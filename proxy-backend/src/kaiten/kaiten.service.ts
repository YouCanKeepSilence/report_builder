import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

const pollIntervalSecs = 60 * 10;

@Injectable()
export class KaitenService {
  private readonly logger = new Logger(KaitenService.name);
  private readonly kaitenUrl;
  private readonly spaceId;
  private readonly boardId;
  private readonly responsibilityStatus = 2;
  private readonly columnNames = Object.freeze({
    IN_QUEUE: 99705,
    READY: 99707,
    IN_PROGRESS: 99706
  });
  private readonly lanesIds;
  private readonly memberIds;
  private readonly kaitenToken;
  // private lastCheckDate = new Date();

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.kaitenUrl = this.configService.get<string>('kaiten_url');
    this.spaceId = this.configService.get<string>('kaiten_space_id');
    this.boardId = this.configService.get<string>('kaiten_board_id');
    this.kaitenToken = this.configService.get<string>('kaiten_token');
    this.memberIds = JSON.parse(this.configService.get<string>('kaiten_member_ids'));
    this.lanesIds = JSON.parse(this.configService.get<string>('kaiten_lanes_ids'));
  }

  @Interval(pollIntervalSecs * 1000)
  async handleNewCards() {
    this.logger.debug('Checking new cards.');
    // get cards list as separate method
    const newCards = await this.getNewCards();
    // forEach new card -> add a comment that work is started and move it to in_progress column
    for (const card of newCards) {
      await this.processCard(card);
    }
    // increase lastCheckDate
    // this.lastCheckDate.setSeconds(this.lastCheckDate.getSeconds() + pollIntervalSecs);
  }

  private async wait(milliseconds) {
    return new Promise((res) => {
      setTimeout(() => res(), milliseconds);
    });
  }

  private async processCard(card): Promise<any> {
    const updateCardUrl = `${this.kaitenUrl}/cards/${card.id}`;
    const addCommentUrl = `${updateCardUrl}/comments`;
    try {
      await this.httpService.patch(updateCardUrl, {
        column_id: this.columnNames.IN_PROGRESS
      }, {
        headers: {
          Authorization: `Bearer ${this.kaitenToken}`
        }
      }).toPromise();
      this.logger.debug(`Moved id: ${card.id}, title: ${card.title} (created at ${card.created})`);
    } catch (e) {
      this.logger.error(`Move card ${card.title} error ${JSON.stringify(e)}`);
      return;
    }
    await this.wait(1000);
    try {
      await this.httpService.post(addCommentUrl, {
        text: 'Анализируем приложенные данные.'
      }, {
        headers: {
          Authorization: `Bearer ${this.kaitenToken}`
        }
      }).toPromise();
      this.logger.debug(`Updated id: ${card.id}, title: ${card.title} (created at ${card.created})`);
    } catch (e) {
      this.logger.error(`Add comment to card ${card.title} error: ${JSON.stringify(e)}`);
    }
    await this.wait(1000);
  }

  private async getNewCards(): Promise<object[]> {
    const url = `${this.kaitenUrl}/cards`;
    const params = {
      board_id: this.boardId,
      column_id: this.columnNames.IN_QUEUE,
      // created_after: this.lastCheckDate.toISOString()
    };
    try {
      const allCards = await Promise.all(this.lanesIds.map(lane => this.httpService.get(url, {
        params: { ...params, lane_id: lane },
        headers: {
          Authorization: `Bearer ${this.kaitenToken}`
        }
      }).toPromise()));
      return allCards.reduce<any[]>((acc: object[], current: any): object[] => acc.concat(current.data), []).filter(card => {
        const members = card.members || [];
        return members.find(mem => this.memberIds.includes(mem.id) && mem.type === this.responsibilityStatus);
      });
    } catch (e) {
      this.logger.error(`getNewCards error: ${JSON.stringify(e)}`);
    }
  }
}

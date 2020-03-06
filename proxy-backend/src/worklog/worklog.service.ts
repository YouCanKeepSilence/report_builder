import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorklogService {
  private readonly tempoUrl;
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.tempoUrl = this.configService.get<string>('tempo_url');
  }

  async getWorklog(from, to, token, limit, offset) {
    const url = `${this.tempoUrl}/worklogs`;
    const config = {
      params: {
        from,
        to,
        limit,
        offset
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.httpService.get(url, config).toPromise();
    return response.data;
  }
}

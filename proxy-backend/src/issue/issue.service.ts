import { HttpService, Injectable } from '@nestjs/common';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IssueService {
  private readonly jiraUrl;
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.jiraUrl = this.configService.get<string>('jira_url');
  }

  async getIssue(id, auth): Promise<object> {
    const url = `${this.jiraUrl}/issue/${id}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await this.httpService.get(url, {
      headers: { authorization: auth },
      httpsAgent: agent}).toPromise();
    return res.data;
  }
}

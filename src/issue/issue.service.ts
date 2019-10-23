import { HttpService, Injectable } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class IssueService {
  constructor(private readonly httpService: HttpService) {}

  async getIssue(id, auth): Promise<object> {
    const url = `https://jira.crpt.ru/rest/api/2/issue/${id}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await this.httpService.get(url, {
      headers: { authorization: auth },
      httpsAgent: agent}).toPromise();
    return res.data;
  }
}

import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class WorklogService {
  constructor(private readonly httpService: HttpService) {}

  async getWorklog(from, to, token, limit, offset) {
    const url = 'https://api.tempo.io/core/3/worklogs';
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
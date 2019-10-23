import Config from './config';
import axios from 'axios';

export class RequestService {
  static prepareTempoUrl (endfix) {
    return `${Config.proxyAddress}${endfix}`;
  }

  static prepareJiraUrl (endfix) {
    return `${Config.jiraUrlPrefix}${endfix}`;
  }

  static async getWorklog (tempoToken, dateFrom, dateTo, limit = 1000, offset = 0) {
    axios.defaults.headers.common['authorization'] = `Bearer ${tempoToken}`;

    const url = RequestService.prepareTempoUrl('/worklog');
    const result = await axios.get(url, {
      params: {
        from: dateFrom,
        to: dateTo,
        limit: limit,
        offset: offset,
        token: tempoToken
      }
    })
    console.log(result.data);
  }
}

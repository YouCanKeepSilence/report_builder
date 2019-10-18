import Config from './config';
import axios from 'axios';

export class RequestService {
  static prepareTempoUrl (endfix) {
    return `${Config.tempoUrlPrefix}${endfix}`;
  }

  static prepareJiraUrl (endfix) {
    return `${Config.jiraUrlPrefix}${endfix}`;
  }
  static async getWorklog (tempoToken, dateFrom, dateTo, limit = 1000, offset = 0) {
    axios.defaults.headers.common['authorization'] = `Bearer ${tempoToken}`;

    const url = RequestService.prepareTempoUrl('/worklogs');
    const result = await axios.get(url, {
      query: { dateFrom, dateTo, limit, offset },
      headers: {
        Authentication: `Bearer ${tempoToken}`,
        'MyAwesomeHeader': '228'
      },
      withCredentials: true
    });
    console.log(result.data);
  }
}

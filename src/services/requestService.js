import Config from './config';
import axios from 'axios';

export class RequestService {
  static prepareProxyUrl (endfix) {
    return `${Config.proxyAddress}${endfix}`;
  }

  static prepareJiraUrl (endfix) {
    return `${Config.jiraUrlPrefix}${endfix}`;
  }

  static async getIssue (issueKey, login, password) {
    const url = RequestService.prepareProxyUrl(`/issue/${issueKey}`);
    const result = await axios.get(url, {
      auth: {
        username: login,
        password: password
      }
    });
    const body = result.data
    const issue = {
      key: body.key,
      name: body.fields.summary,
      epic: null
    };
    if (body.fields.customfield_10008 != null) {
      issue.epic = await RequestService.getIssue(body.fields.customfield_10008, login, password);
    }
    return issue
  }

  static async getWorklog (tempoToken, dateFrom, dateTo, limit = 1000, offset = 0) {
    const url = RequestService.prepareProxyUrl('/worklog');
    const result = await axios.get(url, {
      params: {
        from: dateFrom,
        to: dateTo,
        limit: limit,
        offset: offset,
        token: tempoToken
      }
    });

    const response = result.data;
    response.metadata = {
      ...response.metadata,
      from: dateFrom,
      to: dateTo
    }

    const mappedWorklog = { 'metadata': response.metadata, 'issues': {} };
    response.results.forEach((x) => {
      const { key, self: link } = x.issue;
      const secondsSpent = x.timeSpentSeconds;
      if (mappedWorklog.issues.hasOwnProperty(key)) {
        mappedWorklog.issues[key].duration += secondsSpent;
      } else {
        mappedWorklog.issues[key] = {
          link,
          duration: secondsSpent
        }
      }
    });
    return mappedWorklog;
  }
}

import Vue from 'vue'
import Vuex from 'vuex'
import { RequestService } from '../services/requestService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      login: null,
      password: null,
      token: null
    },
    currentWorklog: {}
  },
  mutations: {
    setCredentials (ctx, { token, login, password }) {
      this.state.currentUser = {
        token, login, password
      }
    }
  },
  actions: {
    async getWorklog (ctx, { tempoToken, dateFrom, dateTo, limit, offset }) {
      const worklog = await RequestService.getWorklog(tempoToken, dateFrom, dateTo, limit, offset);
      this.state.currentWorklog = worklog;
    }
  },
  modules: {
  }
})

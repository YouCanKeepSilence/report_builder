<template>
  <div>
  <v-row justify="center" align="center">
    <v-col cols="10">
      <v-card loader-height="10" :loading="loading">
        <v-card-title>
          <h4>Отчет для {{currentUser.login}} в период с {{currentWorklog.metadata.from}} по {{currentWorklog.metadata.to}}</h4>
        </v-card-title>
        <v-card-text>
          <v-row v-for="(epic, key) of epics" :key="key" justify="center" align="center">
            <v-col cols="12">
              -= {{key}} =-
              <div v-for="task of epic" :key="task.name">
                <a :href="task.link" target="_blank">{{task.link}}</a> - {{task.name}} ({{Math.floor(task.duration / 3600)}} ч.{{task.duration % 3600 ? ` ${task.duration % 3600} м.` : ``}})
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { RequestService } from '../services/requestService'

export default {
  data: () => ({
    epics: {},
    loading: false
  }),
  computed: {
    ...mapState(['currentWorklog', 'currentUser'])
  },
  mounted () {
    this.processWorklog();
  },
  methods: {
    async processWorklog () {
      const issuesPromises = [];
      this.loading = true;
      for (let key in this.currentWorklog.issues) {
        if (this.currentWorklog.issues.hasOwnProperty(key)) {
          issuesPromises.push(RequestService.getIssue(key, this.currentUser.login, this.currentUser.password));
        }
      }
      const result = await Promise.all(issuesPromises);
      const mappedEpics = {};
      result.forEach(x => {
        x.duration = this.currentWorklog.issues[x.key].duration
        x.link = RequestService.prepareJiraUrl(`/browse/${x.key}`);
        const name = x.epic?.name || 'Без эпика';
        if (!mappedEpics.hasOwnProperty(name)) {
          mappedEpics[name] = [x];
        } else {
          mappedEpics[name].push(x);
        }
      });
      this.loading = false;
      this.epics = mappedEpics;
    }
  }
}
</script>

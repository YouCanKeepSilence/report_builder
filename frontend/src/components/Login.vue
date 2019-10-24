<template>
  <div>
    <v-snackbar v-model="snackbar" top multi-line :color="snackbarColor">
      {{ snackbarMessage }}
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-card loader-height="10" :loading="loading">
      <v-card-title>
        <h3>Авторизация</h3>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field label="Логин Jira" v-model="login" required :rules="[nonEmptyRule]"></v-text-field>
          <v-text-field label="Пароль Jira" type="password" v-model="passwordJira" required :rules="[nonEmptyRule]"></v-text-field>
          <v-text-field label="Токен Tempo" type="password" v-model="tokenTempo" required :rules="[nonEmptyRule]"></v-text-field>
          <v-date-picker full-width v-model="dateRange" locale="ru" first-day-of-week="1" range></v-date-picker>
          <v-card-actions>
            <v-btn block
                   text
                   color="primary"
                   :disabled="!valid"
                   @click="submit"
            >
              Создать отчет
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Login',
  data: () => ({
    login: '',
    passwordJira: '',
    tokenTempo: '',
    dateRange: [],
    nonEmptyRule: v => !!v || 'Необходимо заполнить поле',
    // emailRegexRule: v => /.+@.+\..+/.test(v) || 'Некорректный формат email',
    valid: false,
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: 'success',
    loading: false
  }),
  computed: {
    ...mapState(['currentUser', 'currentWorklog'])
  },
  mounted () {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const downDiff = currentDate - (day - 1) * 1000 * 60 * 60 * 24;
    const startOfWeek = new Date(downDiff);
    const upDiff = downDiff + 6 * 1000 * 60 * 60 * 24;
    const endOfWeek = new Date(upDiff);
    this.dateRange = [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]];
    const { login, password, token } = this.currentUser;
    this.login = login || '';
    this.passwordJira = password || '';
    this.tokenTempo = token || '';
  },
  methods: {
    ...mapMutations(['setCredentials']),
    ...mapActions(['getWorklog']),
    async submit () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true;
          // TODO validate jira creds
          await this.getWorklog({
            tempoToken: this.tokenTempo,
            dateFrom: this.dateRange[0],
            dateTo: this.dateRange[1]
          });
        } catch (e) {
          // TODO define different errors (401 and etc)
          this.showSnackbar(`Ошибка: ${e}`, 'error');
          console.error(e);
        }
        this.loading = false;
        if (this.currentWorklog.metadata.count === 0) {
          this.showSnackbar('Нет отчетов в данный период', 'warning');
          return;
        }
        this.setCredentials({ token: this.tokenTempo, login: this.login, password: this.passwordJira });
        await this.$router.push('/worklog');
      }
    },
    showSnackbar (message, color = 'info') {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  }
}
</script>

<style scoped>

</style>

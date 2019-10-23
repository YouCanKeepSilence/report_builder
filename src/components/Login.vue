<template>
  <v-card>
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
    valid: false
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
        await this.getWorklog({ tempoToken: this.tokenTempo, dateFrom: this.dateRange[0], dateTo: this.dateRange[1] });
        if (this.currentWorklog.metadata.count === 0) {
          console.log('No data in current period');
          return;
        }
        this.setCredentials({ token: this.tokenTempo, login: this.login, password: this.passwordJira });
        await this.$router.push('/worklog');
      }
    }
  }
}
</script>

<style scoped>

</style>

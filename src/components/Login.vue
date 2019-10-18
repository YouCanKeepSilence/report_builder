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
        <v-text-field label="Логин Jira" v-model="login" required :rules="[nonEmptyRule, emailRegexRule]"></v-text-field>
        <v-text-field label="Токен Jira" type="password" v-model="tokenJira" required :rules="[nonEmptyRule]"></v-text-field>
        <v-text-field label="Токен Tempo" type="password" v-model="tokenTempo" required :rules="[nonEmptyRule]"></v-text-field>
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
export default {
  name: 'Login',
  data: () => ({
    login: '',
    tokenJira: '',
    tokenTempo: '',
    nonEmptyRule: v => !!v || 'Необходимо заполнить поле',
    emailRegexRule: v => /.+@.+\..+/.test(v) || 'Некорректный формат email',
    valid: false
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        console.log('Заебись')
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title class="headline text-uppercase" @click="$router.push('/')">
        <span class="font-weight-light">Report Builder</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="$router.push('/')"
        target="_blank"
      >
        <span class="mr-2">Home</span>
      </v-btn>
    </v-app-bar>
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
    <v-content container-fluid>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    snackbar: true,
    snackbarMessage: 'Я вас категорически приветствую',
    snackbarColor: 'success'
  })
}
</script>

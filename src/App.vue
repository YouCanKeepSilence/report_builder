<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
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

    <v-content container-fluid>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  })
}
</script>

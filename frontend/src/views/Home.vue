<template>
  <v-row justify="center" align="center">
    <v-col cols="12"
           sm="12"
           md="8"
           lg="6"
           xl="6"
    >
      <login></login>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'

export default {
  name: 'home',
  components: {
    Login
  }
}
</script>

<style lang="less">

</style>

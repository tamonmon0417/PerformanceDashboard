<template>
  <v-app dark>
    <h1>
      {{ pageNotFound }}
    </h1>
    <NuxtLink to="/">
      Go Back to Admin View
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  data () {
    return {
      pageNotFound: '404 Not Found'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>

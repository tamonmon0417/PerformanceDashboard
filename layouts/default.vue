<template>
  <v-app dark>
    <v-app-bar
      app
    >
      <v-toolbar-title class="text-decoration-none" @click="goTop()" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Dashboard'
    }
  },
  computed: {

  },
  methods: {
    goTop () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

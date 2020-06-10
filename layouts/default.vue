<template>
  <v-app dark>
    <v-app-bar
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        color="pink"
        dark
        top
        right
        fab
        class="mr-10 mt-12"
        @click="newUser()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
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
  methods: {
    newUser () {
      this.$store.commit('addUser', { value: {} })
    }
  }
}
</script>

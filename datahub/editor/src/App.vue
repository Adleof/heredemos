<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
      <v-toolbar-title>Space Editor</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {    
  },

  data: () => ({
    //
  }),
};
</script>

<template>
  <div id="app">
      <b-navbar type="light" variant="light" sticky>
        <b-navbar-nav>
          <b-nav-item to="/"><b-icon icon="house"></b-icon></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/setting"><b-icon icon="gear"></b-icon></b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col></b-col>
        <b-col cols="12" class="p-3"><router-view/></b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

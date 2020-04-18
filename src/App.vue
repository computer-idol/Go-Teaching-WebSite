<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
};
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
button:hover {
  cursor: pointer;
}
.cursor_pointer {
  cursor: pointer;
}
input {
  outline: none;
}
button {
  outline: none;
}
</style>

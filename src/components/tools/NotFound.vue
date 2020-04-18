<template>
  <div class="NotFound">
     <Back @click="window.history.go(-1)"></Back>
  </div>
</template>

<script>
  import Back from "./Back"
  export default {
    name: '',
    components:{
      Back
    }
  }
</script>

<style scoped>
  html {
    height: 100%;
  }
  body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  .NotFound{
    background: url("../../../static/imgs/bg/404.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
</style>

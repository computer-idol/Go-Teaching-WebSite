<template>
  <div class="test">
    <ExerciseLayout :ifwrong="ifwrong" :exerciseList="exerciseList"></ExerciseLayout>
  </div>
</template>

<script>
  import ExerciseLayout from "../tools/exercise/exerciseLayout"
  export default {
    name:"test",
    components:{
     ExerciseLayout
    },
    created(){

    },
    data(){
      return {
        user:{},
        exerciseList: [],
        ifwrong:false
      }
    },
    methods:{
      kuli(){
        console.log("xxx")
      }
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

  .test{
    background: url("../../../static/imgs/bg/IndexBg.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
</style>

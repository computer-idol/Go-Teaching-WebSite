<template>
  <ExerciseLayout :exerciseList="exerciseList" :ifwrong="true" :user="user" ref="exerciseLayout"></ExerciseLayout>
</template>

<script>
  import ExerciseLayout from "./tools/exercise/exerciseLayout"
  import UserRequest from "../api/user"
  export default {
    name: '',
    components:{
      ExerciseLayout
    },
    created(){
      let that = this;
      const user = sessionStorage.getItem('user')
      if (user!= null) {
        that.user = JSON.parse(user);
      }
    },
    mounted(){
      let that = this;
      let params = new URLSearchParams();
      params.append("userid",that.user.userid);
      params.append("deleted",0);
      UserRequest.UserWrongList(params).then(res =>{
        if(res.data.code==200) {
          let wrongList = res.data.obj;
          wrongList.forEach(item => {
            that.exerciseList.push(item.exercise);
          })
          that.$nextTick(() => {
            that.$refs.exerciseLayout.initBoard();
          })
        }
      }).catch(error =>{
        console.log(error)
      })
    },
    data(){
      return{
        exerciseList:[],
        user:{}
      }
    }
  }
</script>

<style scoped>

</style>

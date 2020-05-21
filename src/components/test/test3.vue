<template>
    <div class="myWrong">
        <myWrong :wrongList="wrongList"></myWrong>
    </div>
</template>

<script>
  import myWrong from "../tools/user/myWrong"
  import user from '../../api/user'
  export default {
    name: '',
    components:{
      myWrong
    },
    data(){
      return{
        wrongList:[]
      }
    },
    created(){
      let that = this;
      let params = new URLSearchParams();
      params.append("userid",1);
      params.append("deleted",0);
      user.UserWrongList(params).then(res =>{
        that.wrongList = res.data;
      }).catch(error=>{
        console.log(error)
      })
    },
    methods:{

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
  .myWrong{
    background: url("../../../static/imgs/bg/IndexBg.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
</style>

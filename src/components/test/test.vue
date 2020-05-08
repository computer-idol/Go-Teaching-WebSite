<template>
  <div class="test">
    <UserCard :user="user" :levelScore="levelScore" v-if="if_show" @watch="watch" @record="record"></UserCard>
    <img src="../../../static/imgs/button/close.png" @click="xx"
         style="width: 30px; height: 30px; position: fixed;left: 62%;top: 190px;z-index: 1000;"/>
  </div>
</template>

<script>
  import UserCard from "../tools/user/UserCard"
  export default {
    name:"test",
    components:{
      UserCard
    },
    created(){

    },
    data(){
      return {
        user:{
          photo:"https://www.xswq361.cn/img/headImg/1.png",
          name:"威武",
          level:"9k",
          score:1000,
          account:"yyyyy",
          state:"空闲",
          win:10,
          lose:10,
          playList:[
            {roomid:1,ifwin:1},
            {roomid:2,ifwin:1},
            {roomid:3,ifwin:0},
            {roomid:4,ifwin:1},
            {roomid:5,ifwin:0},
            {roomid:6,ifwin:1},
            {roomid:7,ifwin:1},
            {roomid:8,ifwin:1},
            {roomid:9,ifwin:1},
            {roomid:10,ifwin:0},
            {roomid:11,ifwin:1},
            {roomid:12,ifwin:0},
            {roomid:13,ifwin:1},
            {roomid:14,ifwin:1},
            {roomid:12,ifwin:0},
            {roomid:13,ifwin:1},
            {roomid:14,ifwin:1}
          ]
        },
        if_show:true,
        levelScore:2000,
        xx:"kuli"
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

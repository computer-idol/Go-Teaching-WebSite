<template>
  <div class="test1">
    <div class="main">
      <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
      <PlayTable :playData="playData" class="playList"></PlayTable>
    </div>
    <img src="../../../static/imgs/button/close.png" class="cursor_pointer close_table" @click="if_show_user=false" :class="{ closeActive: if_show_user, closeNegative: !if_show_user }">
    <UserTable :userData="userData" :user="user" :class="{ active: if_show_user, close: !if_show_user }" @invite_dialog="invite"></UserTable>
    <PlayBottom :linkList="bottomLink" @open_user="open_user"></PlayBottom>
    <PlayRequest :response="response" @goplay="go_play" @cancel="ifsetup = false"
                 v-if="ifsetup" :request="user" :if_AI="0"></PlayRequest>
    <ReceiveRequest :play="play" v-if="if_receive" @resfuse="refuse" @agree="agree"></ReceiveRequest>
    <WaitResponse :response="response" v-if="if_show_wait" @cancel="cancel"></WaitResponse>
  </div>
</template>

<script>
  import UserLink from "../../components/tools/UserLink"
  import PlayTable from "../../components/tools/play/PlayTable"
  import UserTable from "../../components/tools/play/UserTable"
  import PlayBottom from "../../components/tools/play/PlayBottom"
  import axios from "axios"
  import PlayRequest from "../../components/tools/play/request/PlayRequest"
  import ReceiveRequest from "../../components/tools/play/request/ReceiveRequest"
  import WaitResponse from "../tools/play/request/WaitResponse"
  export default {
    name: '',
    components:{
      PlayTable,UserTable,UserLink,PlayBottom,PlayRequest,ReceiveRequest,WaitResponse
    },
    data(){
      return{
        playData:[],
        userData:[],
        drawer:false,
        user: {},
        linkList: [
          {text:"首页",href:"/home",id:"link1"},
          {text:"教程",href:"/study",id:"link2"},
          {text:"题库练习",href:"/exercise",id:"link3"},
          {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link4"}
        ],
        if_show_user:false,
        bottomLink:[
          {img:"../../../static/imgs/link/myManuals.png",href:"/play/myManuals",id:"bottomLink1"},
          {img:"../../../static/imgs/link/AI_play.png",href:"/play/agentOpt",id:"bottomLink2"},
          {img:"../../../static/imgs/link/play.png",href:"javascript:void(0);",id:"bottomLink3"},
        ],
        request:{},
        response: {},
        ifsetup: false,
        play:{},
        if_receive:false,
        if_show_wait:false
      }
    },
    created(){
      let that = this;
      var usermsg = sessionStorage.getItem("user");
      if (usermsg != null) {
        this.user = JSON.parse(usermsg);
        this.user.state = "空闲";
        sessionStorage.setItem("user", JSON.stringify(this.user));
      }
      axios({
        method: "post",
        url: "http://localhost:8081/play/getRooms",
      }).then(function (res) {
        that.playData = res.data;
      }).catch(function (e) {
        console.log(e)
      });
      axios({
        method: "post",
        url: "http://localhost:8081/getuserList",
      }).then(function (res) {
        that.userData = res.data;
      }).catch(function (e) {
        console.log(e)
      });
    },
    methods:{
      close_userTable(){
        this.if_show_user = false;
      },
      open_user(){
        this.if_show_user = true;
      },
      go_play(play_message) {
        this.ifsetup = false;
        console.log(play_message)
        this.play = play_message;
        this.if_show_wait = true;
        //let message = { type: "agree_play", play: play_message };
        //this.socket1.send(JSON.stringify(message));
      },
      invite(user){
        this.response = user;
        this.ifsetup = true;
      },
      refuse(){

      },
      agree(){

      },
      cancel(){

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
  .test1 {
    background: url("../../../static/imgs/bg/playbg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  .main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 400px;
    margin: 0;
    margin-top: 120px;
  }
  .userlink{
    height: 400px;
  }

  .playList {
    margin-left: 60px;
  }
  .active {
    animation: opendoor 0.3s normal forwards;
  }
  @keyframes opendoor {
    from {
      width: 0;
    }
    to {
      width: 250px;
    }
  }
  .close {
       animation: close 0.3s normal forwards;
  }
  @keyframes close {
    0% {
      width: 250px;
    }
    100% {
      width: 0;
    }
  }

  .close_table{
    width: 50px;
    height: 50px;
    position: fixed;
    top:30px;
  }

  @keyframes close-active {
    from {
      right: -50px;
    }
    to {
      right: 242px;
    }
  }
  @keyframes close-negative {
    from {
      right: 242px;
    }
    to {
      right: -50px;
    }
  }
  .closeActive{
    animation: close-active 0.3s normal forwards;
  }
  .closeNegative{
    animation: close-negative 0.3s normal forwards;
  }
</style>

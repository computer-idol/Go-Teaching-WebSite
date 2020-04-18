<template>
  <div class="play_bg">
    <div class="bg-header">
      <div class="xing"></div>
      <Back :href="'/home'"/>
    </div>
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
    <alert
      v-if="dialog.if_show_tip"
      :tip="dialog.tip"
      :btn1_text="dialog.btn1_text"
      :btn2_text="dialog.btn2_text"
      @btn1_click="close_dialog"
      @btn2_click="close_dialog"
    ></alert>
  </div>
</template>

<script>
import alert from "../tools/Alert";
import PlayRequest from "../tools/play/request/PlayRequest"
import Back from "../tools/Back"
import UserLink from "../tools/UserLink"
import PlayTable from "../tools/play/PlayTable"
import playUtil from "../tools/play/playUtil"
import userUtil from "../tools/play/userUtil"
import ReceiveRequest from "../tools/play/request/ReceiveRequest"
import WaitResponse from "../tools/play/request/WaitResponse"
import UserTable from "../tools/play/UserTable"
import PlayBottom from "../tools/play/PlayBottom"
import EndShow from "../tools/play/EndShow"
export default {
  name: "detailexercise",
  components: {
    alert,PlayRequest,Back,UserLink,PlayTable,ReceiveRequest,WaitResponse,UserTable,PlayBottom,EndShow
  },
  created() {
    document.title = "对弈大厅";
    var usermsg = sessionStorage.getItem("user");
    if (usermsg != null) {
      this.user = JSON.parse(usermsg);
      this.user.state = "空闲";
      sessionStorage.setItem("user", JSON.stringify(this.user));
      this.initwebsocket();
    }
  },
  data() {
    return {
      socket1: null, // 连接play
      socket2: null, // 连接user
      user: {},
      userData: [],
      playData: [],
      activeName: "first",
      select: "", // 排序规则
      request:{},
      response: {},
      play:{},
      ifsetup: false,
      if_receive:false,
      if_show_wait:false,
      if_show_user:false,
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"教程",href:"/study",id:"link2"},
        {text:"题库练习",href:"/exercise",id:"link3"},
        {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link4"}
      ],
      bottomLink:[
        {img:"../../../static/imgs/link/myManuals.png",href:"/play/myManuals",id:"bottomLink1"},
        {img:"../../../static/imgs/link/AI_play.png",href:"/play/agentOpt",id:"bottomLink2"},
        {img:"../../../static/imgs/link/play.png",href:"javascript:void(0);",id:"bottomLink3"},
      ]
    };
  },
  mounted(){
    this.initwebsocket();
  },
  methods: {
    // 打开dialog
    open_dialog(tip) {
      this.dialog.if_show_tip = true;
      this.dialog.tip = tip;
    },
    close_dialog() {
      this.dialog.if_show_tip = false;
      this.dialog.tip = "";
    },
    open_user(){
      this.if_show_user = true;
    },
    beforeunload(e) {
      var usermsg = sessionStorage.getItem("user");
      if (usermsg != null) {
        this.user = JSON.parse(usermsg);
        this.user.state = "空闲";
        sessionStorage.setItem("user", JSON.stringify(this.user));
        this.initwebsocket();
      }
    },
    initwebsocket() {
      this.socket1 = new WebSocket("ws://localhost:8081/playwebsocket/" + this.user.userid);
      this.socket2 = new WebSocket("ws://localhost:8081/userwebsocket/" + this.user.userid);
      this.socket1.onopen = () =>{console.log("用户websocket已经打开");};
      this.socket1.onclose = () =>{console.log("对弈大厅websocket已经关闭");};
      this.socket1.onerror = () =>{console.log("对弈大厅websocket发生错误");};
      this.socket1.onmessage = this.getWebSocket1;
      this.socket2.onopen = () =>{console.log("用户websocket已经打开");};
      this.socket2.onclose = this.closeWebSocket2;
      this.socket2.onerror = () =>{console.log("用户websocket发生错误");};
      this.socket2.onmessage = this.getWebSocket2;
    },

    getWebSocket1(e) {
      var that = this;
      var message = JSON.parse(e.data);
      console.log(message);
      let playData = [];
      let userData = [];
      switch(message.type){
        case"request_play":that.play = message.play;
                           that.if_receive = true;
                           break;
        case"cancel_request":that.if_receive = false;
                             that.open_dialog(message.play.request.user.name + "取消了对您的对局申请");
                             break;
        case"reject_play":
                          that.if_show_wait = false;
                          that.open_dialog(message.play.response.user.name + "拒绝了对您的对局申请");
                          break;
        case"agree_play":userData = [...this.userData]
                         userData = userUtil.changeData2(userData,message.play.black_player,"对弈");
                         userData = userUtil.changeData2(userData,message.play.white_player,"对弈");
                         this.userData = userData;
                         playData = [...this.playData];
                         this.playData = playUtil.add(playData,[message.play]);
                         let path = "";
                         if (message.play.if_play_with_AI == 0) {
                            path = "/play/room/user/" + message.play.roomid;
                         } else {
                            path = "/play/room/AI/" + message.play.roomid;
                         }
                         that.$router.push({ path: path });
                         break;
        case"add_play":playData = [...this.playData];
                       this.playData = playUtil.add(playData,message.list);
                       break;
        case"playRoomList":this.playData = playUtil.sort(message.list);
                           break;
        case"update_game":
                          playData = [...this.playData];
                          userData = [...this.userData]
                          this.playData = playUtil.changeData(playData,message.room);
                          this.userData = userUtil.changeData(userData,message.room,this.user)
                          break;
        case"invalid_game":playData = [...this.playData];
                           this.playData = playUtil.remove(playData,message.roomid);
                           break;
        case"update_user_state":userData = [...this.userData];
                                this.userData = userUtil.changeData2(userData,message.request_id,message.state);
                                break;
        default:break;
      }
    },

    closeWebSocket2(e) {
      this.user.state = "空闲";
      sessionStorage.setItem("user", JSON.stringify(that.user));
      console.log("用户websocket连接已经断开");
    },
    getWebSocket2(e) {
      let userData = JSON.parse(e.data);
      console.log("接收到的用户数据为:" + userData);
      this.userData = userData;
    },

    /*邀请*/
    invite(user) {
      this.request = this.user;
      this.response = user;
      this.ifsetup = true;
    },

    /* 邀请对方对局 */
    go_play(play_message) {
      this.ifsetup = false;
      this.play = play_message;
      this.if_show_wait = true;
      var message = { type: "request_play", play: play_message};
      this.socket1.send(JSON.stringify(message));
    },

    refuse(){
      this.if_receive = false;
      let message = { type: "reject_play", play: this.play };
      this.socket1.send(JSON.stringify(message));
    },
    agree(){
       this.if_receive = false;
       let message = { type: "agree_play", play: this.play };
       this.socket1.send(JSON.stringify(message));
    },
    cancel(){
      this.response = {};
      this.request ={};
      this.if_show_wait = false;
      let message = { type: "cancel_request", play: this.play };
      this.socket1.send(JSON.stringify(message));
    },
  },
};
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
  .play_bg {
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

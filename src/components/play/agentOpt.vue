<template>
  <div class="play_bg">
    <div class="bg-header">
      <div class="xing"></div>
      <Back @click="window.history.go(-1)" class="cursor_pointer"/>
    </div>
    <div class="playArea">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="agent_choice">
          <div class="agent" v-for="(agent, index) in agents" :key="agent.agentid">
            <img :src="agent.photo" class="cursor_pointer" @click="play_agent(index)"/>
            <div class="agent_message">
              <p style="font-size: 20px;">{{ agent.name }}</p>
              <p>({{ agent.statement }})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PlayRequest :response="response" @goplay="go_play" @cancel="close_dialog"
                 v-if="if_show_choice" :request="request" :if_AI="1"></PlayRequest>
  </div>
</template>

<script>
import UserLink from "../../components/tools/UserLink"
import PlayRequest from "../tools/play/request/PlayRequest"
import Back from "../../components/tools/Back"
import UserRequest from "../../api/user"
export default {
  components: {
    PlayRequest,UserLink,Back
  },
  created() {
    document.title = "人机对战";
    let that = this;
    const user = sessionStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
      this.request= this.user;
      this.initwebsocket();
    }
    let params = new URLSearchParams();
    params.append("type",'"AI"')
    UserRequest.getUserList(params).then((res) => {
      that.agents = res.data;
    }).catch(function (e) {
      console.log(e);
    });
  },
  data() {
    return {
      user: null,
      agents: [],
      request: {},
      response: {},
      if_show_choice: false,
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"教程",href:"/study",id:"link2"},
        {text:"题库练习",href:"/exercise",id:"link3"},
        {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link4"}
      ]
    }
  },
  methods: {
    initwebsocket() {
      this.socket1 = new WebSocket("ws://localhost:8081/playwebsocket/" + this.user.userid);
      this.socket1.onopen = () => { console.log("对局websocket连接已经打开");};
      this.socket1.onclose = () =>{ console.log("对局websocket连接已经断开");};
      this.socket1.onerror = () => { console.log("连接发生错误");};
      this.socket1.onmessage = this.getWebSocket1;
    },

    getWebSocket1(e) {
      var message = JSON.parse(e.data);
      console.log(message)
      if(message.type=="add_play"){
        let path = "/play/room/AI/" + message.play.roomid;
        this.$router.push({ path: path });
      }
    },

    play_agent(index) {
      let agent = this.agents[index];
      this.response= agent;
      this.if_show_choice = true;
    },
    close_dialog() {
      this.if_show_choice = false;
    },
    go_play(play_message) {
      this.if_show_choice = false;
      let message = { type: "agree_play", play: play_message };
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
.bg-header {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
}
.xing {
  width: 600px;
  height: 100px;
  animation: xing 3s infinite;
  background-size: 100% 100%;
  background: url("../../../static/imgs/bg/xing.png") no-repeat;
  position: relative;
  left: 300px;
}
@keyframes xing {
  0% {
    opacity: 1;
  }
  33% {
    opacity: 1;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.playArea {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 475px;
}
.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 400px;
  margin: 0;
}

.userlink{
  height: 450px;
}

.agent_choice {
  margin-left: -100px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.agent_choice .agent {
  display: flex;
  flex-direction: column;
  width: 17%;
  margin-left: 3%;
}
.agent_choice .agent img {
  width: 100%;
  height: auto;
  box-shadow: 0 0 15px #ccc;
  border-radius: 55px;
}
.agent_choice .agent img:hover {
  transform: translateY(-10px);
}
.agent_message p {
  color: white;
}
</style>

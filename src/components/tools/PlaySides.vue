<template>
  <div class="playRoom-right">
    <PlayGuys :black="black" :white="white" :gameRuleList="gameRuleList"></PlayGuys>
    <div class="time">
      <Timer :time = "black.time" ref="black_timer" @time_over="black_over" :class="begin_time=='black'?'timeActive':''"></Timer>
      <div class="game-record">
        <p>
          <span style="color: #ebf5cc;">{{ black.otherTimes }}次</span>
          <span style="color: #dd7705; font-weight: bold;">读秒</span>
          <span style="color: #ebf5cc;">{{ white.otherTimes }}次</span>
        </p>
        <p>
          <span style="color: #ebf5cc;">{{ black.eatCount }}子</span>
          <span style="color: #dd7705; font-weight: bold;">提子</span>
          <span style="color: #ebf5cc;">{{ white.eatCount }}子</span>
        </p>
      </div>
      <Timer :time = "white.time" ref="white_timer" @time_over="white_over" :class="begin_time=='black'?'timeActive':''"></Timer>
    </div>
    <div class="block">
      <div class="step">
          <span>{{game.records.length}}手</span>
      </div>
      <div id="operate">
        <button v-for="btn in operateList" v-if="btn.if_show" class="operate_btn" @click="btn.event">{{btn.text}}</button>
      </div>
    </div>
    <div class="choose">
      <button style="border-right: 1px solid black;" :class="ifactive ? 'tab_active' : 'no'" @click="ifactive = !ifactive">
        用户列表({{ watch_userList.length }})
      </button>
      <button :class="!ifactive ? 'tab_active' : 'no'" @click="ifactive = !ifactive">
        聊天({{chatLength}})
      </button>
    </div>
    <UserList :user="user" :watch_userList="watch_userList" :black="black" :white="white" class="userList" v-if="ifactive"></UserList>
    <Chat class="chat" v-if="!ifactive"></Chat>
  </div>
</template>

<script>
  import Timer from "./playSides/Timer"
  import UserList from "./playSides/userList"
  import Chat from "./playSides/Chat"
  import PlayGuys from "./playSides/PlayGuys"
  export default {
    name: 'playSides',
    components:{
      Timer,UserList,Chat,PlayGuys
    },
    props:{
      game:{
        type:Object,
        default: ()=>{}
      },
      black:{
        type:Object,
        default:() => {}
      },
      white:{
        type:Object,
        default:() => {}
      },
      gameRuleList:{
        type:Array,
        default:() => []
      },
      watch_userList:{
        type:Array,
        default:() => []
      },
      user:{
        type:Object,
        default:() => {}
      },
      operateList:{
        type:Array,
        default:() => []
      }
    },
    methods:{
      black_over(){

      },
      white_over(){

      },
      chat_length(){

      }
    },
    data(){
      return{
        ifactive:false,
        begin_time:"",
        chatLength:0
      }
    }
  }
</script>

<style scoped>
  .playRoom-right {
    width: 380px;
    height: 550px;
    left: 760px;
    display: flex;
    flex-direction: column;
    background: #1c80bd;
    background-size: 100% 100%;
    top: 60px;
    position: absolute;
  }
  .time {
    margin-top: 5px;
    background-color: #308fc7;
    width: 380px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
  }

  .game-record {
    width: 140px;
    margin-left: 10px;
  }

  .game-record p {
    margin-top: 5px;
    margin-bottom: 3px;
  }

  .game-record p span {
    margin-left: 10px;
    font-weight: bold;
  }

  .block {
    margin-top: 5px;
    background-color: #308fc7;
    width: 380px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  .block .step{
    margin-top: 5px;
  }
  .block .step span{
    color: rgb(235, 245, 204) !important;
    margin-left: 5px;
    font-size: 15px;
  }

  #operate{
    display: flex;
    flex-direction: row;
    height: 30px;
    justify-content: center;
    margin-bottom: 5px;
  }
  .operate_btn{
    margin-left: 10px;
    background-color: #3399cc;
    color: white;
    border-radius: 8px;
    height: 30px;
    width: 80px;
  }
  #operate:first-child{
    margin-left: 0;
  }

  .choose {
    width: 380px;
    display: flex;
    height: 30px;
    flex-direction: row;
    border-radius: 10px;
    margin-top: 5px;
  }

  .choose button {
    width: 50%;
    color: #ffffff;
    border: 0;
    background-color: #56b1c2;
    font-weight: bold;
  }

  .choose button:hover {
    cursor: pointer;
    background-color: #dbc280;
  }

  .tab_active {
    background-color: #dbc280 !important;
  }
</style>

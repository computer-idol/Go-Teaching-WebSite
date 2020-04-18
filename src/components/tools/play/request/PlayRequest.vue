<template>
  <div class="play_choice">
    <div class="header">请选择对局信息</div>
    <div class="play_choose">
      <p align="left">对手信息：
         <img :src="play.response.user.photo" style="width:30px;height:30px;border-radius:15px;top: 8px;position: relative" alt="头像"/>
         <span>{{play.response.user.name}}</span>
         <span>{{play.response.user.level}}</span>
      </p>
      <p align="left">
        对局类型：
        <select v-model="play.game_type">
          <option value="1" v-if="!if_AI">升降对局</option>
          <option value="2">友谊对局</option>
        </select>
        <span style="margin-left: 12px">棋盘路数：</span>
        <select v-model="play.board_type" v-if="play.response.user.name !== '入门AI'">
            <option value="19路">19路</option>
        </select>
        <select v-model="play.board_type" v-else>
          <option value="9路">9路</option>
          <option value="7路">7路</option>
          <option value="5路">5路</option>
        </select>
      </p>
      <p align="left">
        时间设置：<select v-model="play.basicTime">
        <option value="5分钟">5分钟</option>
        <option value="10分钟">10分钟</option>
        <option value="30分钟">30分钟</option>
      </select>
        <select v-model="play.otherPerTime">
          <option value="15秒">15秒</option>
          <option value="30秒">30秒</option>
          <option value="60秒">60秒</option>
        </select>
        <select v-model="play.otherTimes">
          <option value="1次">1次</option>
          <option value="3次">3次</option>
          <option value="5次">5次</option>
        </select>
      </p>
      <p align="left">
        对局设置：
        <select v-model="play.request.color" style="margin-left: -5px;">
          <option value="1">执黑</option>
          <option value="2">执白</option>
        </select>
        <select v-model="play.handicap" v-if="play.board_type == '19路'">
          <option value="分先">分先</option>
          <option value="让先">让先</option>
          <option value="让2子">让2子</option>
          <option value="让3子">让3子</option>
          <option value="让4子">让4子</option>
          <option value="让5子">让5子</option>
          <option value="让6子">让6子</option>
          <option value="让7子">让7子</option>
          <option value="让8子">让8子</option>
          <option value="让9子">让9子</option>
        </select>
        <select v-model="play.handicap" v-else-if="play.board_type == '13路'">
          <option value="分先">分先</option>
          <option value="让先">让先</option>
          <option value="让2子">让2子</option>
          <option value="让3子">让3子</option>
          <option value="让4子">让4子</option>
          <option value="让5子">让5子</option>
        </select>
        <select v-model="play.handicap" v-else-if="play.board_type == '9路'">
          <option value="分先">分先</option>
          <option value="让先">让先</option>
          <option value="让2子">让2子</option>
          <option value="让3子">让3子</option>
        </select>
        <select v-model="play.handicap" v-if="play.board_type == '7路' || play.board_type == '5路'">
          <option value="分先">分先</option>
          <option value="让先">让先</option>
        </select>
      </p>
    </div>
    <div class="operate">
      <button @click="go_play">确定</button>
      <button @click="close_dialog" class="cancel">取消</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PlayRequest',
    props:{
      response:{
        type:Object,
        default:() => {}
      },
      request:{
        type:Object,
        default:() => {}
      },
      if_AI:Number
    },
    mounted(){
      this.play.response.user = this.response;
      this.play.request.user = this.request;
      this.play.if_play_with_AI = this.if_AI;
      this.play.game_type = this.if_AI?2:1;
    },
    data(){
      return{
        play: {
          board_type: "19路",
          basicTime: "10分钟",
          otherTimes: "3次",
          otherPerTime: "30秒",
          handicap: "分先",
          request: {
            user: "",
            color: "1",
          },
          response: {
            user: {},
            color: "2",
          },
          if_play_with_AI: 1,
          game_type:1
        },
      }
    },
    methods:{
      go_play () {
        this.play.response.color = this.play.request.color == "1" ? "2" : "1";
        this.$emit("goplay",this.play);
      },
      close_dialog(){
        this.$emit("cancel")
      }
    }
  }
</script>

<style scoped>
  .play_choice {
    position: fixed;
    top: 200px;
    left: 35%;
    width: 400px;
    height: 300px;
    background: url("../../../../../static/imgs/bg/public_bg.png");
    background-size: 400px 300px;
    z-index: 100;
  }
  .play_choice .header {
    margin-top: 10px;
    color: #8b5a20;
    font-size: 20px;
    font-weight: bold;
  }

  .play_choice p {
    padding-left: 10px;
  }
  select {
    width: 95px;
    border-radius: 10px;
    height: 30px;
    outline: none;
  }

  .play_choice .operate {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
  }
  .operate button {
    border: 0;
    color: white;
    background: url("../../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 90px 40px;
    width: 90px;
    height: 40px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
  }
  .cancel {
    background: url("../../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    margin-left: 70px;
    background-size: 90px 40px !important;
  }
</style>

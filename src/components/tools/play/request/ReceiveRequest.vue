<template>
  <div class="play_message">
    <div class="header">来自{{play.request.user.name}}({{play.request.user.level}})的邀请</div>
    <div class="main">
      <p align="left">
        <span v-if="play.game_type==1">对局类型：升降对局</span>
        <span v-else>对局类型：友谊对局</span>
        <span>棋盘路数：{{play.board_type}}</span>
      </p>
      <p align="left">
          <span>时间设置：{{play.basicTime}} {{play.otherPerTime}}{{play.otherTimes}}</span>
      </p>
      <p align="left">
        <span v-if="play.request.color==1">对局设置：对方执黑</span>
        <span v-else>对局设置：对方执白</span>
        <span>{{play.handicap}}</span>
      </p>
    </div>
    <div class="bottom">
      <button @click="agree">接受</button>
      <button @click="refuse" class="refuse">拒绝</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props:{
      play:{
        type:Object,
        default:() => {}
      }
    },
    methods:{
      agree(){
        this.$emit("agree",this.play);
      },
      refuse(){
        this.$emit("refuse",this.play);
      }
    }
  }
</script>

<style scoped>
  .play_message {
    position: fixed;
    top: 200px;
    left: 35%;
    width: 350px;
    height: 250px;
    background: url("../../../../../static/imgs/bg/public_bg.png");
    background-size: 350px 250px;
    z-index: 100;
  }
  .play_message .header {
    margin-top: 10px;
    color: #8b5a20;
    font-size: 20px;
    font-weight: bold;
  }
  .play_message p {
    padding-left: 10px;
  }
  .play_message p span{
    margin-left: 20px;
  }
  .play_message .bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
  }
  .bottom button {
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
  .refuse {
    background: url("../../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    margin-left: 70px;
    background-size: 90px 40px !important;
  }
</style>

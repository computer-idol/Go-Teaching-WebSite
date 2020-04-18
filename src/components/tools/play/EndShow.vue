<template>
    <div class="endShow">
      <div  class="header">
        <span v-if="play.type==1">升降对局结果</span>
        <span v-else>友谊对局结果</span>
      </div>
      <div class="main">
         <div class="player">
           <div class="player_message">
             <img :src="play.black_player.photo" class="user_img">
             <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/black.png" class="icon"/>
             <div class="message">
               <div align="left"><span>{{play.black_player.name}}</span></div>
               <div align="left"><span>{{play.black_player.level}}</span></div>
             </div>
           </div>
           <div class="player_get">
             <span v-if="play.winner==1" class="win_span">积分+{{play.score}}</span>
             <span v-if="play.winner==2" class="lose_span">积分-{{play.score}}</span>
           </div>
         </div>
         <div class="result">
           <div class="result_img">
             <img src="../../../../static/imgs/play/win.png" v-if="play.winner==1"/>
             <img src="../../../../static/imgs/play/lose.png" v-else/>
           </div>
           <span>{{play.result}}</span>
         </div>
        <div class="player">
          <div class="player_message">
            <img :src="play.white_player.photo" class="user_img">
            <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/white.png" class="icon"/>
            <div class="message">
              <span>{{play.white_player.name}}</span>
              <span>{{play.white_player.level}}</span>
            </div>
          </div>
          <div class="black_player_get">
            <span v-if="play.winner==2" class="win_span">积分+{{play.score}}</span>
            <span v-if="play.winner==1" class="lose_span">积分-{{play.score}}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <button class="goManual" @click="goManual">查看棋谱</button>
        <button class="goBack" @click="back">返回大厅</button>
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
    methods: {
      goManual () {
        this.$emit("goManual");
      },
      back () {
        this.$emit("back");
      }
    }
  }
</script>

<style scoped>
  .endShow{
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    background: url("../../../../static/imgs/bg/public_bg.png") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    left: 30%;
    top: 200px;
    z-index: 1000;
    padding: 20px;
  }
  .endShow .header {
    color: #8b5a20;
    font-size: 20px;
    font-weight: bold;
  }
  .endShow .main{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    padding: 10px;
    padding-left: 0;
    justify-content: center;
  }
  .player{
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .player .player_message{
    display: flex;
    flex-direction: row;
  }
  .player .player_message .user_img{
    width: 50px;
    height: 50px;
  }
  .player .player_message .icon{
    position: relative;
    width:20px;
    height: 20px;
    margin-left: -14px;
    margin-top: 30px;
  }
  .player .player_message .message{
    display: flex;
    flex-direction: column;
    color: #ff8800;
    font-size: 17px;
    font-weight: bold;
    margin-left: 5px;
  }
  .player .player_get{
    margin-top: 0;
  }
  .result{
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
  }
  .result .result_img{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .result .result_img img{
    width: 45px;
    height: 45px;
  }
  .result span{
    color: white;
    margin-top: 4px;
  }
  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .bottom button {
    border: 0;
    color: white;
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 90px 40px;
    width: 90px;
    height: 40px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
  }
  .goBack {
    background: url("../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    margin-left: 70px;
    background-size: 90px 40px !important;
  }
  .win_span{
    color: red;
  }
  .lose_span{
    color:lightgrey;
  }
</style>

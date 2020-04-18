<template>
  <div class="play-guy">
    <div class="play-guy-img">
      <img :src="black.photo" alt="黑棋头像" class="player_photo"/>
      <img :src="black.icon" alt="黑棋" class="player_icon"/>
      <div class="game_rule">
        <p v-for="(gameRule,index) in gameRuleList" :key="index"><span style="color: #b0c9da;overflow: hidden">{{gameRule}}</span></p>
      </div>
      <img style="left: 10px" :src="white.icon" class="player_icon"/>
      <img :src="white.photo" alt="白棋头像" class="player_photo"/>
    </div>
    <div class="play-guy-msg">
      <p style="width: 80px; margin-left: 0;">{{ black.name }}</p>
      <p style="width: 60px; margin-left: 10px;">{{ black.level }}</p>
      <p style="color: #fec857; width: 60px; margin-left: 10px;">VS</p>
      <p style="width: 60px; margin-left: 10px;">{{ white.level }}</p>
      <p style="width: 80px; margin-left: 20px;">{{ white.name }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'playGuys',
    props:{
      black:{
        type:Object,
        default:() => {}
      },
      white:{
        type:Object,
        default:() => {}
      },
      gameRuleList: {
        type:Array,
        default:() => []
      },
    },
    data(){
      return{

      }
    },
  }
</script>

<style scoped>
  .play-guy {
    width: 370px;
    border-radius: 10px;
    height: 130px;
    background-color: #308fc7;
  }

  .play-guy-img {
    height: 80px;
    width: 380px;
    background: url("/static/imgs/bg/play_guy_bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
  }

  .game_rule {
    width: 180px;
    height: 80px;
    display: flex;
    flex-direction: column;
  }

  .game_rule p {
    width: 180px;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0;
    font-size: 14px;
  }

  .play-guy-msg {
    display: flex;
    flex-direction: row;
    margin: 0;
    width: 370px;
    height: 40px;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
  }

  .play-guy-msg p {
    color: #b0c9da;
    margin: 0;
    height: 20px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  .player_photo{
    width: 80px;
    height: 80px;
    background-color: white;
  }
  .player_icon{
    width: 20px;
    height: 20px;
    position: relative;
    top: 65px;
    left: -10px;
    z-index: 100;
  }
</style>

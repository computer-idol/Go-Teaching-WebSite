<template>
   <div class="compute">
     <div class="compute_message">
       <div class="player_situation" v-for="situation in compute.situations" :key="situation.name">
         <img :src="situation.icon"/>
         <span class="player_name">{{situation.name}}</span>
         <span style="position: absolute;left:110px">{{situation.num}}目</span>
         <span style="position: absolute;left:150px">提{{situation.eatCount}}子</span>
       </div>
     </div>
     <div class="compute_right">
       <div class="compute_result">
         <span style="color:coral;font-weight: bold">{{compute.result}}</span>
         <span style="font-size: 12px">{{compute.komisituation}}</span>
       </div>
     </div>
   </div>
</template>

<script>
  export default {
    name: 'compute',
    props:{
      compute:{
        type:Object,
        default:() => {}
      }
    }
  }
</script>

<style scoped>
  .compute{
    display: flex;
    flex-direction: row;
    width:300px;
    height: 80px;
    background-color: #308fc7;
    border-radius: 5px;
    padding: 10px;
  }
  .compute_message{
    display: flex;
    flex-direction: column;
    width: 65%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  .player_situation{
    display: flex;
    flex-direction: row;
    width: 95%;
    height: 50%;
    align-items: center;
  }
  .player_situation img{
    width:20px;
    height: 20px;
    border-radius: 15px;
  }

  .player_situation span{
    color:lightgoldenrodyellow;
  }

  .player_name{
    position: relative;
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .compute_right{
    width:35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .compute_result{
    width:auto;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3%;
    background: #b0c9da;
    border-radius: 5px;
  }
</style>

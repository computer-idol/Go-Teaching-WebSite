<template>
  <div class="current_user">
    <img :src="user.photo" />
    <a v-for="(link,index) in linkList" :key="index" :href="link.href" :id="link.id">
      <div>{{link.text}}</div>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'UserLink',
    props:{
      user:{
        type:Object,
        default:() => {}
      },
      linkList:{
        type:Array,
        default:() => []
      }
    }
  }
</script>

<style scoped>
  .current_user {
    width: 80px;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("../../../static/imgs/bg/left_nav.png") no-repeat;
    background-size: 100% 100%;
  }
  .current_user img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin-top: 10px;
  }
  .current_user a{
    margin-top: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #link1{
    background: url("../../../static/imgs/button/lightblue_button.png") no-repeat;
    background-size: 100% 100%;
  }
  #link2{
    background: url("../../../static/imgs/button/orange_button.png") no-repeat;
    background-size: 100% 100%;
  }
  #link3{
    background: url("../../../static/imgs/button/blue_button.png") no-repeat;
    background-size: 100% 100%;
  }
  #link4{
    background: url("../../../static/imgs/button/pink_button.png") no-repeat;
    background-size: 100% 100%;
  }
  .current_user a div {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

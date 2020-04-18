<template>
  <div class="waitRequest">
     <div class="header">申请情况</div>
     <div class="user">
       <div class="photo">
          <img :src="response.photo">
       </div>
       <div class="message" align="center">
           <span>{{response.name}}正在接受你的邀请</span>
       </div>
     </div>
     <div class="bottom">
       <button class="cancel" @click="cancel">取消申请</button>
     </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props:{
      response:{
        type:Object,
        default:() => {}
      }
    },
    methods:{
      cancel(){
        this.$emit("cancel");
      }
    }
  }
</script>

<style scoped>
  .waitRequest {
    position: fixed;
    top: 200px;
    left: 35%;
    width: 300px;
    height: 200px;
    background: url("../../../../../static/imgs/bg/public_bg.png");
    background-size: 300px 200px;
    z-index: 100;
  }
  .waitRequest .header {
    margin-top: 10px;
    color: #8b5a20;
    font-size: 20px;
    font-weight: bold;
  }
  .waitRequest .user{
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
    margin-top: 10px;
  }
  .waitRequest .user .photo{
    display: flex;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
  }
  .waitRequest .user .photo img{
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
  .waitRequest .user .message{
    margin-top: 10px;
  }
  .waitRequest .bottom{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    height: auto;
  }
  .cancel{
    border: 0;
    color: white;
    width: 80px;
    height: 30px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
    background: url("../../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    background-size: 80px 30px !important;
  }
</style>

<template>
   <div class="userCard">
      <div class="header">
        <span>个人信息</span>
      </div>
      <div class="main">
        <div class="user">
          <div class="user-img">
            <img :src="user.photo"/>
          </div>
          <div class="user-msg">
            <div class="left" align="left">
              <span style="color: #f6d6b5;font-size: 16px;font-weight: bold">{{user.name}} {{user.level}}</span>
              <div class="level">
                <div class="show-level" :style="'width:' + progress* 100 + '%'">
                  <span>{{user.score}}/{{levelScore}}</span>
                </div>
              </div>
            </div>
            <div class="right" align="left">
              <span style="color: #93b59d;">帐号:{{user.account}}</span>
              <span style="color: #93b59d;margin-top: 5px">状态:{{user.state}}</span>
            </div>
          </div>
        </div>
        <div class="play">
          <div class="header" align="left">
            <span>总战绩:{{user.win}}胜 {{user.lose}}负</span>
          </div>
          <div class="current" align="left">
            <span>近{{user.playList.length}}场 {{win}}胜 {{lose}}负</span>
          </div>
          <div class="show">
            <i v-for="play in user.playList" :key="play.roomid" :class="play.ifwin?'el-icon-circle-check':'el-icon-circle-close'" class="icon"></i>
          </div>
        </div>
      </div>
      <div class="bottom">
        <button @click="$emit('watch')">查看棋谱</button>
        <button class="watchEvalution" @click="$emit('record')">测验记录</button>
      </div>
   </div>
</template>

<script>
  export default {
    name: 'userCard',
    props:{
      user:{
        type:Object,
        default:() => {}
      },
      levelScore:Number
    },
    data(){
      return{
        win:0,
        lose:0,
        progress:0
      }
    },
    mounted(){
      let winList = this.user.playList.filter((obj) =>{
        return obj.ifwin==1;
      })
      let loseList = this.user.playList.filter((obj) =>{
        return obj.ifwin==0;
      })
      this.win = winList.length;
      this.lose = loseList.length;
      this.progress = this.user.score/this.levelScore>1?1:this.user.score/this.levelScore;
    },
    methods:{

    }
  }
</script>

<style scoped>
   .userCard{
     width: auto;
     height: auto;
     display: flex;
     flex-direction: column;
     background:#f5f1e6;
     background-size: 100% 100%;
     position: fixed;
     left: 40%;
     top: 200px;
     z-index: 1000;
     padding: 20px;
     border-radius: 20px;
   }
   .userCard .header {
     color: #f6d6b5;
     font-size: 20px;
     font-weight: bold;
   }
   .userCard .main{
     display: flex;
     flex-direction: column;
     width: 100%;
     height: auto;
     padding: 10px;
     padding-left: 0;
     padding-right: 0;
     justify-content: center;
   }
   .userCard .main .user{
     display: flex;
     flex-direction: row;
     width:100%;
     height: 100px;
   }
   .userCard .main .user-img{
     padding: 10px;
     padding-left: 0;
   }
  .userCard .main .user-img img{
    width:60px;
    height: 60px;
    border-radius: 30px;
  }
  .user-msg{
    padding: 10px;
    display: flex;
    flex-direction: row;
    height: 60px;
    padding-left: 0;
  }
  .user-msg .left{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .level{
    width: 80px;
    height: 25px;
    border:1px solid #1c80bd;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 5px 0px #ddd inset;
  }
  .show-level{
    display: flex;
    width: 70%;
    height: 25px;
    background: #cbd9cc;
    color:#2f503d;
    align-items: center;
  }
  .show-level span{
    font-size: 12px;
    margin-left: 10px;
  }
  .user-msg .right{
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    justify-content: center;
  }
  .play{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: -10px;
    background-color: #cbd9cc;
  }
  .play .header{
    padding: 5px;
    color:#2f503d;
    font-size: 15px;
    border-bottom: 1px solid #ebf5cc;
  }
  .play .current{
    padding: 5px;
    color:#2f503d;
    font-size: 15px;
    border-bottom: 1px solid #ebf5cc;
    height: auto;
  }
  .play .show{
    width: 260px;
  }
  .play .show .icon{
    float: left;
    margin: 5px;
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
   .watchEvalution{
     background: url("../../../../static/imgs/button/btn_blue.png") no-repeat !important;
     margin-left: 70px;
     background-size: 90px 40px !important;
   }
</style>

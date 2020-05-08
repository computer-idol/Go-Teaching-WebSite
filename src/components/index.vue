<template>
  <div class="Index_bg">
    <div class="star">
      <img src="../../static/imgs/bg/star.png" class="shine shine1" />
      <img src="../../static/imgs/bg/star.png" class="shine shine2" />
      <img src="../../static/imgs/bg/star.png" class="shine shine3" />
      <img src="../../static/imgs/bg/star.png" class="shine shine4" />
    </div>
    <div class="user">
      <img :src="user.photo" @click="show_user" class="cursor_pointer"/>
      <div class="user_message" align="left">
        <span style="display: block;width: 50px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ user.name }}</span>
        <span style="margin-left: 0; display: block;">{{ user.level }}</span>
      </div>
    </div>
    <div class="main">
      <div class="type">
        <div class="line1">
          <div class="study" @click="$router.push({ path:'/study'})">
            学习
          </div>
          <div class="practice" @click="$router.push({ path: '/exercise'})">
            练习
          </div>
        </div>
        <div class="line2">
          <div class="test" @click="$router.push({ path: '/evaluation'})">
            测评
          </div>
          <div class="play" style="width: 160px;" @click="$router.push({ path: '/play'})">
            对弈大厅
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="link">
        <a href="javascript:" style="margin-left: 30px;" @click="if_show_myManual = !if_show_myManual">
          <img src="../../static/imgs/link/myManuals.png" />
        </a>
        <a href="/myWrong">
          <img src="../../static/imgs/link/wrong.png" />
        </a>
        <a href="/myCollections">
          <img src="../../static/imgs/link/collections.png" />
        </a>
      </div>
    </div>
    <myManuals :playData="playData" :user="user"  class="playList" v-if="if_show_myManual"></myManuals>
    <img src="../../static/imgs/button/close.png" @click="if_show_myManual = false" v-if="if_show_myManual"
         style="width: 50px; height: 50px; position: fixed;left: 82%;top: 90px;z-index: 1200;" class="cursor_pointer"/>
    <UserCard :user="user" :levelScore="levelScore" v-if="if_show_user" @watch="watch" @record="record"></UserCard>
    <img src="../../static/imgs/button/close.png" @click="if_show_user = false" v-if="if_show_user"
         style="width: 30px; height: 30px; position: fixed;left: 62%;top: 190px;z-index: 1000;" class="cursor_pointer"/>
  </div>
</template>

<script>
import myManuals from "./tools/user/myManuals"
import RoomRequest from "../api/room"
import UserCard from "./tools/user/UserCard"
export default {
  components:{
    myManuals,UserCard
  },
  created() {
    document.title = "首页";
    const user = sessionStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
    }
    let that = this;
    let params = new URLSearchParams();
    params.append("userid",this.user.userid);
    RoomRequest.getPlayUserRoomList(params).then(res =>{
      that.playData = res.data;
    }).catch(e =>{
      console.log(e)
    });
  },
  data() {
    return {
      user: {},
      playData:[],
      if_show_myManual:false,
      levelScore:0,
      if_show_user:false
    };
  },
  methods: {
    show_user(){
       let levelScoreList = JSON.parse(sessionStorage.getItem("levelScoreList"));
       let user = this.user;
       let levels = ["9k","8k","7k","6k","5k","4k","3k","2k","1k","1D","2D","3D","4D","5D","6D","7D","8D","9D"];
       let index = levels.indexOf(user.level)==17?17:levels.indexOf(user.level)+1
       let filterList = levelScoreList.filter((obj) =>{
         return obj.level==levels[index]
       })
       this.levelScore = filterList[0].score;
       //取前20
       let num = this.playData.length>=20?20:this.playData.length;
       for(let i=0;i<num;i++){
         let play = this.playData[i];
         if((play.winner==1&&play.blackid==this.user.userid)||(play.winner==2&&play.whiteid==this.user.userid)){
            play.ifwin = 1;
         }
         else{
           play.ifwin = 0;
         }
       }
       this.user.playList = this.playData.slice(0,num);
       this.if_show_user = true
    },
    watch(){
      this.if_show_myManual = true;
    },
    record(){

    }
  }
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

.Index_bg {
  background: url("../../static/imgs/bg/IndexBg.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 660px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.shine {
  width: 70px;
  height: 70px;
  position: absolute;
}
.shine1 {
  left: 1000px;
  top: 20px;
  animation: shine1 3s infinite;
}
.shine2 {
  left: 500px;
  top: 70px;
  animation: shine1 5s infinite;
}
.shine3 {
  left: 700px;
  top: 50px;
  animation: shine2 3s infinite;
}
.shine4 {
  left: 100px;
  top: 40px;
  animation: shine2 3s infinite;
}

@keyframes shine1 {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shine2 {
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

.user {
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 50px;
  top: 20px;
}
.user img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #fff;
  z-index: 10;
}
.user_message {
  width: 100px;
  border-radius: 30px;
  border: 2px solid lightskyblue;
  height: 40px;
  position: relative;
  left: -30px;
  padding-left: 30px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.user_message span {
  font-size: 15px;
  color: white;
}

.main {
  width: 600px;
  height: 400px;
  position: absolute;
  top: 150px;
  left: 500px;
}
.type {
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.type .line1,
.type .line2 {
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.study,
.practice,
.test,
.play {
  width: 20%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  animation: planet 8s infinite;
  font-size: 18px;
  font-family: "Microsoft YaHei";
  transition: all 0.5s;
}
.study:hover,
.practice:hover,
.test:hover,
.play:hover {
  cursor: pointer;
  animation: unset;
  transform: scale(1.5);
}
.study {
  background: url("../../static/imgs/button/planet4.png") no-repeat;
  background-size: 100% 100%;
}
.practice {
  background: url("../../static/imgs/button/planet2.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 30%;
}
.test {
  background: url("../../static/imgs/button/planet6.png") no-repeat;
  background-size: 100% 100%;
}
.play {
  background: url("../../static/imgs/button/planet3.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 30%;
}
@keyframes planet {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(-20deg);
  }
}

.bottom {
  height: 80px;
  width: 100%;
  bottom: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.link {
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: url("../../static/imgs/bg/linkbg.png") no-repeat;
  background-size: 100% 100%;
}
.link a {
  margin-left: 110px;
}
.link a img {
  width: 110px;
  height: 80px;
}

.link a img:hover {
  transform: translateY(-10px);
}

.playList {
  position: fixed;
  left: 15%;
  top: 100px;
  z-index: 1000;
}
</style>

<template>
  <div class="exercise">
    <div class="bg-header">
      <Back @click="window.history.go(-1)"/>
    </div>
    <div class="exerciseArea">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="exerciseBank">
          <div class="header" style="margin-top: 20px;" v-if="!if_click">
            <span>请选择种类</span>
          </div>
          <div v-if="!if_click && !if_set_level" class="content" style="flex-direction: row; margin-top: -30px;">
            <!--布局-->
            <img class="layout" src="../../../static/imgs/exercise/type_1.png" style="margin-left: 0;" @click="show_level('布局')"/>
            <!--死活-->
            <img class="lifeDeath" src="../../../static/imgs/exercise/type_2.png" @click="show_level('死活')"/>
            <!--手筋-->
            <img class="tesuji" src="../../../static/imgs/exercise/type_3.png" @click="show_level('手筋')"/>
            <!--官子-->
            <img class="yose" src="../../../static/imgs/exercise/type_4.png" @click="show_level('官子')"/>
          </div>
          <div v-if="if_click && !if_set_level" class="content">
            <img src="../../../static/imgs/button/close.png" @click="cancel_level()"
              style="width: 50px; height: 50px;position: relative;top: -90px;left: 450px;"/>
            <div class="header">
              <span>请选择{{ type }}练习的级别</span>
            </div>
            <p style="margin-top: 50px;">
              <button @click="set_level('9k')">9k</button>
              <button @click="set_level('8k')">8k</button>
              <button @click="set_level('7k')">7k</button>
              <button @click="set_level('6k')">6k</button>
              <button @click="set_level('5k')">5k</button>
              <button @click="set_level('4k')">4k</button>
            </p>
            <p>
              <button @click="set_level('3k')">3k</button>
              <button @click="set_level('2k')">2k</button>
              <button @click="set_level('1k')">1k</button>
              <button @click="set_level('1D')">1D</button>
              <button @click="set_level('2D')">2D</button>
              <button @click="set_level('3D')">3D</button>
            </p>
          </div>
          <div v-if="if_set_level" class="content">
            <img src="../../../static/imgs/button/close.png" @click="cancel_level()" style="
                width: 50px;
                height: 50px;
                position: relative;
                top: -140px;
                left: 470px;
              "/>
            <div class="header">
              <span>请选择{{ level }}{{ type }}的种类</span>
            </div>
            <p style="margin-top: 50px;">
              <button v-for="(exerciseType, index) in exerciseTypes" :key="index"
                @click="goto(index)" style="font-size: 20px;">
                {{ exerciseType.subType }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
      @btn1_click="close_tip" @btn2_click="close_tip"></Alert>
  </div>
</template>

<script>
import Alert from "../tools/Alert";
import UserLink from "../../components/tools/UserLink"
import Back from "../../components/tools/Back"
import ExerciseRequest from "../../api/exercise"

export default {
  name: "detailexercise",
  components: {
    Alert,Back,UserLink
  },
  created() {
    document.title = "练习题库";
    const user = sessionStorage.getItem("user");
    if (user!= null) {
      this.user = JSON.parse(user);
    }
  },
  data() {
    return {
      user: {},
      if_click: false,
      if_set_level: false,
      type: "",
      level: "",
      types: ["0", "布局", "死活", "手筋", "官子"],
      levels: ["0", "9k", "8k", "7k", "6k", "5k", "4k", "3k", "2k", "1k", "1D", "2D", "3D"],
      exerciseTypes: [],
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"教程",href:"/study",id:"link2"},
        {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link3"},
        {text:"对弈大厅",href:"/play",id:"link4"}
      ]
    };
  },
  methods: {
    // 打开dialog
    open_tip(tip) {
      this.dialog.if_show_tip = true;
      this.dialog.tip = tip;
    },
    close_tip() {
      this.dialog.if_show_tip = false;
      this.dialog.tip = "";
    },
    get_type_index(type) {
      return this.types.indexOf(type);
    },
    get_level_index(level) {
      return this.levels.indexOf(level);
    },
    show_level(type) {
      this.if_click = true;
      this.type = type;
    },
    cancel_level() {
      this.type = "";
      this.if_click = false;
      this.if_set_level = false;
    },
    set_level(level) {
      this.level = level;
      let that = this;
      let params = new URLSearchParams();
      params.append("type", "'" + that.type + "'");
      params.append("level", "'" + that.level + "'");
      ExerciseRequest.getExerciseTypeList(params).then((res) => {
        if(res.data.code==500){
          that.open_tip("暂时没有这个级别题目");
        }
        else {
          that.exerciseTypes = res.data.obj;
          that.if_set_level = true;
        }
      }).catch(function (e) {
        console.log(e);
      });
    },
    goto(index) {
      let exercisetype = this.exerciseTypes[index];
      let path = "/exercise/detail/" + this.get_type_index(exercisetype.type) + "/" + this.get_level_index(exercisetype.level) +
        "?type=" + exercisetype.subType;
      this.$router.push({ path: path });
    },
  },
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
.exercise {
  background: url("../../../static/imgs/bg/ExerciseBg.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 660px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.back:hover {
  cursor: pointer;
}
.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 520px;
  margin: 0;
}
.userlink{
  height: 400px;
  margin-top: 130px;
}
.exerciseBank {
  margin-top: 80px;
  width: 920px;
  height: 100%;
  background: url("../../../static/imgs/bg/public_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 120px;
}
.exerciseBank .content {
  wiidth: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.exerciseBank .content img {
  margin-left: 15px;
  width: 200px;
  height: 80%;
}

.exerciseBank .content p {
  display: flex;
  flex-direction: row;
}
.exerciseBank .content .header span,
.exerciseBank .header span {
  color: #aa4800;
  font-size: 30px;
  font-weight: bold;
}

.exerciseBank .content p button {
  border: 0;
  width: 100px;
  height: 100px;
  background-color: #7dc438;
  color: white;
  font-size: 30px;
  margin-left: 40px;
  box-shadow: 0 0 15px #ccc;
  border-radius: 15px;
  font-weight: bold;
}
.exerciseBank .content img:hover {
  cursor: pointer;
}
</style>

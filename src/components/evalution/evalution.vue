<template>
  <div class="evalution">
    <div class="bg-header">
      <Back @click="window.history.go(-1)"></Back>
    </div>
    <div class="evalution">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="evalutionBank">
          <div class="header">
            <div class="title">
              <span>请选择测试等级</span>
            </div>
          </div>
          <div class="maincontent">
            <div class="line1">
              <button class="start" @click="goDifficulty(1)">
                入门(9k-7k)
              </button>
              <button class="primary" @click="goDifficulty(2)">
                初级(6k-4k)
              </button>
            </div>
            <div class="line2">
              <button class="middle" @click="goDifficulty(3)">
                中级(3k-1k)
              </button>
              <button class="high" @click="goDifficulty(4)">
                高级(1D及以上)
              </button>
            </div>
          </div>
        </div>
    </div>
    <alert
      v-if="dialog.if_show_tip"
      :tip="dialog.tip"
      :btn1_text="dialog.btn1_text"
      :btn2_text="dialog.btn2_text"
      @btn1_click="close_tip"
      @btn2_click="close_tip"
    ></alert>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import alert from "../tools/Alert";
  import UserLink from "../tools/UserLink"
  import Back from "../tools/Back"
  export default {
    name: "goClass",
    components: {
      alert,UserLink,Back
    },
    created() {
      document.title = "学习";
      var usermsg = sessionStorage.getItem("user");
      if (usermsg != null) {
        this.user = JSON.parse(usermsg);
      }
    },
    data() {
      return {
        user: "",
        chapterList: [],
        page: 1,
        pageLine1: [],
        pageLine2: [],
        dialog: {
          if_show_tip: false,
          tip: "",
          btn1_text: "确定",
          btn2_text: "取消",
        },
        linkList: [
          {text:"首页",href:"/index",id:"link1"},
          {text:"教程",href:"/study",id:"link2"},
          {text:"棋谱欣赏",href:"/exercise",id:"link3"},
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
      goDifficulty(difficultid) {
        let that = this;
        let params = new URLSearchParams();
        params.append("difficultid", difficultid);
        axios({
          method: "post",
          url: "http://localhost:8081/study/getExerciseList",
          data: params,
        }).then((res) => {
            console.log(res.data);
            let exerciseList = res.data;
            if (exerciseList.length === 0) {
              that.open_tip("暂时没有这个难度的试题");
            } else {
              that.if_set_difficulty = true;
              that.exerciseList = exerciseList;
              that.initChapter();
            }
          }).catch(function (error) {
            console.log(error);
          });
      },
      // 学习课
      goClass(id) {
        let path = "/study/detail/" + this.chapterList.length + "/" + id;
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
  .evalution {
    background: url("../../../static/imgs/bg/study_bg.jpg") no-repeat;
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

  .evalutionBank{
    margin-top: 15px;
    width: 1000px;
    height: 100%;
    margin-left: 80px;
    display: flex;
    flex-direction: column;
    padding-top: 5%;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 150px;
    align-items: center;
  }
  .title {
    background: url("../../../static/imgs/bg/title_bg.png") no-repeat;
    background-size: 700px 100px;
    width: 700px;
    height: 100px;
    color: white;
    font-size: 25px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 10px;
  }
  .maincontent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
  .line1,
  .line2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
    margin-top: 5%;
    justify-content: center;
  }
  .line1 button,
  .line2 button {
    background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 300px 60px;
    border: 0;
    width: 300px;
    height: 60px;
    margin-left: 80px;
    color: white;
    font-size: 18px;
    font-weight: bold;
  }

</style>

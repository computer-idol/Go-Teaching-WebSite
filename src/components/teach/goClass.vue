<template>
  <div class="study">
    <div class="bg-header">
       <Back @click="window.history.go(-1)"/>
    </div>
    <div class="studyArea">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="studyBank2" v-if="!if_set_difficulty">
          <div class="header">
            <div class="title">
              <span>请选择适合自己的教程</span>
            </div>
          </div>
          <div class="maincontent">
            <div class="line1">
              <button class="start" @click="goDifficulty(1)">
                入门教程(9k-7k)
              </button>
              <button class="primary" @click="goDifficulty(2)">
                初级教程(6k-4k)
              </button>
            </div>
            <div class="line2">
              <button class="middle" @click="goDifficulty(3)">
                中级教程(3k-1k)
              </button>
              <button class="high" @click="goDifficulty(4)">
                高级教程(1D及以上)
              </button>
            </div>
          </div>
        </div>
        <div class="studyBank" v-if="if_set_difficulty">
          <div class="header">
            <div class="title">
              <span>请选择章节</span>
            </div>
          </div>
          <div class="prev">
            <img src="../../../static/imgs/button/left_btn.png" @click="prev" />
          </div>
          <div class="next">
            <img
              src="../../../static/imgs/button/right_btn.png"
              @click="next"
            />
          </div>
          <div class="maincontent">
            <div class="line1" style="margin-top: 30px;">
              <div
                class="chapter"
                v-for="chapter in pageLine1"
                :key="chapter.chapterid"
              >
                <img
                  :src="chapter.coverImg"
                  style="width: 180px; height: 180px;"
                  class="cursor_pointer"
                  @click="goClass(chapter.chapterid)"
                />
                <p align="center">
                  <span>{{ chapter.chapterid }}.{{ chapter.chapterName }}</span>
                </p>
              </div>
            </div>
            <div class="line2" style="margin-top: 0;">
              <div
                class="chapter"
                v-for="chapter in pageLine2"
                :key="chapter.chapterid"
              >
                <img
                  :src="chapter.coverImg"
                  style="width: 180px; height: 180px;"
                  class="cursor_pointer"
                />
                <p align="center">
                  <span>{{ chapter.chapterid }}.{{ chapter.chapterName }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
      @btn1_click="go_evalution" @btn2_click="close_tip"></Alert>
  </div>
</template>

<script>
import Alert from "../tools/Alert";
import UserLink from "../tools/UserLink"
import Back from "../tools/Back"
import StudyRequest from "../../api/study"
import EvaluationRequest from "../../api/evaluation"
export default {
  name: "goClass",
  components: {
    Alert,UserLink,Back
  },
  created() {
    document.title = "学习";
    const user = sessionStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
    }
    this.open_tip("你想先测试看看自己的薄弱知识点吗?")
  },
  data() {
    return {
      user: "",
      chapterList: [],
      page: 1,
      pageLine1: [],
      pageLine2: [],
      if_set_difficulty: false,
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"教程",href:"/study",id:"link2"},
        {text:"题库练习",href:"/exercise",id:"link3"},
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
      StudyRequest.getChapterList(params).then((res) => {
          let chapterList = res.data;
          if (chapterList.length == 0) {
            that.open_tip("暂时没有这个难度的教程");
          } else {
            that.if_set_difficulty = true;
            that.chapterList = chapterList;
            that.page = 1;
            that.initChapter();
          }
        }).catch(function (error) {
          console.log(error);
        });
    },

    // 根据章节页显示对应章节
    initChapter() {
      this.pageLine1 = [];
      this.pageLine2 = [];
      let total = this.chapterList.length;
      let totalPage = Math.floor(total / 6);
      let extra = total - totalPage * 6;
      totalPage = extra > 0 ? totalPage + 1 : totalPage;
      if (this.page == totalPage && extra > 0) {
        if (extra <= 3) {
          for (let i = (this.page - 1) * 6; i < total; i++) {
            this.pageLine1.push(this.chapterList[i]);
          }
        } else {
          for (let i = (this.page - 1) * 6; i < (this.page - 1) * 6 + 3; i++) {
            this.pageLine1.push(this.chapterList[i]);
          }
          for (let i = (this.page - 1) * 6 + 3; i < total; i++) {
            this.pageLine2.push(this.chapterList[i]);
          }
        }
      } else {
        for (let i = (this.page - 1) * 6; i < (this.page - 1) * 6 + 3; i++) {
          this.pageLine1.push(this.chapterList[i]);
        }
        for (let i = (this.page - 1) * 6 + 3; i < this.page * 6; i++) {
          this.pageLine2.push(this.chapterList[i]);
        }
      }
    },

    prev() {
      if (this.page == 1) {
        this.open_tip("已经是第一页了");
        return;
      }
      this.page -= 1;
      this.initChapter();
    },

    next() {
      let total = this.chapterList.length;
      let totalPage = Math.floor(total / 6);
      let extra = total - totalPage * 6;
      totalPage = extra > 0 ? totalPage + 1 : totalPage;
      if (this.page == totalPage) {
        this.open_tip("已经是最后一页了");
        return;
      }
      this.page += 1;
      this.initChapter();
    },

    back() {
      if (this.if_set_difficulty) {
        this.if_set_difficulty = false;
      } else {
        let path = "/index";
        this.$router.push({ path: path });
      }
    },

    // 学习课
    goClass(id) {
      let path = "/study/detail/" + this.chapterList.length + "/" + id;
      this.$router.push({ path: path });
    },

    go_evalution(){
      let that = this;
      let params = new URLSearchParams();
      let levels = ["9k","8k","7k","6k","5k","4k","3k","2k","1k","1D","2D","3D","4D","5D","6D","7D","8D","9D"];
      params.append("userid",this.user.userid);
      params.append("evaluationid",levels.indexOf(this.user.level)+1);
      params.append("level",this.user.level);
      EvaluationRequest.createEvaluation(params).then(res =>{
        if(res.data!=""){
          let path = "/evaluation/detail/"+res.data.recordid;
          this.$router.push({path:path});
        }
        else{
          that.open_tip("没有"+this.user.level+"的测验题");
        }
      }).catch(e =>{
        console.log(e)
      })
    }
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
.study {
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

.studyBank,
.studyBank2 {
  margin-top: 15px;
  width: 1000px;
  height: 100%;
  margin-left: 80px;
  display: flex;
  flex-direction: column;
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

.chapter {
  display: flex;
  flex-direction: column;
  width: 180px;
  height: auto;
  margin-left: 30px;
}
.chapter p {
  width: 180px;
}
.chapter span {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.prev {
  position: fixed;
  left: 270px;
  top: 300px;
}

.next {
  position: fixed;
  right: 200px;
  top: 300px;
}

.prev img,
.next img {
  width: 100px;
  cursor: pointer;
}
</style>

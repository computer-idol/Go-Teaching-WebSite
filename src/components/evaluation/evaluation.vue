<template>
  <div class="evaluation">
    <div class="bg-header">
      <Back @click="window.history.go(-1)" class="cursor_pointer"></Back>
    </div>
    <div class="evaluation">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="evaluationBank">
          <div class="header">
            <div class="title">
              <span>请选择测试等级</span>
            </div>
          </div>
          <div class="tip" style="color:white">
            注:每个测试共10道题，答对8题即通过,每题限时5分钟
          </div>
          <div class="prev">
            <img src="../../../static/imgs/button/left_btn.png" @click="prev" />
          </div>
          <div class="next">
            <img src="../../../static/imgs/button/right_btn.png" @click="next"/>
          </div>
          <div class="maincontent">
            <div class="line1" style="margin-top: 15px">
              <EvaluationCard v-for="evaluation in pageLine1" :key="evaluation.evaluationid"
                             :evaluation="evaluation" class="evaluation cursor_pointer" @goto="goto" @showRecord="showRecord"></EvaluationCard>
            </div>
            <div class="line2" style="margin-top: 15px">
              <EvaluationCard v-for="evaluation in pageLine2" :key="evaluation.evaluationid"
                             :evaluation="evaluation" class="evaluation cursor_pointer" @goto="goto" @showRecord="showRecord"></EvaluationCard>
            </div>
          </div>
        </div>
    </div>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
      @btn1_click="close_tip" @btn2_click="close_tip"></Alert>
      <EvaluationRecord :recordList="recordList" class="evaluationRecord" v-if="if_showRecord"></EvaluationRecord>
      <img src="../../../static/imgs/button/close.png" @click="if_showRecord = false" v-if="if_showRecord"
           style="width: 50px; height: 50px; position: fixed;left: 65%;top: 180px;z-index: 1000;" class="cursor_pointer"/>
    </div>
  </div>
</template>

<script>
  import Alert from "../tools/Alert";
  import UserLink from "../tools/UserLink"
  import Back from "../tools/Back"
  import EvaluationCard from "../tools/evaluation/EvaluationCard"
  import EvaluationRecord from "../tools/evaluation/EvaluationRecord"
  import EvaluationRequest from "../../api/evaluation"
  import UserRequest from "../../api/user"
  export default {
    name: "goClass",
    components: {
      Alert,UserLink,Back,EvaluationCard,EvaluationRecord
    },
    created() {
      let that = this;
      document.title = "测评";
      const user = sessionStorage.getItem('user')
      if (user!= null) {
        this.user = JSON.parse(user);
      }
      let params = new URLSearchParams();
      EvaluationRequest.getEvaluationList(params).then(res =>{
        if(res.data.code==200) {
          that.evaluationList = res.data.obj;
          that.initEvaluationList();
        }
        else{
          that.open_tip("暂无评测");
        }
      }).catch(e =>{
         console.log(e);
      })
    },
    data() {
      return {
        user: "",
        evaluationList: [],
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
        ],
        recordList:[],
        if_showRecord:false
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

      // 根据章节页显示对应章节
      initEvaluationList() {
        this.pageLine1 = [];
        this.pageLine2 = [];
        let total = this.evaluationList.length;
        let totalPage = Math.floor(total / 6);
        let extra = total - totalPage * 6;
        totalPage = extra > 0 ? totalPage + 1 : totalPage;
        if (this.page === totalPage && extra > 0) {
          if (extra <= 2) {
            for (let i = (this.page - 1) * 6; i < total; i++) {
              this.pageLine1.push(this.evaluationList[i]);
            }
          } else {
            for (let i = (this.page - 1) * 6; i < (this.page - 1) * 6 + 3; i++) {
              this.pageLine1.push(this.evaluationList[i]);
            }
            for (let i = (this.page - 1) * 6 + 3; i < total; i++) {
              this.pageLine2.push(this.evaluationList[i]);
            }
          }
        } else {
          for (let i = (this.page - 1) * 6; i < (this.page - 1) * 6 + 3; i++) {
            this.pageLine1.push(this.evaluationList[i]);
          }
          for (let i = (this.page - 1) * 6 + 3; i < this.page * 6; i++) {
            this.pageLine2.push(this.evaluationList[i]);
          }
        }
      },

      prev() {
        if (this.page === 1) {
          this.open_tip("已经是第一页了");
          return;
        }
        this.page -= 1;
        this.initEvaluationList();
      },

      next() {
        let total = this.evaluationList.length;
        let totalPage = Math.floor(total / 6);
        let extra = total - totalPage * 6;
        totalPage = extra > 0 ? totalPage + 1 : totalPage;
        if (this.page === totalPage) {
          this.open_tip("已经是最后一页了");
          return;
        }
        this.page += 1;
        this.initEvaluationList();
      },

      showRecord(evaluationid){
        let params = new URLSearchParams();
        let that = this;
        let evaluation = this.evaluationList[evaluationid-1]
        params.append("userid",this.user.userid);
        params.append("evaluationid",evaluationid);
        params.append("level",evaluation.level);
        UserRequest.getUserEvaluationList(params).then(res =>{
          if(res.data.code==200) {
            that.recordList = res.data.obj;
            that.if_showRecord = true;
          }
          else{
            that.open_tip("尚无评测记录");
          }
        }).catch(e =>{
          console.log(e)
        })
      },
      goto(evaluationid){
        let evaluation = this.evaluationList[evaluationid-1]
        let params = new URLSearchParams();
        let that = this;
        params.append("userid",this.user.userid);
        params.append("evaluationid",evaluation.evaluationid);
        params.append("level",evaluation.level);
        EvaluationRequest.createEvaluation(params).then(res =>{
          if(res.data.code==200){
            let path = "/evaluation/detail/"+res.data.obj.recordid;
            this.$router.push({path:path});
          }
          else{
            that.open_tip("该等级评测题目不足");
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
  .evaluation {
    background: url("../../../static/imgs/bg/study_bg.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 600px;
    margin: 0;
  }

  .userlink{
    height: 400px;
    margin-top: 130px;
  }

  .evaluationBank{
    width: 1000px;
    height: 100%;
    margin-left: 80px;
    display: flex;
    flex-direction: column;
    padding-top: 3%;
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
    margin-left: 120px;
  }
  .line1,
  .line2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
  }

  .prev {
    position: fixed;
    left: 200px;
    top: 300px;
  }

  .next {
    position: fixed;
    right: 100px;
    top: 300px;
  }

  .prev img,
  .next img {
    width: 100px;
    cursor: pointer;
  }

</style>

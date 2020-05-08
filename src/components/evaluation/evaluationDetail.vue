<template>
   <div class="evalution">
     <audio src="../../../static/sound/black_first.wav" ref="audio1"></audio>
     <audio src="../../../static/sound/white_first.mp3" ref="audio2"></audio>
     <audio src="https://sendeyo.com/updownload/file/script/bf77dd7d4951cfd1dd9c03d6b5f8ec48.mp3" ref="audio3"></audio>
     <audio src="../../../static/sound/right.mp3" ref="audio4"></audio>
     <audio src="../../../static/sound/else.mp3" ref="audio5"></audio>
     <div class="bg-header">
       <Back :href="'/evalution'" class="cursor_pointer"/>
     </div>
     <div class="evalutionArea">
       <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
       <div class="main">
         <Board :game="game" ref="board" @init="init_board" @play="played" class="board"></Board>
         <div class="main-right">
           <div class="message-top">
             <div class="header">
               <span v-if="index<=10">{{ evaluationRecord.evaluation.level}}评测：第{{ index }}题</span>
               <span v-if="index>10">{{ evaluationRecord.evaluation.level}}评测：第10题</span>
             </div>
             <div class="content">
               <span>{{ exercise.content }}</span><br>
               <span v-if="if_end" style="margin-top: 20px;color: red">我的回答{{exercise.result}}</span>
             </div>
             <div class="operate">
                 <Timer :timeCount="timeCount" ref="timer" @time_less="time_less" @time_out="time_out" v-if="!if_end"></Timer>
                 <button @click="begin()" v-if="index==1&&!if_begin&&!if_end">开始</button>
                 <button v-if="if_end" @click="show_answer">展示答案</button>
             </div>
           </div>
           <div class="message-bottom">
             <div class="answer">
               <div v-for="answer in result.answerList" :key="answer.num" class="number cursor_pointer"
                    :class="answer.result=='right'?'right_answer':(answer.result=='wrong'?'wrong_answer':'')" @click="index=answer.num"
                    :id="index==answer.num?'cur':''">
                  {{answer.num}}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
     <alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
            @btn1_click="close_tip" @btn2_click="close_tip"></alert>
     <EvaluationResult :result="result" v-if="show_result"></EvaluationResult>
     <img src="../../../static/imgs/button/close.png" @click="show_result = false" v-if="show_result"
          style="width: 50px; height: 50px; position: fixed;left: 62%;top: 190px;z-index: 1000;" class="cursor_pointer"/>
   </div>
</template>

<script>
  import Alert from "../tools/Alert"
  import UserLink from "../tools/UserLink"
  import Back from "../tools/Back"
  import Board from "../tools/GoBoard"
  import EvaluationRequest from "../../api/evaluation"
  import exercise from '../../api/exercise'
  import Util from "../../../static/js/util/util"
  import Timer from "../tools/playSides/Timer"
  import EvaluationResult from "../tools/evaluation/EvaluationResult"
  export default {
    name: 'evalutionDetail',
    components:{
      Alert,UserLink,Back,Board,Timer,EvaluationResult
    },
    created(){
      this.recordid = this.$route.params.recordid
      const user = sessionStorage.getItem('user')
      if (user!= null) {
        this.user = JSON.parse(user);
      }
    },
    mounted(){
      this.getEvaluation();
    },

    data(){
      return{
        user:null,
        recordid:0,
        evaluationRecord:{
          evaluation:{
            level:""
          }
        },
        linkList:[
          {text:"首页",href:"/home",id:"link1"},
          {text:"教程",href:"/study",id:"link2"},
          {text:"练习题库",href:"/exercise",id:"link3"},
          {text:"对弈大厅",href:"/play",id:"link4"}
        ],
        index:1,
        exercise:{
          content:""
        },
        game: {
          board_size: 19,
          handicap: 0,
          current_player:1,
          komi: 6.5,
          first_player: 1,
        },
        canvas_created:false,
        right_stones:[],
        person_records:[],
        person_step:0,
        dialog: {
          if_show_tip: false,
          tip: "",
          btn1_text: "确定",
          btn2_text: "取消",
        },
        timeCount:300,
        if_begin:false,
        if_end:false,
        result:{
          content:"",
          answerList: [
            {num:1,result:""},
            {num:2,result:""},
            {num:3,result:""},
            {num:4,result:""},
            {num:5,result:""},
            {num:6,result:""},
            {num:7,result:""},
            {num:8,result:""},
            {num:9,result:""},
            {num:10,result:""},
          ],
          wrongKnowledgeList:"",
          level:"",
          wrongIDList:[]
        },
        show_result:false
      }
    },

    watch:{
      index(newVal){
        if(newVal===11){
          let rightList = this.result.answerList.filter((obj) =>{
            return obj.result=="right"
          })
          let wrongList = this.result.answerList.filter(obj =>{
            return obj.result=="wrong"
          })
          this.result.content = rightList.length>=8?"通过":"失败"
          let wrongKnowList = []
          let wrongIDList = [];
          for(let i in wrongList){
            let wrong = wrongList[i];
            let exercise = this.evaluationRecord.exerciseList[wrong.num-1];
            wrongIDList.push(exercise.exerciseid);
            let know = exercise.subType.split("-")[0];
            if(wrongKnowList.indexOf(know)==-1){
              wrongKnowList.push(know)
            }
          }
          this.result.wrongKnowledgeList = wrongKnowList.toString()
          this.result.wrongIDList = wrongIDList.toString();
          this.show_result = true;
          this.send_result();
          return;
        }
        setTimeout(() =>{
          this.init_message()
          this.exercise = this.evaluationRecord.exerciseList[newVal-1];
          this.$refs.board.restart();
          this.init_board();
          if(!this.if_end)
              this.begin();
        },1000)
      }
    },

    methods:{

      open_tip(tip) {
        this.dialog.if_show_tip = true;
        this.dialog.tip = tip;
      },

      close_tip() {
        this.dialog.if_show_tip = false;
        this.dialog.tip = "";
      },

      getEvaluation(){
        let that = this;
        let params = new URLSearchParams();
        params.append("recordid",that.recordid)
        EvaluationRequest.getEvaluationRecordDetail(params).then(res =>{
          console.log(res.data);
          if(res.data==""){
            that.$router.push({path:"/404"})
            return false;
          }
          that.evaluationRecord = res.data;
          if(that.evaluationRecord.state=="已做"){
            that.if_end = true;
            let wrongIDList = that.evaluationRecord.wrongIDList.split(",");
            console.log(wrongIDList)
            for(let i in that.evaluationRecord.exerciseList){
              let exercise = that.evaluationRecord.exerciseList[i];
              console.log(exercise)
              if(wrongIDList.indexOf(exercise.exerciseid+"")!=-1){
                that.result.answerList[i].result="wrong"
                that.evaluationRecord.exerciseList[i].result = "错误";
              }
              else{
                that.result.answerList[i].result="right"
                that.evaluationRecord.exerciseList[i].result = "正确";
              }
            }
          }
          document.title = res.data.evaluation.level+"评测"
          that.exercise = that.evaluationRecord.exerciseList[0];
          that.index = 1;
          that.$nextTick(() =>{
            that.$refs.board.create_board();
          })
        }).catch(e =>{
          console.log(e);
        })
      },

      init_board(){
        this.canvas_created = true;
        let rightStones = this.exercise.right_stones.split(";");
        if (this.exercise.exist_stones != "无") {
          let existStones = this.exercise.exist_stones.split(";");
          this.$refs.board.place_stone(existStones);
        }
        if (this.exercise.content.indexOf("选择") != -1) {
          let choices = rightStones[0].split(",");
          this.$refs.board.put_choices(choices);
          this.right_stones = [rightStones[1]];
        } else {
          this.right_stones = rightStones;
        }
      },

      play(){
        if(this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1) {
          this.$refs.board.play("sign");
        }
        else{
          this.$refs.board.play("stones");
        }
      },

      begin(){
        if(!this.canvas_created) {
          return;
        }
        this.if_begin = true;
        this.$refs.timer.start()
        this.play();
      },

      played(message){
        if(message.state=="success") {
          if (this.person_records.indexOf(message.coordStr) != -1) {
            return;
          }
          this.game.current_player = this.game.current_player == 1 ? 2 : 1;
          this.person_records.push(message.coordStr);
          this.person_step++;
          this.conduct_answer();
        }
      },

      // 判断对错
      conduct_answer() {
        let rightIndex = 0;
        let rightMoves = [];
        let personMove = this.person_records[this.person_step - 1];
        if (this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1) {
          rightMoves = this.right_stones;
          if (rightMoves.indexOf(personMove) != -1) {
            if (rightMoves.length === this.person_step) {
              this.if_begin = false;
              this.$refs.audio4.play();
              this.$refs.timer.stop()
              this.result.answerList[this.index-1].result = "right";
              this.index++;
              return;
            } else if (this.person_step === 1) {
              this.$refs.audio5.play();
              return;
            }
          } else {
            this.if_begin = false;
            this.$refs.audio3.play();
            this.$refs.timer.stop()
            this.result.answerList[this.index-1].result = "wrong";
            this.index++;
            return;
          }
        }
        else {
          rightIndex = (this.person_step - 1) * 2 + 1;
          let rightMoves = this.right_stones[rightIndex - 1].split(",");
          let index = rightMoves.indexOf(personMove);
          if (index != -1) {
            if (rightIndex == this.right_stones.length) {
              this.if_begin = false;
              this.$refs.timer.stop()
              this.$refs.audio4.play();
              this.result.answerList[this.index-1].result = "right";
              this.index++;
              return;
            } else if (rightIndex + 1 == this.right_stones.length) {
              let moves = this.right_stones[rightIndex].split(",");
              let move = moves[index];
              let coord = Util.strTocoord(move, Util.get_cols(19));
              this.refs.board.apply_move(coord, true);
              this.$refs.audio4.play();
              this.if_begin = false;
              this.$refs.timer.stop();
              this.result.answerList[this.index-1].result = "right";
              this.index++;
              return;
            } else {
              let moves = this.right_stones[rightIndex].split(",");
              let move = moves[index];
              let coord = Util.strTocoord(move, Util.get_cols(19));
              this.refs.board.apply_move(coord, true);
              this.play();
              return;
            }
          } else {
            this.if_begin = false;
            this.$refs.audio3.play();
            this.$refs.timer.stop()
            this.result.answerList[this.index-1].result = "wrong";
            this.index++;
            return;
          }
        }
      },
      init_message(){
        this.person_step=0;
        this.timeCount = 300;
        this.person_records = [];
        this.canvas_created = false;
      },

      time_less(){
        this.timeCount--;
      },

      time_out(){
        this.answerList[index-1].result = "wrong";
        this.index++;
      },

      send_result(){
        let ifPass = this.result.content=="通过"?1:0;
        let wrongIDList = this.result.wrongIDList;
        let wrongKnowledgeList = this.result.wrongKnowledgeList;
        let params = new URLSearchParams();
        params.append("ifPass",ifPass);
        params.append("wrongIDList",wrongIDList);
        params.append("wrongKnowledgeList",wrongKnowledgeList);
        params.append("recordid",this.recordid);
        EvaluationRequest.endEvaluation(params).then(res=>{}).catch(e =>{
            console.log(e);
        })
      },
      show_answer(){
        let right_stones = this.exercise.right_stones.split(";");
        for(let i in right_stones){
          let right_stone = right_stones[i];
          let stones = right_stone.split(",");
          let coordStr = stones[Math.floor((Math.random()*stones.length))]
          let coord = Util.strTocoord(coordStr,Util.get_cols(19))
          if(this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1) {
            this.$refs.board.put_select(coord);
          }
          else{
            this.$refs.board.apply_move(coord,true);
          }
          setTimeout(()=>{},500);
        }
      }
    }
  }
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
    background: url("../../../static/imgs/bg/ExerciseBg.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .evalutionArea {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 550px;
    margin: 0;
  }

  .main {
    margin-left: 50px;
    display: flex;
    flex-direction: row;
  }

  .userlink{
    height: 400px;
    margin-top: 130px;
  }
  .board{
    top: 80px;
    position: absolute;
    left: 200px;
    width:545px;
    height:545px;
  }
  .main-right {
    top: 80px;
    display: flex;
    position: absolute;
    left: 850px;
    flex-direction: column;
  }
  .message-top {
    width: 300px;
    height: 220px;
    border-radius: 15px;
    background-color: #fff;
  }
  .message-top .header {
    background-color: #ff8800;
    height: 30px;
    width: 100%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
  .message-top .content {
    height: auto;
    width: 90%;
    margin-top: 20px;
    margin-left: 7%;
  }
  .message-top .operate {
    width: 100%;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .message-top button {
    border: 0;
    color: white;
    background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 100% 100%;
    width: 100px;
    height: 30px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
    margin-top: 20px;
  }
  .message-bottom {
    width: 300px;
    height: 310px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 15px;
  }
  .answer{
    margin-top: 50px;
    width:100%;
    height: 260px;
  }
  .number{
    width:40px;
    height: 40px;
    float: left;
    border:1px solid #b0c9da;
    margin-left: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
    border-radius: 20px;
  }

  .wrong_answer{
    background-color: red;
    border: 0;
  }

  .right_answer{
    background-color: #b0c9da;
    border: 0;
  }

</style>

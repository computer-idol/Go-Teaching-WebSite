<template>
  <div class="exercise">
    <audio src="../../../../static/sound/black_first.wav" ref="audio1"></audio>
    <audio src="../../../../static/sound/white_first.mp3" ref="audio2"></audio>
    <audio src="https://sendeyo.com/updownload/file/script/bf77dd7d4951cfd1dd9c03d6b5f8ec48.mp3" ref="audio3"></audio>
    <audio src="../../../../static/sound/right.mp3" ref="audio4"></audio>
    <audio src="../../../../static/sound/else.mp3" ref="audio5"></audio>
    <div class="bg-header">
      <Back :href="'/exercise'" class="cursor_pointer"/>
    </div>
    <div class="exerciseArea">
      <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
      <div class="main">
        <Board :game="game" ref="board" @init="init_board" @play="played" class="board"></Board>
        <div class="main-right">
          <div class="message-top">
            <div class="header">
              <span v-if="!ifwrong">{{exercise.type }}{{exercise.level }}：{{exercise.subType}}第{{index}}题</span>
              <span v-else>错题第{{index}}题</span>
            </div>
            <div class="content">
              <span>{{ exercise.content }}</span>
            </div>
            <div class="operate">
              <p>
                <button @click="index--">上一题</button>
                <button @click="index++">下一题</button>
              </p>
              <p style="margin-top: -5px;">
                <button @click="begin()" class="nostarted" v-if="!ifbegin">开始</button>
                <button class="started" disabled="disabled" v-if="ifbegin">开始</button>
                <button @click="try_play()" v-if="!game.if_try">试下</button>
                <button @click="cancel_try()" v-if="game.if_try">取消试下</button>
              </p>
            </div>
          </div>
          <div class="message-bottom">
            <img src="../../../../static/imgs/exercise/connect.png" style="position: absolute; left: 50px; top: 200px;"/>
            <img src="../../../../static/imgs/exercise/connect.png" style="position: absolute; left: 230px; top: 200px;"/>
            <img src="../../../../static/imgs/exercise/right.png" v-if="ifshow_right" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../../static/imgs/exercise/wrong.png" v-if="ifshow_wrong" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../../static/imgs/exercise/try.png" v-if="game.if_try" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../../static/imgs/exercise/animal.png" v-if="!ifshow_wrong" style="position: absolute; left: 60px; bottom: 0;"/>
            <img src="../../../../static/imgs/exercise/animal2.png" v-if="ifshow_wrong" style="position: absolute; left: 30px; bottom: 0;"/>
          </div>
        </div>
      </div>
    </div>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
           @btn1_click="close_tip" @btn2_click="close_tip"></Alert>
  </div>
  </div>
</template>

<script>
  import Alert from "../../tools/Alert"
  import UserLink from "../../tools/UserLink"
  import Back from "../../tools/Back"
  import Board from "../../tools/GoBoard"
  import Util from "../../../../static/js/util/util"
  import ExerciseRequest from "../../../api/exercise"
  export default {
    name: '',
    components:{
      Alert,UserLink,Back,Board
    },
    props:{
      exerciseList:{
        type:Array,
        default:() =>[]
      },
      ifwrong:Boolean, //指示用于exercise还是dowrong
      user:{
        type:Object,
        default:() => {}
      }
    },
    data(){
      return{
        dialog: {
          if_show_tip: false,
          tip: "",
          btn1_text: "确定",
          btn2_text: "取消",
        },
        game: {
          board_size: 19,
          handicap: 0,
          current_player:1,
          komi: 6.5,
          first_player: 1,
          variation_first:1,
          variations:[],
          if_try:false,
          records:[]
        },
        index:0,
        canvas_created:false,
        exercise:{},
        ifbegin:false,
        person_step:0,
        ifshow_right:false,
        ifshow_wrong:false,
        right_stones:[],
        linkList: [
          {text:"首页",href:"/home",id:"link1"},
          {text:"教程",href:"/study",id:"link2"},
          {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link3"},
          {text:"对弈大厅",href:"/play",id:"link4"}
        ]
      }
    },
    watch:{
      index(newVal){
        if(newVal>this.exerciseList.length){
         this.open_tip("已经是最后一题了")
         return;
        }
        else if(newVal<=0){
          this.open_tip("当前已经是第一题了")
          return;
        }
        else {
          setTimeout(()=>{
            this.$refs.board.restart();
            this.init_message()
            this.ifbegin=false;
            this.game.if_try = false;
            this.exercise = this.exerciseList[newVal - 1];
            this.ifshow_right = false;
            this.init_board();
          },2000);
        }
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

      // 初始化棋盘
      initBoard() {
        this.index = 1;
        this.exercise = this.exerciseList[this.index-1];
        this.$refs.board.create_board();
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
        this.$refs.board.restart();
        this.init_message()
        this.exercise = this.exerciseList[this.index - 1];
        this.init_board();
        this.ifbegin = true;
        this.play();
      },


      played(message){
        if(message.state=="success") {
          if (this.person_records.indexOf(message.coordStr) != -1) {
            return;
          }
          this.game.current_player = this.game.current_player == 1 ? 2 : 1;
          if(!this.game.if_try) {
            this.game.records.push(message.coordStr);
            this.person_step++;
            this.conduct_answer();
          }
          else{
            this.game.variations.push(message.coordStr);
          }
        }
      },

      // 判断对错
      conduct_answer() {
        let rightIndex = 0;
        let rightMoves = [];
        let personMove = this.game.records[this.person_step - 1];
        if (this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1) {
          rightMoves = this.right_stones;
          if (rightMoves.indexOf(personMove) != -1) {
            if (rightMoves.length === this.person_step) {
              if(this.if_try||!this.ifwrong)
                this.show_right()
              else
                this.up_right();
              return;
            } else if (this.person_step === 1) {
              this.$refs.audio5.play();
              return;
            }
          } else {
            if(this.game.if_try)
              this.show_wrong()
            else
              this.up_wrong();
            return;
          }
        }
        else {
          rightIndex = (this.person_step - 1) * 2 + 1;
          let rightMoves = this.right_stones[rightIndex - 1].split(",");
          let index = rightMoves.indexOf(personMove);
          if (index != -1) {
            if (rightIndex == this.right_stones.length) {
              if(this.if_try||!this.ifwrong)
                this.show_right()
              else
                this.up_right();
              return;
            } else if (rightIndex + 1 == this.right_stones.length) {
              let moves = this.right_stones[rightIndex].split(",");
              let move = moves[index];
              let coord = Util.strTocoord(move, Util.get_cols(19));
              this.refs.board.apply_move(coord, true);
              if(this.if_try||!this.ifwrong)
                this.show_right()
              else
                this.up_right();
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
            if(this.game.if_try)
              this.show_wrong()
            else
              this.up_wrong();
            return;
          }
        }
      },

      show_wrong(){
        this.ifshow_wrong = true;
        this.ifshow_right = false;
        this.ifbegin = false;
        this.$refs.audio4.play();
      },

      //提交错题
      up_wrong(){
        let that = this;
        let imgCode = document.getElementsByTagName("canvas")[0].toDataURL("image/png");
        let params = new URLSearchParams();
        params.append("userid",this.user.userid);
        params.append("exerciseid",this.exercise.exerciseid);
        params.append("imgCode",imgCode);
        ExerciseRequest.AddWrong(params).then(res =>{
          console.log(res.data)
          that.show_wrong();
        }).catch(e =>{
          console.log(e)
        })
      },

      show_right(){
        this.ifshow_right = true;
        this.ifshow_wrong = false;
        this.$refs.audio4.play();
        this.ifbegin = false;
        this.index++;
      },

      up_right(){
        let that = this;
        let params = new URLSearchParams();
        params.append("userid",this.user.userid);
        params.append("exerciseid",this.exercise.exerciseid);
        ExerciseRequest.RemoveWrong(params).then(res =>{
          console.log(res.data)
          that.show_right();
        }).catch(e =>{
          console.log(e)
        })
      },

      init_message(){
        this.person_step=0;
        this.person_records = [];
        this.canvas_created = false;
      },

      //各种操作
      try_play(){
        this.game.if_try=true;
        this.$refs.board.try_play();
        this.play();
      },

      cancel_try(){
        this.game.if_try=false;
        this.$refs.board.cancel_play();
        this.init_message()
        this.exercise = this.exerciseList[this.index - 1];
        this.init_board();
        this.ifbegin = true;
        this.play();
      },
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
  .exercise {
    background: url("../../../../static/imgs/bg/ExerciseBg.jpg") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .exerciseArea {
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
    margin-top: 20px;
  }
  .message-top p {
    display: flex;
    flex-direction: row;
  }
  .message-top p button {
    border: 0;
    color: white;
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 100% 100%;
    width: 100px;
    height: 30px;
    border-radius: 15px;
    margin-left: 30px;
    font-size: 15px;
    font-weight: bold;
  }
  .message-bottom {
    width: 300px;
    height: 310px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 15px;
  }

  .nostarted{
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat !important;
    background-size: 100% 100% !important;
  }

  .started{
    background: url("../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    background-size: 100% 100% !important;
  }
</style>

<template>
  <div class="exercise">
    <audio src="../../../static/sound/black_first.wav" ref="audio1"></audio>
    <audio src="../../../static/sound/white_first.mp3" ref="audio2"></audio>
    <audio src="../../../static/sound/play.wav" ref="audio3"></audio>
    <audio src="../../../static/sound/wrong.mp3" ref="audio4"></audio>
    <audio src="../../../static/sound/right.mp3" ref="audio5"></audio>
    <audio src="../../../static/sound/capture.wav" ref="audio6"></audio>
    <audio src="../../../static/sound/else.mp3" ref="audio7"></audio>
    <div class="bg-header">
      <Back :href="'/exercise'"/>
    </div>
    <div class="exerciseArea">
      <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
      <div class="main">
        <div id="board" style="width: 550px; height: 550px;"></div>
        <div class="main-right">
          <div class="message-top">
            <div class="header">
              <span>{{ type }}{{ level }}：{{ subType }}第{{ index }}题</span>
            </div>
            <div class="content">
              <span>{{ exercise.content }}</span>
            </div>
            <div class="operate">
              <p>
                <button @click="prev()">上一题</button>
                <button @click="next()">下一题</button>
              </p>
              <p style="margin-top: -5px;">
                <button @click="start()">开始</button>
                <button @click="try_play()" v-if="!if_try">试下</button>
                <button @click="cancel_try()" v-if="if_try">取消试下</button>
              </p>
            </div>
          </div>
          <div class="message-bottom">
            <img src="../../../static/imgs/exercise/connect.png" style="position: absolute; left: 50px; top: 200px;"/>
            <img src="../../../static/imgs/exercise/connect.png" style="position: absolute; left: 230px; top: 200px;"/>
            <img src="../../../static/imgs/exercise/right.png" v-if="ifshow_right" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../static/imgs/exercise/wrong.png" v-if="ifshow_wrong" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../static/imgs/exercise/try.png" v-if="if_try" style="
                width: 70px;
                height: 70px;
                margin-top: 30px;
                margin-left: 200px;
              "/>
            <img src="../../../static/imgs/exercise/animal.png" v-if="!ifshow_wrong" style="position: absolute; left: 60px; bottom: 0;"/>
            <img src="../../../static/imgs/exercise/animal2.png" v-if="ifshow_wrong" style="position: absolute; left: 30px; bottom: 0;"/>
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
</template>

<script>
import axios from "axios";
import JGO from "../../../static/js/jgoboard-master/jgoboard-master/dist/jgoboard-latest";
import Medium from "../../../static/js/jgoboard-master/jgoboard-master/medium/board";
import Sgf from "../../../static/js/util/sgf";
import Util from "../../../static/js/util/util";
import alert from "../tools/Alert";
import UserLink from "../../components/tools/UserLink"
import Back from "../../components/tools/Back"
import $ from "jquery";
export default {
  name: "detailexercise",
  components: {
    alert,Back,UserLink
  },
  created() {
    this.typeid = this.$route.params.typeid;
    this.levelid = this.$route.params.levelid;
    this.subType = Util.getUrlKey("type");
    this.type = this.types[this.typeid];
    this.level = this.levels[this.levelid];
    document.title = this.type + this.level + "题库";
    var usermsg = sessionStorage.getItem("user");
    if (usermsg != null) {
      this.user = JSON.parse(usermsg);
    }
    this.getExerciseList();
  },
  data() {
    return {
      type: "",
      level: "",
      user: {
        photo: "../../../static/imgs/logo.png",
      },
      types: ["0", "布局", "死活", "手筋", "官子"],
      levels: ["0", "9k", "8k", "7k", "6k", "5k", "4k", "3k", "2k", "1k", "1D", "2D", "3D"],
      index: 1,
      exercise: {
        content: "请下在小目",
      },
      exercises: null,
      exist_records: [], // 题目记录
      person_records: [], // 用户落子情况
      right_stones: [],
      person_step: 0,
      begin: false,
      jboard: null,
      jrecord: null,
      jsetup: null,
      canvas: null,
      current_player: 1,
      me_player: 1,
      ko: false,
      lastMove: false,
      lastHover: false,
      lastX: -1,
      lastY: -1,
      ifshow_right: false,
      ifshow_wrong: false,
      if_try: false,
      variation_first: 1,
      try_records: [],
      subType: "",
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      linkList: [
        {text:"首页",href:"/home",id:"link1"},
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
    getExerciseList() {
      let params = new URLSearchParams();
      params.append("type", "'" + this.type + "'");
      params.append("level", "'" + this.level + "'");
      params.append("subType", this.subType);
      let that = this;
      axios({
        method: "post",
        url: "http://localhost:8081/exercise/getSubExercise",
        data: params,
      }).then((res) => {
          console.log(res.data);
          if(res.data==""){
            that.$router.push({path:"/404"})
            return false;
          }
          let exerciseList = res.data;
          that.exercises = exerciseList;
          that.init();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    init() {
      this.initBoard();
    },
    // 开始做题
    start() {
      if (this.begin) {
        return;
      }
      this.init_message();
      $("#board span").remove();
      this.jboard.clear();
      if (
        this.exercise.content.indexOf("找出") == -1 &&
        !this.begin &&
        this.exercise.content.indexOf("选择") == -1
      ) {
        if (this.current_player == 1) {
          this.$refs.audio1.play();
        } else {
          this.$refs.audio2.play();
        }
      }
      this.begin = true;
      this.put_exist_stones();
      this.play();
    },
    // 上一题
    prev() {
      if (this.index == 1) {
        this.open_tip("目前已经是第一题了");
        return;
      }
      this.index--;
      $("#board span").remove();
      this.initExercise();
    },
    // 下一题
    next() {
      if (this.index == this.exercises.length) {
        this.open_tip("已经最后一题了，请返回选其他类型的吧");
        return;
      }
      this.index++;
      $("#board span").remove();
      this.initExercise();
    },
    // 初始化棋盘
    initBoard() {
      let that = this;
      that.jrecord = new window.JGO.Record(19);
      that.jboard = that.jrecord.jboard;
      that.jsetup = new window.JGO.Setup(that.jboard, Medium.medium);
      that.jsetup.setOptions({ stars: { points: 9 } });
      that.jsetup.create("board", function (canvas) {
        that.canvas = canvas;
        that.initExercise();
      });
    },
    // 初始化题目
    initExercise() {
      this.jboard.clear();
      this.init_message();
      this.exercise = this.exercises[this.index - 1];
      let rightStones = this.exercise.right_stones.split(";");
      if (this.exercise.exist_stones != "无") {
        this.existRecords = this.exercise.exist_stones.split(";");
        this.put_exist_stones();
      }
      if (this.exercise.content.indexOf("选择") != -1) {
        let choices = rightStones[0].split(",");
        this.put_choices(choices);
        this.right_stones = [rightStones[1]];
      } else {
        this.right_stones = rightStones;
      }
    },
    // 放置题目的选择
    put_choices(choices) {
      for (let i = 0; i < choices.length; i++) {
        let coord = Util.strTocoord(choices[i],Util.get_cols(19));
        this.jboard.setType(coord, window.JGO.DIM_CHOICE);
      }
    },
    // 放置题目的棋子
    put_exist_stones() {
      for (let i = 0; i < this.exist_records.length; i++) {
        if (this.exist_records[i] != "") {
          let coord = Util.strTocoord(this.exist_records[i], Util.get_cols(19));
          this.apply_move(coord, false);
        } else {
          this.current_player = this.current_player == 1 ? 2 : 1;
        }
      }
      this.me_player = this.current_player;
      this.variation_first = this.current_player;
    },
    // 应用落子
    apply_move(coord, ifUser) {
      let that = this;
      let play = that.jboard.playMove(coord, that.current_player, that.ko);
      if (play.success) {
        let node = that.jrecord.createNode(true);
        if (play.captures.length > 0) {
          that.$refs.audio6.play();
        }
        node.setType(play.captures, window.JGO.CLEAR);
        node.setType(coord, that.current_player);
        if (ifUser && !that.if_try)
          node.setMark(coord, window.JGO.MARK.CIRCLE);
        if (that.lastMove)
          node.setMark(that.lastMove, window.JGO.MARK.NONE);
        if (that.ko)
          node.setMark(that.ko, window.JGO.MARK.NONE);
        that.lastMove = coord;
        that.ko = play.ko;
        that.current_player = that.current_player == 1 ? 2 : 1;
        return true;
      } else {
        return false;
      }
    },

    // 用户落子
    play() {
      let that = this;
      that.canvas.addListener("click", function (coord, ev) {
        if (!that.begin) {
          return;
        }
        if (that.me_player != that.current_player && !that.if_try) {
          return;
        }
        if (ev.shiftKey) {
          if (that.jboard.getMark(coord) == window.JGO.MARK.NONE) {
            that.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          } else {
            that.jboard.setMark(coord, window.JGO.MARK.NONE);
          }
          return;
        }
        if (that.lastHover) {
          that.jboard.setType(new window.JGO.Coordinate(that.lastX, that.lastY), window.JGO.CLEAR);
        }
        that.lastHover = false;
        let coordStr = Util.coordTostr(coord, Util.get_cols(19));
        if (
          that.exercise.content.indexOf("找出") != -1 ||
          that.exercise.content.indexOf("选择") != -1
        ) {
          if (that.person_records.indexOf(coordStr) != -1) {
            return;
          }
          that.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          that.person_records.push(coordStr);
          that.person_step++;
          that.conduct_answer();
        } else {
          if (that.apply_move(coord, true)) {
            that.$refs.audio3.play();
            that.person_records.push(coordStr);
            that.person_step++;
            if (!that.if_try) {
              that.conduct_answer();
            } else {
              that.play();
              that.try_records.push(coordStr);
              that.show_vardiation_num();
            }
          }
        }
      });
      // 监听鼠标移动,显示半透明棋子
      that.canvas.addListener("mousemove", function (coord, ev) {
        if (!that.begin)
          return;
        if (that.me_player != that.current_player && !that.if_try)
          return;
        if (coord.i == -1 || coord.j == -1 || (coord.i == that.lastX && coord.j == that.lastY))
          return;
        if (that.lastHover)
          that.jboard.setType(new window.JGO.Coordinate(that.lastX, that.lastY), window.JGO.CLEAR);
        that.lastX = coord.i;
        that.lastY = coord.j;
        if (that.jboard.getType(coord) == window.JGO.CLEAR && that.jboard.getMark(coord) == window.JGO.MARK.NONE)
        {
          if (that.exercise.content.indexOf("找出") != -1 || that.exercise.content.indexOf("选择") != -1)
            that.jboard.setType(coord, window.JGO.DIM_SELECTED);
          else
            that.jboard.setType(coord, that.current_player == 2 ? window.JGO.DIM_WHITE : window.JGO.DIM_BLACK);
          that.lastHover = true;
        } else
          that.lastHover = false;
      });
      // 监听鼠标移出
      that.canvas.addListener("mouseout", function (ev) {
        if (!that.begin)
          return;
        if (that.me_player != that.current_player && !that.if_try)
          return;
        if (that.lastHover)
          that.jboard.setType(new window.JGO.Coordinate(that.lastX, that.lastY), window.JGO.CLEAR);
        that.lastHover = false;
      });
    },

    // 判断对错
    conduct_answer() {
      let that = this;
      let rightIndex = 0;
      let rightMoves = [];
      let personMove = this.person_records[this.person_step - 1];
      if (this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1) {
        rightMoves = this.right_stones;
        if (rightMoves.indexOf(personMove) != -1) {
          if (rightMoves.length == this.person_step) {
            this.ifshow_right = true;
            this.begin = false;
            that.$refs.audio5.play();
          } else if (this.person_step == 1)
            that.$refs.audio7.play();
        } else {
          this.ifshow_wrong = true;
          this.begin = false;
          that.$refs.audio4.play();
        }
      } else {
        rightIndex = (this.person_step - 1) * 2 + 1;
        let rightMoves = this.right_stones[rightIndex - 1].split(",");
        let index = rightMoves.indexOf(personMove);
        if (index != -1) {
          if (rightIndex == this.right_stones.length) {
            this.ifshow_right = true;
            this.begin = false;
            that.$refs.audio5.play();
          } else if (rightIndex + 1 == this.right_stones.length) {
            let moves = this.right_stones[rightIndex].split(",");
            let move = moves[index];
            let coord = Util.strTocoord(move, this.COLS);
            this.apply_move(coord, true);
            that.$refs.audio5.play();
            this.ifshow_right = true;
            this.begin = false;
          } else {
            let moves = this.right_stones[rightIndex].split(",");
            let move = moves[index];
            let coord = Util.strTocoord(move, this.COLS);
            this.apply_move(coord, true);
            this.play();
          }
        } else {
          this.ifshow_wrong = true;
          this.begin = false;
          that.$refs.audio4.play();
        }
      }
    },

    // 初始化信息
    init_message() {
      this.begin = false;
      this.if_try = false;
      this.try_records = [];
      this.person_step = 0;
      this.person_records = [];
      this.current_player = 1;
      this.ifshow_right = false;
      this.ifshow_wrong = false;
      this.ko = false;
      this.lastMove = false;
      this.lastHover = false;
      this.lastX = -1;
      this.lastY = -1;
    },

    // 试下
    try_play() {
      if (!this.begin) {
        this.open_tip("请先点击开始");
        return;
      }
      if (this.ifshow_right || this.ifshow_wrong)
        return;
      if (this.exercise.content.indexOf("找出") != -1 || this.exercise.content.indexOf("选择") != -1)
        return;
      this.if_try = true;
    },
    // 取消试下
    cancel_try() {
      this.init_message();
      $("#board span").remove();
      this.jboard.clear();
      this.begin = true;
      this.put_exist_stones();
      this.play();
    },
    // 显示变化手数
    show_vardiation_num() {
      $("#board span").remove();
      let color = this.variation_first == 1 ? "white" : "black";
      for (let i = 0; i < this.try_records.length; i++) {
        let coord = Util.strTocoord(this.try_records[i], this.COLS);
        let id = coord.i + "," + coord.j;
        let span = document.getElementById(id);
        // 覆盖
        if (span != null)
          document.getElementById("board").removeChild(span);
        let p = i + 1;
        span = Sgf.get_proper_span(coord, this.canvas, p, color, 19);
        document.getElementById("board").appendChild(span);
        color = color == "white" ? "black" : "white";
      }
      // 修正，如果notifier.board上该点为0，就不放数字
      let spans = document.getElementById("board").getElementsByTagName("span");
      for (let i = 0; i < spans.length; i++) {
        let span = spans[i];
        let x = span.id.split(",")[0];
        let y = span.id.split(",")[1];
        if (this.jboard.stones[x][y] == 0) {
          document.getElementById("board").removeChild(span);
        }
      }
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
#board {
  top: 80px;
  display: flex;
  position: absolute;
  left: 260px;
  background: url("../../../static/js/jgoboard-master/jgoboard-master/medium/shinkaya.jpg")
    no-repeat;
  background-size: 100% 100%;
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
  background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
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
</style>

<template>
  <div class="study">
    <audio :src="audioSrc" ref="audio" @ended="audioend"></audio>
    <audio src="https://sendeyo.com/up/4457891cbc89a845ff9393474e8ff956.mp3" ref="audio2"></audio>
    <audio src="../../../static/sound/play.wav" ref="audio3"></audio>
    <audio src="../../../static/sound/capture.wav" ref="audio4"></audio>
    <audio src="../../../static/sound/wrong.mp3" ref="audio5"></audio>
    <audio src="https://sendeyo.com/up/cefdf12de2c99ac91840c3a3c831a285.mp3" ref="audio6"></audio>
    <div class="bg-header">
      <Back :href="'/study'"/>
    </div>
    <div class="studyArea">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="study_main">
          <div class="header">
            <div class="goprev">
              <img src="../../../static/imgs/button/left_btn.png" @click="prev"/>
            </div>
            <div class="classList">
              <div v-for="(goclass, index) in pageList" class="class_item"
                :class="index == active_index ? 'active' : 'common'" @click="choose(index)" :key="index">
                <img :src="goclass.coverImg" class="cursor_pointer" />
                <div class="name">
                  <span>{{ goclass.className }}</span>
                </div>
              </div>
            </div>
            <div class="gonext">
              <img src="../../../static/imgs/button/right_btn.png" @click="next"/>
            </div>
          </div>
          <div class="study_content">
            <button id="begin" v-if="!if_begin" @click="begin">开始学习</button>
            <div id="board" style="width: 500px; height: 500px;" v-if="if_begin && !if_show_img"></div>
            <img :src="teachStep.img" class="board_img" v-if="if_show_img && teachStep != null"/>
            <div class="study_message" align="left" v-if="choices.length == 0 && if_begin">
              {{ study_message }}
              <div class="study_operate" v-if="!if_listen">
                <button v-if="if_wrong" class="rebegin" @click="rebegin">重新开始</button>
                <button v-if="if_try && if_begin && if_show_try" class="cancel_try" @click="cancel_try">取消试下</button>
                <button v-if="!if_try && if_begin && if_show_try" class="try" @click="try_play">试下</button>
              </div>
            </div>
            <div class="select" v-if="choices.length != 0 && if_begin">
              <div class="question" align="left">{{ question }}</div>
              <div class="question_choices">
                <button class="question_choice" v-for="(choose, index) in choices" @click="conduct_choice(choose)" :key="index">
                  {{ choose }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <alert
      v-if="dialog.if_show_tip"
      :tip="dialog.tip"
      :btn1_text="dialog.btn1_text"
      :btn2_text="dialog.btn2_text"
      @btn1_click="op"
      @btn2_click="close_tip"
    ></alert>
  </div>
</template>

<script>
import JGO from "../../../static/js/jgoboard-master/jgoboard-master/dist/jgoboard-latest";
import Sgf from "../../../static/js/util/sgf";
import Util from "../../../static/js/util/util";
import alert from "../tools/Alert";
import UserLink from "../../components/tools/UserLink"
import Back from "../tools/Back"
import StudyRequest from "../../api/study"
import $ from "jquery";
export default {
  name: "classDetail",
  components: {
    alert,UserLink,Back
  },
  created() {
    this.chapterid = this.$route.params.chapterid;
    this.chapterNum = this.$route.params.chapterNum;
    var usermsg = sessionStorage.getItem("user");
    if (usermsg != null) {
      this.user = JSON.parse(usermsg);
    }
    this.init();
  },
  data() {
    return {
      user: "",
      classList: [],
      pageList: [],
      page: 1,
      if_set_difficulty: false,
      if_show_img: false,
      classid: 0,
      active_index: 0,
      chapter: null,
      if_begin: false,
      board_size: 0,
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
      teachStepList: [],
      step: 0, // 教学步骤,
      study_message: "",
      if_try: false,
      variation_first: 1,
      try_records: [],
      choices: [],
      question: "",
      audioSrc: "",
      exist_records: [], // 题目记录
      person_records: [], // 用户落子情况
      right_stones: [],
      person_step: 0,
      if_listen: true, // 是否处于听讲模式
      if_wrong: false,
      if_show_try: false,
      remain: [], // 上一步要保留的棋子,
      teachStep: null,
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_data: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link2"},
        {text:"题库练习",href:"/exercise",id:"link3"},
        {text:"对弈大厅",href:"/play",id:"link4"}
      ]
    };
  },

  methods: {
    // 打开dialog
    open_dialog(tip, buttonData) {
      this.dialog.if_show_tip = true;
      this.dialog.tip = tip;
      this.dialog.btn1_data = buttonData;
    },

    op() {
      if (this.dialog.btn1_data == "")
        this.close_dialog();
      else {
        // 去下一课
        if (this.dialog.btn1_data.type == "go_next_class") {
          this.active_index++;
          this.getClass();
        } else if (this.dialog.btn1_data.type == "go_next_chapter") {
          let path = this.button1_data.path;
          this.$router.push({ path: path });
        } else if (this.dialog.btn1_data.type == "go_back") {
          let path = "/study";
          this.$router.push({ path: path });
        }
      }
    },

    close_dialog() {
      this.dialog.if_show_tip = false;
      this.tip = "";
    },

    init() {
      this.getClassList();
    },
    getClassList() {
      let that = this;
      let params = new URLSearchParams();
      params.append("chapterid", this.chapterid);
      StudyRequest.getClassList(params).then((res) => {
          if(res.data.code==200) {
            that.classList = res.data.obj;
            that.chapter = that.classList[0].chapter;
            document.title = that.chapter.chapterName;
            that.active_index = 0;
            that.page = 1;
            that.initpageClass();
            that.getClass();
          }
        }).catch(function (error) {
          console.log(error);
        });
    },

    // 根据章节页显示对应章节
    initpageClass() {
      this.pageList = [];
      let total = this.classList.length;
      let totalPage = Math.floor(total / 5);
      let extra = total - totalPage * 5;
      totalPage = extra > 0 ? totalPage + 1 : totalPage;
      if (this.page == totalPage && extra > 0) {
        for (let i = (this.page - 1) * 5; i < total; i++)
          this.pageList.push(this.classList[i]);
      } else {
        for (let i = (this.page - 1) * 5; i < this.page * 5; i++)
          this.pageList.push(this.classList[i]);
      }
    },

    // 初始化课程
    getClass() {
      let nowClass = this.pageList[this.active_index];
      let params = new URLSearchParams();
      params.append("classid", nowClass.classid);
      params.append("chapterid", this.chapterid);
      let that = this;
      StudyRequest.getTeachStepList(params).then((res) => {
        if(res.data.code==200) {
          that.teachStepList = res.data.obj;
          that.step = 0;
          that.if_begin = false;
        }
      }).catch(function (error) {
          console.log(error);
      });
    },

    // 初始化信息
    init_step_message() {
      this.current_player = 1;
      this.me_player = 1;
      this.ko = false;
      this.lastMove = false;
      this.lastHover = false;
      this.lastX = -1;
      this.lastY = -1;
      this.if_try = false;
      this.try_records = [];
      this.person_step = 0;
      this.person_records = [];
      this.if_try = false;
      this.variation_first = 1;
      this.choices = [];
      this.if_wrong = false;
    },

    // 初始化教学步骤
    initTeachStep() {
      let that = this;
      if (this.teachStepList.length == 0) {
        this.open_dialog("暂无课程", "");
        return;
      }
      that.init_step_message();
      that.if_begin = true;
      let teachStep = this.teachStepList[that.step];
      this.teachStep = teachStep;
      this.if_show_img = teachStep.if_show_img == 1;
      if (that.remain.length == 0 && !this.if_show_img) {
        $("canvas").remove();
        that.board_size = teachStep.board_size;
        that.jrecord = new window.JGO.Record(that.board_size);
        that.jboard = that.jrecord.jboard;
        that.jsetup = new window.JGO.Setup(that.jboard, Util.choose_board_size(that.board_size));
        that.jsetup.setOptions({stars: { points: Util.get_point_num(that.board_size) }});
        that.jsetup.create("board", function (canvas) {
          that.canvas = canvas;
          that.initmessage();
        });
      } else {
        let that = this;
        this.remain = [];
        let teachStep = this.teachStepList[that.step];
        if (teachStep.rightstones == "all") {
          that.if_show_try = false;
          that.remain = teachStep.stepcontent.split(";");
        }
        else if (!this.if_show_img)
          that.if_show_try = true;
        let content = teachStep.stepcontent;
        let interactiveStyle = teachStep.interactiveStyle;
        that.if_listen = interactiveStyle == 1;
        that.study_message = content;
        that.$refs.audio.src = teachStep.audioSrc;
        that.$refs.audio.play();
      }
    },

    // 放置题目的棋子
    put_exist_stones() {
      let teachStep = this.teachStepList[this.step];
      let interactiveStyle = teachStep.interactiveStyle;
      console.log(interactiveStyle);
      let stepStones = teachStep.stepstones;
      if (stepStones != "无") {
        let existRecords = stepStones.split(";");
        for (let i = 0; i < existRecords.length; i++) {
          if (existRecords[i] != "") {
            let coord = Util.strTocoord(existRecords[i], Util.get_cols(this.board_size));
            this.apply_move(coord, false);
          }
          else
            this.current_player = this.current_player == 1 ? 2 : 1;
        }
        this.me_player = this.current_player;
        this.variation_first = this.current_player;
      }
      if (interactiveStyle == 2) {
        let choices = teachStep.choices;
        this.choices = choices.split(";");
        this.question = teachStep.stepcontent;
      }
    },

    // 音频播放完毕
    audioend() {
      let that = this;
      let teachStep = this.teachStepList[that.step];
      let interactiveStyle = teachStep.interactiveStyle;
      if (interactiveStyle == 1) {
        setTimeout(function () {
          that.next_step();
        }, 1500);
      } else {
        that.wait_user();
      }
    },

    // 教学信息
    initmessage() {
      let that = this;
      let teachStep = this.teachStepList[that.step];
      if (teachStep.rightstones == "all") {
        that.if_show_try = false;
        that.remain = teachStep.stepcontent.split(";");
      }
      else
        that.if_show_try = true;
      let content = teachStep.stepcontent;
      let interactiveStyle = teachStep.interactiveStyle;
      that.if_listen = interactiveStyle == 1;
      that.put_exist_stones();
      that.study_message = content;
      that.$refs.audio.src = teachStep.audioSrc;
      that.$refs.audio.play();
    },

    wait_user() {
      let interactiveStyle = this.teachStep.interactiveStyle;
      if (interactiveStyle != 2)
        this.play();
    },

    next_step() {
      let that = this;
      that.step++;
      if (that.step == that.teachStepList.length) {
        that.$refs.audio6.play();
        if (that.active_index < that.classList.length - 1) {
          let data = {
            type: "go_next_class",
          };
          that.open_dialog("是否进入下一课的学习", data);
        } else if (that.chapterid < that.chapterNum) {
          // 未学完全部章节
          let nextChapterid = that.chapterid + 1;
          let data = {
            type: "go_next_chapter",
            path: "/study/detail/" + that.chapterNum + "/" + nextChapterid,
          };
          that.open_dialog("当前章已学完，是否进入下一章节学习", data);
        } else {
          // 当前级别的课程已经学完
          let data = {
            type: "go_back",
          };
          that.open_dialog("当前级别的课程已经学完，是否返回选择其它级别进行学习", data);
        }
        return;
      }
      that.initTeachStep();
    },

    prev() {
      if (this.page == 1) {
        this.open_dialog("已经是第一页了", "");
        return;
      }
      this.page -= 1;
      this.active_index = 0;
      this.initTeachStep();
    },

    next() {
      let total = this.classList.length;
      let totalPage = Math.floor(total / 6);
      let extra = total - totalPage * 6;
      totalPage = extra > 0 ? totalPage + 1 : totalPage;
      if (this.page == totalPage) {
        this.open_dialog("已经是最后一页了", "");
        return;
      }
      this.page += 1;
      this.active_index = 0;
      this.initTeachStep();
    },

    choose(index) {
      this.active_index = index;
      this.getClass();
    },
    // 开始学习
    begin() {
      this.initTeachStep();
    },

    rebegin() {
      this.init_step_message();
      $("#board span").remove();
      this.jboard.clear();
      this.put_exist_stones();
      this.play();
    },

    // 应用落子
    apply_move(coord, userPlay) {
      let that = this;
      let play = that.jboard.playMove(coord, that.current_player, that.ko);
      if (play.success) {
        let node = that.jrecord.createNode(true);
        if (play.captures.length > 0)
          that.$refs.audio4.play();
        node.setType(play.captures, window.JGO.CLEAR);
        node.setType(coord, that.current_player);
        if (userPlay && !that.if_try)
          node.setMark(coord, window.JGO.MARK.CIRCLE);
        if (that.lastMove)
          node.setMark(that.lastMove, window.JGO.MARK.NONE);
        if (that.ko)
          node.setMark(that.ko, window.JGO.MARK.NONE);
        that.lastMove = coord;
        that.ko = play.ko;
        that.current_player = that.current_player == 1 ? 2 : 1;
        return true;
      }
      else
        return false;
    },

    conduct_choice(choice) {
      let teachStep = this.teachStepList[this.step];
      let rightchoice = teachStep.rightchoice;
      if (rightchoice == choice) {
        let that = this;
        setTimeout(function () {
          that.next_step();
        }, 1500);
      } else {
        this.$refs.audio2.play();
      }
    },

    // 用户落子
    play() {
      let that = this;
      let interactiveStyle = this.teachStep.interactiveStyle;
      that.canvas.addListener("click", function (coord, ev) {
        if (that.me_player != that.current_player && !that.if_try)
          return;
        if (ev.shiftKey) {
          if (that.jboard.getMark(coord) == window.JGO.MARK.NONE)
            that.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          else
            that.jboard.setMark(coord, window.JGO.MARK.NONE);
          return;
        }
        if (that.lastHover)
          that.jboard.setType(new window.JGO.Coordinate(that.lastX, that.lastY), window.JGO.CLEAR);
        that.lastHover = false;
        let coordStr = Util.coordTostr(coord, Util.get_cols(that.board_size));
        if (interactiveStyle == 3) {
          if (that.person_records.indexOf(coordStr) != -1)
            return;
          that.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          that.person_records.push(coordStr);
          that.person_step++;
          if (!that.if_try)
            that.conduct_answer();
        } else {
          if (that.apply_move(coord, true)) {
            that.$refs.audio3.play();
            that.person_records.push(coordStr);
            that.person_step++;
            if (!that.if_try)
              that.conduct_answer();
            else {
              that.play();
              that.try_records.push(coordStr);
              that.show_vardiation_num();
            }
          }
        }
      });
      // 监听鼠标移动,显示半透明棋子
      that.canvas.addListener("mousemove", function (coord, ev) {
        if (that.me_player != that.current_player && !that.if_try)
          return;
        if (coord.i == -1 || coord.j == -1 || (coord.i == that.lastX && coord.j == that.lastY))
          return;
        if (that.lastHover)
          that.jboard.setType(new window.JGO.Coordinate(that.lastX, that.lastY), window.JGO.CLEAR);
        that.lastX = coord.i;
        that.lastY = coord.j;
        if (that.jboard.getType(coord) == window.JGO.CLEAR && that.jboard.getMark(coord) == window.JGO.MARK.NONE) {
          if (interactiveStyle == 3)
            that.jboard.setType(coord, window.JGO.DIM_SELECTED);
          else
            that.jboard.setType(coord, that.current_player == 2 ? window.JGO.DIM_WHITE : window.JGO.DIM_BLACK);
          that.lastHover = true;
        } else
          that.lastHover = false;
      });
      that.canvas.addListener("mouseout", function (ev) {
        // 监听鼠标移出
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
      let teachStep = this.teachStepList[that.step];
      let rightstones = teachStep.rightstones;
      if (rightstones == "all") {
        setTimeout(function () {
          that.next_step();
        }, 1500);
      } else {
        let rightstoneList = rightstones.split(";");
        let rightIndex = 0;
        let rightMoves = [];
        let personMove = this.person_records[this.person_step - 1];
        if (teachStep.interactiveStyle == 3) {
          rightMoves = rightstoneList;
          if (rightMoves.indexOf(personMove) != -1) {
            if (rightMoves.length == this.person_step) {
              setTimeout(function () {
                that.next_step();
              }, 1500);
            }
          } else {
            that.if_wrong = true;
            that.$refs.audio5.play();
          }
        } else {
          rightIndex = (this.person_step - 1) * 2 + 1;
          let rightMoves = rightstoneList[rightIndex - 1].split(",");
          let index = rightMoves.indexOf(personMove);
          if (index != -1) {
            if (rightIndex == rightstoneList.length) {
              setTimeout(function () {
                that.next_step();
              }, 1500);
            } else if (rightIndex + 1 == rightstoneList.length) {
              let moves = this.rightstoneList[rightIndex].split(",");
              let move = moves[index];
              let coord = Util.strTocoord(move, Util.get_cols(this.board_size));
              this.apply_move(coord, true);
              setTimeout(function () {
                that.next_step();
              }, 1500);
            } else {
              let moves = rightstoneList[rightIndex].split(",");
              let move = moves[index];
              let coord = Util.strTocoord(move, Util.get_cols(this.board_size));
              this.apply_move(coord, true);
              this.play();
            }
          } else {
            that.if_wrong = true;
            that.$refs.audio5.play();
          }
        }
      }
    },

    // 试下
    try_play() {
      this.if_try = true;
    },
    // 取消试下
    cancel_try() {
      this.init_step_message();
      $("#board span").remove();
      this.jboard.clear();
      this.put_exist_stones();
      this.play();
    },

    // 显示变化手数
    show_vardiation_num() {
      $("#board span").remove();
      let color = this.variation_first == 1 ? "white" : "black";
      for (let i = 0; i < this.try_records.length; i++) {
        let coord = Util.strTocoord(this.try_records[i], Util.get_cols(this.board_size));
        let id = coord.i + "," + coord.j;
        let span = document.getElementById(id);
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
        if (this.jboard.stones[x][y] == 0)
          document.getElementById("board").removeChild(span);
      }
    },
  },
};
</script>
<style>
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
  height: 700px;
  margin: 0;
}

.userlink{
  height: 400px;
  margin-top: 130px;
}
.study_main {
  margin-top: 5px;
  width: 1000px;
  height: 100%;
  margin-left: 50px;
  display: flex;
  flex-direction: column;
}
.study_main .header {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
}

.study_main .header .goprev,
.study_main .header .gonext {
  width: auto;
  height: 100px;
}

.study_main .header .classList {
  width: 80%;
  height: 140px;
  display: flex;
  flex-direction: row;
}
.goprev img,
.gonext img {
  width: 120px;
  cursor: pointer;
}

.class_item {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  height: 140px;
  width: 120px;
}
.class_item img {
  width: 120px;
  height: 120px;
}
.class_item .name {
  width: 120px;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 14px;
}

.study_content {
  margin-top: 45px;
  display: flex;
  flex-direction: row;
  height: 500px;
  width: 1000px;
}

.study_operate {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: auto;
}

.rebegin,
.try,
.cancel_try {
  margin-left: 30px;
  border: 0;
  color: white;
  background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
  background-size: 100% 100%;
  width: 100px;
  height: 30px;
  border-radius: 15px;
  font-size: 15px;
  font-weight: bold;
}

.study_message,
.select {
  height: 470px;
  width: 360px;
  background-color: white;
  position: absolute;
  left: 780px;
  top: 150px;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px;
}

#begin {
  background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
  background-size: 200px 40px;
  color: white;
  width: 200px;
  height: 40px;
  border: 0;
  position: fixed;
  left: 45%;
  top: 400px;
  z-index: 100;
  font-size: 20px;
  font-weight: bold;
}

#board {
  top: 150px;
  display: flex;
  position: absolute;
  left: 180px;
  background: url("../../../static/js/jgoboard-master/jgoboard-master/medium/shinkaya.jpg")
    no-repeat;
  background-size: 100% 100%;
}

.board_img {
  width: 500px;
  height: 500px;
  top: 150px;
  left: 180px;
  position: absolute;
}

.select {
  display: flex;
  flex-direction: column;
}
.select .question {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  width: 360px;
  height: auto;
}

.select .question_choices {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}

.select .question_choices .question_choice {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 20px;
  color: white;
  background: url("../../../static/imgs/button/lightblue_button.png") no-repeat;
  background-size: 60px 60px;
  margin-left: 20px;
}

.active {
  background: rgba(0, 0, 0, 0.1);
}
</style>

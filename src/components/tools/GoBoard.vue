<template>
  <div>
    <div id="board"></div>
    <audio src="../../../static/sound/play.wav" ref="audio1"></audio>
    <audio src="../../../static/sound/capture.wav" ref="audio2"></audio>
  </div>
</template>

<script>
import JGO from "../../../static/js/jgoboard-master/jgoboard-master/dist/jgoboard-latest";
import Util from "../../../static/js/util/util";
import Compute from "../../../static/js/util/compute_winner";
import sgfParser from "../../../static/js/util/sgf";
import $ from "jquery";
export default {
  name: "board",
  props: {
    game: {
      type: Object,
      default: () => {}
    },
  },
  data(){
    return{
      board:{
        jboard: null,
        jrecord: null,
        jsetup: null,
        canvas: null,
        ko: false,
        lastMove: false,
        lastHover: false,
        lastX: -1,
        lastY: -1
      },
      record:{
        white_capture_num:0,
        black_capture_num:0
      },
      record_play: [], // 记录每次的落子情况
      situation:[]
    }
  },
  methods: {
    /*
    创建棋盘
     */
    create_board() {
      let that = this;
      let boardSize = that.game.board_size;
      that.board.jrecord = new window.JGO.Record(boardSize,boardSize);
      that.board.jboard = that.board.jrecord.jboard;
      if(that.game.handicap!=0) {
        const coords = that.board.jboard.setType(window.JGO.util.getHandicapCoordinates(that.board.jboard.width, that.game.handicap),
          window.JGO.BLACK);
        if (this.game.if_play_with_AI)
          this.$emit("handicap_coords",coords)
      }
      that.board.jsetup = new window.JGO.Setup(this.board.jboard, Util.choose_board_size(boardSize));
      that.board.jsetup.setOptions({stars: { points: Util.get_point_num(boardSize) }});
      that.board.jsetup.create("board", function (canvas) {
        that.board.canvas = canvas;
        that.$emit("init", "canvas is created");
      });
    },

    /*
    放上记录的棋子
     */
    place_stone(records){
      this.board.jboard.clear();
      this.game.current_player = this.game.first_player;
      for (let i in records) {
        if (records[i] != "") {
          let coord = Util.strTocoord(records[i], Util.get_cols(this.game.board_size));
          this.apply_move(coord, false);
          this.game.current_player = this.game.current_player==1?2:1;
        } else {
          this.game.current_player = this.game.current_player == 1 ? 2 : 1;
        }
      }
    },

    /*
    canvas监听
     */
    play(put_type) {
      let that = this;
      that.board.canvas.addListener("click", function (coord, ev) {
        if(that.game.me_player!=that.game.current_player&&!that.game.if_try)
          return;
        if (ev.shiftKey) {
          if (that.board.jboard.getMark(coord) == window.JGO.MARK.NONE) {
            that.board.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          } else {
            that.board.jboard.setMark(coord, window.JGO.MARK.NONE);
          }
          return;
        }
        if (that.board.lastHover)
          that.board.jboard.setType(new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
        that.board.lastHover = false;
        let coordStr = Util.coordTostr(coord, Util.get_cols(that.game.board_size));
        let message = {
          state:"",
          type:"",
          coordStr:coordStr,
          if_try:that.game.if_try
        }
        if (put_type == "sign") {
          that.jboard.setMark(coord, window.JGO.MARK.SELECTED);
          message.state = "success";
          message.type = "sign";
        } else {
          message.type = "stone";
          if (that.apply_move(coord, true)) {
            that.$refs.audio1.play();
            message.state = "success";
          }
          else{
            message.state = "fail";
          }
        }
        that.$emit("play", message);
      });
      // 监听鼠标移动,显示半透明棋子
      that.board.canvas.addListener("mousemove", function (coord, ev) {
        if(that.game.me_player!=that.game.current_player&&!that.game.if_try)
          return;
        if (coord.i == -1 || coord.j == -1 || (coord.i == that.board.lastX && coord.j == that.board.lastY))
          return;
        if (that.board.lastHover)
          that.board.jboard.setType(new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
        that.board.lastX = coord.i;
        that.board.lastY = coord.j;
        if (that.board.jboard.getType(coord) == window.JGO.CLEAR && that.board.jboard.getMark(coord) == window.JGO.MARK.NONE) {
          if (put_type == "sign")
            that.board.jboard.setType(coord, window.JGO.DIM_SELECTED);
          else
            that.board.jboard.setType(coord, that.game.current_player == 2 ? window.JGO.DIM_WHITE : window.JGO.DIM_BLACK);
          that.board.lastHover = true;
        } else {
          that.board.lastHover = false;
        }
      });
      // 监听鼠标移出
      that.board.canvas.addListener("mouseout", function (ev) {
        if(that.game.me_player!=that.game.current_player&&!that.game.if_try)
          return;
        if (that.board.lastHover)
          that.board.jboard.setType(new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
        that.board.lastHover = false;
      });
    },

    /*
    应用落子
     */
    apply_move(coord, userPlay) {
      let that = this;
      let play = that.board.jboard.playMove(coord, that.game.current_player, that.board.ko);
      if (play.success) {
          that.record_play.push(play);
        let node = that.board.jrecord.createNode(true);
        if (play.captures.length > 0) {
          that.$refs.audio2.play();
          //记录吃子
          if(!that.game.if_try) {
            if (that.game.current_player == 1)
              that.record.black_capture_num += play.captures.length;
            else
              that.record.white_capture_num += play.captures.length;
          }
        }
        // 如果显示手数，先去掉死掉的序列
        if (that.game.if_show_sequence&&!that.if_try) {
          that.removeSequenceSpan(play.captures);
          let canAppend = true;
          let records = that.game.records;
          if (records.length > 0) {
            let coord = Util.strTocoord(records[records.length-1],Util.get_cols(that.game.board_size));
            for (let i = 0; i < play.captures.length; i++) {
              if (coord.equals(play.captures[i])) {
                canAppend = false;
              }
            }
            if (canAppend) {
              let color = that.game.current_player == 1 ? "black" : "white";
              var span = sgfParser.get_proper_span(coord, that.board.canvas, records.length, color, that.game.board_size);
              document.getElementById("board").appendChild(span);
            }
          }
        }
        node.setType(play.captures, window.JGO.CLEAR);
        node.setType(coord, that.game.current_player);
        if (userPlay && !that.game.if_try) {
          node.setMark(coord, window.JGO.MARK.CIRCLE);
        }
        if (that.board.lastMove) {
          node.setMark(that.board.lastMove, window.JGO.MARK.NONE);
        }
        if (that.board.ko) {
          node.setMark(that.board.ko, window.JGO.MARK.NONE);
        }
        that.board.lastMove = coord;
        that.board.ko = play.ko;
        return true;
      } else {
        return false;
      }
    },

    /*pass*/
    pass(){
      this.game.current_player = this.game.current_player == 1 ? 2 : 1;
    },
    /*清空*/
    restart(){
      $("#board span").remove();
      this.board.jboard.clear();
      this.game.current_player = this.game.first_player;
      this.board.lastMove = false;
      this.board.lastHover = false;
      this.board.lastX = -1;
      this.board.lastY = -1;
      this.board.ko = false;
      this.game.variations = [];
      this.game.if_try = false;
      this.game.records = [];
    },

    /*形势判断*/
    compute_lead() {
      let martix = this.board.jboard.stones;
      let compute = new Compute.Compute(martix, this.game.komi, this.record.white_capture_num, this.record.black_capture_num);
      let gameResult = compute.conduct_lead();
      let situation = gameResult.situation;
      this.situation =situation;
      for (let i = 0; i < situation.length; i++) {
        for (let j = 0; j < situation.length; j++) {
          let coord = new window.JGO.Coordinate(i, j);
          if (situation[i][j] < 0) {
            this.board.jboard.setMark(coord, window.JGO.MARK.WHITE_TERRITORY);
          } else if (situation[i][j] > 0) {
            this.board.jboard.setMark(coord, window.JGO.MARK.BLACK_TERRITORY);
          }
        }
      }
      this.$emit("compute",gameResult);
    },

    /*关闭形势判断*/
    close_compute() {
      for (let i = 0; i < this.situation.length; i++) {
        for (let j = 0; j < this.situation.length; j++) {
          if (this.situation[i][j] != 0) {
            let coord = new window.JGO.Coordinate(i, j);
            this.board.jboard.setMark(coord, window.JGO.MARK.NONE);
          }
        }
      }
    },

    /*显示手数*/
    showSequence(records) {
      this.cancel_showSequence();
      this.game.if_show_sequence = true;
      let player = this.game.first_player;
      for (let i = 0; i < records.length - 1; i++) {
        let coord = Util.strTocoord(records[i],Util.get_cols(this.game.board_size));
        let color = player == 1 ? "white" : "black";
        this.removeSequenceSpan(this.record_play[i].captures);
        let p = i + 1;
        let span = sgfParser.get_proper_span(coord, this.board.canvas, p, color, this.game.board_size);
        document.getElementById("board").appendChild(span);
        player = player == 1?2:1;
      }
      this.removeSequenceSpan(this.record_play[this.record_play.length - 1].captures);
    },

    // 去掉不显示的span序列
    removeSequenceSpan(sequences) {
      console.log(sequences)
      for (let i=0; i<sequences.length; i++) {
        let coord = sequences[i];
        let span = document.getElementById(coord.i + "," + coord.j);
        if (span != null) {
          document.getElementById("board").removeChild(span);
        }
      }
    },

    /*
    取消手数显示
     */
    cancel_showSequence() {
      $("#board span").remove();
      this.game.if_show_sequence = false;
    },

    /*
    试下
     */
    try_play(){
      this.game.if_try = true;
      this.game.variation_first = this.game.current_player;
      this.cancel_showSequence();
    },

    /*
    取消试下
     */
    cancel_play () {
      let records = this.game.records;
      this.restart();
      this.game.records = records;
      this.place_stone(records)
    },

    // 显示变化手数
    show_vardiation_num() {
      this.game.if_show_sequence = false;
      $("#board span").remove();
      let color = this.game.variation_first == 1 ? "white" : "black";
      let try_length = this.game.variations.length;
      for (let i = 0; i < try_length; i++) {
        let coord = Util.strTocoord(this.game.variations[i], Util.get_cols(this.game.board_size));
        let id = coord.i + "," + coord.j;
        let span = document.getElementById(id);
        // 覆盖
        if (span != null) {
          document.getElementById("board").removeChild(span);
        }
        let p = i + 1;
        span = sgfParser.get_proper_span(coord, this.board.canvas, p, color);
        span.style.top = parseInt(span.style.top) + 12 + "px";
        document.getElementById("board").appendChild(span);
        color = color == "white" ? "black" : "white";
      }
      // 修正，如果board上该点为0，就不放数字
      let spans = document.getElementById("board").getElementsByTagName("span");
      for (let i = 0; i < spans.length; i++) {
        let span = spans[i];
        let x = span.id.split(",")[0];
        let y = span.id.split(",")[1];
        if (this.board.jboard.stones[x][y] == 0) {
          document.getElementById("board").removeChild(span);
        }
      }
    },

    loadSGF(sgf) {
      this.board.jrecord = window.JGO.sgf.load(sgf, true);
      if (typeof this.board.jrecord === "string") {
        this.$message.error("加载SGF失败");
        return;
      }
      if (!(this.jrecord instanceof window.JGO.Record)) {
        this.$message.error("不支持空SGF或多SGF");
        return;
      }
      this.board.notifier.changeBoard(this.board.jrecord.getBoard());
      this.game.step = 0;
      this.move(0); // also updates game info
    },


  }

};
</script>

<style scoped>
#board {
  background: url("../../../static/js/jgoboard-master/jgoboard-master/medium/shinkaya.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>

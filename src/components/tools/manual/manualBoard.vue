<template>
  <div>
    <div id="board"></div>
    <audio src="../../../../static/sound/play.wav" ref="audio1"></audio>
    <audio src="../../../../static/sound/capture.wav" ref="audio2"></audio>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
           @btn1_click="close_tip" @btn2_click="close_tip"></Alert>
  </div>
</template>
/
<script>
  import JGO from "../../../../static/js/jgoboard-master/jgoboard-master/dist/jgoboard-latest";
  import Util from "../../../../static/js/util/util";
  import Init from "./init_manual"
  import Compute from "../../../../static/js/util/compute_winner";
  import sgfParser from "../../../../static/js/util/sgf";
  import Alert from "../Alert"
  import room from "../../../api/room"
  import $ from "jquery";
  export default {
    name: 'manualBoard',
    props:{
      game:{
        type:Object,
        default:() => {}
      },
      sgf:String
    },
    components:{
      Alert
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
          lastY: -1,
          notifier:null
        },
        record:{
          white_capture_num:0,
          black_capture_num:0
        },
        record_play: [], // 记录每次的落子情况
        Eat: {
          black:0,
          white:0
        },
        situation:[],
        dialog: {
          if_show_tip: false,
          tip: "",
          btn1_text: "确定",
          btn2_text: "取消",
        },
        json:""
      }
    },
    methods:{
        // 打开dialog
        open_tip(tip) {
          this.dialog.if_show_tip = true;
          this.dialog.tip = tip;
        },
        close_tip() {
          this.dialog.if_show_tip = false;
          this.dialog.tip = "";
        },
       createManualBoard(sgf){
         let that = this;
         that.sgf = sgf;
         that.board.jrecord = new window.JGO.Record(that.game.board_size);
         that.board.jboard = that.board.jrecord.jboard;
         that.board.jsetup = new window.JGO.Setup(that.board.jboard, Util.choose_board_size(that.game.board_size));
         that.board.notifier = that.board.jsetup.getNotifier();
         that.board.notifier.board.setType(window.JGO.util.getHandicapCoordinates(that.board.jboard.width, that.game.handicap), window.JGO.BLACK);
         that.board.jsetup.setOptions({ stars: { points: Util.get_point_num(that.game.board_size) } });
         that.board.jsetup.create("board", function (canvas) {
           that.board.canvas = canvas;
         });
         that.loadSGF(sgf);
       },
      loadSGF(sgf) {
        this.json = sgfParser.sgf2jsonMain(sgf);
        this.board.jrecord = window.JGO.sgf.load(sgf, true);
        if (typeof this.board.jrecord === "string") {
          this.$message.error("加载SGF失败");
          return;
        }
        if (!(this.board.jrecord instanceof window.JGO.Record)) {
          this.$message.error("不支持空SGF或多SGF");
          return;
        }
        this.board.notifier.changeBoard(this.board.jrecord.getBoard());
        this.$emit("begin");
      },

      move(dir) {
        this.board.notifier.board.setType(window.JGO.util.getHandicapCoordinates(this.board.jboard.width, this.game.handicap), window.JGO.BLACK);
        if (this.game.if_try) {
          this.open_tip("清先关闭试下");
          return;
        }
        if (!this.board.jrecord) return;
        if (dir == 0) {
          this.board.jrecord.first();
          this.game.step=0;
          $("#board span").remove();
        }
        while (dir < 0) {
          if (this.game.step <= this.game.handicap) {
            this.open_tip("当前已经是第一步了");
            break;
          }
          if (!this.board.jrecord.previous()) break;
          this.game.step--;
          dir++;
        }
        while (dir > 0) {
          if (this.game.step >= this.game.records.length) {
            this.game_msg = "棋局结束";
            this.open_tip("没有下一步了");
            break;
          }
          if (!this.board.jrecord.next()) break;
          this.game.step++;
          dir--;
        }
        if (this.game.if_show_sequence) {
          this.showNum();
        }
        this.set_current_player();
        this.updateInfo();
      },
      set_current_player() {
        if (this.game.step <= 0 || this.game.step > this.game.records.length) {
          return;
        }
        if (this.json[0][this.game.step][0].key == "B") {
          this.game.current_player = 2;
        } else {
          this.game.current_player = 1;
        }
      },

      // 更新游戏信息
      updateInfo() {
        let info = this.board.jrecord.getCurrentNode().info;
        this.Eat.black= info.captures[1];
        this.Eat.white= info.captures[2];
        this.$emit("eat",this.Eat);
      },
      // 展示数字
      showNum() {
        $("#board span").remove();
        let player =0;
        if(this.game.if_try) {
          this.game.if_show_sequence = false;
          player = this.game.variation_first;
        }
        else {
          this.game.if_show_sequence = true;
          player = this.game.first_player;
        }
        let total_num = this.game.if_try?this.game.variations.length:this.game.step-1>0?this.game.step-1:0;
        for (let i = 0; i < total_num; i++) {
          let coord = {};
          let cols = [];
          if(!this.game.if_try) {
            cols = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s"];
            coord = Util.strTocoord2(this.game.records[i], cols);
          }
          else {
            cols = Util.get_cols(this.game.board_size)
            coord = Util.strTocoord(this.game.variations[i], cols);
          }
          let id = coord.i + "," + coord.j;
          let span = document.getElementById(id);
          // 覆盖
          if (span != null) {
            document.getElementById("board").removeChild(span);
          }
          let color = player == 1? "white" : "black";
          let p = i + 1;
          span = sgfParser.get_proper_span(coord, this.board.canvas, p, color,this.game.board_size);
          span.style.left = parseInt(span.style.left) + 3 + "px";
          document.getElementById("board").appendChild(span);
          player = player == 1 ? 2 : 1;
        }
        // 修正，如果notifier.board上该点为0，就不放数字
        let spans = document.getElementById("board").getElementsByTagName("span");
        for (let i = 0; i < spans.length; i++) {
          let span = spans[i];
          let x = span.id.split(",")[0];
          let y = span.id.split(",")[1];
          if (this.board.notifier.board.stones[x][y] == 0) {
            document.getElementById("board").removeChild(span);
          }
        }
      },

      cancelNum() {
        $("#board span").remove();
        this.game.if_show_sequence = false;
      },

      // 试下
      try_play() {
        let that = this;
        that.game.if_try = true;
        that.game.variation_first = that.game.current_player;
        that.cancelNum();
        // 监听点击
        that.board.canvas.addListener("click", function (coord, ev) {
          if (ev.shiftKey) {
            if (that.board.notifier.board.getMark(coord) == window.JGO.MARK.NONE) {
              that.board.notifier.board.setMark(coord, window.JGO.MARK.SELECTED);
            } else {
              that.board.notifier.board.setMark(coord, window.JGO.MARK.NONE);
            }
            return;
          }
          if (that.board.lastHover) {
            that.board.notifier.board.setType(new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
            that.board.notifier.changeBoard(that.board.notifier.board);
          }
          that.board.lastHover = false;
          let play = that.board.notifier.board.playMove(coord, that.game.current_player, that.board.ko);
          if (play.success) {
            that.$refs.audio1.play();
            if (play.captures.length > 0) {
              setTimeout(function () {
                that.$refs.audio2.play();
              }, 1000);
            }
            that.game.variations.push(Util.coordTostr(coord,Util.get_cols(that.game.board_size)));
            let node = that.board.jrecord.createNode(true);
            node.info.captures[that.game.current_player] += play.captures.length;
            node.setType(coord, that.game.current_player);
            node.setType(play.captures, window.JGO.CLEAR);
            if (that.board.ko) {
              node.setMark(that.board.ko, window.JGO.MARK.NONE);
            }
            that.board.lastMove = coord;
            if (play.ko) {
              node.setMark(play.ko, window.JGO.MARK.CIRCLE);
            }
            that.board.ko = play.ko;
            that.showNum();
            that.game.current_player = that.game.current_player == 1 ? 2 : 1;
            that.updateInfo();
          }
        });
        // 监听鼠标移动,显示半透明棋子
        that.board.canvas.addListener("mousemove", function (coord, ev) {
          if (coord.i == -1 || coord.j == -1 || (coord.i == that.board.lastX && coord.j == that.board.lastY))
            return;
          if (that.board.lastHover) {
            that.board.notifier.board.setType(new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
            that.board.notifier.changeBoard(that.board.notifier.board);
          }
          that.board.lastX = coord.i;
          that.board.lastY = coord.j;
          if (that.board.notifier.board.getType(coord) == window.JGO.CLEAR &&
            that.board.notifier.board.getMark(coord) == window.JGO.MARK.NONE) {
            that.board.notifier.board.setType(coord, that.game.current_player == 2 ? window.JGO.DIM_WHITE : window.JGO.DIM_BLACK);
            that.board.notifier.changeBoard(that.board.notifier.board);
            that.board.lastHover = true;
          } else
            that.board.lastHover = false;
        });
        // 监听鼠标移出
        that.board.canvas.addListener("mouseout", function (ev) {
          if (that.board.lastHover) {
            that.board.notifier.board.setType(
              new window.JGO.Coordinate(that.board.lastX, that.board.lastY), window.JGO.CLEAR);
            that.board.notifier.changeBoard(that.board.notifier.board);
          }
          that.board.lastHover = false;
        });
      },
      // 取消试下
      untry_play() {
        $("#board span").remove();
        this.game.if_try = false;
        this.board.jrecord.first();
        let step = this.game.step;
        this.game.step = 0;
        this.move(step);
        this.game.variations = [];
        this.game.current_player = this.variation_first;
      },

      // 形势判断
      compute_lead() {
        let martix = this.board.notifier.board.stones;
        let compute = new Compute.Compute(martix, this.game.komi, this.Eat.white, this.Eat.black);
        let gameResult = compute.conduct_lead();
        let situation = gameResult.situation;

        this.situation = situation;
        for (let i = 0; i < situation.length; i++) {
          for (let j = 0; j < situation.length; j++) {
            let coord = new window.JGO.Coordinate(i, j);
            if (situation[i][j] < 0) {
              this.board.notifier.board.setMark(coord, window.JGO.MARK.WHITE_TERRITORY);
            } else if (situation[i][j] > 0) {
              this.board.notifier.board.setMark(coord, window.JGO.MARK.BLACK_TERRITORY);
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
              this.board.notifier.board.setMark(coord, window.JGO.MARK.NONE);
            }
          }
        }
      },

      //判断胜负
      conduct(sgf){
        let json = {
          sgf:sgf,
          p:2,
          debug:true,
          cache:false,
          is_back:false
        }
        room.Compute(json).then(res=>{
          console.log(res.data);
          let pos = Util.arrTrans(19,res.data.data.pos);
          let board = this.board.notifier.board;
          console.log(pos);
          for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos.length; j++) {
              let coord = new window.JGO.Coordinate(i, j);
              if (pos[i][j] < 0) {
                if(board.stones[i][j]==2) continue;
                else {
                  board.setMark(coord, window.JGO.MARK.WHITE_TERRITORY);
                }
              } else if (pos[i][j]>0) {
                if(board.stones[i][j]==1) continue;
                else {
                  board.setMark(coord, window.JGO.MARK.BLACK_TERRITORY);
                }
              }
            }
          }
          this.$emit("conduct",pos)
        }).catch(e =>{
          console.log(e)
        })
      },
    }
  }
</script>

<style scoped>
</style>

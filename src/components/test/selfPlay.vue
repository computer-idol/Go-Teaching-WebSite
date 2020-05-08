<template>
  <div>
    <Board :game="game" ref="goboard" @init="init" @play="play" @compute="compute_result" class="board"></Board>
    <button @click="pass">pass</button>
    <button @click="restart">重下</button>
    <button @click="compute_lead">形势判断</button>
    <button @click="close_compute">关闭形势判断</button>
    <button @click="save">保存成sgf格式</button>
    <button @click="show_num">显示手数</button>
    <button @click="cancel_num">取消手数</button>
    <button @click="try_play">试下</button>
    <button @click="cancel_play">取消试下</button>
    <button @click="conduct">判断胜负</button>
    <p>{{message}}</p>
    <p v-if="compute!=null">形势判断结果:黑{{ compute.black_total_num }}目,白{{ compute.black_total_num }}目,
      黑贴{{game.komi}}目,因此结果:{{ compute.result}}</p>
  </div>
</template>

<script>
import Util from "../../../static/js/util/util";
import Board from "../tools/GoBoard";
import room from "../../api/room"
export default {
  components: {
    alert,Board
  },
  created() {
    document.title = "自我对弈";
  },
  data() {
    return {
      roomid:1,
      game: {
        board_size: 19,
        handicap: 0,
        current_player:1,
        komi: 6.5,
        first_player:1,
        records:[],
        variation_first:1,
        me_player:1,
        time:"",
        variations:[],
        if_try:false,
        if_show_sequence:false
      },
      text:"",
      situation: null,
      black: {
        name: "用户1",
        level: "九级",
      },
      white: {
        name: "用户2",
        level: "九级",
      },
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      message:"",
      compute: null
    };
  },
  mounted() {
    this.$refs.goboard.create_board();
  },
  methods: {
    /*
    初始化
     */
    init(string){
      console.log(string)
      this.canvas_created = true;
      this.$refs.goboard.play("stone");
    },

    /*
    落子信息
     */
    play( message){
      console.log(message);
      if( message.state == "success" && !message.if_try) {
        this.game.records.push(message.coordStr);
        this.game.current_player = this.game.current_player==1?2:1;
        this.game.me_player = this.game.me_player==1?2:1;
      }
      else if(message.state == "success" && message.if_try) {
        this.game.variations.push(message.coordStr);
        this.$refs.goboard.show_vardiation_num();
        this.game.current_player = this.game.current_player==1?2:1;
        this.game.me_player = this.game.me_player==1?2:1;
      }
    },

    /*
    重新开始
     */
    restart(){
      this.$refs.goboard.restart();
    },

    /*
    pass
     */
    pass(){
      this.$refs.goboard.pass();
      this.text += ";";
    },

    /*计算*/
    compute_lead() {
      this.$refs.goboard.compute_lead();
    },

    /*
    计算结果，由子组件传递
     */
    compute_result(result){
      this.compute = result
      this.game.result = result.result;
    },

    /*
    关闭形势判断
     */
    close_compute(){
      this.$refs.goboard.close_compute();
    },

    /*
    保存sgf
     */
    save() {
      let record = {
        game: this.game,
        black: this.black,
        white: this.white,
        roomid: this.roomid,
      };
      let sgf = Util.record_to_sgf(record);
      this.$refs.goboard.conduct(sgf)
      console.log(sgf);
      return sgf;
    },

    /*
    显示手数
     */
    showNum(){
      if(this.game.if_try){
        return;
      }
      this.$refs.goboard.showSequence(this.game.records)
    },

    /*
    取消手数
     */
    cancel_num(){
      if(this.game.if_try){
        return;
      }
      this.$refs.goboard.cancel_showSequence()
    },

    /*
    试下
     */
    try_play(){
      this.$refs.goboard.try_play();
      this.message = "试下中";
    },

    /*
    取消试下
     */
    cancel_play(){
      this.$refs.goboard.cancel_play();
      this.message = "";
      this.game.variations = [];
    },

  },
};
</script>

<style scoped>
  .board{
    top: 80px;
    position: absolute;
    left: 260px;
    width:545px;
    height:545px;
  }
</style>

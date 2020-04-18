<template>
  <div class="manual">
    <Back @click="window.history.go(-1)"></Back>
    <ManualBoard :game="game" @begin="begin" @compute="compute_result" @eat="update_eat"
                 ref="manualBoard" class="board"></ManualBoard>
    <div class="manual-right">
      <PlayGuys :black="black" :white="white" :gameRuleList="gameRuleList"></PlayGuys>
      <div class="game-record" v-if="game.step === 0">
        <span>{{ game.result }}</span>
        <span>{{ game_msg }}</span>
      </div>
      <div class="game-record2" v-else>
        <span>[第{{ game.step}}手]</span><br />
        <span>{{ game_msg }}</span>
      </div>
      <div class="operate">
        <div style="margin-top: 0;" v-if="if_begin">
          <button style="margin-left: 0;" @click="try_play" v-if="!game.if_try">试下</button>
          <button style="margin-left: 0;" @click="untry_play" v-if="game.if_try">取消试下</button>
          <button @click="compute_lead" v-if="!game.if_show_compute">形势判断</button>
          <button @click="close_compute" v-if="game.if_show_compute">关闭形势</button>
          <button @click="showNum" v-if="!game.if_show_sequence">显示手数</button>
          <button @click="cancelNum" v-if="game.if_show_sequence">取消手数</button>
        </div>
        <div style="width: auto;height: 40px;background: url('../../../../static/imgs/button/btn_yellow.png')no-repeat;
                background-size: 260px 40px;display: flex;flex-direction: row;align-items: center;" v-if="if_begin">
          <img src="../../../../static/imgs/button/first.png" alt="第一手" @click="move(0)"/>
          <img src="../../../../static/imgs/button/preTen.png" alt="第十手" @click="move(-10)"/>
          <img src="../../../../static/imgs/button/prev.png" alt="前一手" @click="move(-1)"/>
          <img src="../../../../static/imgs/button/next.png" alt="后一手" @click="move(1)"/>
          <img src="../../../../static/imgs/button/nextTen.png" alt="后十手" @click="move(10)"/>
          <img src="../../../../static/imgs/button/last.png" alt="最后一手" @click="move(game.records.length - game.step)"
               style="margin-right: 20px;"/>
        </div>
      </div>
    </div>
    <ComputeResult :compute="compute" v-if="game.if_show_compute" class="compute_show"></ComputeResult>
  </div>
</template>

<script>
  import ManualBoard from "./manualBoard"
  import PlayGuys from "../playSides/PlayGuys"
  import ComputeResult from "../ComputeResult"
  import Back from "../Back"
  import init_manual from './init_manual'
  export default {
    name: '',
    components:{
      ManualBoard,PlayGuys,ComputeResult,Back
    },
    data(){
      return {
        game: {
          handicap: 0,
          komisituation: "",
          location: "",
          time: "",
          komi: "",
          result: "",
          name: "",
          board_size: 0,
          records: [],
          step: 0,
          current_player: 1,
          first_player: 1,
          variations: [],
          variation_first: 1,
          if_try: false,
          if_show_sequence: false,
          if_show_compute: false,
        },
        white: {
          name: "",
          level: "",
          eatCount: 0,
          icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
          photo: "../../../static/imgs/logo.png",
        },
        black: {
          name: "",
          level: "",
          eatCount: 0,
          icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
          photo: "../../../static/imgs/logo.png",
        },
        if_begin: false,
        gameRuleList: [],
        if_show_compute_result: false,
        game_msg: "",
      }
    },
    methods:{
      init(sgf){
        this.sgf=sgf;
        let game_message = init_manual.get_message(sgf);
        console.log(game_message);
        this.game.board_size = game_message.game.board_size;
        this.game.location = game_message.game.location;
        this.game.time = game_message.game.time;
        this.game.komi = game_message.game.komi;
        this.game.komisituation = game_message.game.komisituation;
        this.game.handicap = game_message.game.handicap;
        this.game.result = game_message.game.result;
        this.game.name = game_message.game.name;
        this.game.records = game_message.game.records;
        this.white.name = game_message.white.name;
        this.white.level = game_message.white.level;
        this.black.name = game_message.black.name;
        this.black.level = game_message.black.level;
        this.gameRuleList = game_message.gameRuleList;
        this.$refs.manualBoard.createManualBoard(sgf);
      },
      begin(){
        console.log("ok")
        this.if_begin=true;
      },
      showNum(){
        if(this.game.if_try){
          return;
        }
        this.$refs.manualBoard.showNum()
      },
      cancelNum(){
        if(this.game.if_try){
          return;
        }
        this.$refs.manualBoard.cancelNum()
      },
      try_play(){
        this.game_msg = "试下中..";
        this.$refs.manualBoard.try_play();
      },
      untry_play(){
        this.game_msg = "";
        this.$refs.manualBoard.untry_play();
        this.game.variations = [];
      },

      update_eat(eat){
        this.black.eatCount = eat.black;
        this.white.eatCount = eat.white;
      },

      compute_lead() {
        this.$refs.manualBoard.compute_lead();
      },

      compute_result(result){
        let compute = {
          result:result.result,
          komisituation:this.game.komisituation,
          situations:[
            {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
              name:this.black.name,num:result.black_total_num,eatCount:this.black.eatCount},
            {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
              name:this.white.name,num:result.white_total_num,eatCount:this.white.eatCount}
          ]
        };
        this.compute = compute;
        this.game.if_show_compute= true;
      },

      close_compute(){
        this.$refs.manualBoard.close_compute();
        this.game.if_show_compute= false;
      },

      move(dir){
        this.$refs.manualBoard.move(dir);
      }
    }
  }
</script>

<style scoped>
  .board{
    top: 80px;
    position: absolute;
    left: 260px;
    width:545px;
    height:545px;
  }
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
  .manual {
    background: url("../../../../static/imgs/bg/playbg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 655px;
    margin: 0;
    overflow: hidden;
  }
  .board{
    top: 70px;
    position: absolute;
    left: 220px;
    width:550px;
    height:550px;
  }

  .manual-right {
    width: 380px;
    height: 550px;
    left: 790px;
    display: flex;
    flex-direction: column;
    background: #1c80bd;
    background-size: 100% 100%;
    top: 70px;
    position: absolute;
  }
  .play-guy {
    width: 100%;
    border-radius: 10px;
    height: 120px;
    background-color: #308fc7;
  }

  .game-record,
  .game-record2 {
    width: 380px;
    background-color: #0e4058;
    height: 235px;
    display: flex;
    flex-direction: column;
    color: #b0c9da;
  }
  .game-record span,
  .game-record2 span {
    margin-right: auto;
    margin-top: 10px;
    margin-left: 10px;
  }

  .operate {
    height: 155px;
    width: 380px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .operate div {
    padding: 0;
    margin-top: 20px;
    height: 30px;
    display: flex;
    flex-direction: row;
  }
  .operate div img {
    width: 20px;
    height: 20px;
    margin-left: 20px;
  }
  .operate div img:hover {
    cursor: pointer;
  }
  .operate div button {
    border: 0;
    color: white;
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 80px 30px;
    width: 80px;
    height: 30px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 30px;
  }

  .compute_show{
    z-index:100;
    position: absolute;
    left:240px;
  }
</style>

<template>
  <div class="manual">
    <Back @click="window.history.go(-1)"></Back>
    <ManualBoard :game="game" :sgf="sgf" @begin="begin" @compute="compute_result" @eat="update_eat"
                 ref="manualBoard" class="board"></ManualBoard>
    <div class="manual-right">
      <PlayGuys :black="black" :white="white" :gameRuleList="gameRuleList"></PlayGuys>
      <div class="game-record" v-if="game.step == 0">
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
          <button @click="conduct">胜负判断</button>
        </div>
        <div style="width: auto;height: 40px;background: url('../../../static/imgs/button/btn_yellow.png')no-repeat;
                background-size: 260px 40px;display: flex;flex-direction: row;align-items: center;" v-if="if_begin">
          <img src="../../../static/imgs/button/first.png" alt="第一手" @click="move(0)"/>
          <img src="../../../static/imgs/button/preTen.png" alt="前十手" @click="move(-10)"/>
          <img src="../../../static/imgs/button/prev.png" alt="前一手" @click="move(-1)"/>
          <img src="../../../static/imgs/button/next.png" alt="后一手" @click="move(1)"/>
          <img src="../../../static/imgs/button/nextTen.png" alt="后十手" @click="move(10)"/>
          <img src="../../../static/imgs/button/last.png" alt="最后一手" @click="move(game.records.length - game.step)"
               style="margin-right: 20px;"/>
        </div>
      </div>
    </div>
    <ComputeResult :compute="compute" v-if="game.if_show_compute" class="compute_show"></ComputeResult>
  </div>
</template>

<script>
  import ManualBoard from "../tools/manual/manualBoard"
  import PlayGuys from "../tools/playSides/PlayGuys"
  import ComputeResult from "../tools/ComputeResult"
  import Back from "../tools/Back"
  import init_manual from '../tools/manual/init_manual'
  export default {
    name: '',
    components:{
      ManualBoard,PlayGuys,ComputeResult,Back
    },
    data(){
      return{
         game:{
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
           if_show_sequence:false,
           if_show_compute:false,
         },
         white:{
           name: "",
           level: "",
           eatCount: 0,
           icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
           photo: "../../../static/imgs/logo.png",
         },
         black:{
           name: "",
           level: "",
           eatCount: 0,
           icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
           photo: "../../../static/imgs/logo.png",
         },
         if_begin:false,
         gameRuleList:[],
         if_show_compute_result:false,
         game_msg:"",
         sgf:"(;SZ[19]FF[3]PB[朴廷桓九段]PW[柯洁九段]PC[成都]DT[2020-01-20]KM[7.5]RE[白中盘胜]GN[2020CCTV贺岁杯第1轮]RO[289];B[qd];W[dd];B[pq];W[dp];B[oc];W[po];B[qo];W[qn];B[qp];W[pn];B[nq];W[qe];B[pe];W[qf];B[rd];W[pj];B[fc];W[hc];B[cf];W[fd];B[cn];W[pf];B[oe];W[ci];B[fp];W[fo];B[ck];W[gp];B[fq];W[dn];B[co];W[do];B[go];W[ho];B[gn];W[fn];B[gm];W[hq];B[cp];W[dq];B[cq];W[dl];B[dk];W[fl];B[of];W[bm];B[dr];W[er];B[cr];W[fr];B[cc];W[cd];B[dc];W[ed];B[bd];W[ec];B[be];W[kc];B[ph];W[qh];B[pg];W[pi];B[qg];W[pp];B[qq];W[rh];B[kq];W[dg];B[df];W[eg];B[bh];W[ko];B[jk];W[ji];B[jm];W[kl];B[jl];W[lj];B[km];W[in];B[ll];W[lp];B[mq];W[hj];B[nl];W[le];B[pl];W[ql];B[ef];W[ff];B[lc];W[lb];B[mc];W[kd];B[ei];W[di];B[ej];W[cg];B[bg];W[bj];B[bk];W[cm];B[bi];W[ap];B[ao];W[bo];B[aq];W[an];B[bp];W[fh];B[gi];W[gj];B[fi];W[hh];B[eb];W[fb];B[fa];W[gb];B[jr];W[mb];B[nb];W[rg];B[rf];W[hl];B[im];W[rn];B[hm];W[hr];B[ip];W[hp];B[no];W[nn];B[mn];W[mo];B[on];W[np];B[nm];W[oo];B[nn];W[ar];B[ao];W[lq];B[lr];W[ap];B[qk];W[pk];B[ao];W[nd];B[bn];W[nc];B[ob];W[mp];B[lg];W[mk];B[mh];W[pm];B[fm];W[el];B[em];W[dm];B[kj];W[ki];B[ln];W[kg];B[ro];W[db];B[cb];W[ea];B[sn];W[sm];B[so];W[rl];B[li];W[mi];B[lh];W[jj];B[kk];W[kh];B[ni];W[mj];B[nh];W[nj];B[ma];W[md];B[kb];W[ld];B[la];W[kp];B[oj];W[ok];B[oi];W[nk];B[ml];W[jq];B[kr];W[cj];B[aj];W[jb];B[qi];W[ri];B[ol];W[qj];B[iq];W[ir];B[jp];W[ka];B[na];W[bb];B[bc];W[ca];B[ba];W[aa];B[am];W[al];B[ak];W[od];B[pd];W[an];B[gh];W[gg];B[am];W[bl];B[ac];W[mf];B[hi];W[ii];B[lf];W[kf];B[nf];W[eb];B[ab];W[da];B[ba];W[js];B[gl];W[hk];B[en];W[eo];B[io];W[jn];B[hn];W[mr];B[nr];W[ks];B[ms];W[is];B[ls];W[gq];B[sg];W[sh];B[sf];W[ds];B[cs];W[es];B[ee];W[fe];B[oq];W[op];B[mg];W[ce];B[me];W[ne];B[mf];W[an];B[ch];W[dh];B[am];W[ek];B[dj];W[an];B[gk];W[am];B[fk];W[fj];B[ai];W[ij];B[eh];W[fg];B[bf];W[de];B[lk];W[jo];B[jq];W[kn];B[lo];W[om];B[il])",
      }
    },
    mounted(){
      this.init();
    },
    methods:{
      init(){
        let game_message = init_manual.get_message(this.sgf);
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
        this.$refs.manualBoard.createManualBoard(this.sgf);
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
      },

      conduct(){
        this.$refs.manualBoard.conduct(this.sgf)
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
    background: url("../../../static/imgs/bg/playbg.png") no-repeat;
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
    background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
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

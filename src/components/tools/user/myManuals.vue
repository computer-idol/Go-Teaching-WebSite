<template>
  <div class="playTable">
    <div class="playTable-header">
      <span>对手名字:</span>
      <label>
        <input type="text" v-model="search_key" @input="if_watch_search=true"/>
        <SearchTip v-if="if_show_search_tip" @search_tip="choose" :tipList="tipList" class="searchTip" :searchKey="search_key"></SearchTip>
      </label>
      <button @click="search" class="search">搜索</button>
      <div class="fliter">
        <button @click="filter(1)" :class="filter_rule==1?'active-filter':'passive-filter'">全部路数</button>
        <button @click="filter(2)" :class="filter_rule==2?'active-filter':'passive-filter'">只看19路</button>
        <button @click="filter(3)" :class="filter_rule==3?'active-filter':'passive-filter'">看其它路</button>
      </div>
    </div>
    <div class="playTable-data">
      <div class="playTable-data-header">
        <p>
          <span >房间号</span>
          <span>对局类型</span>
          <span>棋盘路数</span>
          <span style="width: 20%">我({{user.win}}胜/{{user.lose}}负)</span>
          <span>VS</span>
          <span style="width: 20%">对手</span>
          <span>棋局情况</span>
          <span>结果</span>
        </p>
      </div>
      <div class="playTable-data-main">
        <p v-for="(play,index) in copy_data" :key="play.roomid" @click="goto(index)" v-if="copy_data.length!=0">
          <span>{{play.roomid}}</span>
          <span v-if="play.type==1">升降对局</span>
          <span v-if="play.type==2">友谊对局</span>
          <span>{{play.board_type}}</span>
          <span class="player" v-if="user.userid==play.black_player.userid">
              <img :src="play.black_player.photo" />
              <div>{{play.black_player.name}}</div>
              <div>{{play.black_player.level}}</div>
              <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/black.png"  class="icon"/>
          </span>
          <span class="player" v-else>
              <img :src="play.white_player.photo" />
              <div>{{play.white_player.name}}</div>
              <div>{{play.white_player.level}}</div>
              <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/white.png" class="icon"/>
          </span>
          <span>
              <img src="../../../../static/imgs/play/win.png" v-if="play.winner==1&&user.userid==play.black_player.userid"/>
              <img src="../../../../static/imgs/play/win.png" v-else-if="play.winner==2&&user.userid==play.white_player.userid"/>
              <img src="../../../../static/imgs/play/lose.png" v-else-if="play.winner==1&&user.userid!=play.black_player.userid"/>
              <img src="../../../../static/imgs/play/lose.png" v-else-if="play.winner==2&&user.userid!=play.white_player.userid"/>
              <img src="../../../../static/imgs/button/help_icon.png" v-else/>
            </span>
          <span class="player" v-if="user.userid!=play.black_player.userid">
              <img :src="play.black_player.photo" />
              <div>{{play.black_player.name}}</div>
              <div>{{play.black_player.level}}</div>
              <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/black.png"  class="icon"/>
          </span>
          <span class="player" v-else>
              <img :src="play.white_player.photo" />
              <div>{{play.white_player.name}}</div>
              <div>{{play.white_player.level}}</div>
              <img src="../../../../static/js/jgoboard-master/jgoboard-master/medium/white.png"  class="icon"/>
          </span>
          <span v-if="play.state=='未开始'" style="color:green">{{play.state}}</span>
          <span v-else-if="play.state=='进行中'" style="color:red">{{play.state}}</span>
          <span v-else style="color:rgba(0,0,0,0.2)">{{play.state}}</span>
          <span v-if="play.result!='暂无'" style="color:rgba(0,0,0,0.2)">{{play.result}}</span>
          <span v-else><img src="../../../../static/imgs/button/help_icon.png" style="width:25px;height: 25px"/></span>
        </p>
        <div style="color:rgba(0,0,0,0.4);padding-top: 120px" v-if="copy_data.length==0">没有符合条件的数据</div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from "../play/playUtil"
  import SearchTip from "../play/SearchTip"
  export default {
    name: '',
    components:{
      SearchTip
    },
    props:{
      playData:{
        type:Array,
        default:() => []
      },
      user:{
        type:Object,
        default:() => {}
      }
    },
    data(){
      return{
        search_key:"",
        filter_rule:1,//过滤规则:1表示只看全部路,2表示看19路,3表示其它路
        copy_data:[],
        tipList:[],
        if_show_search_tip:false,
        if_watch_search:true, //是否监听搜索
        searched:false
      }
    },
    mounted(){
      this.copy_data = util.sort([...this.playData]);
    },
    watch:{
      playData(newVal){
        this.copy_data = util.sort(newVal);
      },
      search_key(newVal) {
        if (this.if_watch_search){
          if (newVal != "") {
            this.if_show_search_tip = true;
            this.tipList = util.search(this.copy_data, newVal).nameList
          } else {
            let data = [...this.playData];
            if(this.filter_rule==1)
              this.copy_data = data;
            else
              this.copy_data = util.filter(data,this.filter_rule);
            this.searched = false;
            this.if_show_search_tip = false;
            this.tipList = [];
          }
        }
      },
    },
    methods:{
      goto(index) {
        let play = this.copy_data[index];
        let path = ""
        if (play.if_play_with_AI == 0)
          path = "/play/room/user/" + play.roomid;
        else
          path = "/play/room/AI/" + play.roomid;
        this.$router.push({path: path});
      },

      choose(search_key){
        this.if_watch_search = false;
        this.search_key = search_key;
        this.tipList = [];
        this.if_show_search_tip = false;
      },
      search(){
        this.searched=true;
        let data = [...this.playData];
        if(this.filter_rule!=1){
          data = util.filter(data,this.filter_rule)
        }
        this.copy_data= util.search(data,this.search_key).dataList;
        this.if_show_search_tip = false;
      },

      //过滤
      filter(rule){
        this.filter_rule = rule;
        let data = [...this.playData];
        if(this.searched)
          data = util.search(data,this.search_key).dataList
        if(rule==1)
          this.copy_data = data;
        else
          this.copy_data = util.filter(data,rule);
      }
    }
  }
</script>

<style scoped>
  .playTable{
    width: 900px;
    height:400px;
    background: url("../../../../static/imgs/bg/table-bg.png") no-repeat;
    background-size: 900px 400px;
    z-index:1200;
  }
  .playTable-header{
    height: auto;
    padding:20px;
    padding-left:50px;
    width:auto;
    display: flex;
    flex-direction: row;
  }
  .playTable-header span{
    font-size: 20px;
    font-weight: bold;
    color:white;
  }
  .playTable-header input{
    font-weight: bold;
    height: 35px;
    width: 200px;
    border: 1px solid #ffcb05;
    padding-left: 5px;
    margin-left: 10px;
  }
  .search{
    margin-left: 20px;
    border: 0;
    width:100px;
    height: 40px;
    background: url("../../../../static/imgs/button/btn2.png") no-repeat;
    background-size: 100px 40px;
    color:#c93d00;
    font-size: 16px;
    font-weight: bold;
  }
  .playTable-data{
    width: 90%;
    margin-left: 4.5%;
    height: 280px;
    border:5px solid #fff4c6;
    border-radius: 15px;
  }
  .playTable-data-header{
    width: 100%;
    height: 40px;
    background-color: #ffd86f;
  }
  .playTable-data-header p{
    display: flex;
    flex-direction: row;
    margin: 0;
  }
  .playTable-data-header span{
    display: block;
    text-align:center;
    color:#cc6a00;
    font-weight: bold;
    width: 10%;
    margin-top: 8px;
  }
  .playTable-data-main{
    background-color: white;
    width: 100%;
    height: 240px;
    overflow: auto;
  }
  .playTable-data-main p{
    display: flex;
    flex-direction: row;
    margin: 0;
    background-color: #fff4c6;
    height:40px;
  }
  .playTable-data-main p:hover{
    background-color: #ffea84;
    cursor: pointer;
  }
  .playTable-data-main span{
    font-weight: bold;
    display: block;
    text-align:center;
    width: 10%;
    margin-top: 10px;
  }
  .playTable-data-main p div{
    margin-left:10px;
    height: fit-content;
    margin-top: -2px;
  }
  img{
    width:25px;
    height:25px;
    border-radius: 12.5px;
    margin-top: -3px;
  }
  .searchTip{
    position: absolute;
    margin-left: 10px;
    width:207px;
  }

  .fliter{
    margin-left: 180px;
    display: flex;
    flex-direction:row;
  }

  .fliter button{
    border: 0;
    width: auto;
    height: auto;
    color: white;
  }
  .fliter button:hover{
    background-color: #ffcb05;
  }
  .active-filter{
    background-color: #ffcb05;
  }
  .passive-filter{
    background-color: rgba(0,0,0,0.3);
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(255,0,0,0.1);
    margin-top: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255,0,0,0.4);
  }

  .player{
    width: 20% !important;
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
  }
  .player .icon{
    width:20px;
    height:20px;
    margin-left: 5px;
  }
</style>

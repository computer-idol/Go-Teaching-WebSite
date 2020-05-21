<template>
  <div class="playRoom">
    <Back :href="'/play'" class="cursor_pointer"/>
    <Board :game="game" ref="goBoard" @init="init_board" @play="played" @compute="compute_result"
           @conduct="get_result" class="board"></Board>
    <img class="begin-img" :src="begin_img" v-if="game.me_player != 3 && if_show_begin"/>
    <div class="playRoom-right">
      <PlayGuys :black="black" :white="white" :gameRuleList="gameRuleList"></PlayGuys>
      <div class="time">
        <Timer :timeCount="black.time_total" ref="black_timer" @time_over="black_over"
               :class="game.current_player==1?'timeActive':''" @time_less="black_less">
        </Timer>
        <div class="game-record">
          <p>
            <span style="color: #ebf5cc;">{{ black.otherTimes }}次</span>
            <span style="color: #dd7705; font-weight: bold;">读秒</span>
            <span style="color: #ebf5cc;">{{ white.otherTimes }}次</span>
          </p>
          <p>
            <span style="color: #ebf5cc;">{{ black.eatCount }}子</span>
            <span style="color: #dd7705; font-weight: bold;">提子</span>
            <span style="color: #ebf5cc;">{{ white.eatCount }}子</span>
          </p>
        </div>
        <Timer :timeCount="white.time_total" ref="white_timer" @time_over="white_over"
               :class="game.current_player==2?'timeActive':''" @time_less="white_less">
        </Timer>
      </div>
      <div class="block">
        <div class="step">
          <span v-if="!game.if_try">{{game.records.length}}手</span>
          <span v-if="game.if_try">试下中....</span>
        </div>
        <div id="operate">
          <button class="operate_btn" v-if="game.me_player==3&&!game.if_try&&game_message" @click="try_play" >试下</button>
          <button class="operate_btn" v-if="game.me_player==3&&game.if_try" @click="untry_play">取消试下</button>
          <button class="operate_btn" v-if="game.me_player!=3&&game_message.if_begin" @click="resign" >认输</button>
          <button class="operate_btn" v-if="!if_show_compute_result&&game_message.if_begin" @click="compute_lead">形势判断</button>
          <button class="operate_btn" v-if="if_show_compute_result&&game_message.if_begin" @click="close_compute">取消判断</button>
          <button class="operate_btn" v-if="!game.if_show_sequence&&game_message.if_begin&&!game.if_try" @click="showSequence" >显示手数</button>
          <button class="operate_btn" v-if="game.if_show_sequence&&game_message.if_begin&&!game.if_try" @click="cancel_showSequence">取消手数</button>
          <button class="operate_btn" v-if="game.me_player!=3&&game_message.if_begin" @click="conduct">数子申请</button>
        </div>
      </div>
      <div class="choose">
        <button style="border-right: 1px solid black;" :class="ifactive ? 'tab_active' : 'no'" @click="ifactive = !ifactive">
          用户列表({{ watch_userList.length }})
        </button>
        <button :class="!ifactive ? 'tab_active' : 'no'" @click="ifactive = !ifactive">
          聊天({{chatMessages.length}})
        </button>
      </div>
      <UserList :user="user" :watch_userList="watch_userList" :black="black" :white="white" class="userList" v-if="ifactive"></UserList>
      <Chat class="chat" v-if="!ifactive" :chatMessages="chatMessages" :user="user" @send="send_chat"></Chat>
    </div>

    <ComputeResult :compute="compute" v-if="if_show_compute_result" class="compute_show"></ComputeResult>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
      @btn1_click="btn1_click" @btn2_click="btn2_click"></Alert>
    <EndShow :play="play" v-if="if_show_end" @goManual="goManual" @back="goPlay"></EndShow>
  </div>
</template>

<script>
import Util from "../../../static/js/util/util";
import Board from "../tools/GoBoard";
import ComputeResult from "../tools/ComputeResult"
import Timer from "../tools/playSides/Timer"
import UserList from "../tools/playSides/userList"
import Chat from "../tools/playSides/Chat"
import PlayGuys from "../tools/playSides/PlayGuys"
import Back from "../tools/Back"
import Alert from "../tools/Alert"
import EndShow from "../tools/play/EndShow"
import PlayRoomRequest from "../../api/room"
export default {
  name: "playUserRoom",
  components: {
    Board,ComputeResult,Timer,UserList,Chat,PlayGuys,Back,Alert,EndShow
  },
  beforeCreate() {
    let roomid = this.$route.params.roomid;
    let params = new URLSearchParams();
    params.append("roomid", roomid);
    let that = this;
    PlayRoomRequest.getRoomDetail(params).then((res) => {
        let room = res.data.room;
        if (room.state == "已结束") {
          let path = "/play/room/manual/" + room.roomid;
          that.$router.push({ path: path });
          return false;
        }
      }).catch(function (e) {
        console.log(e);
      });
  },
  created() {
    this.roomid = parseInt(this.$route.params.roomid);
    var usermsg = sessionStorage.getItem("user");
    if (usermsg != null) {
      this.user = JSON.parse(usermsg);
      this.user.state = "空闲";
      sessionStorage.setItem("user", JSON.stringify(this.user));
    }
  },
  mounted() {
    this.init();
  },

  data() {
    return {
      roomid: 0,
      game: {
        board_size: 19,
        handicap: 0,
        current_player:1,
        me_player: 1,
        komi: 6.5,
        first_player: 1,
        records:[],
        variation_first:1,
        time:"",
        variations:[],
        if_try:false,
        if_show_sequence:false
      },
      game_message: {
        basicMinutes: 5,
        otherPerTime: 30,
        otherTimes: 3,
        time: "5分钟", // 对局时间
        if_begin: false, // 游戏是否开始
        winner: null, // 游戏胜者
        komisituation: "黑贴6.5目",
        if_end: false,
        result:{
          winner:0,
          content:""
        }
      },
      black: {
        name: "用户1",
        level: "18级",
        time_total:0,
        otherTimes: 3,
        eatCount: 0,
        icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
        photo: "",
      },
      white: {
        name: "用户2",
        level: "18级",
        time_total:0,
        otherTimes: 3,
        eatCount: 0,
        icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
        photo: "",
      },
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
        btn1_state:"close",
        btn2_state:"close"
      },
      socket1: null,
      socket2: null,
      socket3: null,
      socket4: null,
      user: null,
      watch_userList: [],
      chatMessages: [],
      begin_img: "",
      if_show_begin: false,
      if_show_compute_result: false,
      if_show_end:false,
      audioSrc:"",
      ifactive:true,
      compute:{},
      canvas_created:false,
      gameRuleList:[],
      play:{},
      if_agree_conduct:false,
    };
  },
  methods: {
    // 打开dialog
    open_tip(tip,btn1_text="确定",btn2_text="取消",btn1_state="close",btn2_state="close") {
      this.dialog = {
        if_show_tip:true,
        tip:tip,
        btn1_text:btn1_text,
        btn2_text:btn2_text,
        btn1_state:btn1_state,
        btn2_state:btn2_state
      };
    },
    close_tip() {
      this.dialog={
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
        btn1_state:"close",
        btn2_state:"close"
      }
    },

    // 打开dialog
    open_dialog() {
      this.if_show_compute_result = true;
    },

    initwebsocket() {
      this.socket1 = new WebSocket("ws://localhost:8081/playRoomWebsocket/" + this.roomid + "/" + this.user.userid);
      this.socket2 = new WebSocket("ws://localhost:8081/playwebsocket/" + this.user.userid);
      this.socket3 = new WebSocket("ws://localhost:8081/userRoomWebsocket/" + this.roomid + "/" + this.user.userid);
      this.socket4 = new WebSocket("ws://localhost:8081/chatRoomWebsocket/" + this.roomid + "/" + this.user.userid);
      this.socket1.onopen = this.openWebSocket1;
      this.socket1.onclose = () => {console.log("对局房间socket已关闭");};
      this.socket1.onerror = () => {console.log("对局房间socket出现错误");};
      this.socket1.onmessage = this.getWebSocket1;
      this.socket2.onopen = this.openWebSocket2;
      this.socket2.onclose = () => {console.log("对弈大厅socket已关闭");};
      this.socket2.onerror = () => {console.log("对弈大厅socket出现错误");};
      this.socket3.onopen = this.openWebSocket3;
      this.socket3.onclose = () => {console.log("用户socket已关闭");};
      this.socket3.onerror = () => {console.log("用户socket出现错误");};
      this.socket3.onmessage = this.getWebSocket3;
      this.socket4.onopen = () => {console.log("聊天socket已打开");};
      this.socket4.onclose = () => {console.log("聊天socket已关闭");};
      this.socket4.onerror = () => {console.log("聊天socket出现错误");};
      this.socket4.onmessage = this.getWebSocket4;
    },

    // 对局websocket打开
    openWebSocket1() {
      console.log("对局房间socket已打开");
      if (this.game.me_player == 3) {
        // 请求最新数据
        let message = {
          type: "request_newest",
          request_id: this.user.userid,
        };
        this.socket1.send(JSON.stringify(message));
      }
    },

    // 对局websocket获得消息
    getWebSocket1(e) {
      let message = JSON.parse(e.data);
      console.log(message);
      // 棋局进行中进来的,使用最新的房间信息
      if (message.type == "new_init") {
        let mePlayer = this.game.me_player;
        this.game = message.game;
        this.game.me_player = mePlayer;
        this.game_message = message.game_message;
        this.black = message.black;
        this.white = message.white;
        this.$refs.black_timer.show();
        this.$refs.white_timer.show();
        this.$refs.goBoard.place_stone(message.game.records);
        this.startTime();
      }
      // 有新的落子
      if (message.type == "play") {
        if (this.if_show_compute_result)
          this.close_compute();
        else if(this.game.if_try){
          this.untry_play();
        }
        let coord = message.content.coord;
        let c = new window.JGO.Coordinate(coord.i, coord.j);
        this.game.records.push(Util.coordTostr(c,Util.get_cols(this.game.board_size)));
        this.$refs.goBoard.apply_move(c,true);
        this.afterplay();
        this.game.current_player = this.game.current_player==1?2:1;
        this.startTime();
        this.$refs.goBoard.play("stone");
      } else if (message.type == "end") {
        this.play.score = message.score;
        this.play.result = message.content;
        this.play.winner = message.winner;
        this.game_message.if_begin = false;
        this.game_message.if_end = true;
        this.game_message.result.winner = message.winner;
        this.game_message.result.content = message.content;
        let win_icon = this.game_message.result.winner==1?this.white.icon:this.black.icon;
        let lose_icon = this.game_message.result.winner==1?this.black.icon:this.white.icon;
        lose_icon= "../../../static/imgs/play/lose.png";
        win_icon= "../../../static/imgs/play/win.png";
        this.$refs.black_timer.stop();
        this.$refs.white_timer.stop();
        this.if_show_end = true;
      } else if (message.type == "invalid_game") {
        this.game_message.if_begin = false;
        this.game_message.if_end = true;
        this.$refs.black_timer.stop();
        this.$refs.white_timer.stop();
        this.open_tip(message.content);
        let that = this;
        setTimeout(function () {
          that.$router.push({ path: "/play" });
        }, 3000);
      } else if (message.type == "request_newest") {
        let msg = {
          type: "newest_situation",
          black: this.black,
          white: this.white,
          game: this.game,
          game_message: this.game_message,
          request_id: message.request_id
        };
        this.socket1.send(JSON.stringify(msg));
      } else if(message.type=="request_conduct"){
        let other = this.black.userid==this.user.userid?this.white:this.black;
        this.open_tip(other.name+"发起数子申请，是否同意","同意","拒绝","agree_requestConduct","refuse_requestConduct");
      }else if(message.type=="agree_conduct"){
        this.apply_compute();
      }else if(message.type=="refuse_conduct"){
        this.open_tip("对方不同意进行数子");
      }else if(message.type=="refuse_result"){
        this.close_tip();
        this.open_tip("对方不同意数子结果");
      }else if(message.type=="agree_result"){
        this.close_tip();
        this.end();
      }
    },

    // 对局websocket打开
    openWebSocket2() {
      console.log("对弈大厅socket已打开");
      this.send_begin();
    },

    // 用户websocket打开
    openWebSocket3() {
      console.log("房间用户socket已打开");
      if (this.game.me_player == 3) {
        // 请求最新数据
        let message = {
          type: "update_user_state",
          state: "观战",
          request_id: this.user.userid,
        };
        this.socket3.send(JSON.stringify(message));
      }
    },

    // 用户websocket消息
    getWebSocket3(e) {
      let message = JSON.parse(e.data);
      console.log(message);
      if (message.type == "show_userList") {
        let userList = message.userList;
        if (this.watch_userList.length!= 0)
          this.watch_userList.splice(0, this.watch_userList.length);
        let msg = {
          type: "play",
          user: this.user,
          black: this.black,
          white: this.white,
        };
        this.watch_userList = Util.sortArr(userList, msg);
      } else if (message.type == "update_user_state") {
        for (let i = 0; i < this.watch_userList.length; i++) {
          if (this.watch_userList[i].userid == message.request_id) {
            this.watch_userList[i].state = message.state;
            break;
          }
        }
      }
    },

    // 聊天websocket消息
    getWebSocket4(e) {
      let message = JSON.parse(e.data);
      console.log(message);
      this.chatMessages.push(message);
    },

    // 初始化
    init() {
      let that = this;
      let params = new URLSearchParams();
      params.append("roomid", that.roomid);
      // 请求房间信息
      PlayRoomRequest.getRoomDetail(params).then((res) => {
        if(res.code==200){
          that.play = res.obj;
          if (room.state == "已结束") {
            let path = "/play/room/manual/" + room.roomid;
            that.$router.push({ path: path });
            return false;
          }
          //得出当前用户情况
          let blackUser = room.black_player;
          let whiteUser = room.white_player;
          if (blackUser.name == that.user.name)
            that.game.me_player = 1;
          else if (whiteUser.name == that.user.name)
            that.game.me_player = 2;
          else
            that.game.me_player = 3;

          // 根据让子情况判断第一步该由谁下,默认黑下
          if (room.handicap != "分先") {
            that.game.komi = 0;
            if (room.handicap == "让先")
              that.game_message.komisituation = "让先不贴目";
            else {
              that.game.handicap = parseInt(room.handicap.replace(/[^0-9]/gi, ""));
              that.game.komisituation = "白让" + room.handicap.replace(/[^0-9]/gi, "") + "子不贴目";
              that.game.current_player = 2;
              that.game.first_player = 2;
            }
          }
          else{
            this.game.current_player = 1;
            this.game.first_player = 1;
            this.game.komi = 6.5;
            that.game_message.komisituation = "黑贴6.5目"
          }

          that.game.board_size = parseInt(room.board_type);
          that.game_message.basicMinutes = parseInt(room.basicTime);
          that.game_message.otherPerTime = parseInt(room.otherPerTime);
          that.game_message.otherTimes = parseInt(room.otherTimes);
          that.game_message.time = room.time;
          that.$refs.goBoard.create_board();

          document.title = this.roomid + "号房间 " + blackUser.name + "(" + blackUser.level + ")VS" +
            whiteUser.name + "(" + whiteUser.level + ")";

          // 初始化黑方
          that.black.name = blackUser.name;
          that.black.level = blackUser.level;
          that.black.photo = blackUser.photo;
          that.black.otherTimes = that.game_message.otherTimes;
          that.black.time_total = 60 * that.game_message.basicMinutes;

          // 初始化白方
          that.white.name = whiteUser.name;
          that.white.level = whiteUser.level;
          that.white.photo = whiteUser.photo;
          that.white.otherTimes = that.game_message.otherTimes;
          that.white.time_total = 60 * that.game_message.basicMinutes;
          this.gameRuleList =  [this.roomid+"号房间",this.game_message.komisituation, this.game_message.basicMinutes+"分钟",
          this.game_message.otherPerTime+"秒"+this.game_message.otherTimes+"次"];
          that.$refs.black_timer.show();
          that.$refs.white_timer.show();

          that.initwebsocket();
        }
        else{
          let path = "/play/room/manual/" + room.roomid;
          that.$router.push({ path: path });
          return false;
        }
      }).catch(function (error) {
          console.log(error);
          that.$router.push({ path: "/play" });
          return false;
        });
    },

    init_board(string){
      console.log(string)
      this.canvas_created = true;
      this.begin();
    },


    // 开始游戏
    begin() {
      let game = this.game;
      if(game.me_player==3) return;
      const beginImgs = ["white_back.png","black_first.png","white_first.png","black_back.png"];
      const basicImg = "../../../static/imgs/room/";
      if (game.first_player == 1&&game.me_player==2)
        this.begin_img = basicImg+beginImgs[0];
      else if (game.first_player == 1&&game.me_player == 1)
        this.begin_img = basicImg+beginImgs[1];
      else if (game.first_player == 2&&game.me_player==2)
        this.begin_img = basicImg+beginImgs[2];
      else if (game.first_player == 2&&game.me_player == 1)
        this.begin_img = basicImg+beginImgs[3];

      this.if_show_begin = true;
      setTimeout(()=>{
        this.if_show_begin = false;
        this.game_message.if_begin = true;
        this.$refs.goBoard.play("stone");
        this.startTime();
      },3000)
    },
    // 对局开始时发送消息更新游戏状态和用户状态
    send_begin() {
      let message = {
        type: "update_game_state",
        state: "begin",
        roomid: this.roomid,
      };
      this.socket2.send(JSON.stringify(message));
      if (this.game.me_player == 3) {
        // 请求最新数据
        let message2 = {
          type: "update_user_state",
          state: "观战",
          request_id: this.user.userid,
        };
        this.socket2.send(JSON.stringify(message2));
      }
    },

    //落子后
    played(message){
      console.log(message)
      if(message.state=="fail")
        this.open_tip("非法落子")
      else{
        this.game.current_player = this.game.current_player==1?2:1;
        if(!this.game.if_try) {
          this.game.records.push(message.coordStr);
          let send_message = {
            type: "play",
            content: {
              coord: Util.strTocoord(message.coordStr, Util.get_cols(this.game.board_size))
            }
          };
          this.socket1.send(JSON.stringify(send_message));
          this.startTime();
        }
        else{
          this.game.variations.push(message.coordStr);
          this.$refs.goBoard.show_vardiation_num();
        }
      }
    },

    //计算结果
    compute_result(result){
      let compute = {
        result:result.result,
        komisituation:this.game_message.komisituation,
        situations:[
          {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
            name:this.black.name,num:result.black_total_num,eatCount:this.black.eatCount},
          {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
            name:this.white.name,num:result.white_total_num,eatCount:this.white.eatCount}
        ]
      };
      this.compute = compute;
      this.if_show_compute_result = true;
    },

    // 投降
    resign() {
      if (this.game.me_player == 1) {
        this.game_message.result.winner = 2;
        this.game_message.result.content = "白中盘胜";
        this.end();
      } else if (this.game.me_player == 2) {
        this.game_message.result.winner = 1;
        this.game_message.result.content = "黑中盘胜";
        this.end();
      }
    },

    // 计时
    startTime() {
      this.$refs.black_timer.stop();
      this.$refs.white_timer.stop();
      if (this.game.current_player == 1)
        this.$refs.black_timer.start();
      else
        this.$refs.white_timer.start();
    },

    black_less(){
      this.black.time_total--;
    },

    white_less(){
      this.white.time_total--;
    },

    //落子后
    afterplay() {
      let that = this;
      if (that.game.current_player == 1) {
        console.log("xx")
        // 判断当前是否处于读秒，是的话，因为在读秒内落子，因此时间回到开始
        this.$refs.black_timer.stop();
        if (that.game_message.otherTimes != that.black.otherTimes&&that.black.otherTimes>0)
          that.black.time_total = that.game_message.otherPerTime;
      }
      else {
        this.$refs.white_timer.stop();
        if (that.game_message.otherTimes != that.white.otherTimes&&that.white.otherTimes>0)
          that.white.time_total = that.game_message.otherPerTime;
      }
    },

    //黑时间用完，需要看是否有读秒
    black_over(){
      //判断是否有读秒
      if (this.black.otherTimes > 0) {
        this.black.otherTimes--;
        this.black.time_total = this.game.otherPerTime;
      } else {
        this.game.winner = 2;
        this.game.result = "黑超时负";
        this.end();
      }
    },

    //各种操作
    try_play(){
      this.$refs.goBoard.try_play();
      this.$refs.goBoard.play("stone")
    },

    untry_play(){
      this.$refs.goBoard.cancel_play();
      this.game.variations = [];
    },

    showSequence(){
      this.$refs.goBoard.showSequence(this.game.records)
    },

    cancel_showSequence(){
      this.$refs.goBoard.cancel_showSequence()
    },

    compute_lead(){
      this.$refs.goBoard.compute_lead();
    },

    close_compute(){
      this.$refs.goBoard.close_compute();
      this.if_show_compute_result = false;
    },

    white_over(){
      //判断是否有读秒
      if (this.white.otherTimes > 0) {
        this.white.otherTimes--;
        this.white.time_total = this.game.otherPerTime;
      } else {
        this.game.winner = 1;
        this.game.result = "白超时负";
        this.end();
      }
    },

    //发送消息
    send_chat(message) {
      this.socket4.send(JSON.stringify(message));
    },

    // 游戏结束
    end() {
      this.$refs.black_timer.stop();
      this.$refs.white_timer.stop();
      let message = {};
      if (this.game.records.length > 10) {
        this.send_record();
        message = {
          type: "end",
          winner: this.game_message.result.winner,
          content: this.game_message.result.content,
          play:this.play
        };
        this.socket1.send(JSON.stringify(message));
      } else {
        message = {
          type: "invalid_game",
          content: "本局未到10手,无效",
          roomid: this.roomid,
        };
        this.socket1.send(JSON.stringify(message));
        this.socket2.send(JSON.stringify(message));
      }
    },

    // 结束后发送本局比赛的sgf
    send_record() {
      this.game.result = this.game_message.result.content;
      let record = {
        game: this.game,
        black: this.black,
        white: this.white,
        roomid: this.roomid,
      };
      let sgf = Util.record_to_sgf(record);
      let message = {
        type: "update_game_state",
        state: "end",
        roomid: this.roomid,
        result: {
          winner: this.game_message.result.winner,
          content: this.game_message.result.content,
          record: sgf,
        },
      };
      this.socket2.send(JSON.stringify(message));
    },

    goManual(){
       let path ="/play/room/manual/" + this.roomid;
       this.$router.push({ path:path});
    },

    goPlay(){
      let path = "/play"
      this.$router.push({path:path});
    },

    //提出数子申请
    conduct(){
      this.open_tip("确定要发起数子申请吗?","确定","取消","request_conduct","close");
    },

    //提出数子申请
    request_conduct(){
      let message = {
        type: "request_conduct",
      };
      this.socket1.send(JSON.stringify(message));
      this.close_tip();
    },

    btn1_click(){
      if(this.dialog.btn1_state=="close"){
        this.close_tip();
      }
      else if(this.dialog.btn1_state=="agree_requestConduct"){
        this.agree_requestConduct();
      }
      else if(this.dialog.btn1_state=="agree_result"){
        this.agree_conduct();
      }
      else if(this.dialog.btn1_state=="request_conduct"){
        this.request_conduct();
      }
    },

    btn2_click(){
      if(this.dialog.btn2_state=="close"){
        this.close_tip();
      }
      else if(this.dialog.btn2_state=="refuse_requestConduct"){
        this.refuse_requestConduct();
      }
      else if(this.dialog.btn2_state=="refuse_result"){
        this.refuse_conduct();
      }
    },

    //取消数子申请
    cancel_requestConduct(){
      let message = {
        type: "cancel_conduct",
      };
      this.socket1.send(JSON.parse(message));
      this.close_tip();
    },

    //同意数子申请
    agree_requestConduct(){
      let message = {
        type: "agree_conduct",
      };
      this.socket1.send(JSON.stringify(message));
      this.close_tip();
      this.apply_compute();
    },

    //拒绝数子申请
    refuse_requestConduct(){
      let message = {
        type: "refuse_conduct",
      };
      this.socket1.send(JSON.stringify(message));
      this.close_tip();
    },

    //进行数子
    apply_compute(){
      let record = {
        game: this.game,
        black: this.black,
        white: this.white,
        roomid: this.roomid,
      };
      let sgf = Util.record_to_sgf(record);
      this.$refs.goBoard.conduct(sgf)
    },

    //数子结果
    get_result(pos){
      console.log(pos);
      let white_num=0;
      for(let i=0;i<pos.length;i++){
        for(let j=0;j<pos.length;j++){
          if(pos[i][j]<0)
            white_num++;
        }
      }
      console.log(white_num);
      this.game_message.result.content ="白"+white_num+"子"
      let komi = this.game.komi;
      const diff = komi>0?(white_num-176.5):(white_num-181);
      if(diff>0){
        this.game_message.result = {
          winner:2,
          content:"白胜"+diff+"目"
        }
      }
      else if(diff<0){
        this.game_message.result = {
          winner:1,
          content:"黑胜"+(-diff)+"目"
        }
      }
      this.open_tip(this.game_message.result.content,"同意","不同意","agree_result","refuse_result");
    },

    //同意数子结果
    agree_conduct(){
      this.if_agree_conduct = true;
      let message = {
        type: "agree_result"
      };
      this.socket1.send(JSON.stringify(message));
      this.close_tip();
    },

    //拒绝数子结果
    refuse_conduct(){
      let message = {
        type: "refuse_result"
      };
      this.socket1.send(JSON.stringify(message));
      this.close_tip();
      this.$refs.goBoard.close_result();
    }
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

.playRoom {
  background: url("../../../static/imgs/bg/playbg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 660px;
  margin: 0;
  overflow: hidden;
}

.board{
  top: 60px;
  position: absolute;
  left: 150px;
  width:545px;
  height:545px;
}

.begin-img {
  position: absolute;
  left: 240px;
  top: 200px;
  animation: move 2s;
  background-size: 100% 100%;
  height: 125px;
  width: 350px;
}

@keyframes move {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.playRoom-right {
  width: 380px;
  height: 550px;
  left: 760px;
  display: flex;
  flex-direction: column;
  background: #1c80bd;
  background-size: 100% 100%;
  top: 60px;
  position: absolute;
}
.time {
  margin-top: 5px;
  background-color: #308fc7;
  width: 380px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.game-record {
  width: 140px;
  margin-left: 10px;
}

.game-record p {
  margin-top: 5px;
  margin-bottom: 3px;
}

.game-record p span {
  margin-left: 10px;
  font-weight: bold;
}

.block {
  margin-top: 5px;
  background-color: #308fc7;
  width: 380px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.block .step{
  margin-top: 5px;
}
.block .step span{
  color: rgb(235, 245, 204) !important;
  margin-left: 5px;
  font-size: 15px;
}

#operate{
  display: flex;
  flex-direction: row;
  height: 30px;
  justify-content: center;
  margin-bottom: 5px;
}
.operate_btn{
  margin-left: 10px;
  background-color: #3399cc;
  color: white;
  border-radius: 8px;
  height: 30px;
  width: 80px;
}
#operate:first-child{
  margin-left: 0;
}

.choose {
  width: 380px;
  display: flex;
  height: 30px;
  flex-direction: row;
  border-radius: 10px;
  margin-top: 5px;
}

.choose button {
  width: 50%;
  color: #ffffff;
  border: 0;
  background-color: #56b1c2;
  font-weight: bold;
}

.choose button:hover {
  cursor: pointer;
  background-color: #dbc280;
}

.tab_active {
  background-color: #dbc280 !important;
}

::-webkit-scrollbar {
  width: 0;
}

.compute_show{
  z-index:100;
  position: absolute;
  left:240px;
}
</style>

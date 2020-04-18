<template>
    <div class="play_bg">
        <div class="bg-header">
            <div class="xing">
            </div>
            <img class="back" src="../../../static/imgs/button/back.png"
                 style="right:20px;position: absolute;width: 100px;height:150px" onclick="window.history.go(-1)"/>
        </div>
        <div class="playArea">
            <!--显示对局信息和用户信息-->
            <div class="main">
                <div class="current_user">
                    <img :src="user.photo"/>
                    <a href="/home" class="goHome">
                         <div>首页</div>
                    </a>
                    <a href="/study" class="goStudy">
                         <div>学习</div>
                    </a>
                    <a href="/exercise" class="goPractice">
                          <div>题库练习</div>
                    </a>
                    <a href="/play/manualLibrary" class="goManual">
                          <div>棋谱欣赏</div>
                    </a>
                </div>
                <div class="playData">
                  <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="全部对局" name="first">
                      <el-table
                        :data="playData"
                        style="width: 100%;"
                        height="380">
                        <el-table-column
                          label="房间号"
                          prop="roomid"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="棋盘"
                          prop="board"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="黑方"
                          prop="black"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="棋力"
                          prop="black_level"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="白方"
                          prop="white"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="棋力"
                          prop="white_level"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="状态"
                          prop="state"
                          align="center" min-width="10%">
                          <template slot-scope="scope">
                            <span v-if="scope.row.state=='未开始'" style="color:green">{{scope.row.state}}</span>
                            <span v-if="scope.row.state=='进行中'" style="color:red">{{scope.row.state}}</span>
                            <span v-if="scope.row.state=='已结束'" style="color:rgba(0,0,0,0.2)">{{scope.row.state}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="结果"
                          prop="result"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          align="center"
                          min-width="15%">
                          <template slot="header" slot-scope="scope">
                            <el-input type="text" v-model="select" placeholder="请输入关键字"/>
                          </template>
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              @click="enter(scope.$index)" class="watch" v-if="scope.row.state!='已结束'">观战</el-button>
                            <el-button
                              size="mini"
                              @click="enter(scope.$index)" class="watch" v-if="scope.row.state=='已结束'">查看</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="全部用户" name="second">
                      <el-table
                        :data="userData"
                        style="width: 100%;"
                        height="380">
                        <el-table-column
                          label="昵称"
                          prop="name"
                          align="center" min-width="15%">
                        </el-table-column>
                        <el-table-column
                          label="头像"
                          align="center" min-width="15%">
                          <template slot-scope="scope">
                            <img style="width:50px;height:50px;border:none;border-radius: 50%" :src="scope.row.photo">
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="棋力"
                          prop="level"
                          align="center" min-width="15%">
                        </el-table-column>
                        <el-table-column
                          label="胜"
                          prop="win"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="负"
                          prop="lose"
                          align="center" min-width="10%">
                        </el-table-column>
                        <el-table-column
                          label="积分"
                          prop="score"
                          align="center" min-width="15%">
                        </el-table-column>
                        <el-table-column
                          label="状态"
                          prop="state"
                          align="center" min-width="15%">
                          <template slot-scope="scope">
                            <span v-if="scope.row.state=='空闲'" style="color:green;width:15%">{{scope.row.state}}</span>
                            <span v-if="scope.row.state=='对弈'" style="color:plum;width:15%">{{scope.row.state}}</span>
                            <span v-if="scope.row.state=='观战'" style="color:lightskyblue;width:15%">{{scope.row.state}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          min-width="15%">
                          <template slot="header" slot-scope="scope">
                            <el-input type="text" v-model="select" placeholder="请输入关键字" size="mini"/>
                          </template>
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              @click="setup_game(scope.$index)" class="invite" v-if="user.name!=scope.row.name&&scope.row.state=='空闲'">邀请对局</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </div>
            </div>
            <!--让用户选择对局种类和查看棋谱-->
          <div class="bottom">
            <div class="link">
              <a href="/myManual" style="margin-left: 30px">
                <img src="../../../static/imgs/link/myManuals.png"/>
              </a>
              <a href="/play/agentOpt">
                <img src="../../../static/imgs/link/AI_play.png">
              </a>
              <a href="/myCollections">
                <img src="../../../static/imgs/link/collections.png"/>
              </a>
            </div>
          </div>
        </div>
      <el-dialog
        title="对局设置"
        :visible.sync="ifsetup"
        width="30%"
        :before-close="handleClose"
        :show-close="false"
        :close-on-click-modal='false'>
        <el-form ref="play_person" :model="play" label-width="80px">
          <el-form-item label="棋盘路数">
            <el-select v-model="play.board_type" placeholder="请选择棋盘种类">
              <el-option label="9路" value="9路"></el-option>
              <el-option label="13路" value="13路"></el-option>
              <el-option label="19路" value="19路"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-select v-model="play.basicTime" placeholder="请选择时间">
              <el-option label="1分钟" value="1分钟"></el-option>
              <el-option label="10分钟" value="10分钟"></el-option>
              <el-option label="30分钟" value="30分钟"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="读秒时间">
            <el-select v-model="play.otherPerTime" placeholder="请选择读秒时间">
              <el-option label="15秒" value="15秒"></el-option>
              <el-option label="30秒" value="30秒"></el-option>
              <el-option label="60秒" value="60秒"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="读秒次数">
            <el-select v-model="play.otherTimes" placeholder="请选择读秒次数">
              <el-option label="1次" value="1次"></el-option>
              <el-option label="3次" value="3次"></el-option>
              <el-option label="5次" value="5次"></el-option>
              <el-option label="10次" value="10次"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择棋子">
            <el-select v-model="play.request.color" placeholder="请选择棋子">
              <el-option label="执黑" value="1"></el-option>
              <el-option label="执白" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="让子情况">
            <el-select v-model="play.handicap" placeholder="请选择让子情况">
              <el-option label="分先" value="分先"></el-option>
              <el-option label="让先" value="让先"></el-option>
              <el-option label="让2子" value="让2子"></el-option>
              <el-option label="让3子" value="让3子"></el-option>
              <el-option label="让4子" value="让4子"></el-option>
              <el-option label="让5子" value="让5子"></el-option>
              <el-option label="让6子" value="让6子"></el-option>
              <el-option label="让7子" value="让7子"></el-option>
              <el-option label="让8子" value="让8子"></el-option>
              <el-option label="让9子" value="让9子"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="set_invite()">立即邀请</el-button>
            <el-button @click="remove_invite()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div class="invite_dialog" v-if="if_show_invite">
        <div class="header">对局申请</div>
        <div class="content">
          <div class="user_img">
            <img :src="invite.user.photo">
          </div>
          <div class="user_message">
            <span>{{invite.user.name}}({{invite.user.level}}){{invite.message}}</span>
          </div>
        </div>
        <div class="operate">
          <button class="btn1" @click="agree_play" v-if="invite.if_show_btn1">{{invite.btn1}}</button>
          <button class="btn2" @click="deal" v-if="invite.if_show_btn2">
             {{invite.btn2}}
          </button>
        </div>
      </div>
      <div class="tip" v-if="if_show_tip">
        <div class="content"><div>{{tip}}</div></div>
        <div class="operate">
          <button @click="close_dialog">确定</button>
          <button @click="close_dialog" class="cancel">取消</button>
        </div>
      </div>
      <div class="container" v-if="if_show_tip"></div>
      </div>
    </div>
</template>

<script>
  export default {
    created () {
      document.title = "对弈大厅";
      var usermsg = sessionStorage.getItem("user");
      if (usermsg != null) {
        this.user = JSON.parse(usermsg);
        this.user.state = "空闲";
        sessionStorage.setItem("user", JSON.stringify(this.user))
        this.initwebsocket();
      }
    },
    data () {
      return {
        socket1: null,//连接play
        socket2: null,//连接user
        user: {},
        userData: [],
        playData: [],
        activeName: "first",
        select: '',//排序规则
        ifsetup: false,
        //对局设置
        play: {
          board_type: "19路",
          basicTime: "10分钟",
          otherTimes: "3次",
          otherPerTime: "30秒",
          request: {
            user: "",
            color: "",
          },
          response: {
            user: "",
            color: "",
          },
          handicap: "分先",
          if_play_with_AI: 0
        },
        if_show_invite: false,
        //对局邀请
        invite: {
          user: {
            photo: "../../static/imgs/logo.png",
            name: "hhh",
            level: "9k",
          },
          message: "向你发出对局申请",
          btn1: "接受",
          btn2: "拒绝",
          if_show_btn1: true,
          if_show_btn2: true
        },
        tip: "",
        if_show_tip: false
      }

    },

    methods: {
      //打开dialog
      open_dialog (tip) {
        this.if_show_tip = true;
        this.tip = tip;
      },
      close_dialog () {
        this.if_show_tip = false;
        this.tip = "";
      },
      beforeunload (e) {
        var usermsg = sessionStorage.getItem("user");
        if (usermsg != null) {
          this.user = JSON.parse(usermsg);
          this.user.state = "空闲";
          sessionStorage.setItem("user", JSON.stringify(this.user))
          this.initwebsocket();
        }
      },
      initwebsocket () {
        this.socket1 = new WebSocket("ws://localhost:8081/playwebsocket/" + this.user.userid);
        this.socket2 = new WebSocket("ws://localhost:8081/userwebsocket/" + this.user.userid);
        this.socket1.onopen = this.openWebSocket1;
        this.socket1.onclose = this.closeWebSocket1;
        this.socket1.onerror = this.errorWebSocket1;
        this.socket1.onmessage = this.getWebSocket1;
        this.socket2.onopen = this.openWebSocket2;
        this.socket2.onclose = this.closeWebSocket2;
        this.socket2.onerror = this.errorWebSocket2;
        this.socket2.onmessage = this.getWebSocket2;
      },

      //对局
      closeWebSocket1 (e) {
        console.log("对局websocket连接已经断开");
      },
      getWebSocket1 (e) {
        var that = this;
        var message = JSON.parse(e.data);
        console.log(message);
        if (message.type == "request_play") {
          that.play = message.play;
          that.invite.user = message.play.request.user;
          that.invite.message = "向你发出对局申请";
          that.invite.btn1 = "接受";
          that.invite.btn2 = "拒绝";
          that.if_show_invite = true;
        } else if (message.type == "cancel_request") {
          that.if_show_invite = false;
          that.open_dialog(message.play.request.user.name + "取消了对您的对局申请");
        } else if (message.type == "reject_play") {
          that.invite.if_show_btn1 = true;
          that.invite.if_show_btn2 = true;
          that.if_show_invite = false;
          that.open_dialog(message.play.response.user.name + "拒绝了对您的对局申请");
        } else if (message.type == "agree_play") {
          for (let u in that.userData) {
            if (that.userData[u].name == message.play.black_player.name || that.userData[u].name == message.play.white_player.name) {
              that.userData[u].state = "对弈";
            }
          }
          //添加对局
          that.add_play(message.play)
          let path ="";
          if(message.play.if_play_with_AI==0)
            path = "/play/room/user/" + message.play.roomid
          else
            path = "/play/room/AI/" + message.play.roomid
          that.$router.push({path: path})
        }
        //添加对局
        else if (message.type == "add_play") {
          //添加对局
          that.add_play(message.play)
        } else if (message.type == "playRoomList") {
          let list = message.list;
          if (this.playData.length != 0)
            this.playData.splice(0, this.playData.length);
          for (var i in list) {
            this.add_play(list[i])
          }
        } else if (message.type == "update_game") {
          for (let i = 0; i < this.playData.length; i++) {
            if (this.playData[i].roomid == message.playRoom.roomid) {
              this.playData[i].state = message.playRoom.state;
              if (message.playRoom.state == "已结束") this.playData[i].result = message.playRoom.result;
              break;
            }
          }
          for (let i = 0; i < this.userData.length; i++) {
            if (this.userData[i].userid == message.playRoom.blackid) {
              if (message.playRoom.state == "进行中") this.userData[i].state = "对弈";
              else if (message.playRoom.state == "已结束") this.userData[i].state = "空闲";
            } else if (this.userData[i].userid == message.playRoom.whiteid) {
              if (message.playRoom.state == "进行中") this.userData[i].state = "对弈";
              else if (message.playRoom.state == "已结束") this.userData[i].state = "空闲";
            }
          }
        } else if (message.type == "invalid_game") {
          for (let i = 0; i < this.playData.length; i++) {
            if (this.playData[i].roomid == message.roomid) {
              this.playData.splice(i, 1);
            }
          }
        } else if (message.type == "update_user_state") {
          for (let i = 0; i < this.userData.length; i++) {
            if (this.userData[i].userid == message.request_id) {
              this.userData[i].state = message.state;
              break;
            }
          }
        }
    },
    errorWebSocket1 (e) {
      console.log("连接发生错误");

    },
    openWebSocket2 () {
      console.log("用户websocket已经打开");
    },
    closeWebSocket2 (e) {
      let that = this;
      that.user.state = "空闲";
      sessionStorage.setItem("user", JSON.stringify(that.user))
      console.log("用户websocket连接已经断开");
    },
    getWebSocket2 (e) {
      console.log("接收到的用户数据为:" + e.data);
      var msg = JSON.parse(e.data);
      if (this.userData.length != 0)
        this.userData.splice(0, this.userData.length);
      for (var i in msg) {
        this.userData.push(msg[i]);
      }
    },
    errorWebSocket2 (e) {
      console.log("连接发生错误");

    },
    //退出
    exit () {
      console.log("exit");
      sessionStorage.removeItem("user");
      this.ifLogin = false;
      this.$router.push("/home")
    },
    //进入
    enter (index) {
      let room = this.playData[index];
      let path = "";
      if (room.if_play_with_AI == 0)
        path = "/play/room/user/" + room.roomid
      else
        path = "/play/room/AI/" + room.roomid
      this.$router.push({path: path})
    },

    /*
             对局设置
          */
    setup_game (index) {
      let that = this;
      let opponent = that.userData[index];
      that.play.request.user = that.user;
      that.play.response.user = opponent;
      that.ifsetup = true;
    },
    /*邀请对方对局*/
    set_invite (index) {
      let that = this;
      that.play.response.color = that.play.request.color == 1 ? 2 : 1;
      that.ifsetup = false;
      that.invite.user = that.play.response.user;
      that.invite.message = "正在接受邀请";
      that.invite.if_show_btn1 = false;
      that.invite.if_show_btn2 = true;
      that.invite.btn2 = "取消"
      that.if_show_invite = true;
      var message = {type: "request_play", play: that.play};
      this.socket1.send(JSON.stringify(message));
    },

    /*
            取消邀请设置
          */
    remove_invite () {
      this.play = null;
      this.if_show_setup = false;
    },

    deal () {
      if (this.play.request.user.name == this.user.name) this.cancel_request();
      else this.reject_play();
    },

    /*取消对局申请*/
    cancel_request () {
      this.invite.if_show_btn1 = true;
      this.invite.if_show_btn2 = true;
      this.handleClose("cancel_request");
    },

    /*拒绝对局*/
    reject_play () {
      this.handleClose("reject_play");
    },
    /*同意对局*/
    agree_play () {
      this.handleClose("agree_play");
    },

    handleClose (messageType) {
      let that = this;
      that.if_show_invite = false;
      let message = {type: messageType, play: that.play}
      this.socket1.send(JSON.stringify(message));
    },

    //添加对局
    add_play (play) {
      let playRoom = {
        roomid: play.roomid,
        board: play.board_type,
        black: play.black_player.name,
        black_level: play.black_player.level,
        white: play.white_player.name,
        white_level: play.white_player.level,
        state: play.state,
        result: play.result,
        if_play_with_AI: play.if_play_with_AI
      }
      this.playData.push(playRoom);
    }


      }
  }
</script>

<style scoped>
  html{
    height: 100%;
  }
  body{
    width:100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  .play_bg{
    background: url("../../../static/imgs/bg/playbg.png") no-repeat;
    background-size: 100% 100%;
    width:100%;
    height: 660px;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  .bg-header{
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: row;
  }
  .xing{
     width:600px;
     height:100px;
     animation: xing 3s infinite;
     background-size: 100% 100%;
     background: url("../../../static/imgs/bg/xing.png")no-repeat;
     position: relative;
     left:300px;
  }
  @keyframes xing {
    0% {opacity: 1;}
    33% {opacity: 1;}
    66% {opacity: 0;}
    100% {opacity: 1;}
  }

  .back:hover{
      cursor: pointer;
  }

  /*
    滚动条的样式

   */



  .playArea{
     display: flex;
     flex-direction: column;
     width:100%;
     height:475px;
  }
  .main{
     display: flex;
     flex-direction: row;
     width:100%;
     height:400px;
     margin: 0;
  }

  .current_user{
     width:80px;
     height: 100%;
     margin-left: 30px;
     display: flex;
     flex-direction: column;
     align-items: center;
     background: url("../../../static/imgs/bg/left_nav.png") no-repeat;
     background-size: 100% 100%;
  }
  .current_user img{
     width:60px;
     height:60px;
     border-radius: 100%;
     margin-top: 10px;
  }
  .current_user a{
     margin-top: 20px;
     width: 60px;
     height: 60px;
     border-radius: 30px;
     color:white;
     display: flex;
     justify-content: center;
     align-items: center;
  }
  .current_user .goHome{
     background: url("../../../static/imgs/button/lightblue_button.png") no-repeat;
     background-size: 100% 100%;
  }
  .current_user .goStudy{
    background: url("../../../static/imgs/button/orange_button.png") no-repeat;
    background-size: 100% 100%;
  }
  .current_user .goPractice{
    background: url("../../../static/imgs/button/blue_button.png") no-repeat;
    background-size: 100% 100%;
  }
  .current_user .goManual{
    background: url("../../../static/imgs/button/pink_button.png") no-repeat;
    background-size: 100% 100%;
  }

  .current_user a div{
     width:40px;
     height: 40px;
     display: flex;
     justify-content: center;
     align-items: center;
  }

  .playData{
      width:900px;
      height:100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      margin-left: 100px;
      position: relative;
      top:-50px;
  }

  .playData_header{
     height: 30px;

  }


  .bottom{
    height:80px;
    width: 100%;
    bottom:0;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .link{
    width:700px;
    height: 100%;
    display: flex;
    flex-direction:row ;
    justify-content: center;
    align-items: center;
    background: url("../../../static/imgs/bg/linkbg.png") no-repeat;
    background-size: 100% 100%;
  }
  .link a{
    margin-left:110px;
  }
  .link a img{
    width:110px;
    height: 80px;
  }

  .link a img:hover{
    transform: translateY(-10px);
  }

  /*
    对局邀请信息
   */
  .invite_dialog{
    position: fixed;
    left:40%;
    top:300px;
    display: flex;
    flex-direction: column;
    width:300px;
    height: 200px;
    background: url("../../../static/imgs/bg/public_bg.png") no-repeat;
    background-size: 300px 200px;
  }
  .invite_dialog .header{
    font-size: 20px;
    color:#8b5a20;
    font-weight: bold;
    margin-top: 10px;
  }
  .invite_dialog .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: auto;
  }
  .invite_dialog .user_img{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
  }
  .invite_dialog .user_img img{
    width:50px;
    height:50px;
    border-radius: 25px;
  }
  .invite_dialog .user_message{
    width: 100%;
    height: auto;
    font-size: 18px;
  }
  .invite_dialog .operate{
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .invite_dialog .operate button {
    border: 0;
    font-size: 16px;
    color:white;
    width: 80px;
    height: 30px;
    border-radius: 15px;
  }
  .invite_dialog .operate .btn1{
    background:url("../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 80px 30px;
  }
  .invite_dialog .operate .btn2{
    background:url("../../../static/imgs/button/btn_blue.png") no-repeat;
    background-size: 80px 30px;
    margin-left: 20px;
  }

  /*
    提示的dialog
   */
  .tip{
    width:300px;
    height:200px;
    background: url("../../../static/imgs/bg/public_bg.png")no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 40%;
    top:300px;
    z-index:1000;
  }
  .content {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .content div{
    color: white;
    font-size: 18px;
    height: auto;
    width: 80%;
  }
  .operate{
    display: flex;
    flex-direction:row ;
    justify-content: center;
  }
  .operate button{
    border: 0;
    color:white;
    background:url("../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 80px 30px;
    width:80px;
    height: 30px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
  }
  .cancel{
    background:url("../../../static/imgs/button/btn_blue.png") no-repeat !important;
    margin-left: 50px;
    background-size: 80px 30px !important;
  }

</style>

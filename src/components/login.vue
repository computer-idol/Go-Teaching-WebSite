<template>
  <div class="background">
    <div class="star"></div>
    <div class="star red"></div>
    <div class="star pink"></div>
    <div class="star blue"></div>
    <div class="main">
      <div class="login" v-if="iflogin">
        <div class="login_header">
          <h3>交互型少儿围棋教学平台</h3>
        </div>
        <div class="login_main">
          <div class="form">
            <div class="input">
              <input type="text" v-model="login_params.account" placeholder="请输入帐号"/>
              <input type="password" v-model="login_params.password" style="margin-top: 10px;" placeholder="请输入密码"/>
            </div>
            <div class="btn">
              <button id="loginBtn" @click="login">登录</button>
              <button id="regBtn" @click="iflogin=false">注册</button>
            </div>
          </div>
        </div>
      </div>
      <div class="register" v-if="!iflogin">
        <div class="register_header">
          <h3>交互型少儿围棋教学平台</h3>
        </div>
        <div class="register_main">
          <div class="form">
            <div class="input">
              <input type="text" v-model="reg_params.name" placeholder="请输入昵称"/>
              <input type="text" v-model="reg_params.account" placeholder="请输入帐号"/>
              <input type="password" v-model="reg_params.password" style="margin-top: 10px;" placeholder="请输入密码"/>
              <select v-model="reg_params.level" placeholder="请选择你的级别" class="select">
                <option value="level" label="level" v-for="level in levels" :key="level"></option>
              </select>
            </div>
            <div class="btn">
              <span style="color: white;">已有帐号？<a style="
                    color: lightblue;
                    text-decoration: underline lightskyblue;
                  " @click="iflogin = true">去登录</a></span>
              <button class="regBtn" @click="register">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Alert v-if="dialog.if_show_tip" :tip="dialog.tip" :btn1_text="dialog.btn1_text" :btn2_text="dialog.btn2_text"
           @btn1_click="close_tip" @btn2_click="close_tip"
    ></Alert>
  </div>
</template>
<script>
import Alert from "./tools/Alert";
import UserRequest from "../api/user"
export default {
  name: "login",
  components: {
    Alert
  },
  created() {
    document.title="交互型少儿围棋教学平台";
  },
  data() {
    return {
      iflogin: true,
      login_params: {
        account: "",
        password: "",
      },
      reg_params: {
        name: "",
        account: "",
        password: "",
        level: "9k",
      },
      dialog: {
        if_show_tip: false,
        tip: "",
        btn1_text: "确定",
        btn2_text: "取消",
      },
      levels:["9k","8k","7k","6k","5k","4k","3k","2k","1k","1D","2D","3D","4D","5D","6D","7D","8D","9D"]
    }
  },
  mouted() {},
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
    // 登录
    login() {
      if (this.login_params.account == "") {
        this.open_tip("帐号不能为空");
      } else if (this.login_params.password == "") {
        this.open_tip("密码不能为空");
      } else {
        let that = this;
        let params = new URLSearchParams();
        params.append("account", this.login_params.account);
        params.append("password", this.login_params.password);
        UserRequest.login(params).then((res) => {
          if (res.data.user != null) {
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            sessionStorage.setItem("levelScoreList",JSON.stringify(res.data.levelScoreList))
            that.$router.push({ path: "/index" });
          } else {
            that.open_tip("帐号密码错误");
          }
        }).catch(function (e) {
          console.log(e)
          that.open_tip("登录失败");
        });
      }
    },

    // 注册
    register() {
      if (this.login_params.name == "") {
        this.open_tip("注册昵称不能为空");
        return;
      }
      if (this.login_params.account == "") {
        this.open_tip("注册帐号不能为空");
      } else if (this.login_params.password == "") {
        this.open_tip("注册密码不能为空");
      } else {
        let that = this;
        let params = new URLSearchParams();
        params.append("account", this.reg_params.account);
        params.append("password", this.reg_params.password);
        params.append("name", this.reg_params.name);
        params.append("level", this.reg_params.level);
        UserRequest.register.then((res) => {
          that.open_tip("注册成功，请去登录")
        }).catch(function (error) {
            that.open_tip("注册失败");
        });
      }
    },
  },
};
</script>
<style scoped>
html {
  height: 100%;
  margin: 0;
}
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 660px;
  background: url("../../static/imgs/bg/starSky.jpg") no-repeat;
  background-size: 100% 100%;
}

/*背景的流星划过效果*/
.star {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  top: 100px;
  left: 500px;
  position: relative;
  transform-origin: 100% 0;
  animation: star-ani 4s linear infinite;
  -webkit-animation: star-ani 5s linear infinite;
  box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.3);
  opacity: 0;
  z-index: 2;
}
.star:after {
  content: "";
  display: block;
  top: 0px;
  left: 4px;
  border: 0px solid #fff;
  border-width: 0px 90px 2px 90px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.3);
  transform: rotate(-45deg) translate3d(1px, 3px, 0);
  box-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.1);
  transform-origin: 0% 100%;
}

.red {
  top: 100px;
  left: 200px;
  background: #fff;
  animation-delay: 1s;
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
}
.red:after {
  border-color: transparent transparent transparent #fff;
  animation-delay: 1s;
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
}

.pink {
  top: 100px;
  left: 800px;
  background: #fff;
  animation-delay: 3s;
  -webkit-animation-delay: 3s;
  -moz-animation-delay: 3s;
}
.pink:after {
  border-color: transparent transparent transparent #fff;
  animation-delay: 3s;
  -webkit-animation-delay: 3s;
  -moz-animation-delay: 3s;
}
.blue {
  top: 120px;
  left: 1200px;
  background: #fff;
  animation-delay: 7s;
  -webkit-animation-delay: 7s;
  -moz-animation-delay: 7s;
}
.blue:after {
  border-color: transparent transparent transparent #fff;
  -webkit-animation-delay: 7s;
  -moz-animation-delay: 7s;
  animation-delay: 7s;
}
@keyframes star-ani {
  0% {
    opacity: 0;
    transform: scale(0) translate3d(0, 0, 0);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.2) translate3d(-100px, 100px, 0);
  }
  40% {
    opacity: 0.8;
    transform: scale(0.4) translate3d(-200px, 200px, 0);
  }
  60% {
    opacity: 0.8;
    transform: scale(0.6) translate3d(-300px, 300px, 0);
  }
  80% {
    opacity: 1;
    transform: scale(1) translate3d(-350px, 350px, 0);
  }
  100% {
    opacity: 1;
    transform: scale(1.2) translate3d(-400px, 380px, 0);
  }
}

.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*
       登录表单样式
      */
.login {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 300px;
}
.login_header,
.register_header {
  color: white;
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: "Microsoft YaHei";
}
.login_main {
  width: 100%;
  height: 200px;
}
.login .form {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: row;
}
.login .form .input {
  width: 70%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login .form .input input {
  background-color: #ffffff;
  border-radius: 30px;
  border: 2px solid rgba(203, 96, 179, 1);
  padding: 5px;
  height: 30px;
  width: 80%;
  font-size: 18px;
}

.login .form .btn {
  width: 30%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#loginBtn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  background: linear-gradient(to bottom, #9046d9 0%, #8d34c2 50%, #57099b 100%);
  border: 0;
  box-shadow: 0 0 15px #ccc;
}
#regBtn {
  width: 90px;
  height: 30px;
  background: url("../../static/imgs/login/regbtn.png") no-repeat;
  background-size: 100% 100%;
  border: 0;
  color: white;
  margin-top: 10px;
  font-size: 15px;
}
#regBtn:hover,
#loginBtn:hover {
  cursor: pointer;
}

/*
      注册表单
      */
.register {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 400px;
}
.register_main {
  width: 100%;
  height: 300px;
}
.register_main .form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.register_main .form .input {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.register_main .form .input input {
  background-color: #ffffff;
  border-radius: 30px;
  border: 2px solid rgba(203, 96, 179, 1);
  padding: 5px;
  height: 25px;
  width: 80%;
  font-size: 18px;
  margin-top: 10px;
}
.el-select .el-input input {
  height: 40px !important;
  width: 334px !important;
}
.el-input__suffix {
  right: 10px;
  top: 5px;
}

input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
}
input::-moz-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
}
input::-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
}

.register_main .btn {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 30px;
  margin-top: -10px;
}
.regBtn {
  width: 80px;
  height: 30px;
  border-radius: 20px;
  color: white;
  font-size: 15px;
  background: linear-gradient(to bottom, #9046d9 0%, #8d34c2 50%, #57099b 100%);
  border: 0;
  box-shadow: 0 0 15px #ccc;
  margin-left: 20px;
}
a:hover {
  cursor: pointer;
}
.regBtn:hover {
  cursor: pointer;
}



.select{
  width: 335px;
  border-radius: 30px;
  margin-top: 10px;
  border: 2px solid #cb60b3;
  font-size: 18px;
  color: black;
  padding: 5px;
  height: 40px;
}
</style>

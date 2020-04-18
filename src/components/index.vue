<template>
  <div class="Index_bg">
    <div class="star">
      <img src="../../static/imgs/bg/star.png" class="shine shine1" />
      <img src="../../static/imgs/bg/star.png" class="shine shine2" />
      <img src="../../static/imgs/bg/star.png" class="shine shine3" />
      <img src="../../static/imgs/bg/star.png" class="shine shine4" />
    </div>
    <div class="user">
      <img :src="user.photo" />
      <div class="user_message" align="left">
        <span
          style="
            display: block;
            width: 50px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          "
          >{{ user.name }}</span
        >
        <span style="margin-left: 0; display: block;">{{ user.level }}</span>
      </div>
    </div>
    <div class="main">
      <div class="type">
        <div class="line1">
          <div class="study" @click="goStudy">
            学习
          </div>
          <div class="practice" @click="goPractice">
            练习
          </div>
        </div>
        <div class="line2">
          <div class="test" @click="goTest">
            测评
          </div>
          <div class="play" style="width: 160px;" @click="goPlay">
            对弈大厅
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="link">
        <a href="/myManual" style="margin-left: 30px;">
          <img src="../../static/imgs/link/myManuals.png" />
        </a>
        <a href="/myWrong">
          <img src="../../static/imgs/link/wrong.png" />
        </a>
        <a href="/myCollections">
          <img src="../../static/imgs/link/collections.png" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    document.title = "首页";
    var user = sessionStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
    }
  },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    goStudy() {
      this.$router.push({ path: "/study" });
    },
    goPractice() {
      this.$router.push({ path: "/exercise" });
    },
    goTest() {
      this.$router.push({ path: "/test" });
    },
    goPlay() {
      this.$router.push({ path: "/play" });
    },
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

.Index_bg {
  background: url("../../static/imgs/bg/IndexBg.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 660px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.shine {
  width: 70px;
  height: 70px;
  position: absolute;
}
.shine1 {
  left: 1000px;
  top: 20px;
  animation: shine1 3s infinite;
}
.shine2 {
  left: 500px;
  top: 70px;
  animation: shine1 5s infinite;
}
.shine3 {
  left: 700px;
  top: 50px;
  animation: shine2 3s infinite;
}
.shine4 {
  left: 100px;
  top: 40px;
  animation: shine2 3s infinite;
}

@keyframes shine1 {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shine2 {
  0% {
    opacity: 1;
  }
  33% {
    opacity: 1;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.user {
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 50px;
  top: 20px;
}
.user img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #fff;
  z-index: 10;
}
.user_message {
  width: 100px;
  border-radius: 30px;
  border: 2px solid lightskyblue;
  height: 40px;
  position: relative;
  left: -30px;
  padding-left: 30px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.user_message span {
  font-size: 15px;
  color: white;
}

.main {
  width: 600px;
  height: 400px;
  position: absolute;
  top: 150px;
  left: 500px;
}
.type {
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.type .line1,
.type .line2 {
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.study,
.practice,
.test,
.play {
  width: 20%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  animation: planet 8s infinite;
  font-size: 18px;
  font-family: "Microsoft YaHei";
  transition: all 0.5s;
}
.study:hover,
.practice:hover,
.test:hover,
.play:hover {
  cursor: pointer;
  animation: unset;
  transform: scale(1.5);
}
.study {
  background: url("../../static/imgs/button/planet4.png") no-repeat;
  background-size: 100% 100%;
}
.practice {
  background: url("../../static/imgs/button/planet2.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 30%;
}
.test {
  background: url("../../static/imgs/button/planet6.png") no-repeat;
  background-size: 100% 100%;
}
.play {
  background: url("../../static/imgs/button/planet3.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 30%;
}
@keyframes planet {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(-20deg);
  }
}

.bottom {
  height: 80px;
  width: 100%;
  bottom: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.link {
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: url("../../static/imgs/bg/linkbg.png") no-repeat;
  background-size: 100% 100%;
}
.link a {
  margin-left: 110px;
}
.link a img {
  width: 110px;
  height: 80px;
}

.link a img:hover {
  transform: translateY(-10px);
}
</style>

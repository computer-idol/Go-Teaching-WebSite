<template>
  <div class="tip">
    <div class="text">
      <div>{{ tip }}</div>
    </div>
    <div class="operate">
      <button @click="btn1_click()">{{ btn1_text }}</button>
      <button @click="btn2_click()" class="btn2">{{ btn2_text }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "alert",
  props: {
    tip: String,
    btn1_text: String,
    btn2_text: String,
  },
  methods: {
    btn1_click() {
      this.$emit("btn1_click");
    },
    btn2_click() {
      this.$emit("btn2_click");
    },
  },
};
</script>

<style scoped>
.tip {
  width: 300px;
  height: 200px;
  background: url("../../../static/imgs/bg/public_bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 40%;
  top: 200px;
  z-index: 1000;
}
.text {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text div {
  color: white;
  font-size: 18px;
  height: auto;
  width: 80%;
}
.operate {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.operate button {
  border: 0;
  color: white;
  background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
  background-size: 80px 30px;
  width: 80px;
  height: 30px;
  border-radius: 15px;
  font-size: 15px;
  font-weight: bold;
}
.btn2 {
  background: url("../../../static/imgs/button/btn_blue.png") no-repeat !important;
  margin-left: 50px;
  background-size: 80px 30px !important;
}
</style>

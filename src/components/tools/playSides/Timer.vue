<template>
  <div class="timer" :class="if_active?'timerActive':'negative'">
    <span class="count">{{ time.minute }}</span>
    <span>分</span>
    <span class="count">{{ time.second }}</span>
    <span>秒</span>
  </div>
</template>

<script>
  import Util from "../../../../static/js/util/util"
  export default {
    name: 'timer',
    props:{
      timeCount:Number
    },
    data(){
      return{
        timer: null,
        time: {
          minute: "",
          second: ""
        },
        count:this.timeCount,
        if_active:false
      }
    },
    mounted(){
      this.timeToStr(this.count);
    },
    watch:{
      timeCount(newval){
        this.count = newval;
        this.timeToStr(this.count);
      }
    },
    methods:{
      show(){
        this.timeToStr(this.count);
      },
      /*
      开始计时
       */
      start(){
        clearInterval(this.timer);
        this.if_active = true;
        if(this.count<=-1) {
          this.$emit("time_over")
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          this.$emit("time_less")
          if(this.count>-1)
            this.timeToStr(this.count);
          else{
            this.$emit("time_over")
            clearInterval(this.timer)
          }
        },1000)
      },
      /*
      暂停计时
       */
      stop(){
        clearInterval(this.timer);
        this.if_active=false;
      },
      // 将秒数转成minute和second字符串
      timeToStr(time) {
        let count = time;
        let minute = Math.floor(count/ 60);
        this.time.minute = Util.num_to_str(minute);
        let second = count % 60;
        this.time.second = Util.num_to_str(second);
      },
    }
  }
</script>

<style scoped>
  .timer {
    width: 100px;
    height: 40px;
    margin-top: 10px;
    margin-left: 10px;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }

  .timer span {
    color: #aab791;
    font-weight: bold;
    display: block;
    margin-left: 5px;
  }

  .count {
    color: #b0c9da !important;
    background-color: #1a5b72;
    width: 20px;
    height: 20px;
    border-radius: 3px;
    padding-bottom: 1px;
  }
  .timerActive {
    border: 2px solid yellow;
  }
</style>

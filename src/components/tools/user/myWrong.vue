<template>
    <div class="myWrong">
      <div class="wrong-header">
        <div class="filter">
          <button @click="filter(1)" :class="filter_rule==1?'active-filter':'passive-filter'">全部错题</button>
          <button @click="filter(2)" :class="filter_rule==2?'active-filter':'passive-filter'">已消灭错题</button>
          <button @click="filter(3)" :class="filter_rule==3?'active-filter':'passive-filter'">未消灭错题</button>
        </div>
        <button @click="doWrong" class="dowrong">消灭错题</button>
      </div>
      <div class="wrongList">
        <div class="wrong" v-for="wrong in copy_data" :key="wrong.wrongid">
          <img :src="wrong.imgCode" alt="错题"/>
          <div class="wrong_message">
            <span>{{wrong.exercise.subType}}</span><br>
            <span >答错{{wrong.wrongTimes}}次</span>
            <span v-if="wrong.deleted==1" style="color:lightgreen;font-weight: bold">已消灭</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: '',
    props:{
      wrongList:{
        type:Array,
        default:() =>[]
      },
    },
    data(){
      return{
        filter_rule:1,
        copy_data:this.wrongList
      }
    },
    mounted(){

    },
    watch:{
      wrongList(newVal,oldVal){
        this.copy_data = [...newVal]
      }
    },
    methods:{
      doWrong(){
        if(this.wrongList.length>0) {
          this.$router.push({path: "/user/doWrong"})
        }
        else{
          this.$emit("无错题可以消灭");
        }
      },
      //过滤
      filter(rule){
        this.filter_rule = rule;
        if(rule==1) {
          this.copy_data = [...this.wrongList]
        }
        else{
          this.copy_data = this.wrongList.filter(item =>{
            return item.deleted == (rule==2?1:0);
          })
        }
      }
    }
  }
</script>

<style scoped>
  .myWrong{
    width: 600px;
    height:450px;
    background: url("../../../../static/imgs/bg/table-bg.png") no-repeat;
    background-size: 600px 450px;
    z-index:1200;
  }
  .wrong-header{
    height: 40px;
    padding:20px;
    display: flex;
    flex-direction: row;
    padding-left: 30px;
  }
  .filter{
    display: flex;
    flex-direction: row;
  }

  .filter button{
    border: 0;
    width: auto;
    height: auto;
    color: white;
    margin: 0;
  }
  .filter button:hover{
    background-color: #ffcb05;
  }
  .active-filter{
    background-color: #ffcb05;
  }
  .passive-filter{
    background-color: rgba(0,0,0,0.3);
  }

  .dowrong{
    margin-left: 200px;
    border: 0;
    width:100px;
    height: 40px;
    background: url("../../../../static/imgs/button/btn2.png") no-repeat;
    background-size: 100px 40px;
    color:#c93d00;
    font-size: 16px;
    font-weight: bold;
  }
   .wrongList{
     padding: 10px;
     width: auto;
     height: 330px;
     padding-bottom: 20px;
     overflow: auto;
     padding-right: 14px;
     padding-top: 0;
   }
   .wrong{
      float:left;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
   }
   .wrong img{
     width:120px;
     height: 120px;
   }
   .wrong .wrong_message{
     margin-top: 5px;
     font-size: 14px;
     color:white;
     padding-bottom: 5px;
   }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255,0,0,0.1);
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255,0,0,0.4);
  }
</style>

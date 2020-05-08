<template>
  <div class="EvaluationCard" @click="goto">
    <div class="evaluation">
      <div class="header">
        <span class="left">第{{sequence}}级</span>
        <span class="right">
          <a @click="showRecord">测试记录</a>
        </span>
      </div>
      <div class="main">
        <p style="font-size: 35px;">{{evaluation.level}}</p>
        <p style="font-size: 15px;" v-if="evaluation.knowledgeList!=null">考察知识点:{{evaluation.knowledgeList}}</p>
        <p style="font-size: 15px;" v-else>暂无</p>
      </div>
    </div>
    <div v-if="show_knowledge" class="knowledgeList">
      <p v-for="(knowledge,index) in evalution.knowledgeList" :key="index">{{knowledge}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EvaluationCard',
    props:{
      evaluation:{
        type:Object,
        default:() => {}
      }
    },
    created(){
       this.sequence = this.levels.indexOf(this.evaluation.level)+1;
    },
    data(){
      return{
        show_knowledge:false,
        sequence:0,
        levels:["9k","8k","7k","6k","5k","4k","3k","2k","1k","1D","2D","3D","4D","5D","6D","7D","8D","9D"],
        records:[]
      }
    },
    methods:{
      goto(){
        this.$emit("goto",this.evaluation.evaluationid)
      },
      showRecord(){
        this.$emit("showRecord",this.evaluation.evaluationid)
      }
    }
  }
</script>

<style scoped>
   .EvaluationCard{
     display: flex;
     flex-direction: column;
     width:250px;
     height:auto;
     border-radius: 10px;
     background: url("../../../../static/imgs/bg/table-bg.png") no-repeat;
     background-size: 250px 100%;
     justify-content: center;
     align-items: center;
     margin-left: 20px;
     padding-top:20px;
     padding-bottom:20px;
   }
   .EvaluationCard .evaluation{
     background-color: #d5d8f1;
     width:210px;
     height: auto;
     border-radius: 10px;
   }
  .header{
     font-size: 15px;
     padding:10px;
  }
  .left{
    float: left;
  }
  .right{
    float:right;
  }
  .main{
    padding: 10px;
    color:#23527c;
  }
  .main p{
    margin: 0;
  }
  .right a{
    color:#337ab7;
  }


</style>

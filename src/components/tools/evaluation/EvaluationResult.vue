<template>
  <div class="evaluationResult">
    <div  class="header">
      <span>{{result.level}}评测结果:{{result.content}}</span>
    </div>
    <div class="main">
      <div class="answer">
        <div v-for="answer in result.answerList" :key="answer.num" class="number"
             :class="answer.result=='right'?'right_answer':(answer.result=='wrong'?'wrong_answer':'')">
          {{answer.num}}
        </div>
      </div>
      <div class="result">
        错误知识点:<span>{{result.wrongKnowledgeList}}</span>
      </div>
    </div>
    <div class="bottom">
      <button class="goEvalution" @click="$router.push({path:'/evaluation'})">继续评测</button>
      <button class="goStudy" @click="$router.push({path:'/study'})">去学习</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EvaluationResult',
    props:{
      result:{
        type:Object,
        default:() =>{}
      }
    },
    data(){
      return{

      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  .evaluationResult{
    width: 400px;
    height: auto;
    display: flex;
    flex-direction: column;
    background: url("../../../../static/imgs/bg/public_bg.png") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    left: 30%;
    top: 200px;
    z-index: 1000;
    padding: 20px;
  }
  .evaluationResult .header {
    color: #8b5a20;
    font-size: 20px;
    font-weight: bold;
  }
  .evaluationResult .main{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 10px;
    padding-left: 0;
    justify-content: center;
  }

  .number{
    width:40px;
    height: 40px;
    float: left;
    border:1px solid #b0c9da;
    margin-left: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
    border-radius: 20px;
  }

  .wrong_answer{
    background-color: red;
    border: 0;
  }

  .right_answer{
    background-color: #b0c9da;
    border: 0;
  }

  .result{
    margin-top: 20px;
  }

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .bottom button {
    border: 0;
    color: white;
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: 90px 40px;
    width: 90px;
    height: 40px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: bold;
  }
  .goStudy {
    background: url("../../../../static/imgs/button/btn_blue.png") no-repeat !important;
    margin-left: 70px;
    background-size: 90px 40px !important;
  }
</style>

<template>
  <div class="evaluationRecord">
    <div class="evaluationRecord-data">
      <div class="evaluationRecord-data-header">
        <p>
          <span style="width:15%">测试号</span>
          <span>测试时间</span>
          <span>有无通过</span>
          <span style="widows: 25%;">错题ID</span>
          <span style="width: 25%">错题知识点</span>
        </p>
      </div>
      <div class="evaluationRecord-data-main">
        <p v-for="record in recordList" :key="record.recordid" v-if="recordList.length!=0">
          <span style="width:15%">{{record.recordid}}</span>
          <span>{{record.evaluationTime}}</span>
          <span v-if="record.ifPass===1">通过</span>
          <span v-else>失败</span>
          <span style="width:25%">{{record.wrongIDList}}</span>
          <span style="width:25%">{{record.wrongKnowledgeList}}</span>
        </p>
        <div style="color:rgba(0,0,0,0.4);padding-top: 120px" v-if="recordList.length==0">这个级别没有测试过</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      recordList: {
        type: Array,
        default: () => []
      },
      header: String
    },
    data () {
      return {}
    }
  }
</script>

<style scoped>
  .evaluationRecord{
    width: 500px;
    height:300px;
    position: fixed;
    left:30%;
    top:200px
  }
  .evaluationRecord-data{
    width: 90%;
    margin-left: 4.5%;
    height: 300px;
    border:5px solid #fff4c6;
    border-radius: 15px;
  }
  .evaluationRecord-data-header{
    width: 100%;
    height: 40px;
    background-color: #ffd86f;
  }
  .evaluationRecord-data-header p{
    display: flex;
    flex-direction: row;
    margin: 0;
  }
  .evaluationRecord-data-header span{
    display: block;
    text-align:center;
    color:#cc6a00;
    font-weight: bold;
    width: 20%;
    margin-top: 8px;
  }
  .evaluationRecord-data-main{
    background-color: white;
    width: 100%;
    height: 260px;
    overflow: auto;
  }
  .evaluationRecord-data-main p{
    display: flex;
    flex-direction: row;
    margin: 0;
    background-color: #fff4c6;
    overflow: auto;
  }
  .evaluationRecord-data-main span{
    font-size:15px;
    display: block;
    text-align:center;
    width: 20%;
    margin-top: 10px;
  }
  .evaluationRecord-data-main p div {
    margin-left: 10px;
    height: fit-content;
    margin-top: -2px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(255,0,0,0.1);
    margin-top: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255,0,0,0.4);
  }

</style>

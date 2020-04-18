<template>
  <div class="search_tip_board">
    <p v-for="(tip,index) in tipList" :key="index" align="left" @click="choose(index)">
      <span style="font-size:14px" class="search_name">{{tip}}</span>
    </p>
    <div style="color:rgba(0,0,0,0.4);font-size: 14px" v-if="tipList.length==0">无匹配人的姓名</div>
  </div>
</template>

<script>
  export default {
    name: '',
    props:{
      tipList:{
        type:Array,
        default:() => []
      },
      searchKey:String
    },
    watch:{
      tipList(newVal){
        this.$nextTick(() => {
          this.set_red();
        });
      }
    },
    mounted(){
      this.set_red();
    },
    data(){
      return{
        copy_data:[]
      }
    },
    methods:{
      choose(index){
        let tip = this.tipList[index];
        this.$emit("search_tip",tip);
      },
      set_red(){
        let tipList = [...this.tipList];
        let tip_span = document.getElementsByClassName("search_name");
        console.log(tip_span)
        for (let i = 0; i < tipList.length; i++) {
          let index = tipList[i].indexOf(this.searchKey);
          let values = [];
          if (index>= 0) {
            let value1 = tipList[i].slice(0,index);
            let value2 = tipList[i].slice(index+this.searchKey.length);
            values.push(value1);
            values.push(value2);
            tip_span[i].innerHTML = values.join('<span style="color: red;">' + this.searchKey + "</span>")
          }
        }
      }
    }
  }
</script>

<style scoped>
  .search_tip_board{
    z-index: 100;
    height: auto;
    background-color: white;
  }
  .search_tip_board p{
    padding: 5px;
    margin: 0;
  }
  .search_tip_board p:hover{
    cursor: pointer;
    background-color: #ffea84;
  }
</style>

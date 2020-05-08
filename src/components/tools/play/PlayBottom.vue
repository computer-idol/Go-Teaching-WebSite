<template>
  <div class="bottom">
    <div class="link">
      <a :href="link.href" v-for="(link,index) in linkList" :key="link.id" :id="link.id" @click="open(index)">
        <img :src="link.img" />
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'playBottom',
    props:{
      linkList:{
        type:Array,
        default:() => []
      }
    },
    methods:{
      open(index){
        let link = this.linkList[index];
        if(link.href=="javascript:void(0);")
           this.$emit("open_user",index);
      }
    }
  }
</script>

<style scoped>
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
    background: url("../../../../static/imgs/bg/linkbg.png") no-repeat;
    background-size: 100% 100%;
  }
  .link a img {
    width: 110px;
    height: 80px;
  }

  .link a img:hover {
    transform: translateY(-10px);
  }
  #bottomLink2{
    margin-left: 50px;
  }
  #bottomLink3{
    margin-left: 50px;
  }
</style>

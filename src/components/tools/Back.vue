<template>
    <div>
      <img src="../../../static/imgs/button/back.png" alt="返回" @click="goto"/>
    </div>
</template>

<script>
  export default {
    name: 'Back',
    props:{
      href:{
        type:String,
        default:""
      }
    },
    methods:{
      goto(){
        if(this.href==="")
          window.history.go(-1);
        this.$router.push({ path: this.href });
      }
    }
  }
</script>

<style scoped>
   img{
     right: 20px;
     position: absolute;
     width: 100px;
     height: 150px;
   }
   img:hover{
     cursor: pointer;
   }
</style>

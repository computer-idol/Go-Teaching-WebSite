<template>
  <div class="drawer">
     <div class="drawer-header">
       <label>
         <input type="text" v-model="search_key" @input="if_watch_search=true"placeholder="Enter键搜索" @keyup.enter="search"/>
         <SearchTip v-if="if_show_search_tip" @search_tip="choose" :tipList="tipList" class="searchTip" :searchKey="search_key"></SearchTip>
       </label>
     </div>
     <div class="drawer-main">
       <div class="user" v-for="(user_message,index) in copy_data" :key="user_message.userid" :class="user_message.userid==user.userid?'me':'other'">
         <img :src="user_message.photo" alt="头像" class="photo cursor_pointer"/>
         <div class="level">{{user_message.level}}</div>
         <div style="margin-left:-15px;font-size:15px;width:50px;text-overflow:ellipsis" class="name">{{user_message.name}}</div>
         <div style="margin-left:5px;font-size:15px;width:30px" class="score">{{user_message.score}}</div>
         <button v-if="user_message.userid!=user.userid" :class="user_message.state=='空闲'?'invite':'disinvite'"
                 :disabled="user_message.state=='空闲'?false:true" @click="invite(index)">邀请</button>
       </div>
     </div>
  </div>
</template>

<script>
  import SearchTip from "./SearchTip"
  import userUtil from './userUtil'
  export default {
    name: 'userTable',
    components:{
      SearchTip
    },
    props:{
      userData:{
        type:Array,
        default:() => []
      },
      user:{
        type:Object,
        default:() => {}
      }
    },
    data(){
      return{
         search_key:"",
         if_show_search_tip:false,
         tipList:[],
         copy_data:[],
         if_watch_search:true
      }
    },
    mounted(){
      this.copy_data = userUtil.sort([...this.userData],this.user);
    },
    watch:{
      userData(newVal){
        this.copy_data = userUtil.sort(newVal,this.user);
      },
      search_key(newVal) {
        if(this.if_watch_search) {
          if (newVal != "") {
            this.if_show_search_tip = true;
            this.tipList = userUtil.search(this.copy_data, newVal,this.user).nameList
          } else {
            let data = [...this.userData];
            this.copy_data = userUtil.sort(data,this.user);
            this.if_show_search_tip = false;
            this.tipList = [];
          }
        }
      },

    },
    methods:{
      choose(search_key){
        this.if_watch_search = false;
        this.search_key = search_key;
        this.tipList = [];
        this.if_show_search_tip = false;
      },
      search(){
        let data = [...this.userData];
        this.copy_data= userUtil.search(data,this.search_key,this.user).dataList;
        this.if_show_search_tip = false;
      },
      invite(index){
        let user = this.copy_data[index];
        this.$emit("invite_dialog",user);
      }
    }
  }
</script>

<style scoped>
  .drawer{
    position:fixed;
    top:30px;
    right:0;
    width:250px;
    height:600px;
    background: url("../../../../static/imgs/bg/userBg.png") no-repeat;
    background-size: 250px 600px;
    overflow: hidden;
  }
  .drawer-header{
    height: auto;
    padding:20px;
    padding-left: 50px;
    display: flex;
    flex-direction: row;
    border-bottom:1px solid #43ded8;
    margin-left: 7px;
  }
  .drawer-header input{
    font-weight: bold;
    height: 25px;
    width: 150px;
    border: 1px solid #ffcb05;
    padding-left: 5px;
    margin-left: 10px;
  }
  .searchTip{
    position: absolute;
    margin-left: 10px;
    width:150px;
  }
  .drawer-main{
    height: 525px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 7px;
    overflow-y: auto;
    margin-bottom: 10px;
    background-color: #cbeeff;
    border-bottom-left-radius:30px;
  }
  .drawer-main .user{
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-bottom:1px solid #43ded8;
    align-items: center;
  }
  .drawer-main .user img{
    width:50px;
    height:50px;
    border-radius: 25px;
  }
  .drawer-main .user .level{
    width:20px;
    height: 20px;
    padding: 3px;
    border-radius: 12.5px;
    font-size: 15px;
    color:white;
    background-color: #ffcb05;
    left: -15px;
    top: 10px;
    position: relative;
  }
  .drawer-main .user button{
    border: 0;
    color: white;
    width: auto;
    padding-left:10px;
    padding-right: 10px;
    height: 30px;
    border-radius: 15px;
    right: 20px;
    font-size: 15px;
    margin-left: 15px;
  }
  .me .name,.me .score{
    color:red;
    font-weight: bold;
  }

  ::-webkit-scrollbar {
    width: 15px;
    background-color: #8ccbeb;
    margin-top: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #308cee;
  }
  .invite{
    background: url("../../../../static/imgs/button/btn_yellow.png") no-repeat;
    background-size: auto 30px;
  }
  .disinvite{
    background: url("../../../../static/imgs/button/gray_button.png") no-repeat;
    background-size: auto 30px;
    cursor: not-allowed;
  }
</style>

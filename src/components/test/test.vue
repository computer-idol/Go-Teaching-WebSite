<template>
  <div>
    <ComputeResult :compute="compute"></ComputeResult>
    <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
    <PlayRequest :response="response" @goplay="goplay" @cancel="cancel" v-if="if_show_choice" :request="request"></PlayRequest>
  </div>
</template>

<script>
  import PlaySides from "../../components/tools/PlaySides";
  import ComputeResult from "../../components/tools/ComputeResult"
  import UserLink from "../../components/tools/UserLink"
  import PlayRequest from "../tools/play/request/PlayRequest"
  export default {
    name:"test",
    components:{
      PlaySides,ComputeResult,UserLink,PlayRequest
    },
    data(){
      return{
        user:{
          name:"kk",
          photo:"../../../static/imgs/logo.png"
        },
        time1:{
          minute:"05",
          second:"00",
          total:300,
          if_over:false,
        },
        time2:{
          minute:"05",
          second:"00",
          total:300,
          if_over:false,
        },
        begin_time:"",
        userList: [
          {name:"kk",level:"9级",win:8,lose:9,score:200,state:"空闲"},
          {name:"baba",level:"9级",win:8,lose:9,score:200,state:"空闲"},
          {name:"caca",level:"9级",win:8,lose:9,score:200,state:"空闲"},
          {name:"jjj",level:"9级",win:8,lose:9,score:200,state:"空闲"}
        ],
        black:{
          name:"baba",
          icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",
          photo: "../../../static/imgs/logo.png",
          level:"7k",
          time:{
            minute:"05",
            second:"00",
            total:300,
            if_over:false,
          },
          otherTimes:3,
          otherPerTime:30,
          eatCount:0
        },
        white:{
          name:"caca",
          icon: "../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",
          photo: "../../../static/imgs/logo.png",
          level:"7k",
          otherTimes:3,
          otherPerTime:30,
          time:{
            minute:"05",
            second:"00",
            total:300,
            if_over:false,
          },
          eatCount:0
        },
        gameRuleList: ["1号房间","白让子补贴目","30分钟","30秒3次"],
        operateList:[
          {"text":"开始",if_show:false,event:"begin"},
          {"text":"试下",if_show:true,event:"try_play"},
          {"text":"显示手数",if_show:true,event:"show_num"}
        ],
        game:{
          board_size: 19,
          handicap: 0,
          current_player:1,
          komi: 6.5,
          first_player: 1,
          records:[],
          variation_first:1,
          time:"",
          variations:[],
          if_try:false
        },
        game_message:{
          komisituation:"xxxx"
        },
        compute:{
          result:"黑中盘胜",
          komisituation:"黑贴6.5目",
          situations:[
            {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/black.png",name:"kk",num:88,eatCount:2},
            {icon:"../../../static/js/jgoboard-master/jgoboard-master/medium/white.png",name:"jj",num:45,eatCount:3}
          ]
        },
        linkList: [
          {text:"首页",href:"/home",id:"link1"},
          {text:"教程",href:"/study",id:"link2"},
          {text:"题库练习",href:"/exercise",id:"link3"},
          {text:"棋谱欣赏",href:"/play/manualLibrary",id:"link4"}
        ],
        request:{
          name:"库里",
          photo:"../../static/imgs/logo.png",
          level:"5k"
        },
        response: {
          name:"科比",
          photo:"../../static/imgs/logo.png",
          level:"5k"
        },
        if_show_choice: true,
      }
    },
    methods:{
      goplay(play){
        console.log(play);
        this.if_show_choice = false;
      },
      cancel(){
        this.if_show_choice = false;
      }
    }
  }
</script>

<style scoped>
   .userList{
     width:380px;
     height: 200px;
   }
  .chat{
    width:380px;
    height: 370px;
    margin-top: 10px;
  }
  .userlink{
    height: 500px;
  }
</style>

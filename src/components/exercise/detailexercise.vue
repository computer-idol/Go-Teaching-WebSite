<template>
  <ExerciseLayout :exerciseList="exerciseList" :ifwrong="false" :user="user" ref="exerciseLayout"></ExerciseLayout>
</template>

<script>
import ExerciseLayout from "../tools/exercise/exerciseLayout"
import Util from "../../../static/js/util/util";
import ExerciseRequest from "../../api/exercise"
export default {
  name: "detailexercise",
  components: {
    ExerciseLayout
  },
  created() {
    this.typeid = this.$route.params.typeid;
    this.levelid = this.$route.params.levelid;
    this.subType = Util.getUrlKey("type");
    this.type = this.types[this.typeid];
    this.level = this.levels[this.levelid];
    document.title = this.type + this.level + "题库";
    const user = sessionStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
    }
  },
  data() {
    return {
      type: "",
      level: "",
      user: {},
      types: ["0", "布局", "死活", "手筋", "官子"],
      levels: ["0", "9k", "8k", "7k", "6k", "5k", "4k", "3k", "2k", "1k", "1D", "2D", "3D"],
      exerciseList: [],
    };
  },

  mounted(){
    let params = new URLSearchParams();
    params.append("type", "'" + this.type + "'");
    params.append("level", "'" + this.level + "'");
    params.append("subType", this.subType);
    let that = this;
    ExerciseRequest.getExerciseSubTypeList(params).then((res) => {
      if(res.data.code==500){
        that.$router.push({path:"/404"})
        return false;
      }
      that.exerciseList = res.data.obj;
      that.$nextTick(() => {
        that.$refs.exerciseLayout.initBoard();
      })
    }).catch(function (e) {
      console.log(e);
    });
  },
  methods: {}
};
</script>

<style scoped></style>

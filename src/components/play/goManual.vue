<template>
  <div>
    <manualLayout ref="manualLayout"></manualLayout>
  </div>
</template>

<script>
import manualLayout from "../tools/manual/manualLayout"
import ManualRequest from '../../api/manual'
export default {
  name: "detailexercise",
  components: {
    manualLayout
  },
  created () {
    let that = this;
    this.manualid = this.$route.params.manualid;
  },
  data () {
    return {
      manualid:0
    };
  },
  mounted(){
    let that = this;
    let params = new URLSearchParams();
    params.append("manualid", that.manualid);
    ManualRequest.getManualDetail(params).then((res) => {
      if(res.data.code==200) {
        let sgf = res.data.obj;
        that.$refs.manualLayout.init(sgf);
      }
      else{

      }
    }).catch(function (e) {
      console.log(e);
    });
  },
  methods: {}
}
</script>

<style scoped></style>

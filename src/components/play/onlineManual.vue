<template>
  <div class="manual">
    <manualLayout ref="manualLayout"></manualLayout>
  </div>
</template>

<script>
import manualLayout from "../tools/manual/manualLayout"
import axios from "axios"
export default {
  name: "onlineManual",
  components: {
    manualLayout
  },
  created() {
    this.roomid = this.$route.params.roomid;
  },
  data() {
    return {
      roomid:0
    }
  },
  mounted(){
    let that = this;
    let params = new URLSearchParams();
    params.append("roomid", this.roomid);
    axios({
      method: "post",
      url: "http://localhost:8081/playroom/",
      data: params,
    }).then((res) => {
      console.log(res.data.room.record);
      let sgf = res.data.room.record;
      that.$refs.manualLayout.init(sgf);
    }).catch(function (error) {
      console.log(error);
    });
  },
  methods: {}
};
</script>

<style scoped></style>

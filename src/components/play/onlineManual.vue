<template>
  <div class="manual">
    <manualLayout ref="manualLayout"></manualLayout>
  </div>
</template>

<script>
import manualLayout from "../tools/manual/manualLayout"
import PlayRoomRequest from "../../api/room"
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
    PlayRoomRequest.getRoomDetail(params).then((res) => {
      let sgf = res.data.room.record;
      that.$refs.manualLayout.init(sgf);
    }).catch(function (e) {
      console.log(e);
    });
  },
  methods: {}
};
</script>

<style scoped></style>

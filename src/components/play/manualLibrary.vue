<template>
  <div class="manualLibrary">
    <div class="bg-header">
      <Back @click="window.history.go(-1)" class="cursor_pointer"/>
    </div>
    <div class="manualArea">
      <div class="main">
        <UserLink :user="user" :linkList="linkList" class="userlink"></UserLink>
        <div class="manual">
          <div class="manual-header">
            <h2>{{ header }}</h2>
          </div>
          <div class="manual-main" v-if="!if_show_player">
            <!--中国-->
            <img class="china cursor_pointer" src="../../../static/imgs/manual/country_1.png"
              @click="show_player('中国')" style="margin-left: 0;"/>
            <!--日本-->
            <img class="japan cursor_pointer" src="../../../static/imgs/manual/country_2.png" @click="show_player('日本')"/>
            <!--韩国-->
            <img class="korea cursor_pointer" src="../../../static/imgs/manual/country_3.png" @click="show_player('韩国')"/>
            <!--其它地区-->
            <img class="other cursor_pointer" src="../../../static/imgs/manual/country_4.png" @click="show_player('其它地区')"/>
          </div>
          <div class="manual-player" v-if="if_show_player">
            <div class="player">
              <button v-for="(player, index) in players" :key="index" :class="[index == active_index ? 'active' : '']"
                      @click="getManual(index)">{{ player }}</button>
            </div>
            <div class="player-manual">
              <vxe-table border highlight-hover-row how-overflow ref="xTable"
                height="360" row-id="id" size="mini" @cell-click="cellClickEvent"
                @cell-dblclick="cellDBLClickEvent" :align="'center'" :loading="loading"
                :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize,}"
                :data="tableData">
                <vxe-table-column type="seq" title="序号"width="60"></vxe-table-column>
                <vxe-table-column field="contest" title="对局名称"></vxe-table-column>
                <vxe-table-column field="black_name" title="黑方"></vxe-table-column>
                <vxe-table-column field="black_level" title="棋力"></vxe-table-column>
                <vxe-table-column field="white_name" title="白方"></vxe-table-column>
                <vxe-table-column field="white_level" title="棋力"></vxe-table-column>
                <vxe-table-column field="total_step" title="手数"></vxe-table-column>
                <vxe-table-column field="time" title="时间"></vxe-table-column>
                <vxe-table-column field="result" title="结果"></vxe-table-column>
              </vxe-table>

              <vxe-pager perfect size="mini" :loading="loading"
                :current-page="tablePage.currentPage" :page-size="tablePage.pageSize" :total="tablePage.totalResult"
                :layouts="['PrevPage','JumpNumber','NextPage','FullJump','Sizes','Total',]"
                @page-change="handlePageChange">
              </vxe-pager>
            </div>
          </div>
        </div>
        <img src="../../../static/imgs/button/close.png" @click="cancel_show_player()"
          class="cursor_pointer" style="
            width: 50px;
            height: 50px;
            position: relative;
            top: 90px;
            left: 0;
          " v-if="if_show_player"/>
      </div>
    </div>
  </div>
</template>
<script>
import UserLink from "../../components/tools/UserLink"
import Back from "../../components/tools/Back"
import ManualRequest from "../../api/manual"
export default {
  components:{
    UserLink,Back
  },
  created() {
    document.title = "棋谱库";
  },
  data() {
    return {
      user: {
        photo: "../../../static/imgs/logo.png",
      },
      if_show_player: false,
      header: "请选择棋手所在国家",
      players: [],
      manuals: [],
      active_index: 0,
      loading: false,
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 9,
        totalResult: 0,
        manual_href: "",
      },
      linkList: [
        {text:"首页",href:"/index",id:"link1"},
        {text:"教程",href:"/study",id:"link2"},
        {text:"题库练习",href:"/exercise",id:"link3"},
        {text:"对弈大厅",href:"/play",id:"link4"}
      ]
    };
  },
  mouted() {},
  methods: {
    cellClickEvent(data) {
      console.log(data);
      let manual = this.tableData[data.seq - 1];
      let path = "/play/manualLibrary/" + manual.manualid;
      this.$router.push({ path: path });
    },
    cellDBLClickEvent(data) {
      console.log(data);
      let manual = this.tableData[data.seq - 1];
      let path = "/play/manualLibrary/" + manual.manualid;
      this.$router.push({ path: path });
    },
    show_player(country) {
      let that = this;
      that.if_show_player = true;
      that.header = "请选择棋手";
      let params = new URLSearchParams();
      params.append("country", "'" + country + "'");
      ManualRequest.getPlayCountryList(params).then((res) => {
        that.players = res.obj;
        that.findList(that.players[0]);
      }).catch(function (e) {
        console.log(e);
      });
    },
    cancel_show_player() {
      this.if_show_player = false;
      this.header = "请选择棋手所在国家";
    },
    getManual(index) {
      this.tableData = [];
      this.tablePage.currentPage = 1;
      this.tablePage.totalResult = 0;
      this.active_index = index;
      this.findList(this.players[index]);
    },
    findList(name) {
      this.loading = true;
      let that = this;
      let params = new URLSearchParams();
      params.append("name", "'" + name + "'");
      params.append("currentPage", this.tablePage.currentPage);
      params.append("pageSize", this.tablePage.pageSize);
      ManualRequest.getManualList(params).then((res) => {
        if(res.data.code==200) {
          that.tableData = res.data.obj;
          that.tablePage.totalResult = res.data.obj.length;
          that.loading = false;
        }
      }).catch(function (e) {
        that.loading = false;
        console.log(e);
      });
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.findList(this.players[this.active_index]);
    },
  },
};
</script>
<style scoped>
html {
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.manualLibrary {
  background: url("../../../static/imgs/bg/ExerciseBg.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 660px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 520px;
  margin: 0;
}
.userlink{
  height: 500px;
  margin-top: 100px;
}
.manual {
  margin-top: 80px;
  width: 920px;
  height: 100%;
  background: url("../../../static/imgs/bg/public_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.manual .header {
  width: 100%;
  height: 30%;
}
.manual .header h3 {
  color: #aa4800 !important;
}
.manual .manual-main {
  display: flex;
  flex-direction: row;
}
.manual .manual-main img {
  margin-left: 18px;
  width: 200px;
  height: 416px;
}
.manual-player {
  display: flex;
  flex-direction: row;
  height: 75%;
  width: 95%;
}
.manual-player .player {
  display: flex;
  background-color: white;
  overflow: auto;
  flex-direction: column;
  align-items: center;
  width: 20%;
  height: 100%;
  border-radius: 20px;
}

.manual-player .player button {
  border: 0;
  color: white;
  background: url("../../../static/imgs/button/btn_yellow.png") no-repeat;
  background-size: 100px 30px;
  width: 100px;
  height: 30px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
}

.player-manual {
  margin-left: 3%;
  width: 80%;
  height: 100%;
  background-color: white;
  border-radius: 20px;
}

::-webkit-scrollbar {
  width: 10px;
  background-color: rgba(255, 203, 5, 0.3);
  margin-top: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #ffcb05;
}

.active {
  background: url("../../../static/imgs/button/btn_blue.png") no-repeat !important;
  background-size: 100px 30px !important;
}

.vxe-body--row:hover {
  cursor: pointer;
}
</style>

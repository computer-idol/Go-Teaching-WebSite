<template>
  <div class="watch-user">
    <div class="user-table">
      <div class="user-table-header">
        <span style="width: 20%;">昵称</span>
        <span style="width: 16%;">棋力</span>
        <span style="width: 16%;">胜</span>
        <span style="width: 16%;">负</span>
        <span style="width: 16%;">积分</span>
        <span style="width: 16%;">状态</span>
      </div>
      <div class="user-table-body">
        <div class="watch-user-msg" v-for="watch_user in watch_userList" :key="watch_user.userid">
          <span style="width: 20%; color: lightskyblue;" v-if="watch_user.name == user.name">{{ user.name }}</span>
          <span style="width: 20%; color: lightcyan;" v-if="(black.name == watch_user.name || white.name==watch_user.name)
           && watch_user.name != user.name">{{ watch_user.name }}
          </span>
          <span style="width: 20%; color: white;" v-if=" user.name != watch_user.name
          &&black.name != watch_user.name &&white.name != watch_user.name">
            {{ watch_user.name }}
          </span>
          <span style="width: 16%;">{{ watch_user.level }}</span>
          <span style="width: 16%;">{{ watch_user.win }}</span>
          <span style="width: 16%;">{{ watch_user.lose }}</span>
          <span style="width: 16%;">{{ watch_user.score }}</span>
          <span style="width: 16%;">{{ watch_user.state }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'userList',
    props:{
      user:{
        type: Object,
        default: () => {}
      },
      watch_userList:{
        type:Array,
        default: () => []
      },
      black:{
        type: Object,
        default: () => {}
      },
      white:{
        type: Object,
        default: () => {}
      }
    }
  }
</script>

<style scoped>
  .watch-user{
    background-color: #0e4058;
  }
  .user-table {
    width: 100%;
    overflow: auto;
  }
  .user-table-header,
  .watch-user-msg {
    width: 100%;
    background-color: #1b8bb7;
    height: 30px;
    display: flex;
    flex-direction: row;
  }
  .user-table-header span,
  .watch-user-msg span {
    display: block;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
  }
  .user-table-body {
    display: flex;
    flex-direction: column;
    height: 225px;
    overflow: auto;
  }
  .watch-user-msg {
    background-color: #8b5a20;
  }

</style>

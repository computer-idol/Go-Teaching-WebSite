<template>
  <div class="watch-chat">
    <div id="chat-board" ref="chatContent">
      <p v-for="chat in chatMessages" :key="chat.content" align="left" class="chat-content">
        <span style="color: white; word-break: break-all;" v-if="chat.user.name != user.name">
           {{ chat.user.name }}[{{ chat.user.level }}]:{{ chat.content }}
        </span>
        <span style="color: lightpink; word-break: break-all;" v-if="chat.user.name == user.name">
           {{ chat.user.name }}[{{ chat.user.level }}]:{{ chat.content }}
        </span>
      </p>
    </div>
    <div class="chat-send" align="left">
      <el-dropdown size="small" split-button type="primary" @command="handleCommand" style="margin-top: 4px;">
        默认发言
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="default_chat.command" v-for="(default_chat, index) in default_chats" :key="index">
            {{ default_chat.text }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <input type="text" class="chat-message" v-model="chat_content"/>
      <button @click="send" class="send-btn">
        发送
      </button>
    </div>
    <Alert
      v-if="dialog.if_show_tip"
      :tip="dialog.tip"
      :btn1_text="dialog.btn1_text"
      :btn2_text="dialog.btn2_text"
      @btn1_click="close_tip"
      @btn2_click="close_tip"
    ></Alert>
  </div>
</template>

<script>
  import Alert from "../../../components/tools/Alert";
  export default {
    name: 'Chat',
    components:{
      Alert
    },
    props:{
      chatMessages:{
        type:Array,
        default: () => []
      },
      user:{
        type:Object,
        default: () => {}
      }
    },
    data(){
      return{
        default_chats: [
          { id: 1, command: "a", text: "这棋黑棋应该优势" },
          { id: 2, command: "b", text: "这棋白棋应该优势" },
          { id: 3, command: "c", text: "这棋黑白难分伯仲" },
          { id: 4, command: "d", text: "两边都下得好好啊" },
          { id: 5, command: "e", text: "这棋我上都赢" },
          { id: 6, command: "f", text: "向两位大佬膜拜" },
        ],
        chat_content:"",
        chat: {
          last_time: 0,
        },
        dialog: {
          if_show_tip: false,
          tip: "",
          btn1_text: "确定",
          btn2_text: "取消",
        },
      }
    },
    mounted() {
      this.scrollToBottom();
    },

    updated() {
      this.scrollToBottom();
    },
    methods:{
      // 打开dialog
      open_tip(tip) {
        this.dialog.if_show_tip = true;
        this.dialog.tip = tip;
      },
      close_tip() {
        this.dialog.if_show_tip = false;
        this.dialog.tip = "";
      },

      // 聊天功能
      handleCommand(command) {
        console.log("click on item " + command);
        for (let i = 0; i < this.default_chats.length; i++) {
          if (this.default_chats[i].command == command) {
            this.chat_content = this.default_chats[i].text;
            this.send();
            return;
          }
        }
      },
      scrollToBottom() {
        this.$nextTick(() => {
          if (this.$refs.chatContent) {
            this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
          }
        });
      },
      send() {
        let content = this.chat_content;
        if (content == "") {
          this.open_tip("聊天内容不能为空");
          return;
        }
        if (this.exist(content)) {
          this.open_tip("不要重复刷屏");
          return;
        }
        let time = new Date().getTime();
        /*if (new Date().getTime() - this.chat.last_time < 5000) {
          this.open_tip("发送聊天信息要间隔5秒钟");
          return;
        }*/
        this.chat.last_time = time;
        let message = { type: "say", content: content, user: this.user };
        this.$emit("send",message)
        this.chat_content = "";
      },
      exist(message) {
        if (this.chatMessages.length > 0) {
          for (let i in this.chatMessages)
            if (this.chatMessages[i].content == message)
              return true;
        }
        return false;
      },
    }
  }
</script>

<style scoped>
  .watch-chat {
    background-color: #0e4058;
  }
  #chat-board {
    height: 230px;
    overflow-y: auto;
  }
  .chat-content{
    line-height: 18px;
    margin: 0;
    margin-top: 5px;
    margin-left: 3px;
  }
  .chat-send {
    height: 30px;
    display: flex;
    flex-direction: row;
  }
  .chat-message {
    width: 210px;
    height: 28px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    top: 1px;
    font-size: 16px;
    color: black;
    margin-top: 3px;
    margin-left: 0;
  }
  .send-btn {
    position: relative;
    left: 0px;
    top: 1px;
    height: 32px;
    width: 60px;
    background-color: #43ded8;
    color: white;
    border: 0;
    margin-top: 3px;
    margin-left: 0;
  }
</style>

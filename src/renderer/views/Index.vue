<template>
  <el-container>
    <Sidebar></Sidebar>
    <el-container>
      <el-header>
        <el-input
          placeholder="请输入内容"
          v-model="input3"
          class="input-with-select"
          :disabled="true"
        >
          <template slot="prepend">tcp://</template>
          <el-button slot="append" icon="el-icon-search"></el-button>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="18" class="remote-col">
            <div class="msg-time">2022-10-02 00:00:00</div>
            <div class="msg-content">
              “颜色代码:红色#FF0000 深紫色 #871F78 褐红色 #8E236B 石英色 #D9D9F3
              绿色#00FF00 深石板蓝 #6B238E 中海蓝色 #32CD99 艳蓝色 #5959AB
              蓝色#0000FF 深铅灰色 #2F4F4F 中蓝色 #3232CD 鲑鱼色 #6F4242 牡丹红
              #FF00FF 深棕褐色 #97694F 中森林绿 #6B8E23 猩红色 #BC1717
              青色#00FFFF 深绿松石色 #7093DB
            </div>
          </el-col>
          <el-col :offset="6" :span="18" class="local-col">
            <div class="msg-time">2022-10-02 00:00:00</div>
            <div class="msg-content">123</div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer height="200px">
        <el-row>
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="18" :span="6" class="right">
            <el-button type="primary">主要按钮</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { save } from '../../server/sqlite3'
import Sidebar from '../components/index/Sidebar.vue'
export default {
  name: 'Index',
  components: { Sidebar },
  data() {
    return {
      ws: undefined
    }
  },
  mounted() {
    console.log('666')
    save('lorem', { info: 'test' }).then((res) => {
      console.log('rows', res)
    })
    this.ws = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol')
    this.ws.onerror = function () {
      console.log('Connection Error')
    }
    this.ws.onopen = function () {
      console.log('WebSocket this.ws Connected')
      function sendNumber() {
        // if (this.ws.readyState === this.ws.OPEN) {
        //   var number = Math.round(Math.random() * 0xffffff)
        //   this.ws.send(number.toString())
        //   setTimeout(sendNumber, 1000)
        // }
      }
      sendNumber()
    }
    this.ws.onclose = function () {
      console.log('echo-protocol this.ws Closed')
    }
    this.ws.onmessage = function (e) {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'")
      }
    }
  },
  methods: {}
}
</script>

<style>
.el-container {
  height: 100vh;
}

.el-header {
  padding: 0 0 !important;
}

.el-main {
  height: 100vh;
}

.el-footer {
  padding-top: 20px !important;
  border-top: 1px solid rgba(191, 191, 191, 0.5);
}

.add {
  background-color: aqua;
}

.session {
  padding: 20px 20px;
  border-bottom: 1px solid rgba(191, 191, 191, 0.5);
  cursor: pointer;
}

.connected {
  background-color: green;
}

.connecting {
  background-color: red;
}

.right {
  text-align: right;
}

.el-footer .el-row {
  margin-top: 10px;
}

.local-col {
  text-align: right;
}

.local-col .msg-content {
  font-size: 14px;
  padding: 6px 6px;
  background-color: rgba(64, 158, 255, 1);
  color: #ffffff;
  border-radius: 10px;
  display: inline-flex;
}

.remote-col .msg-content {
  font-size: 14px;
  padding: 6px 6px;
  background-color: rgba(191, 191, 191, 0.5);
  border-radius: 10px;
  display: inline-flex;
}

.msg-time {
  font-size: 14px;
  color: #bfbfbf;
  padding: 5px 5px;
  margin-bottom: 5px;
}
</style>

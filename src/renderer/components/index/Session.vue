<template>
  <el-container>
    <el-header>
      <el-input
        v-model="value.ip + ':' + value.port"
        class="input-with-select"
        :disabled="true"
      >
        <template slot="prepend">tcp://</template>
        <el-button
          v-if="
            this.value.client !== undefined &&
            this.value.client.readyState == 'open'
          "
          class="chain-broken"
          slot="append"
          @click="close"
        >
          <i class="fa fa-chain-broken fa-lg"></i>
        </el-button>
        <el-button v-else class="chain" slot="append" @click="reconnect">
          <i class="fa fa-chain fa-lg"></i>
        </el-button>
      </el-input>
    </el-header>
    <el-main>
      <el-row id="messages">
        <el-col
          v-for="item in list"
          :offset="item.type == 0 ? 6 : 0"
          :span="18"
          :class="{ 'remote-col': item.type == 1, 'local-col': item.type == 0 }"
        >
          <div class="msg-time">{{ item.create_time }}</div>
          <div class="msg-content">
            {{ item.content }}
          </div>
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
            v-model="form.content"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="18" :span="6" class="right">
          <el-button type="primary" @click="saveLocalMessage"
            >主要按钮</el-button
          >
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { list, save } from '../../../server/sqlite3'
import moment from 'moment'
const net = window.require('net')

const FORM = {
  content: undefined,
  create_time: undefined,
  type: 0,
  state: 1,
  session_id: undefined
}

export default {
  name: 'Session',
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      form: Object.assign({}, FORM),
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      list('message', [['state', 1]]).then((list) => {
        this.list = list
      })
    },
    saveLocalMessage() {
      this.saveMessage(this.form)
        .then((data) => {
          this.form.content = ''
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error
          })
        })
    },
    saveMessage(data) {
      return new Promise((resolve, reject) => {
        if (
          this.value === undefined ||
          this.value.client === undefined ||
          this.value.client.readyState !== 'open'
        ) {
          this.$message({
            type: 'error',
            message: this.$t('index.session_unconnected')
          })
        } else {
          data.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
          data.session_id = this.value.id
          save('message', data).then((id) => {
            data.id = id
            const message = Object.assign({}, data)
            let res = this.value.client.write(message.content + '\r\n')
            if (res === true) {
              this.list.push(message)
              this.$nextTick(() => {
                let messages = this.$el.querySelector('#messages')
                messages.scrollTop = messages.scrollHeight
                resolve(message)
              })
            } else {
              reject(this.$t('index.session_send_message_fail'))
            }
          })
        }
      })
    },
    connect(callback) {
      let client = new net.Socket()
      client.connect(this.value.port, this.value.ip, () => {
        client.on('close', () => {})
        client.on('data', (data) => {
          let form = Object.assign({}, FORM)
          form.type = 1
          form.content = data.toString()
          this.saveMessage(form).then((message) => {
            this.list.push(message)
            this.$nextTick(() => {
              let messages = this.$el.querySelector('#messages')
              messages.scrollTop = messages.scrollHeight
            })
          })
        })
        let session = Object.assign({}, this.value)
        session.client = client
        this.$emit('input', session)
        if (callback !== undefined) {
          callback(client)
        }
      })
    },
    reconnect() {
      this.connect()
    },
    close() {
      this.value.client.destroy()
    }
  }
}
</script>

<style>
.el-container {
  height: 100vh;
}

.chain-broken {
  color: #ffffff !important;
  background: #f56c6c !important;
}

.chain {
  color: #ffffff !important;
  background: #67c23a !important;
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

#messages {
  overflow-y: scroll;
  height: 100%;
}
</style>

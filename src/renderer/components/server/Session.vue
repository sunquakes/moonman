<template>
  <el-container>
    <el-header>
      <el-input v-model="address" class="input-with-select" :disabled="true">
        <template slot="prepend">tcp://</template>
        <el-button v-if="this.value !== undefined &&
          this.value.server !== undefined &&
          this.value.server.listening" class="chain-broken" slot="append" @click="close"
          :disabled="value === undefined ? true : false">
          <i class="fa fa-chain-broken fa-lg"></i>
        </el-button>
        <el-button v-else class="chain" slot="append" @click="relisten" :disabled="value === undefined ? true : false">
          <i class="fa fa-chain fa-lg"></i>
        </el-button>
      </el-input>
    </el-header>
    <el-main>
      <el-row id="messages">
        <el-col v-for="item in list" :offset="item.type == 0 ? 6 : 0" :span="18"
          :class="{ 'remote-col': item.type == 1, 'local-col': item.type == 0 }">
          <div class="msg-info">
            <div class="msg-address">{{ item.ip }}:{{ item.port }}</div>
            <div class="msg-time">{{ item.create_time }}</div>
          </div>
          <div class="msg-content">
            {{ item.content }}
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer height="200px">
      <el-row>
        <el-col :span="24">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.content">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="value !== undefined" :span="18">
          <el-form v-model="value" label-width="80px">
            <el-row class="session-config">
              <el-col :span="8">
                <el-form-item :label="$t('index.session_delimiter')">
                  <el-input v-model="value.delimiter" @input="updateSession"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item>
                  <el-radio v-model="value.message_type" label="hex" border @input="updateSession">{{
                    $t('index.session_message_type_hex') }}</el-radio>
                  <el-radio v-model="value.message_type" label="string" border @input="updateSession">{{
                    $t('index.session_message_type_string') }}</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :offset="value === undefined ? 18 : 0" :span="6" class="right">
          <el-button type="primary" @click="saveLocalMessage" :disabled="value === undefined ? true : false">{{
            $t('index.session_send_message') }}</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { list, save, updateById, getOne } from '../../../server/sqlite3'
import moment from 'moment'
import { SERVER } from '../../const/session'
import { READY_STATE } from '../../const/socket'
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
  watch: {
    value(newVal) {
      if (newVal !== undefined) {
        this.address = newVal.ip + ':' + newVal.port
        this.getList()
      }
    }
  },
  data() {
    return {
      form: Object.assign({}, FORM),
      list: [],
      address: undefined,
      map: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.value !== undefined) {
        list('message', [
          ['state', 1],
          ['session_id', this.value.id]
        ]).then((list) => {
          this.list = list
          this.$nextTick(() => {
            let messages = this.$el.querySelector('#messages')
            messages.scrollTop = messages.scrollHeight
          })
        })
      }
    },
    saveLocalMessage() {
      if (this.value === undefined) {
        this.$message({
          type: 'error',
          message: this.$t('index.create_session_first')
        })
        return
      }
      if (!this.form.content) {
        this.$message({
          type: 'error',
          message: this.$t('index.session_content_cannot_empty')
        })
        return
      }
      if (
        this.value === undefined ||
        this.value.server === undefined ||
        !this.value.server.listening
      ) {
        this.$message({
          type: 'error',
          message: this.$t('index.session_unconnected')
        })
      } else {
        let msg
        const delimiter = JSON.parse('"' + this.value.delimiter.replace(/\\/g, '\\') + '"')
        if (this.value.message_type === 'hex') {
          const hexString = this.form.content + delimiter
          this.form.content = hexString
          msg = Buffer.from(hexString, 'hex')
        } else {
          msg = this.form.content + delimiter
          this.form.content = msg
        }
        if (this.map === undefined || this.map[this.value.port] === undefined) {
          return
        }
        const map = this.map[this.value.port]
        Object.keys(map).forEach(key => {
          const client = map[key]
          if (client.readyState !== READY_STATE) {
            client.destroy()
            delete map[key]
            return
          }
          let res = client.write(msg)
          this.form.ip = client.localAddress
          this.form.port = client.localPort
          if (res === true) {
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
          } else {
            this.$message({
              type: 'error',
              message: this.$t('index.session_send_message_fail')
            })
          }
        })
      }
    },
    saveMessage(data) {
      if (!data.content) {
        this.$message({
          type: 'error',
          message: this.$t('index.session_content_cannot_empty')
        })
        return
      }
      return new Promise((resolve, reject) => {
        data.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
        data.session_id = this.value.id
        const delimiter = JSON.parse('"' + this.value.delimiter.replace(/\\/g, '\\') + '"')
        data.content = data.content.substr(0, data.content.length - delimiter.length) + this.value.delimiter
        save('message', data)
          .then((id) => {
            let message = Object.assign({}, data)
            message.id = id
            this.list.push(message)
            this.$nextTick(() => {
              let messages = this.$el.querySelector('#messages')
              messages.scrollTop = messages.scrollHeight
              resolve(message)
            })
          })
          .catch((error) => reject(error))
      })
    },
    listen(ip, port, callback) {
      const server = net.createServer((socket) => {
        const port = socket.localPort
        if (this.map[port] === undefined) {
          this.map[port] = {}
        }
        const key = `${socket.remoteAddress}:${socket.remotePort}`
        // Register client to the map
        if (this.map[port][key] !== undefined) {
          this.map[port][key].destroy()
          this.map[port][key] = undefined
        }
        this.map[port][key] = socket

        socket.on('data', (data) => {
          let form = Object.assign({}, FORM)
          form.type = 1
          if (this.value.message_type === 'hex') {
            form.content = Buffer.from(data, 'utf8').toString('hex')
          } else {
            form.content = data.toString()
          }
          form.ip = socket.remoteAddress
          form.port = socket.remotePort
          this.saveMessage(form)
        })
        socket.on('end', () => { })
      })

      server.listen(port, () => {
        getOne('session', [
          ['type', SERVER],
          ['ip', ip],
          ['port', port]
        ]).then((row) => {
          if (!row) {
            let session = {
              port: port,
              ip: ip,
              type: SERVER,
              delimiter: '\\r\\n',
              message_type: 'string',
              create_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            save('session', session).then((id) => {
              session.id = id
              session.server = server
              this.$emit('input', session)
              this.$nextTick(() => {
                if (callback !== undefined) {
                  callback(server)
                }
              })
            })
          } else {
            let session = Object.assign({}, row)
            session.update_time = moment().format('YYYY-MM-DD HH:mm:ss')
            updateById('session', row.id, session).then((id) => {
              session.server = server
              this.$emit('input', session)
              this.$nextTick(() => {
                if (callback !== undefined) {
                  callback(server)
                }
              })
            })
          }
        })
      })
    },
    relisten() {
      if (this.value === undefined) {
        this.$message({
          type: 'error',
          message: this.$t('index.create_session_first')
        })
        return
      }
      const ip = this.value.ip
      const port = this.value.port
      this.listen(ip, port)
    },
    close() {
      const port = this.value.port
      if (this.map === undefined || this.map[port] === undefined) {
        return
      }
      const map = this.map[port]
      Object.keys(map).forEach(key => {
        const client = map[key]
        client.destroy()
      })
      this.map[port] = {}
      this.value.server.close(() => {
      })
    },
    updateSession() {
      updateById('session', this.value.id, {
        delimiter: this.value.delimiter,
        message_type: this.value.message_type
      }).then((id) => { })
    }
  }
}
</script>

<style scoped>
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
  height: 40px !important;
  padding: 0 0 !important;
}

.el-main {
  height: 100vh;
  overflow-y: hidden !important;
}

::-webkit-scrollbar {
  display: none !important;
  /* Chrome Safari 兼容*/
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
  /* display: inline-flex; */
}

.msg-info {
  margin-top: 10px;
}

.msg-address {
  color: #bfbfbf;
  display: inline-block;
  font-size: 14px;
  padding: 0px 5px;
  margin-bottom: 5px;
}

.msg-time {
  display: inline-block;
  font-size: 14px;
  color: #bfbfbf;
  padding: 0px 5px;
  margin-bottom: 5px;
}

#messages {
  overflow-y: scroll;
  height: 100%;
}

.session-config {
  margin-top: 0px !important;
}
</style>

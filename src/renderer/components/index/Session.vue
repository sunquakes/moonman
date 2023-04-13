<template>
  <el-container>
    <el-header>
      <el-input
        placeholder="请输入内容"
        v-model="value.ip + ':' + value.port"
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
          <el-button type="primary" @click="sendMessage">主要按钮</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { list, save } from '../../../server/sqlite3'
import moment from 'moment'

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
      form: {
        content: undefined,
        create_time: undefined,
        type: 0,
        state: 1,
        session_id: undefined
      },
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
    sendMessage() {
      if (
        this.value === undefined ||
        this.value.client === undefined ||
        this.value.client.readyState !== 'open'
      ) {
        this.$message({
          type: 'error',
          message: '未连接'
        })
      } else {
        this.form.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
        this.form.session_id = this.value.id
        console.log('value', this.form)
        save('message', this.form).then((id) => {
          this.getList()
        })
      }
    }
  }
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

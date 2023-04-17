<template>
  <el-container>
    <Sidebar
      v-model="session"
      @afterCreateSession="afterCreateSession"
    ></Sidebar>
    <Session ref="Session" v-model="session"></Session>
  </el-container>
</template>

<script>
import Sidebar from '../components/index/Sidebar.vue'
import Session from '../components/index/Session.vue'
export default {
  name: 'Index',
  components: { Sidebar, Session },
  data() {
    return {
      session: undefined
    }
  },
  mounted() {},
  methods: {
    afterCreateSession(session, callback) {
      this.session = session
      this.$nextTick(() => {
        this.$refs.Session.connect(callback)
      })
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

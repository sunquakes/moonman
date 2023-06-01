<template>
  <el-container>
    <Menu v-model="menu"></Menu>
    <ClientSidebar
      v-show="menu == CLIENT"
      v-model="session"
      @afterCreateSession="afterCreateSession"
    ></ClientSidebar>
    <ClientSession v-show="menu == CLIENT" ref="Session" v-model="session"></ClientSession>
    <ServerSidebar
      v-show="menu == SERVER"
      v-model="session"
      @afterCreateSession="afterCreateSession"
    ></ServerSidebar>
    <ServerSession v-show="menu == SERVER" ref="Session" v-model="session"></ServerSession>
  </el-container>
</template>

<script>
import ClientSidebar from '../components/client/Sidebar.vue'
import ClientSession from '../components/client/Session.vue'
import ServerSidebar from '../components/server/Sidebar.vue'
import ServerSession from '../components/server/Session.vue'
import Menu from '../components/index/Menu.vue'
import { CLIENT, SERVER } from '../const/menu'
export default {
  name: 'Index',
  components: { ClientSidebar, ClientSession, ServerSidebar, ServerSession, Menu },
  data() {
    return {
      CLIENT,
      SERVER,
      menu: CLIENT,
      session: undefined
    }
  },
  mounted() {},
  methods: {
    afterCreateSession(session, callback) {
      this.$nextTick(() => {
        this.$refs.Session.connect(session.ip, session.port, callback)
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

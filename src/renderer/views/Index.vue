<template>
  <el-container>
    <Menu v-model="menu"></Menu>
    <ClientSidebar v-show="menu == CLIENT" v-model="client" @afterCreate="afterCreateClient"></ClientSidebar>
    <ClientSession v-show="menu == CLIENT" ref="ClientSession" v-model="client"></ClientSession>
    <ServerSidebar v-show="menu == SERVER" v-model="server" @afterCreate="afterCreateServer"></ServerSidebar>
    <ServerSession v-show="menu == SERVER" ref="ServerSession" v-model="server"></ServerSession>
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
      client: undefined,
      server: undefined
    }
  },
  watch: {
    menu(newVal) {
      this.$nextTick(() => {
        if (newVal === SERVER) {
          this.$refs.ServerSession.scrollBottom()
        } else if (newVal === CLIENT) {
          this.$refs.ClientSession.scrollBottom()
        }
      })
    }
  },
  mounted() { },
  methods: {
    afterCreateClient(session, callback) {
      this.$nextTick(() => {
        this.$refs.ClientSession.connect(session.ip, session.port, callback)
      })
    },
    afterCreateServer(session, callback) {
      this.$nextTick(() => {
        this.$refs.ServerSession.listen(session.ip, session.port, callback)
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

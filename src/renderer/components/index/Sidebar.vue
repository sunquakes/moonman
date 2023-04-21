<template>
  <el-aside width="380px">
    <div>
      <el-input
        placeholder="请输入内容"
        v-model="keyword"
        class="input-with-select"
      >
        <template slot="prepend">tcp://</template>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <CreateConnection
        v-model="dialogFormVisible"
        @afterCreate="afterCreateSession"
      ></CreateConnection>
    </div>
    <div class="session-create">
      <el-button type="primary" round @click="dialogFormVisible = true">{{
        $t('index.create_new_connect')
      }}</el-button>
    </div>
    <div class="session-list" v-for="item in list">
      <div
        :class="{
          'session-item hover': value != undefined && value.id == item.id,
          'session-item': value == undefined || value.id != item.id
        }"
        @click="selectSession(item)"
      >
        {{ item.ip }}:{{ item.port }}
        <el-tag
          v-if="
            map[item.id] !== undefined && map[item.id].readyState === 'open'
          "
          type="success"
          effect="dark"
          size="mini"
          class="session-state"
          >{{ $t('index.session_state_online') }}</el-tag
        >
        <el-tag
          v-else
          type="danger"
          effect="dark"
          size="mini"
          class="session-state"
          >{{ $t('index.session_state_offline') }}</el-tag
        >
      </div>
    </div>
  </el-aside>
</template>

<script>
import CreateConnection from './CreateConnection.vue'
import { list } from '../../../server/sqlite3'
export default {
  name: 'Sidebar',
  components: { CreateConnection },
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  watch: {
    value(newVal) {
      const id = newVal.id
      console.log('id', id)
      this.map[id] = newVal.client
      console.log('map', this.map)
      const index = this.indexMap[id]
      if (this.list[index] !== undefined) {
        this.list[index].client = this.map[id]
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      keyword: undefined,
      list: [],
      map: {},
      indexMap: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      list('session', undefined, 'update_time DESC').then((list) => {
        this.indexMap = {}
        for (let index in list) {
          let item = list[index]
          item.client = this.map[item.id]
          this.indexMap[item.id] = Number(index)
        }
        this.list = list
        if (this.value === undefined && this.list.length > 0) {
          let session = this.list[0]
          this.$emit('input', session)
        }
      })
    },
    afterCreateSession(session) {
      this.$emit('afterCreateSession', session, (client) => {
        if (this.map[session.id] !== undefined) {
          this.map[session.id].destroy()
          this.map[session.id] = undefined
        }
        this.getList()
        this.closeCreateConnection()
      })
    },
    selectSession(session) {
      this.$emit('input', session)
    },
    closeCreateConnection() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>
.el-aside {
  width: 500 !important;
  height: 100vh;
  padding-bottom: 20px;
  border-right: 1px solid rgba(191, 191, 191, 0.5);
}

.session-create {
  text-align: center;
  padding: 10px 10px;
}

.session-create .el-button {
  width: 80%;
}

.session-list {
  border-top: 1px solid rgba(191, 191, 191, 0.5);
}
.session-item {
  padding: 20px 20px;
  border-bottom: 1px solid rgba(191, 191, 191, 0.5);
  cursor: pointer;
}

.session-state {
  float: right;
}
.hover {
  background: rgba(191, 191, 191, 0.5);
}
</style>

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
        <el-button
          slot="append"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
        ></el-button>
      </el-input>
      <CreateConnection
        v-model="dialogFormVisible"
        @onCreate="onCreate"
      ></CreateConnection>
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
        {{ !item.client ? 'abc' : item.client.readyState }}
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
  data() {
    return {
      dialogFormVisible: true,
      keyword: undefined,
      list: [],
      map: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      list('session').then((list) => {
        for (let item of list) {
          item.client = this.map[item.id]
        }
        this.list = list
      })
    },
    onCreate(id, client) {
      this.map[id] = client
      this.getList()
    },
    selectSession(session) {
      this.$emit('input', session)
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
.session-item {
  padding: 20px 20px;
  border-bottom: 1px solid rgba(191, 191, 191, 0.5);
  cursor: pointer;
}
.hover {
  background: rgba(191, 191, 191, 0.5);
}
</style>

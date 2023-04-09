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
    <div class="session" v-for="item in list">
      {{ item.ip }}:{{ item.port }}
      {{ !item.client ? 'abc' : item.client.readyState }}
    </div>
  </el-aside>
</template>

<script>
import CreateConnection from './CreateConnection.vue'
import { list } from '../../../server/sqlite3'
export default {
  name: 'Sidebar',
  components: { CreateConnection },
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
</style>

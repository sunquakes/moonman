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
      <CreateConnection v-model="dialogFormVisible"></CreateConnection>
    </div>
    <div class="session" v-for="item in list">{{ item.address }}</div>
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
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      list('session').then((list) => {
        console.log(list)
        this.list = list
      })
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

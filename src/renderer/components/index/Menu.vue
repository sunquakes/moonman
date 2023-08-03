<template>
  <el-menu :default-active="value" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect">
    <el-menu-item index="client" :title="$t('index.menu_client_name')">
      <i class="fa fa-desktop fa-lg"></i>
      <span slot="title">{{ $t('index.menu_client_name') }}</span>
    </el-menu-item>
    <el-menu-item index="server" :title="$t('index.menu_server_name')">
      <i class="fa fa-server fa-lg"></i>
      <span slot="title">{{ $t('index.menu_server_name') }}</span>
    </el-menu-item>
    <el-menu-item index="info" :title="$t('index.menu_info')">
      <i class="fa fa-info fa-lg"></i>
      <span slot="title">{{ $t('index.menu_info') }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { CLIENT } from '../../const/menu'

export default {
  name: 'Menu',
  props: {
    value: {
      type: String,
      default: CLIENT
    }
  },
  data() {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$emit('input', key)
    }
  }
}
</script>

<style scoped>
/deep/.el-menu-item {
  width: 64px;
  text-align: center;
}
</style>

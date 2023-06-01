<template>
  <el-menu default-active="0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    :collapse="isCollapse">
    <el-menu-item index="0">
      <i class="fa fa-user fa-lg"></i>
      <span slot="title">{{ $t('index.menu_client_name') }}</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="fa fa-users fa-lg"></i>
      <span slot="title">{{ $t('index.menu_server_name') }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
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

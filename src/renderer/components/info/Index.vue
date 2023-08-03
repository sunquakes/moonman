<template>
  <div class="info-container">
    <div class="info-item">
      <el-image class="logo" :src="logo" fit="fill"></el-image>
      <el-descriptions class="info" :column="1" :size="size" border>
        <el-descriptions-item>
          <template slot="label">
            <div class="info-label">
              <i class="fa fa-flag"></i>
              {{ $t('info.version') }}
            </div>
          </template>
          <div class="info-content">
            {{ config.version }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <div class="info-label">
              <i class="fa fa-user-circle"></i>
              {{ $t('info.author') }}
            </div>
          </template>
          <div class="info-content">
            {{ config.author }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <div class="info-label">
              <i class="fa fa-chrome"></i>
              {{ $t('info.website') }}
            </div>
          </template>
          <div class="info-content">
            <el-link :href="config.website" target="_blank">{{ config.website }}</el-link>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <div class="info-label">
              <i class="fa fa-download"></i>
              {{ $t('info.update') }}
            </div>
          </template>
          <el-button type="text">{{ $t('info.check_update') }}</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import logo from '../../../../build/icons/256x256.png'
import config from '../../../../package.json'

export default {
  name: 'InfoIndex',
  data() {
    return {
      logo: logo,
      config: config
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
.logo {
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.info-container {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-item {
  margin: 0 auto;
  padding-bottom: 100px;
}

.info {
  margin: 20px auto;
  text-align: center;
}

.info-label {
  padding-left: 100px;
}

.info-content {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 100px;
}
</style>

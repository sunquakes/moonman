<template>
  <el-dialog :title="$t('index.create_new_connect')" :show-close="false" :visible="value">
    <el-form :model="form">
      <el-form-item label="活动名称">
        <el-input
          placeholder="请输入内容"
          v-model="form.address"
          class="input-with-select"
        >
          <template slot="prepend">tcp://</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save } from '../../../server/sqlite3'
export default {
  name: 'CreateConnection',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        address: undefined
      }
    }
  },
  methods: {
    show(value) {
      this.$emit('input', value)
    },
    submit() {
      save('session', this.form).then((id) => {
        this.$emit('onCreated', id)
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

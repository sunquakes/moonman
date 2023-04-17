<template>
  <el-dialog
    :title="$t('index.create_new_connect')"
    :show-close="false"
    :visible="value"
  >
    <el-form :model="form">
      <el-form-item>
        <el-col :span="18">
          <el-input
            placeholder="ip"
            v-model="form.ip"
            class="input-with-select"
          >
          </el-input>
        </el-col>
        <el-col :offset="1" :span="5">
          <el-input placeholder="port" v-model="form.port"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{
        $t('common.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOne, save } from '../../../server/sqlite3'
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
        ip: undefined,
        port: undefined
      }
    }
  },
  methods: {
    show(value) {
      this.$emit('input', value)
    },
    submit() {
      getOne('session', [
        ['ip', this.form.ip],
        ['port', this.form.port]
      ]).then((row) => {
        if (row) {
          this.connect(row)
        } else {
          save('session', this.form).then((id) => {
            this.form.id = id
            this.connect(this.form)
          })
        }
      })
    },
    connect(data) {
      this.$emit('afterCreate', data)
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog {
  width: 400px;
}
</style>

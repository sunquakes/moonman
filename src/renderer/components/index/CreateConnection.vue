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
      <el-button @click="show(false)">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOne, save } from '../../../server/sqlite3'
const net = window.require('net')
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
      getOne('session', [['ip', this.form.ip], ['port', this.form.port]]).then((row) => {
        if (row) {
          this.connect(row.id)
        } else {
          save('session', this.form).then((id) => {
            this.connect(id)
          })
        }
      })
    },
    connect(id) {
      let client = new net.Socket()
      client.connect(this.form.port, this.form.ip, () => {
        client.on('close', () => {})
        this.$emit('onCreate', id, client)
      })
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog {
  width: 400px;
}
</style>

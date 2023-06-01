<template>
  <el-dialog
    :title="$t('index.create_new_connect')"
    :show-close="false"
    :visible="value"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-col :span="16">
        <el-form-item prop="ip">
          <el-input
            placeholder="ip"
            v-model="form.ip"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="7">
        <el-form-item prop="port">
          <el-input placeholder="port" v-model.number="form.port"></el-input>
        </el-form-item>
      </el-col>
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
      form: {
        ip: undefined,
        port: undefined
      },
      rules: {
        ip: [
          {
            required: true,
            message: this.$t('index.form_ip_required'),
            trigger: 'blur'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('index.form_port_required'),
            trigger: 'blur'
          },
          { type: 'number', message: this.$t('index.form_port_type') }
        ]
      }
    }
  },
  methods: {
    show(value) {
      this.$emit('input', value)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.connect(this.form)
        } else {
          return false
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

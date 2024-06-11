<template>
  <el-dialog title="$t('index.session_config')" :visible.sync="visible" width="400px">
    <el-form v-model="value" label-width="130px">
      <el-form-item :label="$t('index.session_delimiter')">
        <el-input v-model="value.delimiter"></el-input>
      </el-form-item>
      <el-form-item :label="$t('index.session_message_type')">
        <el-radio v-model="value.message_type" label="hex" border>{{
          $t('index.session_message_type_hex')
        }}</el-radio>
        <el-radio v-model="value.message_type" label="string" border>{{
          $t('index.session_message_type_string')
        }}</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="updateSession">{{ $t('common.submit') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateById } from '../../server/sqlite3'
export default {
  name: 'Config',
  props: {
    value: {
      type: Object,
      default: undefined
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
    updateSession() {
      updateById('session', this.value.id, {
        delimiter: this.value.delimiter,
        message_type: this.value.message_type
      }).then((id) => {})
    }
  },
  destroyed() {}
}
</script>

<style scoped></style>

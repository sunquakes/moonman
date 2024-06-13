<template>
  <div>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="updateSession">{{ $t('common.submit') }}</el-button>
    </div>
  </div>
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
  computed: {
    transformedProp() {
      return this.grandparentProp.toUpperCase()
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    updateSession() {
      updateById('session', this.value.id, {
        delimiter: this.value.delimiter,
        message_type: this.value.message_type
      }).then((id) => {
        this.$emit('update:visible', false)
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  },
  destroyed() {}
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>

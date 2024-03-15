<template>
  <el-aside width="380px">
    <div>
      <el-input :placeholder="$t('index.sidebar_keyword_placeholder')" v-model="keyword" class="input-with-select">
        <template slot="prepend">tcp://</template>
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
      <CreateConnection v-model="dialogFormVisible" @afterCreate="afterCreate"></CreateConnection>
    </div>
    <div class="session-create">
      <el-button type="primary" round icon="el-icon-plus" @click="dialogFormVisible = true">{{
        $t('index.create_new_client')
      }}</el-button>
    </div>
    <div class="session-list" v-for="item in list">
      <div :class="{
        'session-item hover': value != undefined && value.id == item.id,
        'session-item': value == undefined || value.id != item.id
      }" @click="selectSession(item)">
        {{ item.ip }}:{{ item.port }}
        <el-dropdown trigger="click" class="session-right" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-more el-icon--right"></i>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" :command="{ function: 'deleteSession', id: item.id }">
              <font color="red">{{ $t('index.session_delete') }}</font>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tag v-if="map[item.id] !== undefined && map[item.id].readyState === 'open'
          " type="success" effect="dark" size="mini" class="session-state session-right">{{
    $t('index.session_state_online')
  }}</el-tag>
        <el-tag v-else type="danger" effect="dark" size="mini" class="session-state session-right">{{
          $t('index.session_state_offline')
        }}</el-tag>
      </div>
    </div>
  </el-aside>
</template>

<script>
import CreateConnection from './CreateConnection.vue'
import { list, remove } from '../../server/sqlite3'
import { CLIENT } from '../../const/session'
export default {
  name: 'Sidebar',
  components: { CreateConnection },
  props: {
    value: {
      type: Object,
      default: undefined
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== undefined) {
        const id = newVal.id
        this.map[id] = newVal.client
        const index = this.indexMap[id]
        if (this.list[index] !== undefined) {
          this.list[index].client = this.map[id]
        }
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      keyword: undefined,
      list: [],
      map: {},
      indexMap: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let where = [['type', '=', CLIENT]]
      if (this.keyword) {
        where.push([`(ip || ':' || port)`, 'LIKE', `%${this.keyword}%`])
      }
      list('session', where, 'update_time DESC').then((list) => {
        this.indexMap = {}
        for (let index in list) {
          let item = list[index]
          item.client = this.map[item.id]
          this.indexMap[item.id] = Number(index)
        }
        this.list = list
        if (this.value === undefined && this.list.length > 0) {
          let session = this.list[0]
          this.$emit('input', session)
        } else if (this.list.length === 0) {
          this.$emit('input', undefined)
        }
      })
    },
    afterCreate(session) {
      this.$emit('afterCreate', session, (client) => {
        if (this.map[session.id] !== undefined) {
          this.map[session.id].destroy()
          this.map[session.id] = undefined
        }
        this.getList()
        this.closeCreateConnection()
      })
    },
    selectSession(session) {
      this.$emit('input', session)
    },
    closeCreateConnection() {
      this.dialogFormVisible = false
    },
    deleteSession(obj, id) {
      obj.$confirm(obj.$t('index.session_delete_confirm'), obj.$t('common.alert'), {
        confirmButtonText: obj.$t('common.yes'),
        cancelButtonText: obj.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        remove('session', [['id', id]]).then(() => {
          return remove('message', [['session_id', id]])
        })
      }).then(() => {
        obj.$emit('input', undefined)
        obj.$nextTick(() => {
          obj.getList()
        })
      })
    },
    handleCommand(command) {
      this.$options.methods[command.function](this, command.id)
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

.session-create {
  text-align: center;
  padding: 10px 10px;
}

.session-create .el-button {
  width: 80%;
}

.session-item {
  padding: 20px 20px;
  cursor: pointer;
}

.session-state {
  margin-right: 10px;
}

.session-right {
  float: right;
}

.hover {
  background: rgba(64, 158, 255, 0.2);
}
</style>

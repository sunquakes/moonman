<template>
  <el-container>
    <el-aside width="380px">
      <div>
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
          <template slot="prepend">tcp://</template>
          <el-button slot="append" icon="el-icon-search"></el-button>
          <el-button slot="append" icon="el-icon-plus" @click="dialogFormVisible = true"></el-button>
        </el-input>
        <el-dialog :title="$t('index.create_new_connect')" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="活动名称" :label-width="formLabelWidth">
              <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                <template slot="prepend">tcp://</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
      <div class="session">127.0.0.1:3200</div>
    </el-aside>
    <el-container>
      <el-header>
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" :disabled="true">
          <template slot="prepend">tcp://</template>
          <el-button slot="append" icon="el-icon-search"></el-button>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="18" class="remote-col">
            <div class="msg-time">2022-10-02 00:00:00</div>
            <div class="msg-content">“颜色代码:红色#FF0000 深紫色 #871F78 褐红色 #8E236B 石英色 #D9D9F3 绿色#00FF00 深石板蓝 #6B238E 中海蓝色
              #32CD99 艳蓝色 #5959AB 蓝色#0000FF 深铅灰色 #2F4F4F 中蓝色 #3232CD 鲑鱼色 #6F4242 牡丹红 #FF00FF 深棕褐色 #97694F 中森林绿 #6B8E23
              猩红色 #BC1717 青色#00FFFF 深绿松石色 #7093DB</div>
          </el-col>
          <el-col :offset="6" :span="18" class="local-col">
            <div class="msg-time">2022-10-02 00:00:00</div>
            <div class="msg-content">123</div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer height="200px">
        <el-row>
          <el-col :span="24">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="18" :span="6" class="right">
            <el-button type="primary">主要按钮</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      dialogFormVisible: true
    }
  },
  methods: {
  }
}
</script>

<style>
.el-container {
  height: 100vh;
}

.el-aside {
  width: 500 !important;
  height: 100vh;
  padding-bottom: 20px;
  border-right: 1px solid rgba(191, 191, 191, 0.5);
}

.el-header {
  padding: 0 0 !important;
}

.el-main {
  height: 100vh;
}

.el-footer {
  padding-top: 20px !important;
  border-top: 1px solid rgba(191, 191, 191, 0.5);
}

.add {
  background-color: aqua;
}

.session {
  padding: 20px 20px;
  border-bottom: 1px solid rgba(191, 191, 191, 0.5);
  cursor: pointer;
}

.connected {
  background-color: green;
}

.connecting {
  background-color: red;
}

.right {
  text-align: right;
}

.el-footer .el-row {
  margin-top: 10px;
}

.local-col {
  text-align: right;
}

.local-col .msg-content {
  font-size: 14px;
  padding: 6px 6px;
  background-color: rgba(64, 158, 255, 1);
  color: #FFFFFF;
  border-radius: 10px;
  display: inline-flex;
}

.remote-col .msg-content {
  font-size: 14px;
  padding: 6px 6px;
  background-color: rgba(191, 191, 191, 0.5);
  border-radius: 10px;
  display: inline-flex;
}

.msg-time {
  font-size: 14px;
  color: #BFBFBF;
  padding: 5px 5px;
  margin-bottom: 5px;
}
</style>

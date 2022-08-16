<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span style="float: left">
        <strong>钉钉机器人</strong>
        <span style="color: #909399; margin-left: 10px">
          DingTalk
          <el-popover
            placement="right"
            title="钉钉群机器人"
            width="500"
            trigger="hover"
          >
            <div style="font-size: 14px; padding: 1px; line-height: 30px; color: #606266; font-weight: 550">
              <div>1. 每次任务执行完成后会以钉钉机器人的形式发送消息通知</div>
              <div>2. 支持配置多个群, 可点击 添加令牌 后新增群机器人Token来绑定多个群</div>
              <div>3. <span style="color: #409EFF">右侧开关</span>可以控制本项目是否启用钉钉机器人通知</div>
              <div>4. 请保管好 Webhook 地址，不要公布在外部网站上，泄露有安全风险</div>
              <div>5. 如群机器人未配置加签秘钥请确保关键字中包含 <span style="color: #F56C6C">测试</span> 二字</div>
              <div>6. 如何配置钉钉机器人请查看 <a href="https://www.baidu.com" target="_blank" style="color: #409EFF">教程文档</a></div>
            </div>
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </span>
      </span>
      <el-switch
        v-model="talkForm.status"
        style="float: right; padding: 3px 0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @click.native.stop
      />
    </div>
    <el-form
      ref="talkFormRef"
      :model="talkForm"
      :rules="talkFormRules"
      label-width="100px"
      hide-required-asterisk
    >
      <el-form-item
        v-for="(group, index) in talkForm.tokens"
        :key="group.key"
        :label="'群机器人' + (index + 1)"
        :prop="'group.' + index + '.token'"
      >
        <el-input
          v-model="group.token"
          placeholder="请输入群机器人的 Webhook 地址"
          clearable
          show-password
          style="width: 35%; margin-right: 10px"
        />
        <el-input
          v-model="group.sign"
          placeholder="请输入群机器人的加签秘钥"
          clearable
          show-password
          style="width: 35%; margin-right: 10px"
        />
        <el-button plain type="danger" @click="removeToken(index)">删 除</el-button>
      </el-form-item>
      <el-form-item label="消息通知">
        <el-radio-group v-model="talkForm.atAll">
          <el-radio label="no" border>不@任何人</el-radio>
          <el-radio label="yes" border>@所有人</el-radio>
          <el-radio label="part" border>@指定人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="talkForm.atAll === 'part'"
      >
        <el-select
          v-model="talkForm.atMobile"
          multiple
          filterable
          allow-create
          default-first-option
          remote
          placeholder="请选择或输入被通知人的手机号"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 400px"
        >
          <el-option
            v-for="item in userList"
            :key="item.mobile"
            :label="item.mobile"
            :value="item.mobile"
          >
            <span style="float: left">{{ item.mobile }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button plain type="success" @click="addToken">新增令牌</el-button>
      <el-button type="primary" @click="saveMessage">保 存</el-button>
      <el-button @click="resetForm">重 置</el-button>
    </div>
  </el-card>
</template>

<script>
import { getManagementList } from '@/api/account/management'

export default {
  data() {
    return {
      loading: false,
      userList: [],
      talkForm: {
        status: false,
        tokens: [{ token: null, sign: null }],
        atAll: 'no',
        atMobile: []
      },
      talkFormRules: {}
    }
  },
  methods: {
    addToken() {
      this.talkForm.tokens.push({
        token: null,
        sign: null,
        key: Date.now()
      })
    },
    removeToken(index) {
      if (this.talkForm.tokens.length > 1) {
        this.talkForm.tokens.splice(index, 1)
      } else this.$message.error('最少添加一个群机器人')
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const requestForm = {
          page: 1,
          pageSize: 20,
          name: query
        }
        try {
          const { items } = await getManagementList(requestForm)
          this.userList = items
        } finally {
          this.loading = false
        }
      } else {
        this.userList = []
      }
    }
  }
}
</script>

<style scoped>

</style>

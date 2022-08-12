<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span style="float: left">
          <strong>邮件配置</strong>
          <span style="color: #909399; margin-left: 10px">Email</span>
        </span>
        <el-switch
          v-model="addForm.emailForm.switch"
          style="float: right; padding: 3px 0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @click.native.stop
        />
      </div>
      <el-form ref="emailFormRef" inline :model="addForm.emailForm" :rules="emailFormRules" label-width="80px">
        <el-form-item label="邮箱服务" style="width: 50%">
          <el-select
            v-model="addForm.emailForm.host"
            filterable
            allow-create
            default-first-option
            placeholder="请选择SMTP服务器"
            style="width: 350px"
          >
            <el-option
              v-for="item in emailHostList"
              :key="item.key"
              :label="item.key"
              :value="item.key"
            >
              <span style="float: left">{{ item.key }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="addForm.emailForm.title" style="width: 350px" placeholder="请输入邮件标题" clearable />
        </el-form-item>
        <el-form-item label="发送人" style="width: 50%">
          <el-input v-model="addForm.emailForm.sender" style="width: 350px" placeholder="请输入发送人" clearable />
        </el-form-item>
        <el-form-item label="授权码">
          <el-input v-model="addForm.emailForm.password" style="width: 350px" placeholder="请输入邮箱授权码" show-password clearable />
        </el-form-item>
        <el-form-item label="接收人">
          <el-select
            v-model="addForm.emailForm.receivers"
            multiple
            filterable
            allow-create
            default-first-option
            remote
            placeholder="请选择接收人"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 350px"
          >
            <el-option
              v-for="item in emailList"
              :key="item.email"
              :label="item.email"
              :value="item.email"
            >
              <span style="float: left">{{ item.email }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary">保 存</el-button>
        <el-button>重 置</el-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span style="float: left">
          <strong>钉钉机器人</strong>
          <span style="color: #909399; margin-left: 10px">DingTalk</span>
        </span>
        <el-switch
          v-model="value"
          style="float: right; padding: 3px 0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @click.native.stop
        />
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span style="float: left">
          <strong>飞书机器人</strong>
          <span style="color: #909399; margin-left: 10px">Lark</span>
        </span>
        <el-switch
          v-model="value"
          style="float: right; padding: 3px 0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @click.native.stop
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getManagementList } from '@/api/account/management'

export default {
  name: 'Message',
  data() {
    return {
      value: null,
      loading: false,
      emailList: [],
      emailHostList: [
        { key: 'smtp.qq.com', label: 'QQ' },
        { key: 'smtp.163.com', label: '163' },
        { key: 'smtp.aliyun.com', label: '阿里云' },
        { key: 'smtp.larksuite.com', label: '飞书' },
        { key: 'smtp.gmail.com', label: '谷歌' },
        { key: 'smtp.sina.com.cn', label: '新浪' },
        { key: 'smtp.tom.com', label: 'Tom' },
        { key: 'smtp.126.com', label: '126' },
        { key: 'smtp.mail.yahoo.com', label: '雅虎' },
        { key: 'smtp.mail.yahoo.com.cn', label: '雅虎中国' },
        { key: 'smtp.sohu.com', label: '搜狐' }
      ],
      addForm: {
        emailForm: {
          host: null,
          sender: null,
          password: null,
          title: null,
          receivers: [],
          switch: false
        }
      },
      emailFormRules: {}
    }
  },
  created() {
  },
  methods: {
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
          this.emailList = items
        } finally {
          this.loading = false
        }
      } else {
        this.emailList = []
      }
    }
  }
}
</script>

<style scoped>

</style>

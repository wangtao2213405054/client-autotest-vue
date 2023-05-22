<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span style="float: left">
        <strong>邮件配置</strong>
        <span style="color: #909399; margin-left: 10px">Email</span>
      </span>
      <el-switch
        v-model="emailForm.status"
        style="float: right; padding: 3px 0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @click.native.stop
        @change="updateEmailSwitch"
      />
    </div>
    <el-form
      ref="emailFormRef"
      inline
      :model="emailForm"
      :rules="emailFormRules"
      label-width="80px"
      hide-required-asterisk
    >
      <el-form-item label="邮箱服务" style="width: 50%" prop="host">
        <el-select
          v-model="emailForm.host"
          filterable
          allow-create
          default-first-option
          placeholder="请选择SMTP服务器"
          style="width: 350px"
          clearable
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
      <el-form-item label="邮件标题" prop="title">
        <el-input v-model="emailForm.title" style="width: 350px" placeholder="请输入邮件标题" clearable />
      </el-form-item>
      <el-form-item label="发送人" style="width: 50%" prop="sender">
        <el-input v-model="emailForm.sender" style="width: 350px" autocomplete="new-password" placeholder="请输入发送人" clearable />
      </el-form-item>
      <el-form-item label="授权码" prop="password">
        <el-input v-model="emailForm.password" autocomplete="new-password" style="width: 350px" placeholder="请输入邮箱授权码" show-password clearable />
      </el-form-item>
      <el-form-item label="接收人" prop="receivers">
        <el-select
          v-model="emailForm.receivers"
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
      <el-button type="primary" @click="saveMessage">保 存</el-button>
      <el-button @click="resetForm">重 置</el-button>
    </div>
  </el-card>
</template>

<script>
import { getManagementList } from '@/api/account/management'
import { getEmailInfo, editEmailInfo, updateEmailSwitch } from '@/api/conf/message'

export default {
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
      emailForm: {
        id: null,
        host: null,
        sender: null,
        password: null,
        title: null,
        receivers: [],
        status: false,
        projectId: localStorage.getItem('projectId')
      },
      emailFormRules: {
        host: [
          { required: true, message: '请选择或输入SMTP邮箱服务器', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入邮件标题', trigger: 'change' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        sender: [
          { required: true, message: '请输入邮件发送人名称', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入邮箱服务器授权码', trigger: 'change' }
        ],
        receivers: [
          { required: true, message: '请输入或选择邮件接收人', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getEmailInfo()
  },
  mounted() {
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
    },
    // 获取邮件信息
    async getEmailInfo() {
      this.emailForm = await getEmailInfo({ projectId: localStorage.getItem('projectId') })
    },
    saveMessage() {
      this.$refs.emailFormRef.validate(async(valid) => {
        if (valid) {
          await editEmailInfo(this.emailForm)
          this.$message.success('保存成功')
          await this.getEmailInfo()
        }
      })
    },
    async updateEmailSwitch(bool) {
      if (this.emailForm.id) {
        await updateEmailSwitch({ status: bool, id: this.emailForm.id })
      } else {
        this.$message.warning('请先配置邮箱再使用开关')
        this.emailForm.status = false
      }
    },
    resetForm() {
      this.$refs.emailFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>

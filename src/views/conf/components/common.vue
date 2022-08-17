<template>
  <div>
    <el-form
      ref="robotFormRef"
      :model="robotForm"
      label-width="100px"
      hide-required-asterisk
    >
      <el-form-item
        v-for="(group, index) in robotForm.tokens"
        :key="group.key"
        :label="'群机器人' + (index + 1)"
        :prop="'tokens.' + index + '.token'"
        :rules="{
          required: true, message: 'Webhook 地址不能为空', trigger: 'blur'
        }"
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
        <el-radio-group v-model="robotForm.atAll" :disabled="disabled">
          <el-radio label="no" border>不@任何人</el-radio>
          <el-radio label="yes" border>@所有人</el-radio>
          <el-radio label="part" border>@指定人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="robotForm.atAll === 'part'"
      >
        <el-select
          v-model="robotForm.atMobile"
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
      <el-button plain type="success" @click="addToken">新增机器人</el-button>
      <el-button type="primary" @click="saveMessage">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { getManagementList } from '@/api/account/management'
import { editRobotInfo } from '@/api/conf/robot'

export default {
  props: {
    addForm: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mold: {
      type: String,
      default: 'talk'
    }
  },
  data() {
    return {
      robotForm: {},
      loading: false,
      userList: []
    }
  },
  created() {
    this.robotForm = this.addForm
  },
  methods: {
    addToken() {
      this.robotForm.tokens.push({
        token: null,
        sign: null,
        key: Date.now()
      })
    },
    removeToken(index) {
      if (this.robotForm.tokens.length > 1) {
        this.robotForm.tokens.splice(index, 1)
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
    },
    saveMessage() {
      this.$refs.robotFormRef.validate(async(valid) => {
        if (valid) {
          await editRobotInfo(this.robotForm)
          this.$message.success('保存成功')
          this.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

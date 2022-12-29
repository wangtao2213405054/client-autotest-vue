<template>
  <div>
    <collapseTransition>
      <el-form v-show="!hiddenArea" ref="requestForm" :model="requestForm" inline size="small" label-width="70px">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="requestForm.name" class="request-form" placeholder="输入用户名称查询" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="requestForm.mobile" class="request-form" placeholder="输入手机号查询" clearable />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="requestForm.state" class="request-form" placeholder="选择用户状态查询" clearable>
            <el-option
              v-for="item in stateList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="queryGetList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-waves icon="el-icon-refresh" @click="refreshQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </collapseTransition>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      @close="closeResetFields"
      @open="getRoleList"
    >
      <el-form
        ref="addFormRef"
        inline
        :model="addForm"
        :rules="addFormRules"
        hide-required-asterisk
        label-width="86px"
        size="small"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入用户名称" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入用户手机号" :maxlength="11" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入用户邮箱" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item v-if="!addForm.id" label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入用户密码" show-password style="width: 180px" clearable />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-cascader
            v-model="addForm.department"
            :options="classificationTree"
            placeholder="请选择所属部门"
            style="width: 180px"
            clearable
            :props="{ value: 'id', label: 'name' }"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择用户角色" style="width: 180px" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="addForm.id" label="状态" prop="state">
          <el-radio v-model="addForm.state" :label="true">在职</el-radio>
          <el-radio v-model="addForm.state" :label="false">离职</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editManagementInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-form inline size="mini">
      <el-form-item>
        <el-button v-waves icon="el-icon-plus" plain type="primary" :disabled="newDisabled" @click="newUserButton">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves icon="el-icon-edit" plain type="success" :disabled="updateDisabled" @click="updateUserInfo(selectionUserList[0])">修改</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves icon="el-icon-delete" plain type="danger" :disabled="deleteDisabled" @click="batchDelete">删除</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button v-waves icon="el-icon-refresh" circle plain type="primary" @click="getManagementList" />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="float: right">
        <el-tooltip effect="dark" :hide-after="1000" :content="hiddenArea ? '展示搜索框' : '收起搜索框'" placement="top">
          <el-button v-waves circle :icon="hiddenArea ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" plain type="info" @click="hiddenArea = !hiddenArea" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" :data="userList" style="width: 100%" header-row-class-name="table-header-style" size="small" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="编号" width="60px" align="center" />
      <el-table-column prop="name" label="用户名称" align="center" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" align="center" width="100px" />
      <el-table-column prop="state" label="状态" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row['state']" type="success" size="small">在职</el-tag>
          <el-tag v-else type="danger" size="small" effect="dark">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="updateUserInfo(scope.row)">修改</el-button>
          <el-button class="delete-button" icon="el-icon-delete" size="mini" type="text" @click="deleteManagementInfo([scope.row['id']])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-right"
      :current-page="requestForm.page"
      :page-size="requestForm.pageSize"
      background
      layout="total, prev, pager, next, jumper"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js'
import collapseTransition from '@/utils/collapseTransition'
import { sha1 } from '@/utils/sha1'
import { deleteManagementInfo, editManagementInfo, getManagementList } from '@/api/account/management'
import { getRoleList } from '@/api/permissions/role'

export default {
  name: 'Account',
  components: {
    collapseTransition
  },
  directives: {
    waves
  },
  props: {
    classificationTree: {
      type: Array,
      default: () => []
    },
    queryId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      requestForm: {
        id: null,
        name: null,
        state: null,
        mobile: null,
        page: 1,
        pageSize: 10,
        total: null
      },
      stateList: [
        { key: true, value: '在职' },
        { key: false, value: '离职' }
      ],
      userList: [],
      updateDisabled: true,
      deleteDisabled: true,
      newDisabled: false,
      hiddenArea: false,
      dialogVisible: false,
      title: '',
      addForm: {
        id: null,
        name: null,
        email: null,
        mobile: null,
        password: null,
        state: true,
        department: [],
        role: null,
        avatarUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      },
      addFormRules: {
        name: [{ required: true, message: '请输入正确的姓名', trigger: 'blur' }, { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入正确的手机号', trigger: 'blur' }, { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入正确的邮箱', trigger: 'blur' }, { min: 5, max: 60, message: '长度在 5 到 60 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入正确的密码', trigger: 'blur' }, { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'blur' }],
        department: [{ required: true, message: '请选择正确的所属部门', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色信息', trigger: 'blur' }]
      },
      roleList: [],
      tableLoading: false,
      selectionUserList: []
    }
  },
  created() {
    if (this.queryId) {
      this.requestForm.id = this.queryId
    }
    this.getManagementList()
  },
  methods: {
    // 新增按钮
    newUserButton() {
      this.title = '新增用户'
      this.dialogVisible = true
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getManagementList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 新增/修改用户
    editManagementInfo() {
      this.$refs.addFormRef.validate(async(valid) => {
        const addForm = JSON.parse(JSON.stringify(this.addForm))
        if (!addForm.id) {
          addForm.password = sha1(addForm.password)
        }
        if (valid) {
          await editManagementInfo(addForm)
          this.dialogVisible = false
          await this.getManagementList()
        }
      })
    },
    // 获取用户列表
    async getManagementList() {
      this.tableLoading = true
      try {
        const { items, total } = await getManagementList(this.requestForm)
        this.userList = items
        this.requestForm.total = total
      } finally {
        this.tableLoading = false
      }
    },
    // 数据查询
    queryGetList() {
      this.requestForm.page = 1
      this.getManagementList()
    },
    // 重置查询表单
    refreshQuery() {
      this.$refs.requestForm.resetFields()
      this.queryGetList()
    },
    // 重置提交表单
    closeResetFields() {
      this.addForm = {
        id: null,
        name: null,
        email: null,
        mobile: null,
        password: null,
        state: true,
        department: [],
        role: null,
        avatarUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 删除用户
    async deleteManagementInfo(userList) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteManagementInfo({ id: userList })
      await this.getManagementList()
    },
    // 选中的用户组
    handleSelectionChange(value) {
      this.selectionUserList = value
      this.updateDisabled = value.length !== 1 // 选中列表不为1时禁用此功能
      this.deleteDisabled = !value.length // 选中列表为空时禁用此功能
    },
    // 批量删除
    batchDelete() {
      const userList = []
      for (let i = 0; i < this.selectionUserList.length; i++) {
        userList.push(this.selectionUserList[i]['id'])
      }
      this.deleteManagementInfo(userList)
    },
    // 修改用户信息
    updateUserInfo(value) {
      this.addForm = JSON.parse(JSON.stringify(value))
      this.title = '修改用户'
      this.dialogVisible = true
    },
    // 获取角色列表
    async getRoleList() {
      const requestForm = {
        page: 1,
        pageSize: 9999
      }
      const { items } = await getRoleList(requestForm)
      this.roleList = items
    }
  }
}
</script>

<style lang="scss" scoped>
.request-form {
  width: 180px;
}
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
</style>

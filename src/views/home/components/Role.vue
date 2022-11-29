<template>
  <el-form ref="requestFormRef" :model="requestForm" inline size="small">
    <el-form-item label="角色名称">
      <el-input v-model="requestForm.name" placeholder="输入角色名称进行查询" clearable />
    </el-form-item>
    <el-form-item label="标识符">
      <el-input v-model="requestForm.identifier" placeholder="输入标识符进行查询" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="queryRoleList">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" plain @click="newButton">新增</el-button>
    </el-form-item>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="650px"
      @open="getPermissionsList"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" inline label-width="80px" size="small" hide-required-asterisk>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="addForm.identifier" placeholder="请输入标识符" clearable />
        </el-form-item>
        <el-form-item label="权限菜单" prop="permissionsApi">
          <div style="width: 465px">
            <el-checkbox v-model="expand">展开/折叠</el-checkbox>
            <el-checkbox v-model="checked" @change="checkedKeys">全选/全不选</el-checkbox>
            <el-checkbox v-model="strictly">父子联动</el-checkbox>

            <el-tree
              :key="expand"
              ref="tree"
              style="border-style: solid; border-color: #DCDFE6; border-width: 1px"
              :data="menuList"
              show-checkbox
              node-key="identifier"
              :render-after-expand="false"
              :props="defaultProps"
              :default-expand-all="expand"
              :check-strictly="!strictly"
              :default-checked-keys="addForm.permissionsApi"
              @check-change="handleCheckChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="roleList" style="width: 100%" size="small" header-row-class-name="table-header-style">
      <el-table-column type="index" label="编号" align="center" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="identifier" label="标识符" align="center" />
      <el-table-column prop="updateTime" label="修改时间" align="center" width="140px" />
      <el-table-column label="操作" align="center" width="140px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="updateButton(scope.row)">编辑</el-button>
          <el-button class="delete-button" type="text" size="mini" icon="el-icon-delete" @click="deleteRoleInfo(scope.row.id)">删除</el-button>
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
  </el-form>
</template>

<script>
import { getPermissionsList } from '@/api/permissions/menu'
import { deleteRoleInfo, editRoleInfo, getRoleList } from '@/api/permissions/role'

export default {
  data() {
    return {
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        name: '',
        identifier: ''
      },
      addForm: {
        id: null,
        name: '',
        identifier: '',
        permissionsApi: []
      },
      addFormRules: {
        name: [{ required: true, message: '请输入正确的角色名称', trigger: 'blur' }, { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
        identifier: [{ required: true, message: '请输入正确的标识符', trigger: 'blur' }, { min: 2, max: 512, message: '长度在 2 到 512 个字符', trigger: 'blur' }],
        permissionsApi: [{ required: true, message: '请选择相关权限', trigger: 'blur' }]
      },
      dialogVisible: false,
      title: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuList: [],
      roleList: [],
      strictly: false,
      expand: false,
      checked: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 新增按钮
    newButton() {
      this.title = '新增角色'
      this.dialogVisible = true
    },
    // 获取菜单列表
    async getPermissionsList() {
      this.menuList = await getPermissionsList({})
      this.checked = false
      this.strictly = false
      this.expand = false
    },
    // 新增/修改 角色信息
    editRoleInfo() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editRoleInfo(this.addForm)
          this.dialogVisible = false
          await this.getRoleList()
        }
      })
    },
    // tree 发生变化时的钩子
    handleCheckChange() {
      this.addForm.permissionsApi = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
    },
    // 获取角色列表
    async getRoleList() {
      const { items, total } = await getRoleList(this.requestForm)
      this.roleList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getRoleList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 查询角色列表
    queryRoleList() {
      this.requestForm.page = 1
      this.getRoleList()
    },
    // 更新按钮
    updateButton(value) {
      this.dialogVisible = true
      this.addForm = JSON.parse(JSON.stringify(value))
      this.title = '编辑角色'
      /**
       * 渲染完成后执行方法 一个小的知识点
       * this.$nextTick(() => {
       *   this.$refs.tree.setCheckedKeys(this.addForm.permissionsApi)
       * })
       */
    },
    // 关闭对话框的钩子
    closeDialog() {
      this.addForm = {
        id: null,
        name: '',
        identifier: '',
        permissionsApi: []
      }
      this.$refs.addFormRef.clearValidate()
      this.$refs.tree.setCheckedKeys([])
    },
    // 重置查询框
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.identifier = ''
      this.$refs.requestFormRef.resetFields()
    },
    // 删除角色信息
    async deleteRoleInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteRoleInfo({ id })
      await this.getRoleList()
    },
    // 递归获取tree 的所有 identifier
    getMenuNodeIdentifier(menuList) {
      const identifierList = []
      menuList.forEach(items => {
        identifierList.push(items['identifier'])
        if (items['children'].length) {
          this.getMenuNodeIdentifier(items['children']).forEach(item => {
            identifierList.push(item)
          })
        }
      })
      return identifierList
    },
    // 全选/全不选事件
    checkedKeys(value) {
      if (value) {
        this.$refs.tree.setCheckedKeys(this.getMenuNodeIdentifier(this.menuList))
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
</style>

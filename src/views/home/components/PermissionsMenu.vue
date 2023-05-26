<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="650px"
      @close="closeDialog"
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
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" style="width: 200px" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="addForm.identifier" style="width: 200px" placeholder="请输入标识符" clearable />
        </el-form-item>
        <el-form-item label="菜单类型">
          <div style="width: 200px">
            <el-radio v-model="addForm.menuType" label="menu">菜单</el-radio>
            <el-radio v-model="addForm.menuType" label="case">接口</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="所属位置">
          <div style="width: 200px">
            <el-radio v-model="addForm.belongType" label="home">首页</el-radio>
            <el-radio v-model="addForm.belongType" label="project">项目</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPermissionsInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestForm" :model="requestForm" size="small" inline>
      <el-form-item label="节点名称">
        <el-input v-model="requestForm.name" placeholder="输入节点名称进行过滤" clearable @keyup.enter.native="getPermissionsList" />
      </el-form-item>
      <el-form-item label="标识符">
        <el-input v-model="requestForm.identifier" placeholder="输入标识符进行过滤" clearable @keyup.enter.native="getPermissionsList" />
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="getPermissionsList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="primary" plain icon="el-icon-plus" @click="newButton">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="info" plain icon="el-icon-sort" @click="hiddenTable">展开/折叠</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-if="refreshTable"
      v-loading="MenuLoading"
      :data="menuList"
      style="width: 100%"
      row-key="id"
      :default-expand-all="hiddenArea"
      size="small"
      header-row-class-name="table-header-style"
    >
      <el-table-column type="index" label="编号" align="center" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column prop="identifier" label="标识符" align="center" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="修改时间" align="center" width="140px" />
      <el-table-column label="操作" align="center" width="180px">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="updateButton(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-plus" size="mini" @click="newNode(scope.row.id)">新增</el-button>
          <el-button class="delete-button" icon="el-icon-delete" type="text" size="mini" @click="deletePermissionsInfo(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deletePermissionsInfo, editPermissionsInfo, getPermissionsList } from '@/api/permissions/menu'
import waves from '@/directive/waves/index.js'

export default {
  name: 'Menu',
  directives: {
    waves
  },
  data() {
    return {
      menuList: [],
      dialogVisible: false,
      title: '',
      addForm: {
        id: null,
        name: null,
        identifier: null,
        nodeId: null,
        menuType: 'menu',
        belongType: 'home'
      },
      addFormRules: {
        name: [{ required: true, message: '请输入正确的菜单名称', trigger: 'blur' }, { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
        identifier: [{ required: true, message: '请输入正确的标识符', trigger: 'blur' }, { min: 2, max: 512, message: '长度在 2 到 512 个字符', trigger: 'blur' }]
      },
      hiddenArea: false,
      refreshTable: true,
      requestForm: {
        name: null,
        identifier: null
      },
      MenuLoading: true
    }
  },
  created() {
    this.getPermissionsList()
  },
  methods: {
    // 新增button
    newButton() {
      this.title = '新增菜单'
      this.dialogVisible = true
    },
    // 新增菜单
    editPermissionsInfo() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editPermissionsInfo(this.addForm)
          this.dialogVisible = false
          await this.getPermissionsList()
        }
      })
    },
    // 获取权限菜单
    async getPermissionsList() {
      this.MenuLoading = true
      this.menuList = await getPermissionsList(this.requestForm)
      this.MenuLoading = false
    },
    // 关闭钩子
    closeDialog() {
      this.addForm = {
        id: null,
        name: null,
        identifier: null,
        nodeId: null,
        menuType: 'menu',
        belongType: 'home'
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 新增子节点
    newNode(id) {
      this.title = '新增菜单'
      this.addForm.nodeId = id
      this.addForm.menuType = 'api'
      this.dialogVisible = true
    },
    // 删除节点
    async deletePermissionsInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deletePermissionsInfo({ id })
      await this.getPermissionsList()
    },
    // 修改按钮Button
    updateButton(value) {
      this.addForm = JSON.parse(JSON.stringify(value))
      this.title = '修改菜单'
      this.dialogVisible = true
    },
    // 展开/收起
    hiddenTable() {
      this.refreshTable = false
      this.$nextTick(() => {
        this.hiddenArea = !this.hiddenArea
        this.refreshTable = true
      })
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm = {
        name: null,
        identifier: null
      }
      this.getPermissionsList()
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

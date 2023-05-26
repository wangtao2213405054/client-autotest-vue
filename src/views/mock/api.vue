<template>
  <el-card v-loading="apiLoading">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item
          label="接口名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入接口名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item
          label="接口路径"
          prop="path"
          :rules="[
            { required: true, message: '请输入接口路径', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.path" placeholder="请输入接口路径" clearable />
        </el-form-item>
        <el-form-item
          label="返回结构"
          prop="body"
          :rules="[
            { required: true, message: '请输入返回结构', trigger: 'blur' },
            { validator: checkJson, trigger: 'blur' }
          ]"
        >
          <b-code-editor
            ref="editor"
            v-model="addForm.body"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入接口名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="requestForm.path" placeholder="输入接口路径查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryApiList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="apiList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="接口名称" width="200px" />
      <el-table-column prop="path" label="接口路径" />
      <el-table-column prop="createTime" label="更新时间" width="140px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateApi(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteApiInfo(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; margin-top: 15px"
      background
      :page-size="requestForm.pageSize"
      layout="total, prev, pager, next"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import { deleteApiInfo, editApiInfo, getApiList } from '@/api/mock/api'
const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  name: 'Api',
  data() {
    return {
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        name: null,
        path: null,
        projectId: projectId
      },
      title: '添加接口',
      dialogVisible: false,
      addForm: {
        name: null,
        path: null,
        body: '',
        projectId: projectId
      },
      apiList: [],
      checkJson: (rule, value, callback) => {
        try {
          if (JSON.parse(value.trim())) {
            callback()
          }
        } catch (e) {
          callback('请输入正确的JSON结构')
        }
      },
      apiLoading: true
    }
  },
  created() {
    this.getApiList()
  },
  methods: {
    // 查询
    queryApiList() {
      this.requestForm.page = 1
      this.getApiList()
    },
    // 重置
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.path = null
      this.$refs.requestFormRef.resetFields()
      this.queryApiList()
    },
    // 添加接口
    openDialog() {
      this.title = '添加接口'
      this.dialogVisible = true
    },
    // 关闭弹窗的钩子
    closeDialog() {
      this.addForm = {
        name: null,
        path: null,
        body: '',
        projectId: projectId
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editApiInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getApiList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getApiList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 删除接口
    async deleteApiInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteApiInfo({ id })
      await this.getApiList()
    },
    // 编辑接口
    updateApi(value) {
      this.title = '编辑接口'
      this.addForm = JSON.parse(JSON.stringify(value))
      this.addForm.body = JSON.stringify(JSON.parse(value.body), null, 2)
      this.addForm.projectId = projectId
      this.dialogVisible = true
    },
    // 获取接口列表
    async getApiList() {
      this.apiLoading = true
      const { items, total } = await getApiList(this.requestForm)
      this.apiList = items
      this.requestForm.total = total
      this.apiLoading = false
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

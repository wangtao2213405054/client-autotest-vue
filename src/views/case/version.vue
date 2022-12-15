<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item
          label="版本名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入版本名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入版本名称" clearable />
        </el-form-item>
        <el-form-item
          prop="identify"
          :rules="[
            { required: true, message: '请输入版本标识', trigger: 'blur'},
            { type: 'number', message: '版本标识必须为数字'}
          ]"
        >
          <span slot="label">
            版本标识
            <el-tooltip
              effect="dark"
              content="版本标识必须为数字, 推荐使用应用实际的版本标识，用于任务过滤。"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-input v-model.number="addForm.identify" placeholder="请输入版本标识" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="版本描述"
          prop="desc"
        >
          <el-input v-model="addForm.desc" placeholder="请输入版本描述" clearable type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入版本名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryVersionList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addVersion">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="versionList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="版本名称" width="150px" />
      <el-table-column prop="name" label="版本标识" width="150px">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="scope.row.effect" effect="dark">{{ scope.row.identify }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="版本描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="140px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateVersion(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteVersionInfo(scope.row.id)"
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
import { deleteVersionInfo, editVersionInfo, getVersionList } from '@/api/business/version'

const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  data() {
    return {
      addForm: {
        name: null,
        projectId: projectId,
        identify: null,
        desc: null
      },
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        projectId: projectId,
        name: null
      },
      title: '添加版本',
      dialogVisible: false,
      versionList: []
    }
  },
  created() {
    this.getVersionList()
  },
  methods: {
    // 查询版本信息
    queryVersionList() {
      this.requestForm.page = 1
      this.getVersionList()
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm.name = ''
      this.$refs.requestFormRef.resetFields()
      this.queryVersionList()
    },
    // 添加版本信息
    addVersion() {
      this.title = '添加版本'
      this.dialogVisible = true
    },
    // 关闭弹窗的事件
    closeDialog() {
      this.addForm = {
        name: null,
        projectId: projectId,
        identify: null,
        desc: null
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editVersionInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getVersionList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取版本列表
    async getVersionList() {
      const { items, total } = await getVersionList(this.requestForm)
      const effectList = ['success', 'info', 'warning', 'danger', null]
      items.forEach(item => {
        item.effect = effectList[Math.floor(Math.random() * effectList.length)]
      })
      this.versionList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getVersionList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 编辑版本
    updateVersion(row) {
      this.title = '编辑版本'
      this.addForm = JSON.parse(JSON.stringify(row))
      this.addForm.projectId = projectId
      this.dialogVisible = true
    },
    // 删除版本
    async deleteVersionInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteVersionInfo({ id })
      await this.getVersionList()
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

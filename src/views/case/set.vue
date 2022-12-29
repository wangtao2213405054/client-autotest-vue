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
          label="集合名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入集合名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入集合名称" clearable />
        </el-form-item>
        <el-form-item
          label="集合类型"
        >
          <el-switch
            v-model="addForm.special"
            active-text="特殊集合"
            inactive-text="普通集合"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item
          label="集合描述"
          prop="desc"
        >
          <el-input v-model="addForm.desc" placeholder="请输入集合描述" clearable type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入集合名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="requestForm.special"
          placeholder="选择集合类型查询"
          clearable
        >
          <el-option
            v-for="item in specialList"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="querySetList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addSet">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="setList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="集合名称" width="150px" />
      <el-table-column prop="name" label="集合类型" width="150px" align="center">
        <template v-slot="scope">
          <div
            v-for="item in specialList"
            :key="item.key"
          >
            <el-tag v-if="item.key === scope.row.special" :type="item.tag" disable-transitions effect="dark">{{ item.label }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="集合描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="140px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
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
            @click.stop="deleteSetInfo(scope.row.id)"
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
import { editSetInfo, getSetList, deleteSetInfo } from '@/api/business/set'

const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  data() {
    return {
      addForm: {
        name: null,
        projectId: projectId,
        special: false,
        desc: null,
        customSet: []
      },
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        projectId: projectId,
        name: null,
        special: null
      },
      title: '添加集合',
      dialogVisible: false,
      setList: [],
      specialList: [
        { key: false, label: '普通集合', tag: null },
        { key: true, label: '特殊集合', tag: 'success' }
      ]
    }
  },
  created() {
    this.getSetList()
  },
  methods: {
    // 查询集合信息
    querySetList() {
      this.requestForm.page = 1
      this.getSetList()
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.special = null
      this.$refs.requestFormRef.resetFields()
      this.querySetList()
    },
    // 添加版本信息
    addSet() {
      this.title = '添加集合'
      this.dialogVisible = true
    },
    // 关闭弹窗的事件
    closeDialog() {
      this.addForm = {
        name: null,
        projectId: projectId,
        special: false,
        desc: null,
        customSet: []
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editSetInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getSetList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取集合列表
    async getSetList() {
      const { items, total } = await getSetList(this.requestForm)
      this.setList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getSetList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 编辑集合
    updateVersion(row) {
      this.title = '编辑集合'
      this.addForm = JSON.parse(JSON.stringify(row))
      this.addForm.projectId = projectId
      this.dialogVisible = true
    },
    // 删除集合
    async deleteSetInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该集合, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteSetInfo({ id })
      await this.getSetList()
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

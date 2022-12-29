<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item
          label="通讯协议"
          prop="protocol"
          :rules="[
            { required: true, message: '请选择通讯协议', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.protocol"
            placeholder="请选择通讯协议"
            clearable
          >
            <el-option
              v-for="item in protocolList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="域名备注"
          prop="name"
          :rules="[
            { required: true, message: '请输入域名备注', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入域名备注" clearable />
        </el-form-item>
        <el-form-item
          label="域名信息"
          prop="domain"
          :rules="[
            { required: true, message: '请输入域名信息', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 256 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.domain" placeholder="请输入域名信息" clearable />
        </el-form-item>
        <el-form-item
          label="协议端口"
          prop="port"
          :rules="[
            { required: true, message: '请选择协议端口', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.port"
            placeholder="请选择通讯协议"
            clearable
            filterable
            allow-create
          >
            <el-option
              v-for="item in portList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入域名备注查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="requestForm.domain" placeholder="输入域名信息查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="requestForm.protocol"
          placeholder="选择通讯协议查询"
          clearable
        >
          <el-option
            v-for="item in protocolList"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryDomainList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="domainList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="域名备注" width="200px" />
      <el-table-column prop="protocol" label="通讯协议" width="120px">
        <template v-slot="scope">
          <div
            v-for="item in protocolList"
            :key="item.key"
          >
            <span v-if="scope.row.protocol === item.key"> {{ item.label }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="domain" label="域名信息" align="center" />
      <el-table-column prop="port" label="协议端口" width="120px" />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateDomain(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteDomainInfo(scope.row.id)"
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
import { deleteDomainInfo, editDomainInfo, getDomainList } from '@/api/mock/domain'
const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  name: 'Domain',
  data() {
    return {
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        name: null,
        protocol: null,
        domain: null,
        projectId: projectId
      },
      title: '添加域名',
      dialogVisible: false,
      addForm: {
        name: null,
        protocol: 'https',
        port: '443',
        domain: null,
        projectId: projectId
      },
      protocolList: [
        { label: 'HTTPS', key: 'https' },
        { label: 'HTTP', key: 'http' }
      ],
      portList: ['443', '80'],
      domainList: []
    }
  },
  created() {
    this.getDomainList()
  },
  methods: {
    // 查询
    queryDomainList() {
      this.requestForm.page = 1
      this.getDomainList()
    },
    // 重置
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.protocol = null
      this.requestForm.domain = null
      this.$refs.requestFormRef.resetFields()
      this.queryDomainList()
    },
    // 添加域名
    openDialog() {
      this.title = '添加域名'
      this.dialogVisible = true
    },
    // 关闭弹窗的钩子
    closeDialog() {
      this.addForm = {
        name: null,
        protocol: 'https',
        port: '443',
        domain: null,
        projectId: projectId
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editDomainInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getDomainList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getDomainList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 删除域名
    async deleteDomainInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该域名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteDomainInfo({ id })
      await this.getDomainList()
    },
    // 编辑域名
    updateDomain(value) {
      this.title = '编辑域名'
      this.addForm = JSON.parse(JSON.stringify(value))
      this.addForm.projectId = projectId
      this.dialogVisible = true
    },
    // 获取域名列表
    async getDomainList() {
      const { items, total } = await getDomainList(this.requestForm)
      this.domainList = items
      this.requestForm.total = total
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

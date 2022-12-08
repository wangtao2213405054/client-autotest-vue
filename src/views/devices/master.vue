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
          label="设备名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item
          label="所属角色"
          prop="role"
          :rules="[
            { required: true, message: '请选择角色信息', trigger: 'blur' }
          ]"
        >
          <el-select v-model="addForm.role" placeholder="请选择设备绑定的角色" clearable @visible-change="getRoleList">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="最大进程"
          prop="maxContext"
          :rules="[
            { required: true, message: '请输入此设备的最大进程数', trigger: 'blur' },
          ]"
        >
          <el-input-number v-model="addForm.maxContext" :min="1" :max="6" label="请输入最大进程数" />
        </el-form-item>
        <el-form-item
          label="所属项目"
          prop="projectId"
        >
          <el-select v-model="addForm.projectId" placeholder="请选择设备所属项目" clearable @visible-change="getProjectList">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addForm.token"
          label="设备令牌"
          prop="token"
        >
          <span>
            <el-input v-model="addForm.token" readonly disabled style="width: 80%" />
            <el-button style="margin-left: 10px" type="primary" plain @click.prevent="copyToken(addForm.token, $event)">复制</el-button>
          </span>
        </el-form-item>
        <el-form-item
          label="设备描述"
          prop="desc"
        >
          <el-input v-model="addForm.desc" placeholder="请输入设备描述" clearable type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item
          label="设备状态"
          prop="status"
        >
          <el-switch
            v-model="addForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
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
        <el-input v-model="requestForm.name" placeholder="输入设备名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.projectId" placeholder="选择项目进行查询" clearable @visible-change="getProjectList">
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.status" placeholder="选择状态进行查询" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryDeviceList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addDevice">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="masterList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="设备名称" width="150px" />
      <el-table-column label="角色信息" width="120px">
        <template slot-scope="scope">
          <div v-for="item in roleList" :key="item.id">
            <span v-if="scope.row.role === item.id"> {{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maxContext" label="最大进程" width="70px" align="center" />
      <el-table-column prop="context" label="已绑设备" width="70px" align="center" />
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip />
      <el-table-column prop="online" label="设备状态" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.online ? 'success' : 'info'">{{ scope.row.online ? '在线' : '离线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="240px" align="center">
        <template slot-scope="scope">
          <el-button
            :icon="scope.row.status ? 'el-icon-video-pause' : 'el-icon-video-play'"
            :class="scope.row.status ? 'yellow-button' : 'green_button'"
            size="mini"
            type="text"
            @click.stop="updateDeviceStatus(scope.row.id, scope.row.status)"
          >{{ scope.row.status ? '关闭' : '开启' }}</el-button>
          <el-button
            icon="el-icon-data-line"
            class="green_button"
            size="mini"
            type="text"
            @click.stop="toCharts(scope.row.id)"
          >性能</el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateDevice(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteDeviceInfo(scope.row.id)"
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
import { getRoleList } from '@/api/permissions/role'
import { getProjectList } from '@/api/business/project'
import {
  deleteMasterList,
  editMasterInfo,
  getMasterList,
  editMasterStatus,
  statusMasterRoom
} from '@/api/devices/master'
import clip from '@/utils/clipboard'

export default {
  name: 'Driver',
  data() {
    return {
      title: '新增设备',
      dialogVisible: false,
      addForm: {
        name: null,
        desc: null,
        role: null,
        maxContext: 4,
        projectId: null,
        status: true,
        token: null
      },
      roleList: [],
      projectList: [],
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        name: null,
        projectId: null,
        status: null
      },
      masterList: [],
      statusList: [
        { key: true, label: '启用' },
        { key: false, label: '禁用' }
      ]
    }
  },
  created() {
    this.getRoleList(true)
    this.getProjectList(true)
    this.getMasterList()
  },
  methods: {
    // 获取角色列表
    async getRoleList(value) {
      if (value) {
        const { items } = await getRoleList({ page: 1, pageSize: 9999 })
        this.roleList = items
      }
    },
    // 获取项目列表
    async getProjectList(value) {
      if (value) {
        const { items } = await getProjectList({ page: 1, pageSize: 9999 })
        this.projectList = items
      }
    },
    // 添加设备时的钩子
    addDevice() {
      this.title = '添加设备'
      this.dialogVisible = true
    },
    // 编辑设备信息时的钩子
    updateDevice(info) {
      this.addForm = JSON.parse(JSON.stringify(info))
      this.title = '编辑设备'
      this.dialogVisible = true
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editMasterInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getMasterList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取设备列表
    async getMasterList() {
      const { items, total } = await getMasterList(this.requestForm)
      this.masterList = items
      this.requestForm.total = total
    },
    // 关闭弹窗时的钩子
    closeDialog() {
      this.addForm = {
        name: null,
        desc: null,
        role: null,
        maxContext: 4,
        projectId: null,
        status: true,
        token: null
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 复制令牌
    copyToken(text, event) {
      clip(text, event)
    },
    // 删除设备
    async deleteDeviceInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteMasterList({ id })
      await this.getMasterList()
    },
    // 重置查询框
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.projectId = null
      this.requestForm.status = null
      this.$refs.requestFormRef.resetFields()
      this.queryDeviceList()
    },
    // 查询角色列表
    queryDeviceList() {
      this.requestForm.page = 1
      this.getMasterList()
    },
    // 修改设备当前状态
    async updateDeviceStatus(id, status) {
      const message = status ? '此操作将关闭此设备, 此设备将不会再执行任务（并不会关闭正在执行的任务）' : '此操作将开启此设备的任务轮训'
      const clickConfirmResult = await this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') return
      await editMasterStatus({ id, status: !status })
      await this.getMasterList()
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getMasterList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 进入性能监控页面
    async toCharts(id) {
      // this.$socket.open()
      const roomId = await statusMasterRoom({ id: id })
      this.$router.push({ name: 'DevicesProperty', params: { id: roomId.toString() }})
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

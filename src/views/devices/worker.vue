<template>
  <el-card v-loading="workerLoading">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
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
          label="归属设备"
          prop="platformName"
          :rules="[
            { required: true, message: '请选择归属设备', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.master"
            placeholder="请选择归属设备"
            clearable
            @visible-change="getMasterList"
          >
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.context >= item.maxContext"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备描述"
          prop="desc"
        >
          <el-input v-model="addForm.desc" placeholder="请输入设备描述" clearable type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item
          label="日志等级"
          prop="logging"
          :rules="[
            { required: true, message: '请选择日志等级', trigger: 'blur' }
          ]"
        >
          <el-select v-model="addForm.logging" placeholder="请选择日志等级" clearable>
            <el-option
              v-for="item in loggingList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="熔断阈值"
          prop="blocker"
          :rules="[
            { required: true, message: '请输入此设备的熔断阈值', trigger: 'blur' },
          ]"
        >
          <el-input-number v-model="addForm.blocker" :min="1" :max="10" label="请输入此设备的熔断阈值" />
        </el-form-item>
        <el-form-item
          label="设备状态"
          prop="status"
        >
          <el-switch
            v-model="addForm.switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item
          label="所属平台"
          prop="platformName"
          :rules="[
            { required: true, message: '请选择所属平台', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.platformName"
            placeholder="请选择所属平台"
            clearable
            @visible-change="getMappingList"
            @change="changePlatform($event, true)"
          >
            <el-option
              v-for="item in mappingList"
              :key="item.id"
              :label="item.name"
              :value="item.platformName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(mapping, index) in setMappingList"
          :key="mapping.key"
          :label="mapping.title"
          :prop="'mapping.' + index + '.value'"
          :rules="{required: true, message: mapping.param + '不能为空', trigger: 'blur'}"
        >
          <el-input
            v-if="mapping.type === 'input'"
            v-model="addForm.mapping[index].value"
            clearable
            :placeholder="mapping.docs"
          />
          <el-select
            v-else
            v-model="addForm.mapping[index].value"
            :placeholder="mapping.docs"
            clearable
          >
            <el-option
              v-for="item in mapping.source"
              :key="item.key"
              :label="item.label"
              :value="item.param"
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
        <el-input v-model="requestForm.name" placeholder="输入设备名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.master" placeholder="选择归属设备查询" clearable @visible-change="getMasterList">
          <el-option
            v-for="item in masterList"
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
    <el-table header-row-class-name="table-header-style" :data="workerList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="设备名称" width="150px" />
      <el-table-column prop="blocker" label="熔断阈值" width="70px" align="center" />
      <el-table-column label="绑定映射" width="120px" align="center">
        <template v-slot="scope">
          <div
            v-for="item in mappingList"
            :key="item.id"
          >
            <span v-if="scope.row.platformName === item.platformName">{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="归属设备" width="120px" align="center">
        <template v-slot="scope">
          <div
            v-for="item in masterList"
            :key="item.id"
          >
            <span v-if="scope.row.master === item.id">{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip />
      <el-table-column label="设备状态" width="120px" align="center">
        <template v-slot="scope">
          <div
            v-for="item in statusList"
            :key="item.key"
          >
            <el-popover :key="scope.row.cause" :content="scope.row.cause" :disabled="!scope.row.cause" placement="top" trigger="hover">
              <el-tag
                v-if="scope.row.status === item.key"
                slot="reference"
                :type="item.type"
                effect="dark"
                disable-transitions
              >
                {{ item.label }}
              </el-tag>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="180px" align="center">
        <template v-slot="scope">
          <el-button
            :icon="scope.row.switch ? 'el-icon-video-pause' : 'el-icon-video-play'"
            :class="scope.row.switch ? 'yellow-button' : 'green_button'"
            size="mini"
            type="text"
            @click.stop="updateDeviceStatus(scope.row.id, scope.row.switch, scope.row.status)"
          >{{ scope.row.switch ? '关闭' : '开启' }}</el-button>
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
            @click.stop="deleteDeviceInfo(scope.row.id, scope.row.master)"
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
import { getCapabilitiesList } from '@/api/devices/capabilities'
import { getMasterList } from '@/api/devices/master'
import { deleteWorkerInfo, editWorkerInfo, editWorkerSwitch, getWorkerList } from '@/api/devices/worker'
import { loggingInfo } from '@/utils/localType'

export default {
  data() {
    return {
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        master: null,
        name: null,
        status: null
      },
      dialogVisible: false,
      title: '添加设备',
      addForm: {
        name: null,
        platformName: null,
        master: null,
        desc: null,
        blocker: 3,
        mapping: [],
        switch: true,
        logging: 'INFO'
      },
      mappingList: [],
      setMappingList: [],
      masterList: [],
      workerList: [],
      statusList: [
        { type: 'success', label: '空闲', key: 0 },
        { type: '', label: '任务中', key: 1 },
        { type: 'danger', label: '异常', key: 2 },
        { type: 'info', label: '停止', key: 3 },
        { type: 'info', label: '离线', key: 4 }
      ],
      loggingList: loggingInfo,
      workerLoading: true
    }
  },
  created() {
    this.getMasterList()
    this.getMappingList()
    this.getWorkerList()
  },
  methods: {
    // 关闭弹窗钩子
    closeDialog() {
      this.setMappingList = [] // 关闭弹窗时将 mapping 清空
      this.addForm = {
        name: null,
        platformName: null,
        master: null,
        desc: null,
        blocker: 3,
        mapping: [],
        switch: true,
        logging: 'INFO'
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 添加设备
    addDevice() {
      this.title = '添加设备'
      this.dialogVisible = true
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editWorkerInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getWorkerList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取映射列表
    async getMappingList() {
      const { items } = await getCapabilitiesList({ page: 1, pageSize: 9999 })
      this.mappingList = items
    },
    // 所属平台变化时的钩子
    changePlatform(value, model) {
      this.mappingList.forEach(data => {
        if (data.platformName === value) {
          const { mapping } = data
          this.setMappingList = mapping
          if (model) {
            this.addForm.mapping = []
            for (let i = 0; i < mapping.length; i++) {
              this.addForm.mapping.push({
                param: mapping[i]['param'],
                value: mapping[i]['default'] ? mapping[i]['default'] : null,
                type: mapping[i]['dataType'],
                key: mapping[i]['key']
              })
            }
          }
        }
      })
    },
    // 获取控制设备列表
    async getMasterList() {
      const { items } = await getMasterList({ page: 1, pageSize: 9999 })
      this.masterList = items
    },
    // 获取执行设备列表
    async getWorkerList() {
      this.workerLoading = true
      const { items, total } = await getWorkerList(this.requestForm)
      this.workerList = items
      this.requestForm.total = total
      this.workerLoading = false
    },
    // 编辑设备
    updateDevice(value) {
      this.title = '编辑设备'
      this.addForm = JSON.parse(JSON.stringify(value))
      this.changePlatform(value.platformName, false)
      this.dialogVisible = true
    },
    // 删除设备
    async deleteDeviceInfo(id, master) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteWorkerInfo({ id, master })
      await this.getWorkerList()
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getWorkerList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 重置查询框
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.master = null
      this.requestForm.status = null
      this.$refs.requestFormRef.resetFields()
      this.queryDeviceList()
    },
    // 查询角色列表
    queryDeviceList() {
      this.requestForm.page = 1
      this.getWorkerList()
    },
    // 修改设备状态
    async updateDeviceStatus(id, status, online) {
      const message = status ? '此操作将停止此设备, 此设备将不会再执行任务' : '此操作将开启此设备的任务进程'
      const clickConfirmResult = await this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: status && (online !== 4 && online === 1) ? '关闭进程' : '取消',
        type: 'warning',
        distinguishCancelAndClose: true
      }).catch(err => err)
      if (status && clickConfirmResult === 'close') return
      if (clickConfirmResult !== 'confirm' && !status) return
      if ((online !== 4 && online !== 1) && clickConfirmResult !== 'confirm') return
      await editWorkerSwitch({ id, switch: !status, kill: clickConfirmResult === 'cancel' })
      await this.getWorkerList()
    }
  },
  sockets: {
    // 更新当前设备离线状态
    masterOnline(data) {
      this.workerList.forEach(item => {
        if (item.master === data.id) {
          item.status = data.online ? 0 : 4
        }
      })
    },
    // 更新执行设备的状态
    workerStatus(data) {
      this.workerList.forEach(item => {
        if (item.id === data.id) {
          item.status = data.status
          item.cause = data.cause
        }
      })
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

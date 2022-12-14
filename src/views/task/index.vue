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
          label="任务名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item
          label="所属平台"
          prop="platform"
          :rules="[
            { required: true, message: '请选择平台信息', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.platform"
            placeholder="请选择任务的所属平台"
            clearable
            style="width: 100%"
            @change="platformChange"
          >
            <el-option
              v-for="item in platformList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addForm.platform"
          :key="addForm.platform"
          label="指定设备"
        >
          <el-cascader
            v-model="addForm.devices"
            :props="loadDevice"
            clearable
            style="width: 100%"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item
          label="运行版本"
          prop="version"
          :rules="[
            { required: true, message: '请输入运行版本', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.version" placeholder="请输入运行版本" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addTask">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="taskList" stripe style="width: 100%" @row-click="toReport">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="设备名称" width="150px" />
      <el-table-column prop="name" label="任务状态" width="150px">
        <template slot-scope="scope">
          <div
            v-for="item in taskStatusList"
            :key="item.status"
          >
            <span v-if="scope.row.status === item.status">{{ item.label }}</span>
          </div>
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
import { getMasterList } from '@/api/devices/master'
import { getWorkerList } from '@/api/devices/worker'
import { getTaskList, newTaskInfo } from '@/api/task/center'
let platformSelect = ''
const projectId = JSON.parse(localStorage.getItem('projectId'))
const mold = localStorage.getItem('mold')
export default {
  name: 'Index',
  data() {
    return {
      addForm: {
        name: null,
        platform: null,
        projectId: projectId,
        version: null,
        devices: null
      },
      dialogVisible: false,
      title: '添加任务',
      platformList: [],
      masterList: [],
      loadDevice: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          if (level === 0) {
            const { items } = await getMasterList({ page: 1, pageSize: 9999 })
            items.forEach(item => {
              item.leaf = !item.context
              item.disabled = item.projectId !== null && item.projectId !== projectId || !item.context
            })
            resolve(items)
          } else {
            const { items } = await getWorkerList({ page: 1, pageSize: 9999, master: node.value })
            items.forEach(item => {
              item.disabled = platformSelect !== item.platformName
              item.leaf = true
            })
            resolve(items)
          }
        },
        value: 'id',
        label: 'name'
      },
      taskList: [],
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null
      },
      taskStatusList: [
        { status: 0, label: '等待执行' },
        { status: 1, label: '执行中' },
        { status: 2, label: '执行成功' },
        { status: 3, label: '执行失败' }
      ]
    }
  },
  watch: {
    'addForm.platform'() {
      this.addForm.devices = null
    }
  },
  created() {
    this.filterPlatform()
    this.getTaskList()
  },
  methods: {
    // 添加任务钩子
    addTask() {
      this.title = '添加任务'
      this.dialogVisible = true
    },
    // 关闭弹窗钩子
    closeDialog() {},
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await newTaskInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          // await this.getWorkerList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 根据项目过滤所属平台
    filterPlatform() {
      const platform = [
        { id: 'web', mold: 'selenium', name: 'Web' },
        { id: 'android', mold: 'appium', name: 'Android' },
        { id: 'ios', mold: 'appium', name: 'iOS' }
      ]
      // 根据项目过滤
      this.platformList = platform.filter(item => {
        return mold === item.mold
      })
      // 如果只有一个平台则默认选中
      if (this.platformList.length === 1) {
        this.addForm.platform = this.platformList[0].id
      }
    },
    // 获取控制设备列表
    async getMasterList() {
      const { items } = await getMasterList({ page: 1, pageSize: 9999 })
      return items
    },
    // 选择器发生变化
    platformChange(value) {
      platformSelect = value
    },
    // 获取任务列表列表
    async getTaskList() {
      const { items, total } = await getTaskList(this.requestForm)
      this.taskList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getTaskList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 进入测试报告页面
    toReport(row) {
      this.$router.push({ name: 'TaskReport', params: { id: row.id }})
    }
  }
}
</script>

<style scoped>

</style>

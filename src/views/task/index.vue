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
            :clearable="platformList.length !== 1"
            style="width: 100%"
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
          label="运行环境"
          prop="environmental"
          :rules="[
            { required: true, message: '请选择本次任务的运行环境', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.environmental"
            placeholder="请选择本次任务的运行环境"
            clearable
            style="width: 100%"
            @visible-change="getDomainList"
          >
            <el-option
              v-for="item in domainList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addForm.platform"
          :label="urlName"
          prop="url"
          :rules="[
            { required: true, message: urlMessage, trigger: 'blur' }
          ]"
        >
          <span slot="label">
            {{ urlName }}
            <el-tooltip
              effect="dark"
              trigger="click"
              :content="urlContent"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-input v-model="addForm.url" :placeholder="urlMessage" clearable />
        </el-form-item>
        <el-form-item
          v-if="addForm.platform"
          label="指定设备"
        >
          <span slot="label">
            指定设备
            <el-tooltip
              effect="dark"
              trigger="click"
              content="通过此选项可以将任务分发到指定的设备进行执行, 不指定设备则空闲设备进行执行"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-cascader
            v-model="addForm.devices"
            :props="loadDevice"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="运行版本"
        >
          <span slot="label">
            运行版本
            <el-tooltip
              effect="dark"
              trigger="click"
              content="不选择运行版本时, 将加载全部的测试用例, 选择运行版本后将通过版本过滤出要执行的测试用例"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-select
            v-model="addForm.version"
            placeholder="请选择本次任务的版本信息"
            clearable
            style="width: 100%"
            @visible-change="getVersionList"
          >
            <el-option
              v-for="item in versionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="运行集合"
        >
          <span slot="label">
            运行集合
            <el-tooltip
              effect="dark"
              trigger="click"
              content="不选择运行集合时加载本项目的全部用例, 当选择测试集合后将只执行已选择的测试集合中的用例. ps: 可多选"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-select
            v-model="addForm.set"
            placeholder="请选择本次任务要运行的集合"
            clearable
            multiple
            style="width: 100%"
            @visible-change="getSetList"
          >
            <el-option
              v-for="item in setList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="执行顺序"
        >
          <span slot="label">
            执行顺序
            <el-tooltip
              effect="dark"
              trigger="click"
              content="当不选择执行顺序时以默认排序加载用例, 当选择执行顺序后将以选择的条件对测试用例进行排序然后执行"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-select
            v-model="addForm.priority"
            placeholder="请选择本次任务优先级的执行顺序"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in priorityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
        <template v-slot="scope">
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
import { platform } from '@/utils/localType'
import { getVersionList } from '@/api/business/version'
import { getSetList } from '@/api/business/set'
import { getDomainList } from '@/api/mock/domain'
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
        devices: null,
        url: null,
        set: [],
        priority: null,
        environmental: null
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
      ],
      versionList: [],
      urlName: '',
      urlMessage: '',
      urlContent: '',
      setList: [],
      priorityList: [
        { id: 'highest', name: '由高到低' },
        { id: 'lowest', name: '由低到高' }
      ],
      domainList: []
    }
  },
  watch: {
    'addForm.platform'(newData) {
      this.addForm.devices = null
      platformSelect = newData
      this.urlContent = mold === 'selenium' ? '' +
        '执行域名即为要执行测试的域名地址信息, 如本项目为测试百度则执行域名为: https://www.baidu.com' : '' +
        '请输入本次执行任务的安装包下载地址, 以 ' + (newData === 'ios' ? '.plist' : '.apk') + ' 结束'
    }
  },
  created() {
    this.urlName = mold === 'selenium' ? '执行域名' : '下载链接'
    this.urlMessage = mold === 'selenium' ? '请输入本次任务启动执行的域名地址信息' : '请输入本次运行的安装包下载链接'
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
    },
    // 获取版本列表
    async getVersionList(bool) {
      if (!bool) return
      const { items } = await getVersionList({ page: 1, pageSize: 9999, projectId })
      this.versionList = items
    },
    // 获取集合列表
    async getSetList() {
      const { items } = await getSetList({ page: 1, pageSize: 9999, projectId })
      this.setList = items
    },
    // 获取域名列表
    async getDomainList() {
      const { items } = await getDomainList({ page: 1, pageSize: 9999, projectId })
      this.domainList = items
    }
  }
}
</script>

<style scoped>

</style>

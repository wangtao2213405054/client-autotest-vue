<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
      @open="filterPlatform"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="urlRules" label-width="100px">
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
            placeholder="请选择要指定的执行设备"
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
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入任务名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.status" placeholder="选择任务状态查询" clearable>
          <el-option
            v-for="item in taskStatusList"
            :key="item.status"
            :class="item.color"
            :label="item.label"
            :value="item.status"
          >
            <span style="font-size: 13px">{{ item.label }}</span>
            <span style="float: right; color: #8492a6"><i :class="item.icon" /></span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="requestForm.environmental"
          placeholder="选择运行环境查询"
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
      <el-form-item>
        <el-select
          v-if="platformList.length > 1"
          v-model="requestForm.platform"
          placeholder="选择所属平台查询"
          clearable
        >
          <el-option
            v-for="item in platformList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryTaskList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addTask">添 加</el-button>
      </el-form-item>
    </el-form>
    <div class="user-activity">
      <div v-for="item in taskList" :key="item.id">
        <div :class="item.color">
          <div class="post" @click="toReport(item)">
            <div class="user-block">
              <img class="img-circle" alt="" :src="item.avatar + avatarPrefix">
              <span class="username text-muted">{{ item['name'] }}</span>
              <span
                v-for="status in taskStatusList"
                :key="status.status"
                class="mold"
              >
                <el-tag v-if="item.status === status.status" :disable-transitions="true" :type="status.type" effect="dark">
                  <i :class="status.icon" />
                  {{ status.label }}
                </el-tag>
              </span>
              <span class="description">
                {{ item['username'] + ' 创建于 ' + item['createTime'] }}
              </span>
            </div>
            <p>
              {{ item['describe'] }}
            </p>
            <el-row :gutter="20">
              <el-col :span="22">
                <el-descriptions :column="5" :label-style="{'font-weight': 'bold'}">
                  <el-descriptions-item label="所属平台">
                    <div
                      v-for="items in platformList"
                      :key="items.id"
                    >
                      <span v-if="items.id === item.platform">{{ items.name }}</span>
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="运行环境">{{ item['environmentalName'] }}</el-descriptions-item>
                  <el-descriptions-item :label="item.status === 0 ? '指定设备' : '执行设备'">{{ item['devicesName'] ? item['devicesName'] : '暂无' }}</el-descriptions-item>
                  <el-descriptions-item label="用例数量">{{ item['count'] }}</el-descriptions-item>
                  <el-descriptions-item :label="urlName">
                    <tooltips :value="item.url" />
                  </el-descriptions-item>
                  <el-descriptions-item label="成功用例">{{ item['passCase'] }}</el-descriptions-item>
                  <el-descriptions-item label="失败用例">{{ item['failCase'] }}</el-descriptions-item>
                  <el-descriptions-item v-if="item.status === 1" label="测试进度">
                    <el-progress style="width: 100%" :percentage="item['percentage']" :color="item['percentageColor']" />
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="item.status < 2"
                  type="text"
                  icon="el-icon-video-pause"
                  class="delete-button"
                  @click.native.stop="pauseTaskInfo(item.id)"
                >
                  终止
                </el-button>
              </el-col>
            </el-row>
            <div class="card__arrow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15">
                <path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-if="!taskList.length" description="暂无任务，快来添加一个吧~" />
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
import { getTaskList, newTaskInfo, pauseTaskInfo } from '@/api/task/center'
import { platform } from '@/utils/localType'
import { getVersionList } from '@/api/business/version'
import { getSetList } from '@/api/business/set'
import { getDomainList } from '@/api/mock/domain'
import tooltips from '@/views/common/tooltips'
let platformSelect = ''
const avatarPrefix = '?imageView2/1/w/80/h/80'
const projectId = JSON.parse(localStorage.getItem('projectId'))
const mold = localStorage.getItem('mold')
const _color = {
  0: 'warning',
  1: 'brand',
  2: 'success',
  3: 'danger',
  4: 'info'
}
export default {
  name: 'Index',
  components: {
    tooltips
  },
  data() {
    // 验证链接格式
    const validateUrl = (rule, value, callback) => {
      const re = /^(http|https|ftp|file|rtmp|rtsp):\/\/([a-zA-Z0-9-_])/
      if (!re.test(value)) {
        callback(new Error(mold === 'selenium' ? '请输入本次任务启动执行的域名地址信息' : '请输入本次运行的安装包下载链接'))
      } else {
        callback()
      }
    }
    return {
      urlRules: {
        url: [
          { required: true, trigger: 'blur', validator: validateUrl }
        ]
      },
      avatarPrefix,
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
        total: null,
        projectId,
        name: null,
        worker: null,
        status: null,
        environmental: null,
        platform: null
      },
      taskStatusList: [
        { status: 0, label: '等待执行', type: 'warning', icon: 'el-icon-time', color: 'warning' },
        { status: 1, label: '正在执行', type: '', icon: 'el-icon-loading', color: 'brand' },
        { status: 2, label: '执行成功', type: 'success', icon: 'el-icon-circle-check', color: 'success' },
        { status: 3, label: '执行失败', type: 'danger', icon: 'el-icon-circle-close', color: 'danger' },
        { status: 4, label: '执行终止', type: 'info', icon: 'el-icon-remove-outline', color: 'info' }
      ],
      versionList: [],
      urlName: '',
      urlMessage: '',
      urlContent: '',
      setList: [],
      priorityList: [
        { id: false, name: '由高到低' },
        { id: true, name: '由低到高' }
      ],
      domainList: [],
      avatarList: [
        require('@/icons/png/mouse.png'), require('@/icons/png/ox.png'), require('@/icons/png/tiger.png'),
        require('@/icons/png/rabbit.png'), require('@/icons/png/dragon.png'), require('@/icons/png/snake.png'),
        require('@/icons/png/horse.png'), require('@/icons/png/sheep.png'), require('@/icons/png/monkey.png'),
        require('@/icons/png/chicken.png'), require('@/icons/png/dog.png'), require('@/icons/png/pig.png')
      ]
    }
  },
  sockets: {
    // 更新页面状态
    taskStatus(data) {
      this.taskList.forEach(item => {
        if (item.id === data.taskId) {
          item.status = data.status
          item.color = _color[item.status]
          item.devicesName = data.devicesName
        }
      })
    },
    // 更新任务运行信息
    taskRunningStatus(data) {
      this.taskList.forEach(item => {
        if (item.id === data.id) {
          item.passCase = data.pass
          item.failCase = data.fail
          item.percentage = data.percentage
          item.percentageColor = this.getColor(data.percentage)
        }
      })
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
    this.urlName = mold === 'selenium' ? '启动链接' : '下载链接'
    this.urlMessage = mold === 'selenium' ? '请输入本次任务启动执行的域名地址信息' : '请输入本次运行的安装包下载链接'
    this.filterPlatform()
    this.getTaskList()
    this.getDomainList()
  },
  methods: {
    // 添加任务钩子
    addTask() {
      this.title = '添加任务'
      this.dialogVisible = true
    },
    // 关闭弹窗钩子
    closeDialog() {
      this.addForm = {
        name: null,
        platform: null,
        projectId: projectId,
        version: null,
        devices: null,
        url: null,
        set: [],
        priority: null,
        environmental: null
      }
      this.$refs.addFormRef.clearValidate()
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await newTaskInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getTaskList()
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
      items.forEach(item => {
        item.avatar = this.avatarList[Math.floor(Math.random() * this.avatarList.length)]
        item.color = _color[item.status]
        item.percentageColor = this.getColor(item.percentage)
      })
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
    toReport(item) {
      const { id, status } = item
      if (status === 0) return
      this.$router.push({ name: 'TaskReport', params: { id }})
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
    },
    // 获取百分比颜色
    getColor(percentage) {
      //  < 20% #909399  <40% #F56C6C < 60% #E6A23C < 80% #409EFF < 100% #67C23A
      if (percentage <= 20) {
        return '#909399'
      } else if (percentage <= 40) {
        return '#F56C6C'
      } else if (percentage <= 60) {
        return '#E6A23C'
      } else if (percentage <= 80) {
        return '#409EFF'
      } else return '#67C23A'
    },
    // 终止任务进程
    async pauseTaskInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将停止运行该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消')
      }
      await pauseTaskInfo({ id })
      await this.getTaskList()
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.environmental = null
      this.requestForm.platform = null
      this.requestForm.status = null
      this.requestForm.worker = null
      this.$refs.requestFormRef.resetFields()
      this.getTaskList()
    },
    // 查询任务信息
    queryTaskList() {
      this.requestForm.page = 1
      this.getTaskList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions__body .el-descriptions__table {
  white-space: nowrap;
}
::v-deep .el-descriptions-item__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}

.warning {
  background-color: rgba(230, 162, 60, 0.1);
}
.brand {
  background-color: rgba(64, 158, 255, 0.1)
}
.success {
  background-color: rgba(103, 194, 58, 0.1);
}
.danger {
  background-color: rgba(245, 108, 108, 0.1);
}
.info {
  background-color: rgba(144, 147, 153, 0.1);
}
::v-deep .el-descriptions__body {
  background-color: rgba(245, 108, 108, 0);
}
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }
    .mold {
      display: block;
      float: right;
      margin-right: 10px;
      align-items: center;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 5px;
    //padding-bottom: 15px;
    color: #666;
    --border-radius: 0.75rem;
    --primary-color: #409EFF;
    padding: 1rem;
    border-radius: var(--border-radius);
    position: relative;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.post > * + * {
  margin-top: 1.1em;
}

.post .card__arrow {
  position: absolute;
  background: var(--primary-color);
  padding: 0.4rem;
  border-top-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  bottom: 0;
  right: 0;
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post svg {
  transition: 0.2s;
}

.post:hover .card__arrow {
  background: #67C23A;
}

.post:hover .card__arrow svg {
  transform: translateX(3px);
}
</style>

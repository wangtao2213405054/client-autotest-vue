<template>
  <el-card>
    <div>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-descriptions class="margin-top" title="任务信息" :column="2" border>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-s-flag" />
                任务名称
              </template>
              {{ taskInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone" />
                执行环境
              </template>
              {{ taskInfo['environmentalName'] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline" />
                执行设备
              </template>
              {{ taskInfo['devicesName'] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets" />
                执行平台
              </template>
              <div
                v-for="item in platformList"
                :key="item.id"
              >
                <span v-if="taskInfo['platform'] === item.id">{{ item.name }}</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-discover" />
                任务状态
              </template>
              <span
                v-for="status in taskStatusList"
                :key="status.status"
                class="mold"
              >
                <el-tag v-if="taskInfo.status === status.status" :disable-transitions="true" :type="status.type" effect="dark">
                  <i :class="status.icon" />
                  {{ status.label }}
                </el-tag>
              </span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-coin" />
                用例总数
              </template>
              {{ taskInfo['count'] }}
            </el-descriptions-item>
            <el-descriptions-item :content-style="{'background': '#E1F3D8'}">
              <template slot="label">
                <i class="el-icon-success" />
                成功数
              </template>
              {{ taskInfo['passCase'] }}
            </el-descriptions-item>
            <el-descriptions-item :content-style="{'background': '#FDE2E2'}">
              <template slot="label">
                <i class="el-icon-error" />
                失败数
              </template>
              {{ taskInfo['failCase'] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-timer" />
                开始时间
              </template>
              {{ taskInfo['startTime'] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="taskInfo['endTime']">
              <template slot="label">
                <i class="el-icon-time" />
                结束时间
              </template>
              {{ taskInfo['endTime'] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="taskInfo['concurrent']">
              <template slot="label">
                <i class="el-icon-unlock" />
                进程数量
              </template>
              {{ taskInfo['processes'] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user-solid" />
                创建人
              </template>
              {{ taskInfo['username'] }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="8">
          <div id="diagram" class="container" />
        </el-col>
      </el-row>
      <el-descriptions style="margin-top: 20px" :colon="false">
        <el-descriptions-item>
          <template slot="label">
            <span style="font-size: 16px; font-weight: bold; color: #303133">执行进度:</span>
          </template>
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            style="width: 100%"
            :percentage="taskInfo['percentage']"
            :color="taskInfo['percentageColor']"
          />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-table
      header-row-class-name="table-header-style"
      :data="reportList"
      style="width: 100%; margin-top: 20px"
      @row-click="openDrawer"
    >
      <el-table-column prop="caseId" label="编号" width="80px" align="center" />
      <el-table-column prop="name" label="用例名称" width="300px" show-overflow-tooltip />
      <el-table-column prop="priority" label="优先级" width="80px" align="center" />
      <el-table-column prop="module" label="所属模块" width="150px" align="center" show-overflow-tooltip />
      <el-table-column prop="details" label="用例描述" show-overflow-tooltip />
      <el-table-column prop="duration" label="执行时长" width="80px" align="center">
        <template v-slot="scope">
          {{ scope.row.duration }} 秒
        </template>
      </el-table-column>
      <el-table-column prop="status" label="执行结果" width="80px" align="center">
        <template v-slot="scope">
          <div
            v-for="item in statusList"
            :key="item.id"
          >
            <el-tag
              v-if="scope.row.status === item.id"
              :type="item.type"
              effect="dark"
              disable-transitions
            >
              {{ item.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="用例详情"
      :visible.sync="drawer"
      :with-header="false"
      size="70%"
    >
      <div :key="caseInfo.id" style="padding: 10px">
        <span class="case-font-size">用例信息</span>
        <el-descriptions border style="margin-top: 10px" direction="vertical" size="medium" :column="4">
          <el-descriptions-item label="用例编号">{{ caseInfo['caseId'] }}</el-descriptions-item>
          <el-descriptions-item label="用例名称">{{ caseInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <div
              v-for="item in priorityList"
              :key="item.id"
            >
              <el-tag
                v-if="item.name === caseInfo.priority"
                :type="item.type"
                effect="dark"
              >
                {{ caseInfo.priority }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="所属模块">{{ caseInfo.module }}</el-descriptions-item>
          <el-descriptions-item label="执行结果">
            <div
              v-for="item in statusList"
              :key="item.id"
            >
              <el-tag
                v-if="item.id === caseInfo.status"
                size="small"
                :type="item.type"
                effect="dark"
                disable-transitions
              >
                {{ item.name }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ caseInfo['startTime'] }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ caseInfo['stopTime'] }}</el-descriptions-item>
          <el-descriptions-item label="执行时长">{{ caseInfo.duration }} 秒</el-descriptions-item>
          <el-descriptions-item label="所属集合">
            <el-tag
              v-for="item in caseInfo['setList']"
              :key="item"
              style="margin-right: 6px"
              size="small"
              effect="dark"
            >
              {{ item }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用例描述">{{ caseInfo.details }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="caseInfo.output">
          <el-divider />
          <span class="case-font-size">执行日志</span>
          <code-read
            style="margin-top: 10px"
            old-string=""
            :new-string="caseInfo.output"
            output-format="line-by-line"
            :context="10"
            file-name="logging"
          />
        </div>
        <div v-if="caseInfo.gif">
          <el-divider />
          <div class="case-font-size">执行步骤</div>
          <el-image
            class="borderDiv"
            :src="caseInfo.gif"
            :preview-src-list="[caseInfo.gif]"
            style="width: 100%; height: 350px"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div v-if="caseInfo['errorStep']">
          <el-divider />
          <span class="case-font-size">错误步骤</span>
          <div>
            <el-tag
              effect="plain"
              size="medium"
              type="danger"
              style="margin-top: 10px"
            >
              {{ caseInfo['errorStep'] }}
            </el-tag>
          </div>
        </div>
        <div v-if="caseInfo.images.length >= 1">
          <el-divider />
          <div class="case-font-size">用例截图</div>
          <el-image
            class="borderDiv"
            style="width: 100%; height: 350px"
            :src="caseInfo.images[0]"
            :preview-src-list="caseInfo.images"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div v-if="caseInfo['errorInfo']">
          <el-divider />
          <span class="case-font-size">错误信息</span>
          <code-read
            style="margin-top: 10px"
            :old-string="caseInfo['errorInfo']"
            new-string=""
            output-format="line-by-line"
            :context="10"
            file-name="logging"
          />
        </div>
        <div v-if="caseInfo['errorDetails']">
          <el-divider />
          <span class="case-font-size">详细错误</span>
          <code-read
            style="margin-top: 10px"
            :old-string="caseInfo['errorDetails']"
            new-string=""
            output-format="line-by-line"
            :context="10"
            file-name="logging"
          />
        </div>
      </div>
    </el-drawer>
    <el-pagination
      style="text-align: right; margin-top: 15px"
      background
      :page-size="requestForm.size"
      layout="total, sizes, prev, pager, next"
      :total="requestForm.total"
      :page-sizes="[20, 50, 100, 500]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script>
import { getReportList } from '@/api/task/report'
import { getTaskInfo } from '@/api/task/center'
import { runCaseStatusList, priority, taskStatus, platform, getColor } from '@/utils/localType'
import CodeRead from 'vue-code-diff'
import echarts from 'echarts'
export default {
  components: {
    CodeRead
  },
  data() {
    return {
      reportList: [],
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        taskId: JSON.parse(this.$route.params.id)
      },
      roomId: null,
      taskInfo: {},
      statusList: runCaseStatusList,
      drawer: false,
      caseInfo: {
        id: 0,
        images: []
      },
      priorityList: priority,
      chart: null,
      taskStatusList: taskStatus,
      platformList: platform,
      chartInfo: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '0%',
          left: 'center'
        },
        series: [
          {
            name: '结果统计',
            type: 'pie',
            radius: '70%',
            color: ['#67C23A', '#F56C6C', '#E6A23C'],
            data: [
              { value: 0, name: '成功' },
              { value: 0, name: '失败' }
            ]
          }
        ]
      }
    }
  },
  async mounted() {
    this.roomId = 'taskReport' + this.$route.params.id
    this.initChart()
    await this.getTaskInfo()
    await this.getReportList()
    this.joinTaskRoom()
  },
  // 页面销毁后的钩子
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    // 退出房间
    this.$socket.emit('leaveRoom', { roomId: this.roomId })
  },
  methods: {
    // 初始化表格
    initChart() {
      const chartDom = document.getElementById('diagram')
      this.chart = echarts.init(chartDom)
    },
    // 加入任务房间
    joinTaskRoom() {
      this.$socket.emit('joinRoom', { roomId: this.roomId })
    },
    // 获取测试报告列表
    async getReportList() {
      const { items, total } = await getReportList(this.requestForm)
      this.reportList = items
      this.requestForm.total = total
    },
    // 获取任务信息
    async getTaskInfo() {
      this.taskInfo = await getTaskInfo({ id: JSON.parse(this.$route.params.id) })
      this.updateChart()
    },
    // 更新图片和进度条颜色
    updateChart() {
      this.taskInfo['percentageColor'] = getColor(this.taskInfo['percentage'])
      this.chartInfo.series[0].data[0].value = this.taskInfo['passCase']
      this.chartInfo.series[0].data[1].value = this.taskInfo['failCase']
      this.chart.setOption(this.chartInfo)
    },
    // 打开抽屉
    openDrawer(row) {
      this.drawer = true
      this.caseInfo = row
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getReportList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 大小改变
    handleSizeChange(newSize) {
      this.requestForm.pageSize = newSize
      this.getReportList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
  },
  sockets: {
    // 任务详情信息
    taskReportInfo(data) {
      if (data.taskId !== this.taskInfo.id) return
      // 更新任务信息
      this.taskInfo.passCase = data.passCase
      this.taskInfo.failCase = data.failCase
      this.taskInfo.percentage = data.percentage
      this.taskInfo.status = data['taskStatus']
      // 更新报告详情
      this.updateChart()
      this.reportList.unshift(data)
      if (this.reportList.length > this.requestForm.pageSize) {
        this.reportList.pop()
      }
      this.requestForm.total += 1
    },
    // 任务状态
    taskStatus(data) {
      if (data.id !== this.taskInfo.id) return
      this.taskInfo.status = data.status
      this.taskInfo.endTime = data.endTime
    }
  }
}
</script>

<style scoped>
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
::v-deep .d2h-code-line {
  padding: 0 5em;
}
::v-deep .d2h-wrapper .d2h-code-linenumber, .d2h-code-side-linenumber {
  height: 19px;
  width: 50px;
}
::v-deep .d2h-info {
  display: none;
}
::v-deep .d2h-code-line-prefix {
  display: none
}
.case-font-size {
  font-weight: bold;
  font-size: 20px;
}
.borderDiv {
  margin-top: 10px;
  border-style: solid;
  border-color: #DCDFE6;
  border-width: 1px;
  background-color: #FFFFFF
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40vh;
  width: 100%;
}
</style>

<template>
  <el-card>
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="任务名称">
            <template slot="formatter"> {{ taskInfo.name }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="执行环境">
              <template slot="formatter"> {{ taskInfo['environmentalName'] }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="执行设备">
              <template slot="formatter"> {{ taskInfo['devicesName'] }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="执行平台">
              <template slot="formatter"> {{ taskInfo['platform'] }} </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table header-row-class-name="table-header-style" :data="reportList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="用例名称" width="200px" />
      <el-table-column prop="status" label="用例状态" />
    </el-table>
  </el-card>
</template>

<script>
import { getReportList } from '@/api/task/report'
import { getTaskInfo } from '@/api/task/center'
export default {
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
      taskInfo: {}
    }
  },
  created() {
    this.roomId = 'taskReport' + this.$route.params.id
    this.getTaskInfo()
  },
  mounted() {
    this.getReportList()
    this.joinDeviceRoom()
  },
  methods: {
    // 加入任务房间
    joinDeviceRoom() {
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
    }
  },
  sockets: {
    taskReportInfo(data) {
      this.reportList.unshift(data)
    }
  }
}
</script>

<style scoped>

</style>

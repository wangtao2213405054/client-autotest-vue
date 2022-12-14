<template>
  <el-card>
    <el-table header-row-class-name="table-header-style" :data="reportList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="用例名称" width="200px" />
      <el-table-column prop="status" label="用例状态" />
    </el-table>
  </el-card>
</template>

<script>
import { getReportList } from '@/api/task/report'
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
      roomId: null
    }
  },
  created() {
    this.roomId = 'taskReport' + this.$route.params.id
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
    async getReportList() {
      const { items, total } = await getReportList(this.requestForm)
      this.reportList = items
      this.requestForm.total = total
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

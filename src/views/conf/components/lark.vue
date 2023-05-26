<template>
  <el-card v-loading="larkLoading" shadow="hover">
    <div slot="header" class="clearfix">
      <span style="float: left">
        <strong>飞书机器人</strong>
        <span style="color: #909399; margin-left: 10px">Lark</span>
      </span>
      <el-switch
        v-model="larkForm.status"
        style="float: right; padding: 3px 0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @click.native.stop
        @change="editRobotSwitch"
      />
    </div>
    <common :key="larkForm.id" :add-form="larkForm" :disabled="true" mold="lark" @refresh="getRobotInfo" />
  </el-card>
</template>

<script>
import common from '@/views/conf/components/common'
import { editRobotSwitch, getRobotInfo } from '@/api/conf/robot'
export default {
  components: {
    common
  },
  data() {
    return {
      larkForm: {},
      larkLoading: true
    }
  },
  async created() {
    await this.getRobotInfo()
  },
  methods: {
    async getRobotInfo() {
      this.larkLoading = true
      this.larkForm = await getRobotInfo({
        projectId: localStorage.getItem('projectId'),
        app: 'lark'
      })
      this.larkLoading = false
    },
    async editRobotSwitch(bool) {
      if (this.larkForm.id) {
        await editRobotSwitch({ status: bool, id: this.larkForm.id })
      } else {
        this.$message.warning('请先配置飞书机器人再使用开关')
        this.larkForm.status = false
      }
    }
  }
}
</script>

<style scoped>

</style>

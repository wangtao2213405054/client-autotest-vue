<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span style="float: left">
        <strong>钉钉机器人</strong>
        <span style="color: #909399; margin-left: 10px">
          DingTalk
          <el-popover
            placement="right"
            title="钉钉群机器人"
            width="550"
            trigger="hover"
          >
            <div style="font-size: 14px; padding: 1px; line-height: 30px; color: #606266; font-weight: 550">
              <div>1. 每次任务执行完成后会以钉钉机器人的形式发送消息通知</div>
              <div>2. 支持配置多个群, 可点击 添加机器人 后新增群机器人 Webhook 来绑定多个群</div>
              <div>3. <span style="color: #409EFF">右侧开关</span>可以控制本项目是否启用钉钉机器人通知</div>
              <div>4. 请保管好 Webhook 地址，不要公布在外部网站上，泄露有安全风险</div>
              <div>5. 如群机器人未配置加签秘钥请确保关键字中包含 <span style="color: #F56C6C">测试</span> 二字</div>
              <div>6. 如何配置钉钉机器人请查看 <a href="https://www.baidu.com" target="_blank" style="color: #409EFF">教程文档</a></div>
            </div>
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </span>
      </span>
      <el-switch
        v-model="talkForm.status"
        style="float: right; padding: 3px 0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @click.native.stop
        @change="editRobotSwitch"
      />
    </div>
    <common :key="talkForm.id" :add-form="talkForm" mold="talk" @refresh="getRobotInfo" />
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
      talkForm: {}
    }
  },
  async created() {
    await this.getRobotInfo()
  },
  methods: {
    async getRobotInfo() {
      this.talkForm = await getRobotInfo({
        projectId: localStorage.getItem('projectId'),
        app: 'talk'
      })
    },
    async editRobotSwitch(bool) {
      if (this.talkForm.id) {
        await editRobotSwitch({ status: bool, id: this.talkForm.id })
      } else {
        this.$message.warning('请先配置钉钉机器人再使用开关')
        this.talkForm.status = false
      }
    }
  }
}
</script>

<style scoped>

</style>

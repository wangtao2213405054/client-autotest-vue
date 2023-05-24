<template>
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
</template>

<script>
import { platform, taskStatus } from '@/utils/localType'

export default {
  props: {
    taskInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      platformList: platform,
      taskStatusList: taskStatus
    }
  }
}
</script>

<style scoped>

</style>

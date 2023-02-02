<template>
  <el-tooltip :content="value" :disabled="tooltipShow" placement="top-start">
    <span ref="content" @mouseover="isShowTooltip">{{ value }}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'DescriptionsTooltip',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tooltipShow: false
    }
  },
  methods: {
    isShowTooltip() {
      this.tooltipShow = this.$refs.content.offsetWidth < this.$refs.content.parentNode.offsetWidth
    }
  }
}
</script>

<style scoped>

</style>


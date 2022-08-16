<template>
  <el-card>
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
      />
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      larkForm: {
        status: false
      }
    }
  }
}
</script>

<style scoped>

</style>

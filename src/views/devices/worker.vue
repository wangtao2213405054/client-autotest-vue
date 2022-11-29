<template>
  <div style="width: 200px; height: 200px; text-align: center; display: table-cell; vertical-align: middle">
    <el-badge :value="1" class="item">
      <i class="el-icon-message-solid" style="font-size: 24px;" />
    </el-badge>
  </div>
</template>

<script>
export default {
  name: 'Execute'
}
</script>

<style lang="scss" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>

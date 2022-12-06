<template>
  <el-dropdown trigger="click" placement="bottom-start">
    <el-badge :value="100" :max="99">
      <span class="el-dropdown-link">
        <svg-icon class-name="size-icon" icon-class="coke-icon-message" />
      </span>
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <div style="height: 200px; width: 300px">
        pass
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
::v-deep .el-badge {
  position: relative;
  vertical-align: middle;
  display: table-caption;
}
::v-deep .el-badge__content.is-fixed {
  right: 12px;
  margin-top: 13px;
}
.el-dropdown {
  font-size: 18px;
}
</style>

<template>
  <div>
    <el-skeleton :throttle="300" animated>
      <template slot="template">
        <el-skeleton-item variant="button" style="width: 100%; height: 300px;" />
        <div style="padding: 14px;">
          <el-skeleton-item variant="button" style="width: 100%" />
          <div
            style="display: flex; align-items: center"
          >
            <el-skeleton-item variant="text" style="margin-right: 16px;" />
            <el-skeleton-item variant="text" style="width: 30%;" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
<script>
</script>

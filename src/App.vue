<template>
  <div id="app">
    <router-view />
    <div
      style="position:fixed;text-align:center;bottom:0;margin:0 auto;width:100%;color: #5c6b77"
    >
      <div style="margin-bottom: 10px">
        <a
          target="_blank"
          style="color: #5c6b77"
          href="https://beian.miit.gov.cn/"
        >备案号: </a>
        &nbsp;
        <a
          target="_blank"
          style="color: #5c6b77"
          href="https://beian.miit.gov.cn/"
        >京ICP备2023003728号-1</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

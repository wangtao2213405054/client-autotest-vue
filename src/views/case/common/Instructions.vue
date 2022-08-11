<template>
  <div style="line-height: 25px; color: #303133">
    <div v-if="type === 'params'">
      <div>
        参数会以URL String 的形式进行传递，即
        <span class="text-background">?</span>
        后的字符串为其请求参数, 并以
        <span class="text-background">&</span>
        作为参数之间的分隔符</div>
      <div>
        示例:
        <span class="text-background">
          http://localhost:8080/get/userInfo?id=1&role=admin
        </span>
      </div>
      <div>
        示例中的
        <span class="text-background">id=1</span>
        和
        <span class="text-background">role=admin</span>
        即为其请求参数的参数名和示例值
      </div>
    </div>
    <div v-if="type === 'url'">
      <div>
        <div>1. 接口路径以
          <span class="text-background">/</span>
          起始, HTTP协议及域名部分请在 环境 中配置</div>
        <div>2. 使用花括号表示 Path 参数 如
          <span class="text-background">/get/userInfo/{id}</span>
        </div>
        <div>3. Path 参数可在下方
          <span style="color: #409EFF">请求参数 - Params - Path 参数</span>
          处添加示例值和说明</div>
      </div>
    </div>
    <div v-if="type === 'path'">
      <div>参数会以 URL Path 的形式动态进行传递</div>
      <div>
        示例:
        <span class="text-background">http://localhost:8080/get/userInfo/{id}</span>
      </div>
      <div>
        示例中的
        <span class="text-background">{id}</span>
        为动态 Path, 请求时会将
        <span class="text-background">{id}</span>
        替换为
        <span style="color: #409EFF">示例值</span>
        中的值
      </div>
      <div>
        发送请求后的URL:
        <span class="text-background">http://localhost:8080/get/userInfo/1</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style lang="scss" scoped>
.text-background {
  background-color: #EBEEF5;
  border-radius: 4px;
  padding: 1px
}
</style>

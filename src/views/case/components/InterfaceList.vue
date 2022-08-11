<template>
  <div>
    <div v-for="item in methodsList" :key="item.label">
      <!--    <el-button @click="toTest">跳转</el-button>-->
      <!--    <span class="request">GET</span>-->
      <span :style="{'color': item.color}"> {{ item.label }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterfaceList',
  props: {
    moduleId: {
      type: Number,
      default: () => null
    },
    moduleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: 'second',
      methodsList: [
        { label: 'GET', color: '#67C23A' },
        { label: 'POST', color: '#409EFF' },
        { label: 'DEL', color: '#F56C6C' },
        { label: 'PUT', color: '#E6A23C' }
      ]
    }
  },
  watch: {
    moduleId(newData) {
      console.log(newData)
    }
  },
  methods: {
    toTest() {
      this.$router.push({ name: 'ApiDocument', params: { id: this.moduleId.toString() }})
    }
  }
}
</script>

<style scoped>
.request {
  width: 29px;
  color: #409EFF;
}
</style>

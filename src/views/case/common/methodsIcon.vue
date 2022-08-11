<template>
  <span>
    <span v-for="item in methodsList" :key="item.label">
      <span v-if="item.label === methods" :style="{'color': item.color}"> {{ item.label }} </span>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    methods: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      methodsList: [
        { label: 'GET', color: '#67C23A' },
        { label: 'POST', color: '#E6A23C' },
        { label: 'DEL', color: '#F56C6C' },
        { label: 'PUT', color: '#409EFF' }
      ]
    }
  }
}
</script>

<style scoped>
</style>

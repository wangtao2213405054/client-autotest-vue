<template>
  <div style="border-style: solid; border-color: #C0C4CC; border-width: 1px; min-height: 400px">
    <jsonView v-if="disable" :data="jsonFileNoStr" />
    <span v-else style="margin-left: 10px; font-size: 18px">{{ jsonFileNoStr }}</span>
  </div>
</template>

<script>
import jsonView from 'vue-json-views'
import dataType from '@/views/api/common/dataType'
export default {
  components: {
    jsonView
  },
  props: {
    treeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      jsonFileNoStr: {},
      defaultDict: {},
      disable: true
    }
  },
  created() {
    this.defaultDict = dataType.defaultDict
    this.initTree()
  },
  methods: {
    // 将传递过来的树解析为 Json
    treeToJson(treeData, type) {
      if (type === 'Object') {
        const dict = {}
        for (let i = 0; i < treeData.length; i++) {
          let { sample } = treeData[i]
          const { name, dataType, children } = treeData[i]
          if (!sample) {
            sample = this.defaultDict[dataType]
          } else {
            sample = this.dataTypeChange(sample, dataType)
          }
          dict[name] = sample
          if (dataType === 'Object' || dataType === 'Array') {
            dict[name] = this.treeToJson(children, dataType)
          }
        }
        return dict
      } else if (type === 'Array') {
        const list = []
        for (let i = 0; i < treeData.length; i++) {
          let { sample } = treeData[i]
          const { dataType, children } = treeData[i]
          if (!sample) {
            sample = this.defaultDict[dataType]
          } else {
            sample = this.dataTypeChange(sample, dataType)
          }
          if (dataType === 'Object' || dataType === 'Array') {
            list.push(this.treeToJson(children, dataType))
          } else {
            list.push(sample)
          }
        }
        return list
      }
    },
    // 数据类型转换
    dataTypeChange(data, type) {
      if (type === 'None') {
        return null
      } else if (type === 'Boolean') {
        return JSON.parse(data.toLowerCase())
      } else if (type === 'Integer') {
        return parseInt(data)
      } else if (type === 'Float') {
        return parseFloat(data)
      } else if (type === 'String') {
        return String(data)
      }
    },
    // 处理跟目录数据
    initTree() {
      const { dataType, children } = this.treeList[0]
      let { sample } = this.treeList[0]
      if (dataType === 'Object' || dataType === 'Array') {
        this.disable = true
        this.jsonFileNoStr = this.treeToJson(children, dataType)
      } else {
        this.disable = false
        if (!sample) {
          sample = this.defaultDict[dataType]
        } else {
          sample = this.dataTypeChange(sample, dataType)
        }
        this.jsonFileNoStr = sample
      }
    }
  }
}
</script>

<style scoped>

</style>

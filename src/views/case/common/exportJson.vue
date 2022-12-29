<template>
  <div>
    <el-dialog
      title="快捷导入"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <b-code-editor
        ref="editor"
        v-model="translationStr"
        theme="idea"
        :line-wrap="false"
      />
      <span slot="footer" class="dialog-footer">
        <el-button plain icon="el-icon-brush" type="success" @click="formatText">格式化数据</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      dialogVisible: false,
      translationStr: ''
    }
  },
  watch: {
    visible(newData) {
      this.dialogVisible = newData
    },
    dialogVisible(newData) {
      this.$emit('update:visible', newData)
    }
  },
  created() {
    this.dialogVisible = this.visible
  },
  methods: {
    submitForm() {
      let parseData = null
      try {
        parseData = JSON.parse(this.translationStr)
      } catch (e) {
        return this.$message.error('JSON格式不正确')
      }
      const dataType = this.getDataType(parseData)
      const treeData = this.jsonToListTree(parseData, dataType)
      this.$emit('getData', { type: dataType, data: treeData })
      this.dialogVisible = false
    },
    // 获取数据类型
    getDataType(data) {
      if (typeof data === 'number') {
        if (data % 1 === 0) {
          return 'Integer'
        } else if (data === +data && data !== (data | 0)) {
          return 'Float'
        }
      } else if (typeof data === 'string') {
        return 'String'
      } else if (typeof data === 'boolean') {
        return 'Boolean'
      } else if (data === null) {
        return 'None'
      } else {
        if (data instanceof Array) {
          return 'Array'
        } else {
          return 'Object'
        }
      }
    },
    // json转换为list tree
    jsonToListTree(value, type) {
      const listData = []
      /**
       * 如果为对象, 则遍历对象的每个 items, 并将其添加至 listData 中, 如果 items 中有 object or array 则进行递归调用
       * 如果为数组, 则取出数组中的第一个值, 并将items添加值 listData 中, 如果 items 为 object or array 则进行递归调用
       * 如果非对象和数组, 则返回 value
       */
      if (type === 'Object') {
        for (const items in value) {
          const dataType = this.getDataType(value[items])
          if (dataType === 'Object' || dataType === 'Array') {
            const children = this.getItemsData(items, dataType, null, dataType === 'Object' ? 3 : 2)
            children['children'] = this.jsonToListTree(value[items], dataType)
            listData.push(children)
          } else {
            listData.push(this.getItemsData(items, dataType, value[items]))
          }
        }
      } else if (type === 'Array') {
        const content = value[0]
        const dataType = this.getDataType(content)
        if (dataType === 'Array' || dataType === 'Object') {
          const children = this.getItemsData('items', dataType, null, dataType === 'Object' ? 3 : 2)
          children['children'] = this.jsonToListTree(content, dataType)
          listData.push(children)
        } else {
          listData.push(this.getItemsData('items', dataType, content))
        }
      } else {
        return value
      }
      return listData
    },
    // 获取列表中item的信息
    getItemsData(name, type, sample, level = 2) {
      if (sample) {
        sample = sample.toString()
      }
      return {
        name: name,
        dataType: type,
        mandatory: true,
        sample: sample,
        describe: null,
        key: Date.now() + Math.random(),
        level: level,
        children: []
      }
    },
    // 格式化文本信息
    formatText() {
      try {
        this.translationStr = JSON.stringify(JSON.parse(this.translationStr), null, '  ')
      } catch (e) {
        this.$message.error('JSON格式不正确')
      }
    }
  }
}
</script>

<style scoped>

</style>

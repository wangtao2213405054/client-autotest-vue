<template>
  <div>
    <div v-for="item in dataList" :key="item.value">
      <el-input v-if="item.type === 'input'" v-model="addForm.steps[item.value]" :placeholder="item.placeholder" />
      <el-select
        v-if="item.type === 'select'"
        v-model="addForm.steps[item.value]"
        :placeholder="item.placeholder"
        @visible-change="item.change"
      >
        <el-option
          v-for="items in item.source"
          :key="items.value"
          :label="items.label"
          :value="items.value"
        />
      </el-select>
      <div>{{ item.change }}</div>
    </div>
    <el-button @click="console1">确认</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [
        { type: 'input', placeholder: '请输入内容: text', value: 'text', steps: {}},
        { type: 'input', placeholder: '请输入内容: test', value: 'test', steps: {}},
        { type: 'select', placeholder: '请选择内容', value: 'test2', change: this.test1,
          steps: {}, source: [{ value: 'test', label: '测试' }, { value: 'test1', label: '测试1' }] }
      ],
      addForm: {
        steps: {},
        txt: null
      }
    }
  },
  methods: {
    test1() {
      console.log('123123??!@?#@!#')
      console.log('this is test!')
    },
    console1() {
      console.log('11123')
      console.log(this.addForm)
    }
  }
}
</script>

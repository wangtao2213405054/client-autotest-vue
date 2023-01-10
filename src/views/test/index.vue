<template>
  <div>
    <div>
      <div class="block">
        <span class="demonstration">折叠展示Tag</span>
        <el-cascader
          v-model="valueList"
          :options="optionsList"
          :props="props"
          collapse-tags
          clearable
        />
      </div>
      {{ valueList }}
      {{ 'options' + this.optionsList }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 级联选择器
      optionsList: [],
      valueList: [['zhinan', 'shejiyuanze'], ['ziyuan', 'jiaohu'], ['ziyuan', 'sketch'], ['ziyuan', 'sketchss']],
      val: '870,872',
      props: {
        multiple: true,
        checkStrictly: false,
        emitPath: true,
        lazyLoad: this.lazyLoads,
        leaf: 'leaf',
        lazy: true
      },
      list1: [
        {
          value: 'zhinan',
          label: '指南'
        },
        {
          value: 'ziyuan',
          label: '资源'
        }]
    }
  },
  methods: {
    lazyLoads(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        // 判断是否回显 如果this.valueList>0 代表需要回显，调用formatting 如果不回显直接调取一级数据resolve回去。
        if (this.valueList.length > 0) {
          // 判断是否回显
          this.formatting()
        } else {
          const res = this.getfristChild()
          resolve(res)
        }
      } else {
        const list = this.valueList
        // 如果有children 证明有子集可以继续调取
        if (!node.data.children) {
          const res = this.getOther(node.data.value)
          setTimeout(() => {
            // 模拟接口
            resolve(res)
          }, 100)
        } else {
          resolve([])
          // return false
        }
        // 先合并在去重
        this.valueList = [...new Set([...this.valueList, ...list])]
        console.log(this.valueList, '去重后的数据')
      }
    },
    // 请求一级节点 我这里没走接口。
    getfristChild() {
      return this.list1
    },
    // 获取子集数据  没到取接口，假数据模仿
    getOther(value) {
      let res = []
      if (value === 'zhinan') {
        res = [
          {
            value: 'shejiyuanze',
            label: '设计原则',
            leaf: true
          },
          {
            value: 'daohang',
            label: '导航',
            leaf: true
          }
        ]
      }
      if (value === 'ziyuan') {
        res = [
          {
            value: 'axure',
            label: 'Axure Components',
            leaf: true
          },
          {
            value: 'sketch',
            label: 'Sketch Templates',
            leaf: true
          },
          {
            value: 'jiaohu',
            label: '组件交互文档',
            leaf: true
          }
        ]
      }
      return res
    },
    formatting() {
      // 拿一级数据 根据 this.valueList去判断哪些一级数据需要回显
      const res = this.getfristChild()
      this.valueList.forEach((item) => {
        if (item.length > 1) {
          console.log(item, 'item')
          item.forEach((sitem, index) => {
            if (index === item.length - 1) {
              return
            }
            console.log(sitem, 'sitem')
            const arr = this.getOther(sitem)
            this.findItem(res, arr, sitem)
          })
        }
      })
      // 递归判断
    },
    findItem(res, arr, id) {
      for (let i = 0; i < res.length; i++) {
        if (res[i].value === id) {
          res[i].children = arr
          this.optionsList = res
        }
        if (res[i].children) {
          this.findItem(res[i].children, arr, id)
        }
      }
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <el-dialog
      title="批量编辑"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-radio-group v-model="activeName" size="mini">
        <el-radio-button label="json">JSON模式</el-radio-button>
        <el-radio-button label="csv">CSV模式</el-radio-button>
      </el-radio-group>
      <span style="margin-left: 5px; color: #909399">
        格式: 参数名:示例值
      </span>
      <div style="margin-top: 10px">
        <b-code-editor
          ref="editor"
          v-model="translationStr"
          theme="material"
          :line-wrap="false"
        />
        <div style="margin-top: 10px">
          数据格式遵循 <el-link type="primary">《标准 JSON 规范》</el-link>, 非 JSON 格式无法导入
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="jsonToList(translationStr)">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      :id="methods"
      ref="table"
      :data="tableList"
      border
      row-key="key"
      style="width: 100%"
    >
      <el-table-column width="35px" class-name="sortable">
        <template>
          <i class="el-icon-d-caret" />
        </template>
      </el-table-column>
      <el-table-column label="参数名" width="150px">
        <template v-slot="scope">
          <el-tooltip :disabled="methods !== 'path'" content="自动提取接口路径中的 { path } 形式参数, 请在接口路径中修改" placement="top">
            <el-input v-model="scope.row['name']" :disabled="methods === 'path'" placeholder="请输入参数名称" @blur="pushData(scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="150px">
        <template v-slot="scope">
          <el-tooltip :disabled="!typeDisable" content="默认类型为String 不允许修改" placement="top">
            <el-select v-model="scope.row['dataType']" :disabled="typeDisable" placeholder="请选择参数类型" @blur="pushData(scope.$index)">
              <el-option
                v-for="item in dataTypeList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
                <div style="width: 200px">
                  <span style="float: left">{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                </div>
              </el-option>
            </el-select>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="必填" width="50px" align="center">
        <template v-slot="scope">
          <el-tooltip :disabled="methods !== 'path'" content="来自 URL Path 必填" placement="top">
            <el-checkbox v-model="scope.row['mandatory']" :disabled="methods === 'path'" @change="pushData(scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="示例值" width="150px">
        <template v-slot="scope">
          <el-input v-model="scope.row['sample']" placeholder="请输入示例值" @blur="pushData(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template v-slot="scope">
          <el-input v-model="scope.row['describe']" placeholder="请输入字段说明" @blur="pushData(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column v-if="methods !== 'path'" width="60px" align="center">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="批量编辑" placement="top-start">
            <el-button type="text" icon="el-icon-s-cooperation" style="height: 6px" size="mini" @click="batchEditor" />
          </el-tooltip>
        </template>
        <template v-slot="scope">
          <el-button v-if="tableList.length - 1 !== scope.$index" style="color: #909399" icon="el-icon-close" type="text" @click="deleteItems(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  props: {
    editorList: {
      type: Array,
      default: () => []
    },
    methods: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      tableList: [],
      dataTypeList: [
        // { value: 'Integer', label: '整数' },
        { value: 'String', label: '字符串' },
        // { value: 'Boolean', label: '布尔值' },
        // { value: 'Array', label: '数组/列表' },
        // { value: 'Object', label: '对象/字典' },
        // { value: 'Float', label: '浮点数/小数' },
        { value: 'File', label: '文件' }
      ],
      typeDisable: true,
      dialogVisible: false,
      activeName: 'json',
      translationStr: ''
    }
  },
  created() {
    this.tableList = this.editorList // 变量绑定
    // 如果列表为空或者列表中最后一个数据中有值则调用 pushBodyWrapper 方法
    if (this.methods !== 'path') {
      if (!this.tableList.length || this.tableList[this.tableList.length - 1]['name']) {
        this.pushBodyWrapper()
      }
    }
    if (this.methods === 'data') {
      this.typeDisable = false
    }
  },
  mounted() {
    if (this.methods !== 'path') {
      this.rowDrop()
    }
    // this.rowDrop()
  },
  methods: {
    // 拖拽
    rowDrop() {
      // 监听拖拽响应的DOM对象
      const tbody = document.querySelector('#' + this.methods + ' tbody')

      const that = this
      Sortable.create(tbody, {
        handle: '.sortable', // 允许拖拽的元素
        // 结束拖拽的函数
        onEnd({ newIndex, oldIndex }) {
          console.log('拖动了行，当前序号:' + newIndex)
          const currentRow = that.tableList.splice(oldIndex, 1)[0]
          that.tableList.splice(newIndex, 0, currentRow)
        }
      })
    },
    // 删除参数
    deleteItems(index) {
      this.tableList.splice(index, 1)
    },
    // push数据
    pushData(index) {
      if (this.methods !== 'path' && index === this.tableList.length - 1) {
        this.pushBodyWrapper()
      }
    },
    // push数据到底部
    pushBodyWrapper(fieldName = null, fieldSample = null, pushType = true) {
      const pushData = {
        name: fieldName,
        dataType: 'String',
        mandatory: false,
        sample: fieldSample,
        describe: null,
        key: Date.now() + Math.random()
      }
      if (pushType) {
        this.tableList.push(pushData)
      } else {
        return pushData
      }
    },
    // 批量编辑功能
    batchEditor() {
      this.dialogVisible = true
      this.translationStr = this.listToJson(this.tableList)
    },
    // list 转换为 json
    listToJson(value) {
      const dict = {}
      for (let i = 0; i < value.length; i++) {
        if (i !== value.length - 1) {
          dict[value[i]['name']] = value[i]['sample']
        }
      }
      return JSON.stringify(dict, null, '  ')
    },
    // json 转换为 list
    jsonToList(value) {
      const dict = JSON.parse(value) // 要进行转换的 json 数据
      const historical = [] // 历史中的数据key
      const newList = [] // 最终返回的新数组
      const current = Object.keys(dict)
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList.length - 1 !== i) {
          historical.push(this.tableList[i]['name'])
          newList.push(this.tableList[i])
        }
      }
      // 当前和历史的差集
      const currentDiffSet = current.concat(historical).filter(item => !historical.includes(item))
      // 历史和当前的差集
      const historicalDiffSet = historical.concat(current).filter(item => !current.includes(item))
      // 获取两个列表的交集并完成对其修改的操作
      for (const item in dict) {
        newList.forEach((items, index) => {
          if (items['name'] === item) {
            items['sample'] = String(dict[item])
            this.$set(newList, index, items)
          }
        })
      }
      // 通过历史和当前的差集删除不存在的数据
      historicalDiffSet.forEach(items => {
        newList.forEach((item, index) => {
          if (items === item['name']) {
            newList.splice(index, 1)
          }
        })
      })
      // 通过当前和历史的差集增加历史不存在的数据
      currentDiffSet.forEach(items => {
        newList.push(this.pushBodyWrapper(items, String(dict[items]), false))
      })
      newList.push(this.pushBodyWrapper(null, null, false))
      this.tableList = newList
    }
  }
}
</script>

<style scoped>

</style>

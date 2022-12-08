<template>
  <div style="border-style: solid; border-color: #DCDFE6; border-width: 1px; background-color: #FFFFFF">
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <preview-tree v-if="dialogVisible" :tree-list="dataList" />
    </el-dialog>
    <export-json v-if="visible" :visible.sync="visible" @getData="getJsonData" />
    <div style="text-align: center; padding: 10px">
      <el-button plain type="primary" size="mini" @click="visible = true">
        <svg-icon icon-class="coke-icon-json-scan" style="margin-right: 5px; font-size: 11px" />JSON 智能识别/快捷导入
      </el-button>
      <el-button plain type="success" size="mini" icon="el-icon-view" @click="dialogVisible = true">预览</el-button>
    </div>
    <el-tree
      ref="tree"
      :data="dataList"
      default-expand-all
      style="padding: 10px"
      :expand-on-click-node="false"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <span style="width: 100%; margin-right: 10px">
          <el-input v-model="data['name']" :readonly="data.disable" size="small" placeholder="字段名称" />
        </span>
        <span style="padding: 3px">
          <el-tooltip effect="light" content="是否必传" placement="top">
            <el-checkbox v-model="data['mandatory']" size="medium" style="margin-right: 10px" />
          </el-tooltip>
          <el-select v-model="data['dataType']" size="small" style="width: 120px; margin-right: 5px" placeholder="字段类型" @change="changeType(node, data, $event)">
            <el-option
              v-for="item in dataTypeList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
              style="width: 200px"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
          <el-input v-model="data['sample']" size="small" style="width: 150px; margin-right: 5px" placeholder="示例值" />
          <el-input v-model="data['describe']" size="small" style="width: 250px; margin-right: 5px" placeholder="字段说明" />
        </span>
        <div>
          <div style="width: 50px">
            <span>
              <el-tooltip v-if="!data.disable" effect="light" :open-delay="200" :enterable="false" content="删除节点" placement="top">
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-error"
                  :disabled="data.disable"
                  style="color: #F56C6C; font-size: 18px; margin-right: 10px"
                  @click="() => remove(node, data)"
                />
              </el-tooltip>
            </span>
            <span>
              <el-tooltip v-if="data['level'] === 1" effect="light" :open-delay="200" :enterable="false" content="添加子节点" placement="top">
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-circle-plus"
                  style="font-size: 18px"
                  @click="append(node, data)"
                />
              </el-tooltip>
            </span>
            <span>
              <el-tooltip v-if="data['level'] === 2" effect="light" :open-delay="200" :enterable="false" content="添加相邻节点" placement="top">
                <el-button
                  v-if="data['level']"
                  type="text"
                  size="small"
                  icon="el-icon-circle-plus"
                  style="font-size: 18px"
                  @click="appendLevel(node)"
                />
              </el-tooltip>
            </span>
            <el-dropdown v-if="data['level'] === 3">
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                style="font-size: 18px"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.prevent.native="appendLevel(node)">添加相邻节点</el-dropdown-item>
                <el-dropdown-item @click.prevent.native="append(node, data)">添加子节点</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import dataType from '@/views/case/common/dataType'
import previewTree from '@/views/case/common/previewJson'
import exportJson from '@/views/case/common/exportJson'
export default {
  components: {
    previewTree,
    exportJson
  },
  props: {
    createTree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [],
      id: 0,
      dataTypeList: [],
      dialogVisible: false,
      visible: false
    }
  },
  created() {
    this.dataTypeList = dataType.dataTypeList
    this.dataList = this.createTree
    if (!this.dataList.length) {
      this.dataList.push({
        name: '根节点',
        dataType: 'Object',
        mandatory: true,
        sample: null,
        describe: null,
        key: Date.now() + Math.random(),
        disable: true,
        level: 1,
        children: []
      })
    }
  },
  // level 定义: 0 不能添加任何节点 1 可以添加子节点 2 可以添加同级节点 3 可以添加子节点和同级节点
  methods: {
    // 添加子节点
    append(node, data) {
      const newChild = {
        name: null,
        dataType: 'String',
        mandatory: false,
        sample: null,
        describe: null,
        key: Date.now() + Math.random(),
        level: 2,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 删除节点
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    // 添加相邻节点
    appendLevel(node) {
      const newChild = {
        name: null,
        dataType: 'String',
        mandatory: false,
        sample: null,
        describe: null,
        key: Date.now() + Math.random(),
        level: 2,
        children: []
      }
      this.$refs.tree.insertAfter(newChild, node)
    },
    // 选择器变化的钩子
    changeType(node, data, dataType) {
      // 获取父节点对象
      const newChild = {
        name: null,
        dataType: 'String',
        mandatory: false,
        sample: null,
        describe: null,
        key: Date.now() + Math.random(),
        disable: false,
        level: 0,
        children: []
      }
      const father = node.parent.data.dataType
      /**
       * 变更当前节点的信息
       * 如果父亲为对象, 那么则可以添加同级节点
       * 如果父亲为对象, 并且本身为对象, 则都可以添加
       * 如果父亲为空, 本身为对象, 那么可以添加子节点
       * 如果父亲为空, 本身非对象, 那么不可以添加任何节点
       */
      if (father === 'Object') {
        if (dataType === 'Object') {
          this.$set(data, 'level', 3)
        } else {
          this.$set(data, 'level', 2)
        }
      } else {
        if (dataType === 'Object') {
          this.$set(data, 'level', 1)
        } else {
          this.$set(data, 'level', 0)
        }
      }
      // 当为数组 or 字典时进行子数据的 Push
      if (dataType === 'Array') {
        newChild.name = 'items'
        newChild.disable = true
        this.$set(data, 'children', [newChild])
      } else if (dataType === 'Object') {
        newChild.level = 2
        this.$set(data, 'children', [newChild])
      } else {
        this.$set(data, 'children', [])
      }
    },
    // 获取json 解析后的数据
    getJsonData(value) {
      this.$set(this.dataList[0], 'dataType', value['type'])
      if (value['type'] === 'Array' || value['type'] === 'Object') {
        this.$set(this.dataList[0], 'children', value['data'])
      } else {
        this.$set(this.dataList[0], 'sample', value['data'])
      }
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}
</style>

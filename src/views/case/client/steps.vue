<template>
  <div>
    <el-empty v-if="!caseSteps.length" description="暂无步骤, 快来添加一个吧" />
    <el-tree
      v-else
      ref="tree"
      :data="caseSteps"
      node-key="key"
      default-expand-all
      draggable
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @node-click="caseExpanded"
      @node-drop="rearrangement"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <el-tooltip effect="dark" :content="data.desc" placement="top" :open-delay="1000">
          <span class="caseStepsTitle">{{ data.index + '. ' + data.name }}</span>
        </el-tooltip>
        <el-form
          :ref="`treeStepsFormRef${data.key}`"
          :model="data"
          class="stepContext"
          :show-message="false"
          inline
          hide-required-asterisk
        >
          <el-form-item v-if="!data.func.length">
            <el-input v-model="data.name" readonly />
          </el-form-item>
          <div v-else>
            <el-form-item
              v-for="(item, index) in data.func"
              :key="item.key"
              style="width: 180px"
              :prop="'func.' + index + '.default'"
              :rules="[
                { required: true, trigger: 'blur' },
              ]"
            >
              <el-tooltip effect="dark" :open-delay="1000" :content="item.placeholder" placement="top">
                <el-input
                  v-if="item.type.indexOf('input') !== -1"
                  v-model="item.default"
                  :placeholder="item.placeholder"
                  clearable
                />
                <el-select
                  v-if="item.type.indexOf('select') !== -1 && item.selectModel === 'Custom'"
                  v-model="item.default"
                  :placeholder="item.placeholder"
                  clearable
                >
                  <el-option
                    v-for="items in item.source"
                    :key="items.key"
                    :label="items.label"
                    :value="items.param"
                  />
                </el-select>
                <el-select
                  v-if="item.type.indexOf('select') !== -1 && item.selectModel !== 'Custom'"
                  v-model="item.default"
                  :placeholder="item.placeholder"
                  clearable
                  @visible-change="getInlaySelectInfo(item.selectModel, item, $event)"
                >
                  <el-option
                    v-for="items in item.source"
                    :key="items.id"
                    :label="items.name"
                    :value="items.id"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </div>
        </el-form>
        <div style="margin-left: auto">
          <el-dropdown v-if="data.subset" trigger="click" style="margin-right: 5px">
            <el-button
              type="text"
              size="mini"
            >
              添加子节点
            </el-button>
            <el-dropdown-menu slot="dropdown" class="cont">
              <el-dropdown-item
                v-for="item in eventList"
                :key="item.id"
                divided
                @click.native="() => addNode(node, data, item)"
              >
                <el-tooltip effect="dark" :content="item.desc" placement="right">
                  <span> {{ item.name }} </span>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            class="delete-button"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
        </div>
      </div>
    </el-tree>
    <div class="eventSelect">
      <el-dropdown trigger="click" placement="top">
        <el-button type="primary">
          添加步骤<i class="el-icon-arrow-up el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="cont">
          <el-dropdown-item
            v-for="item in eventList"
            :key="item.id"
            divided
            @click.native="addSteps(item)"
          >
            <el-tooltip effect="dark" :content="item.desc" placement="right">
              <span> {{ item.name }} </span>
            </el-tooltip>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getEventList } from '@/api/conf/event'
import { getInlaySelectInfo } from '@/utils/inlaySelect'

const mold = localStorage.getItem('mold')
const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  props: {
    steps: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      eventList: [],
      caseSteps: [],
      treeClickCount: 0
    }
  },
  created() {
    this.getEventList()
    this.caseSteps = this.steps
  },
  methods: {
    // 获取事件列表
    async getEventList() {
      const request = {
        platform: mold,
        projectId: projectId,
        page: 1,
        pageSize: 9999
      }
      const { items } = await getEventList(request)
      items.forEach(item => {
        item.func.forEach(async event => {
          if (event.type.indexOf('select') !== -1 && event.selectModel !== 'Custom') {
            // eslint-disable-next-line require-atomic-updates
            event.source = await getInlaySelectInfo(event.selectModel)
          }
        })
      })
      this.eventList = items
    },
    // 添加步骤
    async addSteps(value) {
      value.key = Date.now() + Math.random()
      value.index = this.caseSteps.length + 1
      this.caseSteps.push(JSON.parse(JSON.stringify(value)))
    },
    // 删除节点
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      children.forEach((item, index) => {
        item.index = index + 1
      })
    },
    // 展开/关闭内置选择器时调用的钩子
    async getInlaySelectInfo(model, source, unfold) {
      if (unfold) {
        const inlay = await getInlaySelectInfo(model)
        this.$set(source, 'source', inlay)
      }
    },
    // 递归获取数中的所有 key
    getTreeKeys(tree) {
      const keys = []
      tree.forEach(item => {
        keys.push(item.key)
        if (item.subset && item.children) {
          keys.push.apply(keys, this.getTreeKeys(item.children))
        }
      })
      return keys
    },
    // 触发表单校验规则
    validate() {
      const flag = []
      const keys = this.getTreeKeys(this.caseSteps)
      keys.forEach(item => {
        this.$refs[`treeStepsFormRef${item}`].validate((valid) => {
          flag.push(valid)
        })
      })
      if (flag.includes(false)) {
        this.$nextTick(() => {
          const isError = document.getElementsByClassName('is-error')
          if (isError.length) {
            isError[0].scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          }
        })
      }
      return !flag.includes(false)
    },
    // 判断是否可以放置在此位置
    allowDrop(draggingNode, dropNode, type) {
      // 如果 subset 不为真则不可将节点拖拽成为其子节点
      return !(type === 'inner' && !dropNode.data.subset)
    },
    // 添加子节点
    addNode(node, data, value) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      value.key = Date.now() + Math.random()
      value.index = data.children.length + 1
      data.children.push(JSON.parse(JSON.stringify(value)))
    },
    // 双击展开收齐节点
    caseExpanded(data, node) {
      this.treeClickCount++
      window.setTimeout(() => {
        // 双击事件
        if (this.treeClickCount > 1 && data.subset) {
          this.treeClickCount = 0
          // 展开或收起树节点
          node.expanded ? node.collapse() : node.expand()
        } else {
          this.treeClickCount = 0
        }
      }, 200)
    },
    // 更新 Case Steps 索引信息
    updateCaseStepsIndex(tree) {
      tree.forEach((item, index) => {
        item.index = index + 1
        if (item.subset && item.children) {
          this.updateCaseStepsIndex(item.children)
        }
      })
    },
    // 当 tree 出现拖动后更新索引
    rearrangement() {
      this.updateCaseStepsIndex(this.caseSteps)
    }
  }
}
</script>

<style lang="scss" scoped>
.eventSelect {
  text-align: center;
  margin-top: 20px;
}
.cont {
  height: 300px;
  overflow: auto
}
.cont::-webkit-scrollbar {
  display: none;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  padding-right: 8px;
}
.stepContext {
  white-space: pre-wrap;
}
.el-form-item.el-form-item {
  margin-bottom: 5px;
}
.caseStepsTitle {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  font-weight: 700
}
</style>

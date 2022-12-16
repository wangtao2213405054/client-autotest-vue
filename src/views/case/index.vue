<template>
  <el-row style="background-color: rgba(248,248,248,0.6)">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeModule"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="68px" hide-required-asterisk>
        <el-form-item
          :label="labelName"
          prop="name"
          :rules="[
            { required: true, message: '请输入正确的' + labelName, trigger: 'blur' },
            { min: 2, max: 7, message: '长度在 2 到 12 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" clearable :placeholder="'请输入' + labelName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editModulesData">确 定</el-button>
      </span>
    </el-dialog>
    <el-col :span="7" :xs="26">
      <el-scrollbar class="api-content">
        <div style="padding-left: 10px; padding-top: 10px; padding-bottom: 10px">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            size="small"
            clearable
            style="width: 65%; margin-right: 20px"
          />
          <el-button style="" size="small" type="primary" plain icon="el-icon-plus" @click="createModule(null)">添加</el-button>
        </div>
        <el-tree
          ref="tree"
          class="folderTree"
          :data="modulesList"
          accordion
          :props="defaultProps"
          highlight-current
          node-key="id"
          :indent="12"
          :load="loadNode"
          lazy
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="queryModuleApi"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
            <span>
              <svg-icon
                :icon-class="node.expanded ? 'coke-icon-folder-open' : 'coke-icon-folder'"
                class="icon-class"
              />
              <span style="color: #606266">{{ data.name }}</span>
            </span>
            <span v-show="data['show']">
              <el-tooltip
                v-if="node.level < 2"
                content="添加子分组"
                :open-delay="200"
                :enterable="false"
                placement="top-start"
              >
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  circle
                  class="round"
                  style="color: #606266"
                  @click.stop="createModule(data.id)"
                />
              </el-tooltip>
              <el-dropdown placement="bottom-start">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-more"
                  circle
                  class="round"
                  style="color: #606266"
                  @click.stop
                />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit" style="color: #409EFF" @click.prevent.native="updateModule(data)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="node.level < 2" icon="el-icon-folder-add" divided style="color: #67C23A" @click.prevent.native="createModule(data.id)">添加子分组</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" divided style="color: #F56C6C" @click.prevent.native="deleteModuleInfo(data.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
        <div class="folderTree" style="height: 20px" />
      </el-scrollbar>
    </el-col>
    <el-col style="border-style: solid; border-color: #DCDFE6; border-width: 1px; background-color: #FFFFFF" :span="17" :xs="24">
      <el-scrollbar class="api-content">
        <div>
          <caseList style="padding: 10px" :module-id="queryId" />
          <div style="height: 20px" />
        </div>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script>
import { deleteModulesInfo, editModulesInfo, getModulesList } from '@/api/business/folder'
import caseList from '@/views/case/client/index'

export default {
  components: {
    caseList
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      filterText: '',
      addForm: {
        id: null,
        nodeId: null,
        name: null,
        projectId: JSON.parse(localStorage.getItem('projectId'))
      },
      dialogVisible: false,
      title: '',
      labelName: '',
      modulesList: [],
      queryId: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 添加模块
    createModule(nodeId) {
      this.title = nodeId ? '添加模块' : '添加业务'
      this.labelName = nodeId ? '模块名称' : '业务名称'
      this.dialogVisible = true
      this.addForm.nodeId = nodeId
    },
    // 编辑模块
    updateModule(value) {
      this.title = '编辑模块'
      this.labelName = '模块名称'
      this.dialogVisible = true
      this.addForm.id = value['id']
      this.addForm.name = value['name']
      // 编辑时获取父节点的id
      const node = this.$refs.tree.getNode(value)
      this.addForm.nodeId = node.parent.data.id
    },
    // 关闭模块弹窗
    closeModule() {
      this.addForm.nodeId = null
      this.addForm.name = null
      this.addForm.id = null
      this.$refs.addFormRef.clearValidate()
    },
    // 新增节点
    editModulesData() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          const data = await editModulesInfo(this.addForm)
          /**
           * 如果id真进行修改操作, 如果此节点的父节点id为真，则刷新这个父节点，否则修改这个节点的名称
           * 如果id为假则进行新增操作, 如果节点id为真则刷新节点, 如果节点为假则在最后一个节点后新增一个节点
           */
          if (this.addForm.id) {
            const node = this.$refs.tree.getNode(this.addForm.id)
            if (node.parent.data.id) {
              this.refreshNodeBy(node.parent.data.id)
            } else {
              this.$set(node.data, 'name', data['name'])
            }
          } else {
            if (this.addForm.nodeId) {
              this.refreshNodeBy(this.addForm.nodeId)
            } else {
              this.$refs.tree.insertAfter(data, this.modulesList[this.modulesList.length - 1])
            }
          }
          this.dialogVisible = false
        }
      })
    },
    // 删除模块
    async deleteModuleInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteModulesInfo({ id })
      /**
       * 获取父节点的信息, 如果父节点信息为真则刷新父节点, 否则在前端假删除这个node节点
       */
      const node = this.$refs.tree.getNode(id)
      if (node.parent.data.id) {
        this.refreshNodeBy(node.parent.data.id)
      } else {
        this.$refs.tree.remove(node)
      }
    },
    // 绑定模块id
    queryModuleApi(data) {
      this.queryId = data['id']
      console.log(data)
    },
    // 鼠标悬浮在 tree 节点时的钩子
    mouseenter(data) {
      this.$set(data, 'show', true)
    },
    // 鼠标离开 tree 节点时的钩子
    mouseleave(data) {
      this.$set(data, 'show', false)
    },
    // 懒加载
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const data = await this.getModuleNodeList(0)
        this.modulesList = data
        return resolve(data)
      }
      const data = await this.getModuleNodeList(node['data']['id'])
      return resolve(data)
    },
    // 获取列表
    getModuleNodeList(id) {
      const requestForm = {
        projectId: JSON.parse(localStorage.getItem('projectId')),
        id: id
      }
      return getModulesList(requestForm)
    },
    // 子节点刷新
    refreshNodeBy(id) {
      const node = this.$refs.tree.getNode(id) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.isLeaf = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 10px;
}
.round {
  padding: 4px;
}
.round:hover {
  background-color: #FFFFFF;
}
.folderTree {
  background-color: rgba(248,248,248,0.6)
}
//::v-deep .folderTree .el-tree-node__content{
//  &:hover{
//    background-color: rgba(132, 187, 243, 0.33);
//  }
//}
//::v-deep .folderTree .el-tree-node.is-current > .el-tree-node__content {
//  background-color: rgba(97, 163, 231, 0.53) !important;
//}
.api-content {
  height: calc(100vh - 80px)
}
.icon-class {
  margin-right: 5px;
  font-size: 16px
}
</style>

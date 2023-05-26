<template>
  <el-row :gutter="20">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeClassification"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="68px" hide-required-asterisk>
        <el-form-item
          :label="labelName"
          prop="name"
          :rules="[
            { required: true, message: '请输入正确的' + labelName, trigger: 'blur' },
            { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" clearable :placeholder="'请输入' + labelName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassificationData">确 定</el-button>
      </span>
    </el-dialog>
    <el-col v-loading="accountTreeLoading" :span="7" :xs="24">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="16" :xs="24">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            size="mini"
            clearable
          />
        </el-col>
        <el-col :span="6" :xs="24">
          <el-button v-waves size="mini" type="success" plain icon="el-icon-plus" @click="newClassification(null)">新增</el-button>
        </el-col>
      </el-row>
      <el-tree
        ref="tree"
        :data="classificationTree"
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="queryNodeUser"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span style="font-size: 10px">{{ data.name }}</span>
          <span>
            <el-button
              v-if="node.level < 2"
              type="text"
              size="mini"
              @click.stop="newClassification(data.id)"
            >
              添加
            </el-button>
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              :title="node.level === 2 ? '确定要删除这个部门吗？' : '确认要删除这个公司吗？'"
              @confirm="remove(data.id)"
            >
              <el-button
                slot="reference"
                class="delete-button"
                type="text"
                size="mini"
                @click.stop
              >
                删除
              </el-button>
            </el-popconfirm>
          </span>
        </span>
      </el-tree>
    </el-col>
    <el-col :span="17" :xs="24">
      <account :key="queryId" :query-id="queryId" :classification-tree="classificationTree" />
    </el-col>
  </el-row>
</template>

<script>
import waves from '@/directive/waves/index.js'
import Account from '@/views/home/components/Account'
import { deleteClassificationData, editClassificationData, getClassificationList } from '@/api/account/classification'
export default {
  components: { Account },
  directives: {
    waves
  },
  data() {
    return {
      classificationTree: [],
      filterText: '',
      dialogVisible: false,
      title: '',
      labelName: '',
      addForm: {
        nodeId: null,
        name: null
      },
      queryId: null,
      accountTreeLoading: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getClassificationList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取tree
    async getClassificationList() {
      this.accountTreeLoading = true
      this.classificationTree = await getClassificationList()
      this.accountTreeLoading = false
    },
    // 删除节点
    async remove(id) {
      await deleteClassificationData({ id })
      await this.getClassificationList()
    },
    // 新增一级分类
    newClassification(nodeId) {
      this.title = nodeId ? '新增部门' : '新增公司'
      this.labelName = nodeId ? '部门名称' : '公司名称'
      this.dialogVisible = true
      this.addForm.nodeId = nodeId
    },
    // 关闭新增分类
    closeClassification() {
      this.addForm.nodeId = null
      this.addForm.name = null
      this.$refs.addFormRef.clearValidate()
    },
    // 新增节点
    editClassificationData() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editClassificationData(this.addForm)
          this.dialogVisible = false
          await this.getClassificationList()
        }
      })
    },
    // 查询tree节点的用户列表
    queryNodeUser(data) {
      this.queryId = data.id
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
  padding-right: 8px;
}
</style>

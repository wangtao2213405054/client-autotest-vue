<template>
  <div v-loading="caseLoading">
    <el-tabs v-model="editableTabsValue" stretch @tab-remove="removeTab">
      <el-tab-pane label="用例列表" name="first">
        <el-form ref="requestFormRef" :model="requestForm" inline>
          <el-form-item>
            <el-input v-model="requestForm.name" placeholder="输入用例名称查询" clearable />
          </el-form-item>
          <el-form-item>
            <el-select v-model="requestForm.special" placeholder="选择类型进行查询" clearable>
              <el-option
                v-for="item in specialList"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="requestForm.action" placeholder="选择状态进行查询" clearable>
              <el-option
                v-for="item in actionList"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryCaseList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="success" @click="addTab(0, '新增用例')">添 加</el-button>
          </el-form-item>
        </el-form>
        <el-empty v-if="!caseList.length" description="暂无用例, 快来添加一个吧" />
        <el-table v-else header-row-class-name="table-header-style" :data="caseList" stripe style="width: 100%">
          <el-table-column type="index" label="编号" width="60" align="center" />
          <el-table-column prop="name" label="用例名称" show-overflow-tooltip />
          <el-table-column prop="desc" label="用例描述" show-overflow-tooltip />
          <el-table-column label="优先级" width="80px" align="center">
            <template v-slot="scope">
              <div
                v-for="item in priorityList"
                :key="item.id"
              >
                <span v-if="scope.row.priority === item.id">
                  {{ item.name }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用例类型" width="80px" align="center">
            <template v-slot="scope">
              <div
                v-for="item in specialList"
                :key="item.key"
              >
                <el-tag
                  v-if="scope.row.special === item.key"
                  :type="item.type"
                  disable-transitions
                >
                  {{ item.label }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用例状态" width="80px" align="center">
            <template v-slot="scope">
              <div
                v-for="item in actionList"
                :key="item.key"
              >
                <el-tag
                  v-if="scope.row.action === item.key"
                  :type="item.type"
                  disable-transitions
                  effect="dark"
                >
                  {{ item.label }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateName" label="更新人" width="100px" align="center" />
          <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <el-button
                icon="el-icon-edit"
                size="mini"
                type="text"
                @click.stop="addTab(scope.row.id, scope.row.name, scope.row)"
              >编辑</el-button>
              <el-button
                class="delete-button"
                icon="el-icon-delete"
                size="mini"
                type="text"
                @click.stop="deleteCaseInfo(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="caseList.length"
          style="text-align: right; margin-top: 15px"
          background
          :page-size="requestForm.pageSize"
          layout="total, prev, pager, next"
          :total="requestForm.total"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        <case-edit :module-id="moduleId" :update-form="item.content" @save="saveEvent" @delete="deleteCaseInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import caseEdit from '@/views/case/client/edit'
import { deleteCaseInfo, getCaseList } from '@/api/business/case'
import { priority, actions, specials } from '@/utils/localType'
const projectId = JSON.parse(localStorage.getItem('projectId'))
export default {
  components: {
    caseEdit
  },
  props: {
    moduleId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editableTabsValue: 'first',
      editableTabs: [],
      tabIndex: 2,
      requestForm: {
        name: null,
        page: 1,
        pageSize: 20,
        projectId: projectId,
        folderId: this.moduleId,
        special: null,
        action: null
      },
      caseList: [],
      specialList: specials,
      actionList: actions,
      priorityList: priority,
      caseInfo: {},
      caseLoading: true
    }
  },
  watch: {
    // 当左侧树发生变化时触发的钩子
    moduleId(newData, oldData) {
      if (!oldData || newData.toString() === oldData.toString()) return
      this.requestForm.folderId = newData
      this.editableTabsValue = 'first'
      this.queryCaseList()
    }
  },
  created() {
    this.getCaseList()
  },
  methods: {
    // 添加标签页触发的钩子
    addTab(targetName, title, caseInfo = null) {
      const tabsValue = String(targetName)
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (tabsValue === this.editableTabs[i].name) {
          this.editableTabsValue = tabsValue
          return
        }
      }
      this.editableTabs.push({
        title: title,
        name: tabsValue,
        content: JSON.parse(JSON.stringify(caseInfo))
      })
      this.editableTabsValue = tabsValue
    },
    // 删除标签页时触发的钩子
    removeTab(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            } else {
              activeName = 'first'
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    // 查询用例列表
    queryCaseList() {
      this.requestForm.page = 1
      this.getCaseList()
    },
    refreshRequest() {
      this.requestForm.name = null
      this.requestForm.action = null
      this.requestForm.special = null
      this.$refs.requestFormRef.resetFields()
      this.getCaseList()
    },
    // 获取用例列表列表
    async getCaseList() {
      this.caseLoading = true
      const { items, total } = await getCaseList(this.requestForm)
      this.caseList = items
      this.requestForm.total = total
      this.caseLoading = false
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getCaseList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 点击保存时的钩子
    saveEvent(value, model) {
      this.editableTabs.forEach(item => {
        const models = model ? String(value.id) : '0'
        if (item.name === models) {
          item.title = value.name
          item.name = String(value.id)
          item.content = value
          this.editableTabsValue = item.name
        }
      })
      this.getCaseList()
    },
    // 删除测试用例
    async deleteCaseInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      this.removeTab(String(id))
      await deleteCaseInfo({ id })
      await this.getCaseList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
</style>

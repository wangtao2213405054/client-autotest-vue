<template>
  <div>
    <el-tabs v-model="editableTabsValue" stretch @tab-remove="removeTab">
      <el-tab-pane label="用例列表" name="first">
        <el-form ref="requestFormRef" :model="requestForm" inline>
          <el-form-item>
            <el-input v-model="requestForm.name" placeholder="输入设备名称查询" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryCaseList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="success" @click="addTab('新增用例')">添 加</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        <case-edit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import caseEdit from '@/views/case/client/edit'
export default {
  components: {
    caseEdit
  },
  props: {
    moduleId: {
      type: Number,
      default: () => null
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
        pageSize: 20
      }
    }
  },
  methods: {
    addTab(targetName) {
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (targetName === this.editableTabs[i].name) {
          this.editableTabsValue = targetName
          return
        }
      }
      this.editableTabs.push({
        title: targetName,
        name: targetName,
        content: 'New Tab content'
      })
      this.editableTabsValue = targetName
    },
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
    }
  }
}
</script>

<style scoped>

</style>

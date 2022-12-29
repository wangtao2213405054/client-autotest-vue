<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item
          label="映射名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入映射名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入映射名称" clearable />
        </el-form-item>
        <el-form-item
          label="平台标识"
          prop="platformName"
          :rules="[
            { required: true, message: '请选择平台标识（platformName映射）', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="addForm.platformName"
            placeholder="请选择平台标识"
            clearable
          >
            <el-option
              v-for="item in platformList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(items, index) in addForm.mapping"
          :key="items.key"
          :label="'映射' + (index + 1) + ':'"
        >
          <el-collapse v-model="items.collapse">
            <el-collapse-item name="items">
              <template slot="title">
                <div style="width: 100%; margin-right: 20px">
                  <p style="float: left">
                    <span style="font-weight: bolder">{{ items.type === 'input' ? '输入框': '选择器' }}: </span>
                    <span style="color: #606266"> {{ items.title }} </span>
                  </p>
                  <p style="float: right; margin-bottom: 10px">
                    <el-tooltip class="item" effect="dark" content="添加自定义选择器的绑定值和展示值" placement="top">
                      <el-button
                        v-if="items.type === 'select'"
                        plain
                        type="success"
                        size="mini"
                        @click.stop="sourcePush(items.source)"
                      >添 加</el-button>
                    </el-tooltip>
                    <el-button
                      plain
                      type="danger"
                      size="mini"
                      @click.stop="deleteFunc(index)"
                    >删 除</el-button>
                  </p>
                </div>
              </template>
              <div class="borderDiv">
                <el-form-item
                  label="映射名称"
                  :prop="'mapping.' + index + '.title'"
                  :rules="[
                    { required: true, message: '请输入映射名称', trigger: 'blur' },
                    { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input
                    v-model="items.title"
                    placeholder="请输入映射名称"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="映射说明"
                  :prop="'mapping.' + index + '.docs'"
                  :rules="[
                    { required: true, message: '请输入映射说明', trigger: 'blur' },
                    { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input
                    v-model="items.docs"
                    placeholder="请输入映射说明"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="映射标识"
                  :prop="'mapping.' + index + '.param'"
                  :rules="[
                    { required: true, message: '请输入映射标识', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input
                    v-model="items.param"
                    placeholder="请输入映射标识"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="数据类型"
                  :prop="'mapping.' + index + '.dataType'"
                  :rules="[
                    { required: true, message: '请选择此映射的数据类型', trigger: 'blur' },
                  ]"
                >
                  <el-select
                    v-model="items.dataType"
                    size="small"
                    style="width: 100%"
                    placeholder="请选择此映射的数据类型"
                    clearable
                  >
                    <el-option
                      v-for="item in paramsTypeList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.value }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="默认值"
                >
                  <el-input
                    v-model="items.default"
                    placeholder="请输入此参数的默认值"
                    clearable
                  />
                </el-form-item>
                <div
                  v-for="(item, i) in items.source"
                  :key="item.key"
                >
                  <el-row :gutter="20">
                    <el-col :span="7">
                      <el-form-item
                        label="绑定变量"
                        :prop="'mapping.' + index + '.source.' + i + '.param'"
                        :rules="[
                          { required: true, message: '请输入绑定变量', trigger: 'blur' },
                          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                        ]"
                      >
                        <el-input
                          v-model="item.param"
                          placeholder="请输入绑定变量"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item
                        label="绑定类型"
                        :prop="'mapping.' + index + '.source.' + i + '.dataType'"
                        :rules="[
                          { required: true, message: '请选择参数变量的数据类型', trigger: 'blur' },
                        ]"
                      >
                        <el-select
                          v-model="item.dataType"
                          size="small"
                          style="width: 100%"
                          placeholder="请选择此变量数据类型"
                          clearable
                        >
                          <el-option
                            v-for="paramItem in paramsTypeList"
                            :key="paramItem.value"
                            :label="paramItem.value"
                            :value="paramItem.value"
                          >
                            <span style="float: left">{{ paramItem.value }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ paramItem.label }}</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item
                        label="绑定标题"
                        :prop="'mapping.' + index + '.source.' + i + '.label'"
                        :rules="[
                          { required: true, message: '请输入绑定标题', trigger: 'blur' },
                          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
                        ]"
                      >
                        <el-input
                          v-model="item.label"
                          placeholder="请输入绑定标题"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-button
                          plain
                          size="small"
                          type="danger"
                          @click="deleteSource(items.source, i)"
                        >删 除</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-dropdown trigger="click" style="margin-right: 12px" placement="top" @command="clickFunc">
          <el-button type="success">添加映射</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="select">选择器</el-dropdown-item>
            <el-dropdown-item command="input">输入框</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入映射名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="requestForm.platformName"
          placeholder="选择平台映射查询"
          clearable
        >
          <el-option
            v-for="item in platformList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryCapabilitiesList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addMapping">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="capabilitiesList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="80" align="center" />
      <el-table-column prop="name" label="映射名称" width="200px" />
      <el-table-column prop="platformName" label="平台映射">
        <template v-slot="scope">
          <div
            v-for="item in platformList"
            :key="item.id"
          >
            <span v-if="item.id === scope.row.platformName">{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateCapabilities(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteCapabilitiesInfo(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; margin-top: 15px"
      background
      :page-size="requestForm.pageSize"
      layout="total, prev, pager, next"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import { dataType } from '@/utils/localType'
import { platform } from '@/utils/localType'
import { editCapabilitiesInfo, getCapabilitiesList, deleteCapabilitiesInfo } from '@/api/devices/capabilities'
export default {
  name: 'Capabilities',
  data() {
    return {
      title: '新增映射',
      dialogVisible: false,
      paramsTypeList: dataType,
      addForm: {
        name: null,
        platformName: null,
        mapping: []
      },
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        platformName: null,
        name: null
      },
      capabilitiesList: [],
      platformList: platform
    }
  },
  created() {
    this.getCapabilitiesList()
  },
  methods: {
    // 条件查询
    queryCapabilitiesList() {
      this.requestForm.page = 1
      this.getCapabilitiesList()
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.platformName = null
      this.$refs.requestFormRef.resetFields()
      this.queryCapabilitiesList()
    },
    // 添加映射
    addMapping() {
      this.title = '新增映射'
      this.dialogVisible = true
    },
    sourcePush(source) {
      source.push({
        key: Date.now(),
        label: null,
        param: null,
        dataType: null
      })
    },
    deleteSource(source, index) {
      source.splice(index, 1)
    },
    deleteFunc(index) {
      this.addForm.mapping.splice(index, 1)
    },
    // 添加映射
    clickFunc(funcType) {
      this.addForm.mapping.push({
        type: funcType,
        title: null,
        docs: null,
        param: null,
        source: [],
        dataType: null,
        key: Date.now(),
        collapse: 'items',
        default: null
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editCapabilitiesInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getCapabilitiesList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取设备列表
    async getCapabilitiesList() {
      const { items, total } = await getCapabilitiesList(this.requestForm)
      this.capabilitiesList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getElementList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 删除功能映射
    async deleteCapabilitiesInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该映射, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteCapabilitiesInfo({ id })
      await this.getCapabilitiesList()
    },
    // 编辑映射信息时的钩子
    updateCapabilities(info) {
      this.addForm = JSON.parse(JSON.stringify(info))
      this.title = '编辑映射'
      this.dialogVisible = true
    },
    // 关闭弹窗时的钩子
    closeDialog() {
      this.addForm = {
        name: null,
        platformName: null,
        mapping: []
      }
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.borderDiv {
  border-style: solid;
  border-color: #DCDFE6;
  border-width: 1px;
  background-color: #FFFFFF;
  padding: 10px;
  .item {
    margin-top: 10px;
  }
}
.el-collapse {
  border-top: 0;
  //border-bottom: 0;
  ::v-deep .el-collapse-item__header {
    height: 32px;
    //border-bottom: 0;
  }
}
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
</style>

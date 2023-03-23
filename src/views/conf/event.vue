<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item
          label="事件名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入事件名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入事件名称" clearable />
        </el-form-item>
        <el-form-item
          label="函数映射"
          prop="mapping"
          :rules="[
            { required: true, message: '请输入此事件的 Python 函数映射', trigger: 'blur' },
            { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.mapping" placeholder="请输入事件对应的驱动端函数名称" clearable />
        </el-form-item>
        <el-form-item
          label="事件描述"
          prop="desc"
          :rules="[
            { required: true, message: '请输入此事件详细的使用描述', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="addForm.desc"
            placeholder="请输入事件描述"
            type="textarea"
            :rows="2"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="事件截图"
        >
          <span slot="label">
            是否截图
            <el-tooltip
              effect="dark"
              trigger="click"
              content="当此事件完成后会进行截图，并将截图信息添加至 GIF 动图中"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </span>
          <el-switch
            v-model="addForm.screenshot"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item
          label="事件类型"
          prop="subset"
          :rules="[
            { required: true, message: '请选择此事件的事件类型', trigger: 'blur' }
          ]"
        >
          <el-radio-group v-model="addForm.subset">
            <el-radio-button :label="false">普通事件</el-radio-button>
            <el-radio-button :label="true">允许添加子节点</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="事件归属"
          prop="platform"
          :rules="[
            { required: true, message: '请选择此事件的归属信息', trigger: 'blur' }
          ]"
        >
          <el-radio-group v-model="addForm.platform">
            <el-radio
              v-for="item in platformList"
              :key="item.label"
              :label="item.label"
              border
              class="eventPlatform"
            >
              <span>{{ item.title }}</span>
              <br>
              <div class="items">{{ item.desc }}</div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-for="(items, index) in addForm.func"
          :key="items.key"
          :label="'参数' + (index + 1) + ':'"
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
                        v-if="items.selectModel === 'Custom'"
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
                  label="简要说明"
                  :prop="'func.' + index + '.title'"
                  :rules="[
                    { required: true, message: '请输入此参数的简要说明', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input
                    v-model="items.title"
                    placeholder="请输入此参数的简要说明"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="参数变量"
                  :prop="'func.' + index + '.param'"
                  :rules="[
                    { required: true, message: '请输入要绑定的参数变量', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input
                    v-model="items.param"
                    placeholder="请输入要绑定的参数变量"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="参数类型"
                  :prop="'func.' + index + '.dataType'"
                  :rules="[
                    { required: true, message: '请选择参数变量的数据类型', trigger: 'blur' },
                  ]"
                >
                  <el-select
                    v-model="items.dataType"
                    size="small"
                    style="width: 100%"
                    placeholder="请选择参数变量的数据类型"
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
                  label="详细说明"
                  :prop="'func.' + index + '.placeholder'"
                  :rules="[
                    { required: true, message: '请输入此参数的详细说明', trigger: 'blur' },
                  ]"
                >
                  <el-input
                    v-model="items.placeholder"
                    placeholder="请输入此参数的详细说明"
                    clearable
                  />
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
                <el-form-item
                  v-if="items.type === 'select'"
                  label="选择器"
                  :prop="'func.' + index + '.selectModel'"
                  :rules="[
                    { required: true, message: '请选择选择器的展示类型', trigger: 'blur' },
                  ]"
                >
                  <el-select
                    v-model="items.selectModel"
                    style="width: 100%"
                    placeholder="请选择选择器类型"
                    clearable
                    @change="changeModelFunc(items.source, $event)"
                  >
                    <el-option
                      v-for="item in selectTypeList"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <div
                  v-for="(item, i) in items.source"
                  :key="item.key"
                >
                  <el-row :gutter="20">
                    <el-col :span="7">
                      <el-form-item
                        label="绑定变量"
                        :prop="'func.' + index + '.source.' + i + '.param'"
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
                        :prop="'func.' + index + '.source.' + i + '.dataType'"
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
                        :prop="'func.' + index + '.source.' + i + '.label'"
                        :rules="[
                          { required: true, message: '请输入绑定标题', trigger: 'blur' },
                          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
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
          <el-button type="success">添加参数</el-button>
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
        <el-input v-model="requestForm.name" placeholder="输入事件名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="requestForm.mapping" placeholder="输入事件映射查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryEventList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="eventList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="事件名称" width="200px" />
      <el-table-column prop="mapping" label="函数映射" width="250px" />
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click.stop="updateButton(scope.row)"
          >编辑</el-button>
          <el-button
            class="delete-button"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click.stop="deleteEventInfo(scope.row.id)"
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
import { deleteEventInfo, editEventInfo, getEventList } from '@/api/conf/event'
import { selectType } from '@/utils/localType'
const projectId = JSON.parse(localStorage.getItem('projectId'))
const mold = localStorage.getItem('mold')
export default {
  name: 'Event',
  data() {
    return {
      dialogVisible: false,
      title: null,
      addForm: {
        name: null,
        mapping: null,
        desc: null,
        platform: null,
        subset: false,
        func: [],
        projectId: projectId,
        screenshot: false
      },
      paramsTypeList: dataType,
      selectTypeList: selectType,
      eventList: [],
      requestForm: {
        page: 1,
        pageSize: 20,
        total: null,
        projectId: projectId,
        platform: mold,
        name: null,
        mapping: null
      },
      platformList: [
        { label: 'all', title: '所有项目', desc: '此事件可在所有项目中使用' },
        { label: 'exclusive', title: '项目专用', desc: '此事件仅可在此项目中使用' },
        { label: 'selenium', title: 'Web项目', desc: '此事件属于所有 Web 端项目' },
        { label: 'appium', title: 'App项目', desc: '此事件属于所有 App 端项目' }
      ]
    }
  },
  created() {
    this.getEventList()
  },
  methods: {
    // 条件查询
    queryEventList() {
      this.requestForm.page = 1
      this.getEventList()
    },
    // 重置请求信息
    refreshRequest() {
      this.requestForm.name = ''
      this.requestForm.mapping = ''
      this.$refs.requestFormRef.resetFields()
      this.getEventList()
    },
    clickFunc(funcType) {
      this.addForm.func.push({
        type: funcType,
        placeholder: null,
        title: null,
        param: null,
        source: [],
        default: null,
        dataType: null,
        key: Date.now(),
        selectModel: null,
        collapse: 'items'
      })
    },
    deleteFunc(index) {
      this.addForm.func.splice(index, 1)
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
    changeModelFunc(source, model) {
      if (model === 'Custom') {
        source.push({
          key: Date.now(),
          label: null,
          param: null,
          dataType: null
        })
      } else {
        source.splice(0, source.length)
      }
    },
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editEventInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getEventList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    async getEventList() {
      const { total, items } = await getEventList(this.requestForm)
      this.eventList = items
      this.requestForm.total = total
    },
    updateButton(row) {
      this.addForm = row
      this.title = '修改事件'
      this.dialogVisible = true
    },
    openDialog() {
      this.title = '添加事件'
      this.dialogVisible = true
    },
    closeDialog() {
      this.addForm = {
        name: null,
        mapping: null,
        desc: null,
        platform: null,
        func: [],
        subset: false,
        projectId: projectId,
        screenshot: false
      }
      this.$refs.addFormRef.clearValidate()
    },
    async deleteEventInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该元素, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteEventInfo({ id })
      await this.getEventList()
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getEventList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
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
.eventPlatform {
  height: 50px;
  .items {
    margin-top: 5px;
  }
}
::v-deep .table-header-style th {
  background-color: #E4E7ED;
  color: #303133;
}
</style>

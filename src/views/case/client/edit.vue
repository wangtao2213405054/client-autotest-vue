<template>
  <div>
    <el-form ref="addFormRef" :model="addForm" :show-message="false">
      <el-form-item
        prop="name"
        :rules="[
          { required: true, message: '请填写用例名称', trigger: 'blur' },
        ]"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <el-popover
              placement="bottom"
              width="500"
              trigger="click"
              :disabled="caseTips"
            >
              <div style="line-height: 25px; color: #303133">
                <div>1. 测试用例名称通常以简述整个测试过程而命名的</div>
                <div>2. 为确保用例顺序被打乱后仍然可以执行, 请确保用例
                  <span style="color: #409EFF">环境纯净</span>
                </div>
                <div>3. 即测试用例不依赖于上一条测试用例, 如有依赖项请在
                  <span style="color: #67C23A">前置用例</span>
                  中实现
                </div>
              </div>
              <el-button type="primary" size="mini" style="float: right; margin-top: 10px" @click="setPopover">不再提示</el-button>
              <el-input slot="reference" v-model="addForm.name" placeholder="请输入测试用例名称">
                <template slot="prepend">用例名称</template>
              </el-input>
            </el-popover>
          </el-col>
          <el-col :span="6">
            <div style="text-align: center">
              <el-button type="primary" @click="submitForm">保存</el-button>
              <el-button type="danger" @click="deleteCaseInfo">删除</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="前置用例">
            <span slot="label">
              前置用例
              <el-tooltip
                effect="dark"
                trigger="click"
                content="测试开始前（程序启动后）会优先执行前置用例, 当前置用例存在前置用例时, 会优先执行其前置用例"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-cascader
              v-model="addForm.prePosition"
              :props="loadSpecialCase"
              clearable
              style="width: 100%"
              :show-all-levels="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="后置用例">
            <span slot="label">
              后置用例
              <el-tooltip
                effect="dark"
                trigger="click"
                content="测试结束后（程序关闭前）会执行此后置用例, 当后置用例存在后置用例时, 会优先执行此后置用例"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-cascader
              v-model="addForm.postPosition"
              :props="loadSpecialCase"
              clearable
              style="width: 100%"
              :show-all-levels="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="优先级"
            prop="priority"
            :rules="[
              { required: true, message: '请选择优先级', trigger: 'blur' },
            ]"
          >
            <span slot="label">
              优先级
              <el-tooltip
                effect="dark"
                trigger="click"
                content="在创建任务时, 可以通过优先级进行排序或筛选"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.priority"
              placeholder="请选择优先级"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in priorityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="所属模块"
            prop="moduleList"
            :rules="[
              { required: true, message: '请选择所属模块', trigger: 'blur' },
            ]"
          >
            <el-cascader
              v-model="addForm.moduleList"
              :props="loadModule"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始版本">
            <span slot="label">
              开始版本
              <el-tooltip
                effect="dark"
                trigger="click"
                content="执行任务时, 当APP的版本低于此用例的开始版本, 那么此用例将不会被执行"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.startVersion"
              placeholder="请选择开始版本"
              style="width: 100%"
              clearable
              @visible-change="getVersionList"
            >
              <el-option
                v-for="item in versionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束版本">
            <span slot="label">
              结束版本
              <el-tooltip
                effect="dark"
                trigger="click"
                content="执行任务时, 当APP的版本高于此用例的结束版本, 那么此用例将不会被执行"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.endVersion"
              placeholder="请选择结束版本"
              style="width: 100%"
              clearable
              @visible-change="getVersionList"
            >
              <el-option
                v-for="item in versionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="所属集合"
            prop="setInfo"
            :rules="[
              { required: true, message: '请选择所属集合', trigger: 'blur' },
            ]"
          >
            <span slot="label">
              所属集合
              <el-tooltip
                effect="dark"
                trigger="click"
                content="一条用例至少包含一个普通集合, 当执行条件中包含此集合则此用例将会被执行, 集合中不包含此用例时, 此用例将会被跳过"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.setInfo"
              placeholder="请选择所属集合"
              style="width: 100%"
              multiple
              collapse-tags
              clearable
              @visible-change="getSetList"
            >
              <el-option
                v-for="item in setList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="所属平台"
            prop="platform"
            :rules="[
              { required: true, message: '请选择所属平台', trigger: 'blur' },
            ]"
          >
            <span slot="label">
              所属平台
              <el-tooltip
                effect="dark"
                trigger="click"
                content="在部分应用中, 可能出现多个可选平台, 如移动端的 Android 和 iOS 平台, 此用例可以只在某些平台中运行或在全部平台运行"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.platform"
              placeholder="请选择所属平台"
              style="width: 100%"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in platformList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任人">
            <span slot="label">
              责任人
              <el-tooltip
                effect="dark"
                trigger="click"
                content="当此用例失败或达成某种条件后, 会以邮件的形式通知到对应的责任人"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-select
              v-model="addForm.officerList"
              style="width: 100%"
              multiple
              placeholder="请输入责任人"
              filterable
              remote
              clearable
              :loading="selectLoading"
              :remote-method="loadingOfficer"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label-width="90px">
            <span slot="label">
              用例状态
              <el-tooltip
                effect="dark"
                content="被废弃的用例将不会进入执行过程 ~"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-radio-group v-model="addForm.action" style="margin-left: 20px">
              <el-radio
                v-for="item in actionList"
                :key="item.key"
                :label="item.key"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="90px">
            <span slot="label">
              用例类型
              <el-tooltip
                effect="dark"
                content="特殊用例不会被执行, 只可以被前、后置用例所调用 ~"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </span>
            <el-radio-group v-model="addForm.special" style="margin-left: 20px">
              <el-radio
                v-for="item in specialList"
                :key="item.key"
                :label="item.key"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用例说明">
        <el-input
          v-model="addForm.desc"
          type="textarea"
          :rows="4"
          placeholder="请输入用例步骤说明"
        />
      </el-form-item>
    </el-form>
    <steps ref="steps" :steps="addForm.caseSteps" />
  </div>
</template>

<script>
import { getVersionList } from '@/api/business/version'
import { getSetList } from '@/api/business/set'
import { platform, priority, specials, actions } from '@/utils/localType'
import { getManagementList } from '@/api/account/management'
import { getModulesList } from '@/api/business/folder'
import { editCaseInfo, getCaseList } from '@/api/business/case'
import steps from '@/views/case/client/steps'
const projectId = JSON.parse(localStorage.getItem('projectId'))
const mold = localStorage.getItem('mold')
export default {
  components: {
    steps
  },
  props: {
    moduleId: {
      type: Array,
      default: () => []
    },
    updateForm: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      caseTips: JSON.parse(localStorage.getItem('caseTips')),
      addForm: {
        name: null, // 用例名称
        prePosition: null, // 前置条件
        postPosition: null, // 后置条件
        desc: null, // 用例备注
        special: false, // 特殊标记
        action: true, // 用例状态
        startVersion: null, // 开始版本
        endVersion: null, // 结束版本
        setInfo: [], // 所属集合
        platform: [], // 所属平台
        priority: null, // 优先级
        officerList: [], // 责任人
        moduleList: this.moduleId, // 所属模块
        caseSteps: [], // 用例步骤
        projectId: projectId
      },
      specialList: specials,
      actionList: actions,
      setList: [],
      versionList: [],
      moduleList: [],
      platformList: [],
      priorityList: priority,
      selectLoading: false,
      userList: [],
      loadModule: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          const items = await getModulesList({ projectId, id: node.data ? node.data.id : level })
          if (level === 0) {
            items.forEach(item => {
              item.disabled = item.leaf
            })
          }
          resolve(items)
        },
        value: 'id',
        label: 'name'
      },
      // 加载特殊用例
      loadSpecialCase: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level, data } = node
          if (level <= 1) {
            const module = await getModulesList({ projectId, id: data ? data.id : level, special: true })
            module.forEach(item => {
              item.disabled = level === 0 ? item.leaf : item.exist
              item.leaf = level === 0 ? item.leaf : item.exist
            })
            resolve(module)
          } else {
            const request = {
              page: 1,
              pageSize: 9999,
              special: true,
              projectId,
              folderId: [1, data.id]
            }
            const { items } = await getCaseList(request)
            items.forEach(item => {
              item.leaf = true
            })
            resolve(items)
          }
        },
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    if (this.updateForm) {
      this.addForm = this.updateForm
    }
    this.filterPlatform()
    this.getVersionList()
    this.getSetList()
  },
  methods: {
    // 设置不再弹出提示
    setPopover() {
      localStorage.setItem('caseTips', 'true')
      this.caseTips = true
    },
    // 获取版本列表
    async getVersionList(bool = true) {
      if (bool) {
        const { items } = await getVersionList({ page: 1, pageSize: 9999, projectId })
        this.versionList = items
      }
    },
    // 获取集合列表
    async getSetList(bool = true) {
      if (bool) {
        const { items } = await getSetList({ page: 1, pageSize: 9999, projectId, special: false })
        this.setList = items
      }
    },
    // 根据项目过滤所属平台
    filterPlatform() {
      // 根据项目过滤
      this.platformList = platform.filter(item => {
        return mold === item.mold
      })
      // 如果只有一个平台则默认选中
      if (this.platformList.length === 1 && !this.updateForm) {
        this.addForm.platform.push(this.platformList[0].id)
      }
    },
    // 责任人加载器
    async loadingOfficer(query) {
      if (query !== '') {
        this.loading = true
        const requestForm = {
          page: 1,
          pageSize: 20,
          name: query
        }
        try {
          const { items } = await getManagementList(requestForm)
          this.userList = items
        } finally {
          this.loading = false
        }
      } else {
        this.userList = []
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          if (!this.addForm.caseSteps.length) {
            return this.$message.error('用例步骤不能为空')
          }
          const flag = this.$refs.steps.validate()
          if (flag) {
            const caseInfo = await editCaseInfo(this.addForm)
            this.$message.success('保存成功')
            this.$emit('save', caseInfo, !!this.addForm.id)
            this.addForm = caseInfo
          } else {
            this.$message.error('请检查用例步骤信息是否完善')
          }
        } else {
          this.$message.error('请检查基础信息是否完善')
        }
      })
    },
    // 删除用例
    deleteCaseInfo() {
      if (this.addForm.id) {
        this.$emit('delete', this.addForm.id)
      } else {
        this.$message.warning('未保存的用例无法删除哟~')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//::v-deep .el-form-item--small .el-form-item__label {
//  line-height: 20px;
//}
::v-deep .el-form-item__content {
  line-height: 32px;
  position: inherit;
  font-size: 14px;
}
.text-background {
  background-color: #EBEEF5;
  border-radius: 4px;
  padding: 1px
}
</style>

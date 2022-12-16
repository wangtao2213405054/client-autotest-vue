<template>
  <div>
    <el-form ref="addFormRef" :model="addForm">
      <el-form-item>
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
              <el-button type="primary" @click="saveApi">保存</el-button>
              <el-button type="danger">删除</el-button>
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优先级">
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="所属模块">
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="所属类型">
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属平台">
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
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
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
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
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">废弃</el-radio>
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
              <el-radio :label="false">普通用例</el-radio>
              <el-radio :label="true">特殊用例</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用例说明">
        <el-input
          v-model="addForm.background"
          type="textarea"
          :rows="4"
          placeholder="请输入接口说明"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      caseTips: JSON.parse(localStorage.getItem('caseTips')),
      addForm: {
        name: null,
        special: false,
        action: true
      }
    }
  },
  methods: {
    // 设置不再弹出提示
    setPopover() {
      localStorage.setItem('caseTips', 'true')
      this.caseTips = true
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

<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="150px">
        <el-form-item
          label="设备名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item
          label="所属平台"
          prop="platformName"
          :rules="[
            { required: true, message: '请选择所属平台', trigger: 'blur' }
          ]"
        >
          <el-select
            v-model="addForm.platformName"
            placeholder="请选择所属平台"
            clearable
            value-key="id"
            @visible-change="getMappingList"
            @change="changePlatform"
          >
            <el-option
              v-for="item in mappingList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(mapping, index) in setMappingList"
          :key="mapping.key"
          :label="mapping.param"
          :prop="'mapping.' + index + '.value'"
          :rules="{required: true, message: mapping.param + '不能为空', trigger: 'blur'}"
        >
          <el-input
            v-if="mapping.type === 'input'"
            v-model="addForm.mapping[index].value"
            clearable
            :placeholder="mapping.title"
          />
          <el-select
            v-else
            v-model="addForm.mapping[index].value"
            :placeholder="mapping.title"
            clearable
          >
            <el-option
              v-for="item in mapping.source"
              :key="item.key"
              :label="item.label"
              :value="item.param"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="addDevice">添 加</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getCapabilitiesList } from '@/api/devices/capabilities'

export default {
  data() {
    return {
      requestForm: {},
      dialogVisible: false,
      title: '添加设备',
      addForm: {
        name: null,
        platformName: null,
        mapping: []
      },
      mappingList: [],
      setMappingList: []
    }
  },
  methods: {
    // 关闭弹窗钩子
    closeDialog() {},
    // 添加设备
    addDevice() {
      this.title = '添加设备'
      this.dialogVisible = true
    },
    // 提交表单
    submitForm() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          this.addForm.platformName = this.addForm.platformName.platformName
          // await editMasterInfo(this.addForm)
          this.$message.success('保存成功')
          // this.dialogVisible = false
          // await this.getMasterList()
        } else {
          this.$message.error('请检查信息是否完善')
        }
      })
    },
    // 获取映射列表
    async getMappingList() {
      const { items } = await getCapabilitiesList({ page: 1, pageSize: 9999 })
      this.mappingList = items
    },
    // 所属平台变化时的钩子
    changePlatform(value) {
      const { mapping } = value
      this.addForm.mapping = []
      for (let i = 0; i < mapping.length; i++) {
        this.addForm.mapping.push({
          param: mapping[i]['param'],
          value: mapping[i]['default'] ? mapping[i]['default'] : null,
          type: mapping[i]['dataType'],
          key: mapping[i]['key']
        })
      }
      this.setMappingList = mapping
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

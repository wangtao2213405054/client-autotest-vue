<template>
  <el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        hide-required-asterisk
      >
        <el-form-item label="元素名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入元素名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="元素内容" prop="label">
          <el-input
            v-model="addForm.label"
            placeholder="请输入元素内容"
            clearable
          />
        </el-form-item>
        <el-form-item label="元素备注" prop="desc">
          <el-input
            v-model="addForm.desc"
            type="textarea"
            :row="2"
            placeholder="请输入元素备注"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-checkbox-group v-model="addForm.platform">
            <el-checkbox label="selenium">
              Web端
            </el-checkbox>
            <el-checkbox label="appium">移动端</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editElementInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-form style="text-align: right">
      <el-form-item>
        <el-button type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="elementList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="元素名称" width="250px" />
      <el-table-column prop="label" label="元素内容" width="250px" />
      <el-table-column prop="desc" label="元素描述" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" width="140px" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
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
            @click.stop="deleteElementInfo(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; margin-top: 15px"
      background
      :page-size="requestForm.size"
      layout="total, prev, pager, next"
      :total="requestForm.total"
    />
  </el-card>
</template>

<script>
import { editElementInfo, getElementList, deleteElementInfo } from '@/api/conf/element'

export default {
  name: 'Element',
  data() {
    return {
      dialogVisible: false,
      title: '',
      addForm: {
        id: null,
        name: null,
        label: null,
        desc: null,
        platform: []
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入元素名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入元素值', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        platform: [
          { required: true, message: '请选择所属平台', trigger: 'blur' }
        ]
      },
      elementList: [],
      requestForm: {
        page: 1,
        size: 20,
        total: null,
        platform: localStorage.getItem('mold')
      }
    }
  },
  created() {
    this.getElementList()
  },
  methods: {
    editElementInfo() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editElementInfo(this.addForm)
          this.$message.success('保存成功')
          this.dialogVisible = false
          await this.getElementList()
        }
      })
    },
    async getElementList() {
      const { items, total } = await getElementList(this.requestForm)
      this.elementList = items
      this.requestForm.total = total
    },
    async deleteElementInfo(id) {
      console.log(id, 'deleteId')
      const clickConfirmResult = await this.$confirm('此操作将永久删除该元素, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteElementInfo({ id })
      await this.getElementList()
    },
    updateButton(row) {
      this.addForm = row
      this.title = '修改元素'
      this.dialogVisible = true
    },
    openDialog() {
      this.title = '添加元素'
      this.dialogVisible = true
    },
    closeDialog() {
      this.addForm = {
        id: null,
        name: null,
        label: null,
        desc: null,
        platform: []
      }
      this.$refs.addFormRef.clearValidate()
    }
  }
}
</script>

<style scoped>

</style>

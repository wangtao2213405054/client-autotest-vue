<template>
  <div class="user-activity">
    <el-dialog
      :title="title"
      :visible.sync="visibleBool"
      width="600px"
      @close="closeDialog"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" hide-required-asterisk label-width="80px" size="small">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item label="项目描述" prop="describe">
          <el-input
            v-model="addForm.describe"
            placeholder="请输入项目描述"
            type="textarea"
            :rows="4"
            clearable
          />
        </el-form-item>
        <el-form-item label="项目类型">
          <div>
            <el-radio v-model="addForm.mold" style="height: 55px" label="appium" border>
              移动端
              <div style="margin-top: 10px">基于 Appium 框架</div>
            </el-radio>
            <el-radio v-model="addForm.mold" style="height: 55px" label="selenium" border>
              Web端
              <div style="margin-top: 10px">基于 Selenium 框架</div>
            </el-radio>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleBool = false">取 消</el-button>
        <el-button type="primary" @click="editProjectInfo">确 定</el-button>
      </span>
    </el-dialog>
    <div v-for="item in projectList" :key="item.id">
      <div class="post" @click="enterProjectPage(item.id, item.mold)">
        <div class="user-block">
          <img class="img-circle" alt="" :src="item['avatar'] + avatarPrefix">
          <span class="username text-muted">{{ item['name'] }}</span>
          <el-tag v-if="item.mold === 'appium'" class="mold" type="success">移动端</el-tag>
          <el-tag v-else class="mold" type="warning">Web端</el-tag>
          <span class="description">{{ item['label'] }}</span>
        </div>
        <p>
          {{ item['describe'] }}
        </p>
        <ul class="list-inline" style="text-align: right">
          <li>
            <el-button icon="el-icon-edit" size="mini" type="text" @click.stop="updateButton(item)">编辑</el-button>
          </li>
          <li>
            <el-button class="delete-button" icon="el-icon-delete" size="mini" type="text" @click.stop="deleteProjectInfo(item.id)">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
    <el-empty v-if="!projectList.length" description="暂无项目, 快来创建一个吧" />
    <el-pagination
      style="text-align: right"
      background
      :page-size="requestForm.pageSize"
      layout="total, prev, pager, next"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { deleteProjectInfo, editProjectInfo, getProjectList } from '@/api/business/project'

const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatarPrefix,
      carouselPrefix,
      projectList: [],
      requestForm: {
        name: '',
        page: 1,
        pageSize: 4,
        total: null
      },
      visibleBool: false,
      addForm: {
        id: null,
        name: null,
        describe: null,
        avatar: null,
        mold: 'appium'
      },
      addFormRules: {
        name: [{ required: true, message: '请输入正确的项目名称', trigger: 'blur' }, { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
        describe: [{ required: true, message: '请输入正确的项目背景', trigger: 'blur' }, { min: 5, max: 512, message: '长度在 5 到 512 个字符', trigger: 'blur' }]
      },
      title: '创建项目'
    }
  },
  watch: {
    dialogVisible(newData) {
      this.visibleBool = newData
    }
  },
  created() {
    this.getProjectList()
    this.visibleBool = this.dialogVisible
  },
  methods: {
    // 进入项目详情页面
    enterProjectPage(id, mold) {
      console.log('点击测试呀' + id)
      localStorage.setItem('projectId', id)
      localStorage.setItem('mold', mold)
      this.$router.push('/dashboard')
    },
    // 获取项目列表
    async getProjectList() {
      const { items, total } = await getProjectList(this.requestForm)
      this.projectList = items
      this.requestForm.total = total
    },
    // 页码改变
    handleCurrentChange(newPage) {
      this.requestForm.page = newPage
      this.getProjectList()
      // 返回顶部
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:dialogVisible', false)
      this.addForm = {
        id: null,
        name: null,
        describe: null,
        avatar: null,
        mold: 'appium'
      }
      this.$refs.addFormRef.clearValidate()
      this.title = '创建项目'
    },
    // 创建/编辑项目
    editProjectInfo() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (valid) {
          await editProjectInfo(this.addForm)
          this.visibleBool = false
          await this.getProjectList()
        }
      })
    },
    // 编辑项目
    updateButton(value) {
      this.addForm.id = value['id']
      this.addForm.name = value['name']
      this.addForm.describe = value['describe']
      this.addForm.avatar = value['avatar']
      this.addForm.mold = value['mold']
      this.title = '编辑项目'
      this.visibleBool = true
    },
    // 删除项目
    async deleteProjectInfo(id) {
      const clickConfirmResult = await this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (clickConfirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await deleteProjectInfo({ id })
      await this.getProjectList()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }
    .mold {
      display: block;
      float: right;
      margin-right: 10px;
      align-items: center;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>

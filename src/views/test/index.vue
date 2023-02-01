<template>
  <div class="user-activity">
    <div v-for="item in projectList" :key="item.id">
      <div class="post">
        <div class="user-block">
          <img class="img-circle" alt="" :src="item.avatar + avatarPrefix">
          <span class="username text-muted">{{ item['name'] }}</span>
          <span
            v-for="status in taskStatusList"
            :key="status.status"
            class="mold"
          >
            <el-tag v-if="item.status === status.status" :type="status.type" effect="dark">{{ status.label }}</el-tag>
          </span>
          <span class="description">{{ item['username'] + ' 创建于 ' + item['createTime'] }}</span>
        </div>
        <p>
          {{ item['describe'] }}
        </p>
        <el-descriptions :column="5">
          <el-descriptions-item label="所属平台">{{ item['platform'] }}</el-descriptions-item>
          <el-descriptions-item label="运行环境">{{ item['environmentalName'] }}</el-descriptions-item>
          <el-descriptions-item label="执行设备">{{ item['devicesName'] }}</el-descriptions-item>
          <el-descriptions-item label="用例数量">{{ item['count'] }}</el-descriptions-item>
          <el-descriptions-item label="启动链接">{{ item['url'] }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
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
import { getTaskList } from '@/api/task/center'
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
      avatarList: [
        require('@/icons/png/mouse.png'), require('@/icons/png/ox.png'), require('@/icons/png/tiger.png'),
        require('@/icons/png/rabbit.png'), require('@/icons/png/dragon.png'), require('@/icons/png/snake.png'),
        require('@/icons/png/horse.png'), require('@/icons/png/sheep.png'), require('@/icons/png/monkey.png'),
        require('@/icons/png/chicken.png'), require('@/icons/png/dog.png'), require('@/icons/png/pig.png')
      ],
      projectList: [],
      requestForm: {
        name: '',
        page: 1,
        pageSize: 4,
        total: null
      },
      visibleBool: false,
      title: '创建项目',
      taskStatusList: [
        { status: 0, label: '等待执行', type: 'warning' },
        { status: 1, label: '执行中', type: '' },
        { status: 2, label: '执行成功', type: 'success' },
        { status: 3, label: '执行失败', type: 'danger' }
      ]
    }
  },
  watch: {
    dialogVisible(newData) {
      this.visibleBool = newData
    }
  },
  created() {
    this.getTaskList()
    this.visibleBool = this.dialogVisible
  },
  methods: {
    // 获取任务列表列表
    async getTaskList() {
      const { items, total } = await getTaskList(this.requestForm)
      items.forEach(item => {
        item.avatar = this.avatarList[Math.floor(Math.random() * this.avatarList.length)]
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  padding: 15px;
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

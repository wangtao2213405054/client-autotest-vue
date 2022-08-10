<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="项目列表" name="activity">
                <activity :dialog-visible.sync="dialogVisible" />
              </el-tab-pane>
              <el-tab-pane label="更新日志" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane v-if="permissionInfo.userControl" label="用户管理" name="account">
                <account />
              </el-tab-pane>
              <el-tab-pane v-if="permissionInfo.roleControl" label="角色管理" name="role">
                <role />
              </el-tab-pane>
              <el-tab-pane v-if="permissionInfo.menuControl" label="菜单管理" name="menu">
                <permissions-menu />
              </el-tab-pane>
            </el-tabs>
            <div v-if="activeTab === 'activity'" class="new-project">
              <div>
                <el-button v-waves type="primary" icon="el-icon-plus" plain size="mini" @click="createProject">新建</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Project'
import Timeline from './components/Timeline'
import Account from './components/AccountTree'
import waves from '@/directive/waves/index.js' // 水波纹指令
import PermissionsMenu from '@/views/home/components/PermissionsMenu'
import Role from '@/views/home/components/Role'

export default {
  name: 'Home',
  components: { UserCard, Activity, Timeline, Account, PermissionsMenu, Role },
  directives: {
    waves
  },
  data() {
    return {
      activeTab: 'activity',
      permissionInfo: {
        userControl: false,
        roleControl: false,
        menuControl: false
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 处理权限
    getRoles() {
      if (this.roles.includes('admin')) {
        for (const key in this.permissionInfo) {
          this.permissionInfo[key] = true
        }
      } else {
        // 新增页面时需要向此list中添加绑定
        const permissions = [
          { identifier: 'user', value: 'userControl' },
          { identifier: 'role', value: 'roleControl' },
          { identifier: 'menu', value: 'menuControl' }
        ]
        permissions.forEach(items => {
          const { identifier, value } = items
          if (this.roles.includes(identifier)) {
            this.permissionInfo[value] = true
          }
        })
      }
    },
    createProject() {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.new-project {
  position: absolute;
  right: 30px;
  top: 23px;
  font-weight: 600;
  font-size: 14px;
}
</style>

<template>
  <div>
    <el-form ref="addFormRef" :model="addForm">
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-popover
              placement="bottom"
              width="500"
              trigger="click"
              :disabled="disabled"
            >
              <instructions type="url" />
              <el-button type="primary" size="mini" style="float: right; margin-top: 10px" @click="setPopover">不再提示</el-button>
              <el-input slot="reference" v-model="addForm.url" placeholder="请输入接口路径, 以 '/' 开始">
                <el-select slot="prepend" v-model="addForm.methods" placeholder="请求类型" style="width: 110px">
                  <el-option
                    v-for="item in methodsList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  >
                    <span :style="{'float': 'left', 'color': item.color ? item.color : '#606266'}">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-input>
            </el-popover>
          </el-col>
          <el-col :span="5">
            <div style="text-align: center">
              <el-button type="primary" @click="saveApi">保存</el-button>
              <el-button type="danger">删除</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="接口名称">
            <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接口分组">
            <el-cascader
              v-model="addForm.folderId"
              style="width: 100%"
              placeholder="请选择接口分组"
              :props="propsData"
              clearable
            >
              <template slot-scope="{ node, data }">
                <span v-if="data['identifier'] === 'folder'">{{ data.name }}</span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接口状态">
            <el-select v-model="addForm.state" style="width: 100%" placeholder="请选择接口状态">
              <el-option
                v-for="item in apiStateList"
                :key="item.identifier"
                :label="item.name"
                :value="item.identifier"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="责任人">
            <el-select
              v-model="addForm.liabilityList"
              style="width: 100%"
              multiple
              placeholder="请输入责任人"
              filterable
              remote
              clearable
              :loading="selectLoading"
              :remote-method="remoteMethod"
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
        <el-col :span="8">
          <el-form-item label="是否鉴权">
            <el-radio-group v-model="addForm.authentication" style="width: 100%">
              <el-radio :label="true">鉴权</el-radio>
              <el-radio :label="false">不鉴权</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否验签">
            <el-radio-group v-model="addForm.attestation" style="width: 100%">
              <el-radio :label="true">验签</el-radio>
              <el-radio :label="false">不验签</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="接口说明">
        <el-input
          v-model="addForm.background"
          type="textarea"
          :rows="4"
          placeholder="请输入接口说明"
        />
      </el-form-item>
    </el-form>
    <span style="color: #606266; font-size: 18px; margin-bottom: 10px; font-weight: bold">请求参数</span>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Params" name="params">
        <div>
          <div style="font-size: 13px; margin-bottom: 10px; color: #606266">
            Query 参数
            <el-popover
              placement="right"
              width="450"
              trigger="hover"
            >
              <instructions type="params" />
              <i slot="reference" style="margin-left: 5px" class="el-icon-info" />
            </el-popover>
          </div>
          <editor methods="params" :editor-list="addForm.requestParams.query" />
        </div>
        <div v-if="addForm.requestParams.path.length">
          <div style="font-size: 13px; margin-bottom: 10px; margin-top: 10px; color: #606266">
            Path 参数
            <el-popover
              placement="right"
              width="450"
              trigger="hover"
            >
              <instructions type="path" />
              <i slot="reference" style="margin-left: 5px" class="el-icon-info" />
            </el-popover>
          </div>
          <editor methods="path" :editor-list="addForm.requestParams.path" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Body" name="body">
        <el-radio-group v-model="addForm.requestBody.bodyType" style="margin-bottom: 10px">
          <el-radio label="none">none</el-radio>
          <el-radio label="data">form-data</el-radio>
          <el-radio label="json">json</el-radio>
        </el-radio-group>
        <div v-if="addForm.requestBody.bodyType === 'none'" class="body-none">
          <span style="font-weight: bold; font-size: 14px; color: #909399">该请求没有 Body 体</span>
        </div>
        <div v-if="addForm.requestBody.bodyType === 'data'">
          <editor
            :key="addForm.requestBody.bodyType"
            methods="data"
            :editor-list="addForm.requestBody.formData"
          />
        </div>
        <div v-if="addForm.requestBody.bodyType === 'json'">
          <editor-tree
            :create-tree="addForm.requestBody.json"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Header" name="header">
        <editor
          methods="header"
          :editor-list="addForm.requestHeader"
        />
      </el-tab-pane>
    </el-tabs>
    <div style="color: #606266; font-size: 18px; margin-bottom: 10px; margin-top: 20px; font-weight: bold">返回响应</div>
    <editor-tree :create-tree="addForm.response" />
  </div>
</template>

<script>
import editor from '@/views/api/components/exportTable'
import Instructions from '@/views/api/common/Instructions'
import editorTree from '@/views/api/components/jsonTree'
import { getModulesList } from '@/api/business/folder'
import { getManagementList, getUserListByIdList } from '@/api/account/management'
export default {
  components: {
    editor,
    Instructions,
    editorTree
  },
  props: {
    moduleId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      disabled: false,
      selectLoading: false,
      addForm: {
        id: null,
        methods: null,
        url: '',
        name: '',
        folderId: [2, 5],
        state: null,
        liabilityList: [],
        authentication: true,
        attestation: false,
        background: null,
        requestParams: {
          query: [],
          path: []
        },
        requestBody: {
          bodyType: 'none',
          formData: [],
          json: []
        },
        requestHeader: [],
        response: []
      },
      methodsList: [
        { label: 'POST', color: '#E6A23C' },
        { label: 'GET', color: '#67C23A' },
        { label: 'PUT', color: '#409EFF' },
        { label: 'DELETE', color: '#F56C6C' }
      ],
      activeName: 'params',
      userList: [], // 用户列表
      apiStateList: [], // 接口状态列表
      // 懒加载级联选择器
      propsData: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        lazy: true,
        leaf: 'leaf',
        async lazyLoad(node, resolve) {
          console.log(node, '级联选择器加载')
          if (node.level === 0) {
            const data = await getModulesList({
              identifier: 'folder',
              projectId: localStorage.getItem('projectId')
            })
            return resolve(data)
          } else if (node.level > 1) {
            // 由于文件夹只有两层, 所以做了一个加载限制
            return resolve([])
          }
          const data = await getModulesList({
            identifier: 'folder',
            id: node['data']['id'],
            projectId: localStorage.getItem('projectId')
          })
          return resolve(data)
        }
      }
    }
  },
  watch: {
    'addForm.url'(newData, oldData) {
      /**
       * 同步数据到Path方法中
       * 匹配花括号内部的值, 如果匹配到了则进行判断, 存在为修改不存在为新增
       * 当新老数据不一致时获取其差集然后删除
       * 当变更为无时赋值一个空的列表
       */
      const reList = newData.match(/\{.*?}/g)
      const oldList = oldData.match(/\{.*?}/g)
      if (reList) {
        reList.forEach((items, index) => {
          const isAre = this.addForm.requestParams.path[index]
          const fieldName = items.replace('{', '').replace('}', '')
          if (isAre) {
            this.addForm.requestParams.path[index]['name'] = fieldName
          } else {
            this.addForm.requestParams.path.push({
              name: fieldName,
              dataType: 'String',
              mandatory: true,
              sample: null,
              describe: null,
              key: Date.now()
            })
          }
        })
        if (oldList && reList.length !== oldList.length) {
          const diffSet = oldList.concat(reList).filter(item => !reList.includes(item)) // 差集
          diffSet.forEach((items) => {
            const fieldName = items.replace('{', '').replace('}', '')
            this.addForm.requestParams.path.forEach((item, index) => {
              if (item['name'] === fieldName) {
                this.addForm.requestParams.path.splice(index, 1)
              }
            })
          })
        }
      } else {
        this.addForm.requestParams.path = []
      }
    }
  },
  created() {
    // 查询是否关闭 popover
    if (localStorage.getItem('urlPopover') === 'yes') {
      this.disabled = true
    }
  },
  mounted() {
    if (this.addForm.liabilityList.length) {
      this.getUserListByIdList(this.addForm.liabilityList)
    }
  },
  methods: {
    // 设置不再弹出提示
    setPopover() {
      localStorage.setItem('urlPopover', 'yes')
      this.disabled = true
    },
    // 保存接口
    saveApi() {
      console.log(this.addForm, 'addForm')
    },
    // 责任人加载器
    async remoteMethod(query) {
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
    // 根据id 获取用户信息
    async getUserListByIdList(idList) {
      this.userList = await getUserListByIdList({ idList })
    }
  }
}
</script>

<style lang="scss" scoped>
.body-none {
  width: 100%;
  height: 100px;
  line-height:100px;
  margin: 0 auto;
  //background-color: #0a76a4;
  text-align: center;
  border-style: solid;
  border-color: #DCDFE6;
  border-width: 1px
}

</style>

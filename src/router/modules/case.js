
import Layout from '@/layout'

const _case = {
  path: '/case',
  component: Layout,
  redirect: 'noRedirect',
  name: 'CaseManage',
  meta: {
    title: '用例管理',
    icon: 'el-icon-menu',
    roles: ['CaseManage']
  },
  children: [
    {
      path: 'container',
      component: () => import('@/views/case/index'),
      name: 'TestCase',
      meta: {
        title: '测试用例',
        icon: 'coke-icon-api-list',
        roles: ['TestCase']
      }
    },
    {
      path: 'state',
      component: () => import('@/views/case/state/index'),
      name: 'ApiState',
      meta: {
        title: '接口状态',
        icon: 'coke-icon-api-state',
        roles: ['ApiState']
      }
    },
    {
      path: 'response',
      component: () => import('@/views/case/response/index'),
      name: 'ApiResponse',
      meta: {
        title: '公共响应',
        icon: 'coke-icon-api-response',
        roles: ['ApiResponse']
      }
    },
    {
      path: 'document/:id',
      hidden: true,
      name: 'ApiDocument',
      component: () => import('@/views/case/document'),
      meta: {
        title: '接口文档',
        activeMenu: '/case/container'
      }
    }
  ]
}

export default _case

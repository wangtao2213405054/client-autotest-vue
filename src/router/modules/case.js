
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
      path: 'version',
      component: () => import('@/views/case/version'),
      name: 'CaseVersion',
      meta: {
        title: '版本管理',
        icon: 'coke-icon-api-state',
        roles: ['CaseVersion']
      }
    },
    {
      path: 'set',
      component: () => import('@/views/case/set'),
      name: 'CaseSet',
      meta: {
        title: '用例集合',
        icon: 'coke-icon-api-response',
        roles: ['CaseSet']
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

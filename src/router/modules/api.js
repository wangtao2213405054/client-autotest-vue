
import Layout from '@/layout'

const api = {
  path: '/api',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Api',
  meta: {
    title: '接口管理',
    icon: 'coke-icon-api-management',
    roles: ['api']
  },
  children: [
    {
      path: 'container',
      component: () => import('@/views/api/index'),
      name: 'ApiContainer',
      meta: {
        title: '接口列表',
        icon: 'coke-icon-api-list',
        roles: ['apiContainer']
      }
    },
    {
      path: 'state',
      component: () => import('@/views/api/state/index'),
      name: 'ApiState',
      meta: {
        title: '接口状态',
        icon: 'coke-icon-api-state',
        roles: ['ApiState']
      }
    },
    {
      path: 'response',
      component: () => import('@/views/api/response/index'),
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
      component: () => import('@/views/api/document'),
      meta: {
        title: '接口文档',
        activeMenu: '/api/container'
      }
    }
  ]
}

export default api

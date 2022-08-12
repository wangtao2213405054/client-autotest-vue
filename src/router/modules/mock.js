
import Layout from '@/layout'

const mock = {
  path: '/mock',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Mock',
  meta: {
    title: '模拟配置',
    icon: 'el-icon-magic-stick',
    roles: ['Mock']
  },
  children: [
    {
      path: 'domain',
      component: () => import('@/views/mock/domain'),
      name: 'MockDomain',
      meta: {
        title: '域名配置',
        icon: 'coke-icon-domain',
        roles: ['MockDomain']
      }
    },
    {
      path: 'api',
      component: () => import('@/views/mock/api'),
      name: 'MockApi',
      meta: {
        title: '接口配置',
        icon: 'coke-icon-api',
        roles: ['MockApi']
      }
    }
  ]
}

export default mock

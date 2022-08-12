
import Layout from '@/layout'

const conf = {
  path: '/conf',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Config',
  meta: {
    title: '基础配置',
    icon: 'coke-icon-config',
    roles: ['Config']
  },
  children: [
    {
      path: 'event',
      component: () => import('@/views/conf/event'),
      name: 'ConfEvent',
      meta: {
        title: '操作事件',
        icon: 'coke-icon-event',
        roles: ['ConfEvent']
      }
    },
    {
      path: 'element',
      component: () => import('@/views/conf/element'),
      name: 'ConfElement',
      meta: {
        title: '页面元素',
        icon: 'coke-icon-element',
        roles: ['ConfElement']
      }
    },
    {
      path: 'message',
      component: () => import('@/views/conf/message'),
      name: 'ConfMessage',
      meta: {
        title: '消息通知',
        icon: 'coke-icon-message',
        roles: ['ConfMessage']
      }
    }
  ]
}

export default conf

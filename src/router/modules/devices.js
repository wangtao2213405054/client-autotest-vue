
import Layout from '@/layout'

const devices = {
  path: '/devices',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Devices',
  meta: {
    title: '设备管理',
    icon: 'coke-icon-devices',
    roles: ['Devices']
  },
  children: [
    {
      path: 'driver',
      component: () => import('@/views/devices/driver'),
      name: 'DevicesDriver',
      meta: {
        title: '驱动设备',
        icon: 'coke-icon-computer',
        roles: ['DevicesDriver']
      }
    },
    {
      path: 'execute',
      component: () => import('@/views/devices/execute'),
      name: 'DevicesExecute',
      meta: {
        title: '测试设备',
        icon: 'coke-icon-phone',
        roles: ['DevicesExecute']
      }
    }
  ]
}

export default devices

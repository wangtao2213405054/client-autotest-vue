
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
      path: 'master',
      component: () => import('@/views/devices/master'),
      name: 'DevicesMaster',
      meta: {
        title: '驱动设备',
        icon: 'coke-icon-computer',
        roles: ['DevicesMaster']
      }
    },
    {
      path: 'worker',
      component: () => import('@/views/devices/worker'),
      name: 'DevicesWorker',
      meta: {
        title: '测试设备',
        icon: 'coke-icon-phone',
        roles: ['DevicesWorker']
      }
    },
    {
      path: 'capabilities',
      component: () => import('@/views/devices/capabilities'),
      name: 'DevicesCapabilities',
      meta: {
        title: '能力映射',
        icon: 'coke-icon-capabilities',
        roles: ['DevicesCapabilities']
      }
    },
    {
      path: '/property/:id',
      component: () => import('@/views/devices/charts'),
      hidden: true,
      name: 'DevicesProperty',
      meta: {
        title: '性能监控',
        activeMenu: '/devices/master'
      }
    }
  ]
}

export default devices

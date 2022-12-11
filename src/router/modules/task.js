
import Layout from '@/layout'

const task = {
  path: '/task',
  component: Layout,
  redirect: 'noRedirect',
  name: 'task',
  meta: {
    title: '测试任务',
    icon: 'coke-icon-task',
    roles: ['Task']
  },
  children: [
    {
      path: 'master',
      component: () => import('@/views/task/index'),
      name: 'DevicesMaster',
      meta: {
        title: '任务中心',
        icon: 'coke-icon-task',
        roles: ['taskCenter']
      }
    }
  ]
}

export default task

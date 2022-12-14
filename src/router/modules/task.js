
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
      path: 'center',
      component: () => import('@/views/task/index'),
      name: 'TaskCenter',
      meta: {
        title: '任务中心',
        icon: 'coke-icon-task',
        roles: ['taskCenter']
      }
    },
    {
      path: '/report/:id',
      component: () => import('@/views/task/report'),
      hidden: true,
      name: 'TaskReport',
      meta: {
        title: '测试报告',
        activeMenu: '/task/center'
      }
    }
  ]
}

export default task

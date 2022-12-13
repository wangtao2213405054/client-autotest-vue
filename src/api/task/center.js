import request from '@/utils/request'

// 新增任务信息
export function newTaskInfo(data) {
  return request({
    url: '/task/center/new',
    method: 'POST',
    data
  })
}

// 获取任务列表
export function getTaskList(data) {
  return request({
    url: '/task/center/list',
    method: 'POST',
    data
  })
}

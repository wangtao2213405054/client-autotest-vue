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

// 修改任务状态
export function pauseTaskInfo(data) {
  return request({
    url: '/task/center/pause',
    method: 'POST',
    data
  })
}

// 获取任务信息
export function getTaskInfo(data) {
  return request({
    url: '/task/center/info',
    method: 'POST',
    data
  })
}

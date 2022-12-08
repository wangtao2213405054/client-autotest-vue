import request from '@/utils/request'

// 编辑执行设备信息
export function editWorkerInfo(data) {
  return request({
    url: '/devices/worker/edit',
    method: 'POST',
    data
  })
}

// 获取执行设备列表
export function getWorkerList(data) {
  return request({
    url: '/devices/worker/list',
    method: 'POST',
    data
  })
}

// 删除执行设备信息
export function deleteWorkerInfo(data) {
  return request({
    url: '/devices/worker/delete',
    method: 'POST',
    data
  })
}

// 修改设备状态
export function editWorkerSwitch(data) {
  return request({
    url: '/devices/worker/switch',
    method: 'POST',
    data
  })
}

import request from '@/utils/request'

// 编辑设备信息
export function editMasterInfo(data) {
  return request({
    url: '/devices/master/edit',
    method: 'POST',
    data
  })
}

// 获取设备列表
export function getMasterList(data) {
  return request({
    url: '/devices/master/list',
    method: 'POST',
    data
  })
}

// 获取设备列表
export function deleteMasterList(data) {
  return request({
    url: '/devices/master/delete',
    method: 'POST',
    data
  })
}

// 修改设备状态
export function editMasterStatus(data) {
  return request({
    url: '/devices/master/status',
    method: 'POST',
    data
  })
}

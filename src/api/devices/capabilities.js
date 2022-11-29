import request from '@/utils/request'

// 编辑功能映射信息
export function editCapabilitiesInfo(data) {
  return request({
    url: '/devices/capabilities/edit',
    method: 'POST',
    data
  })
}

// 获取功能映射信息列表
export function getCapabilitiesList(data) {
  return request({
    url: '/devices/capabilities/list',
    method: 'POST',
    data
  })
}

// 删除功能映射信息
export function deleteCapabilitiesInfo(data) {
  return request({
    url: '/devices/capabilities/delete',
    method: 'POST',
    data
  })
}

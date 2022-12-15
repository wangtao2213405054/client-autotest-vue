import request from '@/utils/request'

// 新增/编辑版本信息
export function editVersionInfo(data) {
  return request({
    url: '/business/version/edit',
    method: 'POST',
    data
  })
}

// 获取版本列表
export function getVersionList(data) {
  return request({
    url: '/business/version/list',
    method: 'POST',
    data
  })
}

// 删除版本信息
export function deleteVersionInfo(data) {
  return request({
    url: '/business/version/delete',
    method: 'POST',
    data
  })
}

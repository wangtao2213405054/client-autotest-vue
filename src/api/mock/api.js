import request from '@/utils/request'

// 获取接口列表
export function getApiList(data) {
  return request({
    url: '/mock/api/list',
    method: 'POST',
    data
  })
}

// 修改接口信息
export function editApiInfo(data) {
  return request({
    url: '/mock/api/edit',
    method: 'POST',
    data
  })
}

// 删除接口信息
export function deleteApiInfo(data) {
  return request({
    url: '/mock/api/delete',
    method: 'POST',
    data
  })
}

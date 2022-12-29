import request from '@/utils/request'

// 获取域名列表
export function getDomainList(data) {
  return request({
    url: '/mock/domain/list',
    method: 'POST',
    data
  })
}

// 修改域名信息
export function editDomainInfo(data) {
  return request({
    url: '/mock/domain/edit',
    method: 'POST',
    data
  })
}

// 删除域名信息
export function deleteDomainInfo(data) {
  return request({
    url: '/mock/domain/delete',
    method: 'POST',
    data
  })
}

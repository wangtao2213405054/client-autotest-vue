import request from '@/utils/request'

// 获取分类tree
export function getClassificationList() {
  return request({
    url: '/account/classification/list',
    method: 'GET'
  })
}

// 删除分类节点
export function deleteClassificationData(data) {
  return request({
    url: '/account/classification/delete',
    method: 'POST',
    data
  })
}

// 新增分类节点
export function editClassificationData(data) {
  return request({
    url: '/account/classification/edit',
    method: 'POST',
    data
  })
}

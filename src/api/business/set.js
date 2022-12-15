import request from '@/utils/request'

// 新增/编辑测试集合信息
export function editSetInfo(data) {
  return request({
    url: '/business/set/edit',
    method: 'POST',
    data
  })
}

// 获取集合列表
export function getSetList(data) {
  return request({
    url: '/business/set/list',
    method: 'POST',
    data
  })
}

// 删除集合信息
export function deleteSetInfo(data) {
  return request({
    url: '/business/set/delete',
    method: 'POST',
    data
  })
}

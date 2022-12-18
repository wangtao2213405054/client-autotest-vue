import request from '@/utils/request'

// 获取用例列表
export function getCaseList(data) {
  return request({
    url: '/business/case/list',
    method: 'POST',
    data
  })
}

// 修改用例信息
export function editCaseInfo(data) {
  return request({
    url: '/business/case/edit',
    method: 'POST',
    data
  })
}

// 删除用例信息
export function deleteCaseInfo(data) {
  return request({
    url: '/business/case/delete',
    method: 'POST',
    data
  })
}

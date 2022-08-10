import request from '@/utils/request'

// 新增/修改 用户
export function editManagementInfo(data) {
  return request({
    url: '/account/user/edit',
    method: 'POST',
    data
  })
}

// 获取用户列表
export function getManagementList(data) {
  return request({
    url: '/account/user/list',
    method: 'POST',
    data
  })
}

// 删除用户
export function deleteManagementInfo(data) {
  return request({
    url: '/account/user/delete',
    method: 'POST',
    data
  })
}

// 根据用户id列表获取用户信息
export function getUserListByIdList(data) {
  return request({
    url: '/account/user/ids',
    method: 'POST',
    data
  })
}


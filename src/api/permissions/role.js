import request from '@/utils/request'

// 新增角色
export function editRoleInfo(data) {
  return request({
    url: '/permissions/role/edit',
    method: 'POST',
    data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/permissions/role/list',
    method: 'POST',
    data
  })
}

// 删除角色信息
export function deleteRoleInfo(data) {
  return request({
    url: '/permissions/role/delete',
    method: 'POST',
    data
  })
}

import request from '@/utils/request'

// 编辑权限菜单
export function editPermissionsInfo(data) {
  return request({
    url: '/permissions/menu/edit',
    method: 'POST',
    data
  })
}

// 获取权限菜单列表
export function getPermissionsList(data) {
  return request({
    url: '/permissions/menu/list',
    method: 'POST',
    data
  })
}

// 删除权限菜单
export function deletePermissionsInfo(data) {
  return request({
    url: '/permissions/menu/delete',
    method: 'POST',
    data
  })
}

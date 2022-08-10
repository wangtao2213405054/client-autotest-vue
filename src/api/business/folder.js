import request from '@/utils/request'

// 获取模块列表
export function getModulesList(data) {
  return request({
    url: '/business/folder/list',
    method: 'POST',
    data
  })
}

// 新增/编辑模块
export function editModulesInfo(data) {
  return request({
    url: '/business/folder/edit',
    method: 'POST',
    data
  })
}

// 删除模块
export function deleteModulesInfo(data) {
  return request({
    url: '/business/folder/delete',
    method: 'POST',
    data
  })
}

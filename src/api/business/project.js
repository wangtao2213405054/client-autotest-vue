import request from '@/utils/request'

// 获取项目列表
export function getProjectList(data) {
  return request({
    url: '/business/project/list',
    method: 'POST',
    data
  })
}

// 创建/编辑项目
export function editProjectInfo(data) {
  return request({
    url: '/business/project/edit',
    method: 'POST',
    data
  })
}

// 删除项目
export function deleteProjectInfo(data) {
  return request({
    url: '/business/project/delete',
    method: 'POST',
    data
  })
}

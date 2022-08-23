import request from '@/utils/request'

export function getElementList(data) {
  return request({
    url: '/conf/element/list',
    method: 'POST',
    data
  })
}

export function editElementInfo(data) {
  return request({
    url: '/conf/element/edit',
    method: 'POST',
    data
  })
}

export function deleteElementInfo(data) {
  return request({
    url: '/conf/element/delete',
    method: 'POST',
    data
  })
}

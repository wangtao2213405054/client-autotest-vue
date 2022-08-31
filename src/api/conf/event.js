import request from '@/utils/request'

export function getEventList(data) {
  return request({
    url: '/conf/event/list',
    method: 'POST',
    data
  })
}

export function editEventInfo(data) {
  return request({
    url: '/conf/event/edit',
    method: 'POST',
    data
  })
}

export function deleteEventInfo(data) {
  return request({
    url: '/conf/event/delete',
    method: 'POST',
    data
  })
}

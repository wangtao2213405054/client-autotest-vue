import request from '@/utils/request'

export function getEmailInfo(data) {
  return request({
    url: '/message/email/info',
    method: 'POST',
    data
  })
}

export function editEmailInfo(data) {
  return request({
    url: '/message/email/edit',
    method: 'POST',
    data
  })
}

export function updateEmailSwitch(data) {
  return request({
    url: '/message/email/switch',
    method: 'POST',
    data
  })
}

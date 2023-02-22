import request from '@/utils/request'

export function getSocketDomain() {
  return request({
    url: '/conf/socket/domain',
    method: 'GET'
  })
}

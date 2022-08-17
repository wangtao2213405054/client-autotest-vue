import request from '@/utils/request'

export function getRobotInfo(data) {
  return request({
    url: '/message/robot/info',
    method: 'POST',
    data
  })
}

export function editRobotInfo(data) {
  return request({
    url: '/message/robot/edit',
    method: 'POST',
    data
  })
}

export function editRobotSwitch(data) {
  return request({
    url: '/message/robot/switch',
    method: 'POST',
    data
  })
}

import request from '@/utils/request'

// 获取测试报告
export function getReportList(data) {
  return request({
    url: '/task/report/list',
    method: 'POST',
    data
  })
}

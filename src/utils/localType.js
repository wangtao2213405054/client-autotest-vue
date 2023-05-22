
export const platform = [
  { id: 'web', mold: 'selenium', name: 'Web' },
  { id: 'android', mold: 'appium', name: 'Android' },
  { id: 'ios', mold: 'appium', name: 'iOS' }
]

export const priority = [
  { id: 0, name: 'P0', type: 'danger' },
  { id: 1, name: 'P1', type: 'warning' },
  { id: 2, name: 'P2', type: 'success' },
  { id: 3, name: 'P3', type: '' }
]

export const specials = [
  { key: false, label: '普通用例', type: null },
  { key: true, label: '特殊用例', type: 'success' }
]

export const actions = [
  { key: true, label: '正常', type: 'success' },
  { key: false, label: '废弃', type: 'danger' }
]

export const selectType = [
  { key: 'Custom', value: '自定义数据选择器' },
  { key: 'DataType', value: '数据类型选择器' },
  { key: 'Boolean', value: '布尔选择器' },
  { key: 'Element', value: '元素选择器' },
  { key: 'Api', value: '接口选择器' },
  { key: 'ElementIndex', value: '元素位置选择器' },
  { key: 'Operation', value: '运算符选择器' }
]

export const dataType = [
  { value: 'None', label: '空值' },
  { value: 'Integer', label: '整数' },
  { value: 'String', label: '字符串' },
  { value: 'Boolean', label: '布尔值' },
  { value: 'Array', label: '数组/列表' },
  { value: 'Object', label: '对象/字典' },
  { value: 'Float', label: '浮点数/小数' }
]

export const booleanSelect = [
  { id: true, name: 'True' },
  { id: false, name: 'False' }
]

export const loggingInfo = [
  { key: 'DEBUG', value: 'DEBUG' },
  { key: 'INFO', value: 'INFO' },
  { key: 'ERROR', value: 'ERROR' },
  { key: 'WARNING', value: 'WARNING' },
  { key: 'CRITICAL', value: 'CRITICAL' }
]

export const operationSelect = [
  { id: '=', name: '等于' },
  { id: '!=', name: '不等于' },
  { id: '>', name: '大于' },
  { id: '>=', name: '大于等于' },
  { id: '<', name: '小于' },
  { id: '<=', name: '小于等于' },
  { id: 'in', name: '在...里面' },
  { id: 'out', name: '不在...里面' }
]

export const runCaseStatusList = [
  { id: 0, name: '失败', type: 'danger' },
  { id: 1, name: '成功', type: 'success' },
  { id: 2, name: '跳过', type: 'warning' }
]

export const taskStatus = [
  { status: 0, label: '等待执行', type: 'warning', icon: 'el-icon-time', color: 'warning' },
  { status: 1, label: '正在执行', type: '', icon: 'el-icon-loading', color: 'brand' },
  { status: 2, label: '执行成功', type: 'success', icon: 'el-icon-circle-check', color: 'success' },
  { status: 3, label: '执行失败', type: 'danger', icon: 'el-icon-circle-close', color: 'danger' },
  { status: 4, label: '执行终止', type: 'info', icon: 'el-icon-remove-outline', color: 'info' }
]

export function getColor(percentage) {
  //  < 20% #909399  <40% #F56C6C < 60% #E6A23C < 80% #409EFF < 100% #67C23A
  if (percentage <= 20) {
    return '#909399'
  } else if (percentage <= 40) {
    return '#F56C6C'
  } else if (percentage <= 60) {
    return '#E6A23C'
  } else if (percentage <= 80) {
    return '#409EFF'
  } else return '#67C23A'
}

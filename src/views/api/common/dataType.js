
const dataTypeList = [
  { value: 'None', label: '空值' },
  { value: 'Integer', label: '整数' },
  { value: 'String', label: '字符串' },
  { value: 'Boolean', label: '布尔值' },
  { value: 'Array', label: '数组/列表' },
  { value: 'Object', label: '对象/字典' },
  { value: 'Float', label: '浮点数/小数' }
]
const defaultDict = {
  'None': null,
  'Integer': 1,
  'String': 'this is string',
  'Boolean': true,
  'Array': [],
  'Object': {},
  'Float': 3.14
}

export default {
  dataTypeList,
  defaultDict
}

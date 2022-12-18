
export const platform = [
  { id: 'web', mold: 'selenium', name: 'Web' },
  { id: 'android', mold: 'appium', name: 'Android' },
  { id: 'ios', mold: 'appium', name: 'iOS' }
]

export const priority = [
  { id: 0, name: 'P0' },
  { id: 1, name: 'P1' },
  { id: 2, name: 'P2' },
  { id: 3, name: 'P3' }
]

export const specials = [
  { key: false, label: '普通用例', type: null },
  { key: true, label: '特殊用例', type: 'success' }
]

export const actions = [
  { key: true, label: '正常', type: 'success' },
  { key: false, label: '废弃', type: 'danger' }
]

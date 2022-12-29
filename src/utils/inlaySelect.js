import { dataType, booleanSelect } from '@/utils/localType'
import { getElementList } from '@/api/conf/element'

export async function getInlaySelectInfo(model) {
  let data = []
  if (model === 'DataType') {
    dataType.forEach(item => {
      data.push({ id: item.value, name: item.label })
    })
  } else if (model === 'Boolean') {
    data = booleanSelect
  } else if (model === 'Element') {
    const request = {
      page: 1,
      size: 9999,
      platform: localStorage.getItem('mold')
    }
    const { items } = await getElementList(request)
    items.forEach(item => {
      data.push({ id: item.label, name: item.name, desc: item.desc })
    })
  } else if (model === 'ElementIndex') {
    for (let i = 0; i < 20; i++) {
      data.push({ id: i, name: '第 ' + (i + 1) + ' 个元素' })
    }
  }
  return data
}

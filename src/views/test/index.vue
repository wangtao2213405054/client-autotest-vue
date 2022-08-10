<template>
  <el-tree
    :props="props"
    :load="loadNode"
    lazy
  >
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      console.log(node, 'node')
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 1) return resolve([])
      setTimeout(() => {
        const data = [{
          name: 'leaf',
          leaf: true
        }, {
          name: 'zone'
        }]

        resolve(data)
      }, 500)
    }
  }
}
</script>

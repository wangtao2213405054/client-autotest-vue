<template>
  <div>
    <el-form class="stepContext" status-icon :show-message="false" inline hide-required-asterisk size="mini">
      <el-form-item
        label="TEST"
        prop="desc"
        :rules="[
          { required: true, message: '请输入此事件详细的使用描述', trigger: 'blur' }
        ]"
      >
        <el-input v-model="addForm.desc" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {
        desc: null
      }
    }
  },
  created() {
    const test = 'inputText'
    console.log(test.indexOf('input') !== -1)
  }
}
</script>

<style lang="scss" scoped>
</style>

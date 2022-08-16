<template>
  <div>
    <email />
    <dingTalk />
    <lark />
  </div>
</template>

<script>
import dingTalk from '@/views/conf/components/dingTalk'
import lark from '@/views/conf/components/lark'
import email from '@/views/conf/components/email'

export default {
  name: 'Message',
  components: {
    dingTalk,
    lark,
    email
  }
}
</script>

<style scoped>

</style>

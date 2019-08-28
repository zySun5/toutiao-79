<template>
    <div class="container">COM-B <button @click="fn()">提交数据给父组件</button></div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'COM-B的数据'
    }
  },
  methods: {
    fn () {
      console.log(this.msg)
      // 提交数据给父组件
      this.$emit('abc', this.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

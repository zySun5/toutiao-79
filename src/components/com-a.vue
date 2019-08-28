<template>
    <div>
      <div>header</div>
      <!-- slot:当使用组件的时候， 内容会默认插入slot标签内 -->
      <!-- 默认在插槽显示的内容：备用内容 -->
      <div><slot name="content" :abc="msg" def="100">content</slot></div>
      <!-- 具名插槽 :当你需要往组件内容插入多处内容-->
      <div><slot name="footer">footer</slot></div>
      <!-- 作用域插槽：当使用组件的时候，获取组件内部的数据， -->

    </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '组件内部的数据com-a'
    }
  }
}
</script>

<style lang="less" scoped>
</style>

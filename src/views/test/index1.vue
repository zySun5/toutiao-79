<template>
    <div class="container">
      {{parentMsg}}
      <com-b @abc="fn1"></com-b>
    </div>
</template>

<script>
import ComB from '@/components/com-b'
export default {
  data () {
    return {
      parentMsg: ''
    }
  },
  methods: {
    // @abc 事件属于 com-b 的自定义事件
    // 遵循：事件给谁绑定，谁负责触发
    // fn 父组件声明  函数可以传参
    fn1 (data) {
      // 事件对应函数
      console.log(data)
      this.parentMsg = data
    }
  },
  components: { ComB }
}
</script>

<style lang="less" scoped>
</style>

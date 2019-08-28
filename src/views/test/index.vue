<template>
    <div>
      <com-a>
        <!-- slot-scope : 获取组件内部给插槽传递的数据  scope是收集了当前插槽上所有绑定的数据 -->
        <div slot="content" slot-scope="scope">con1 {{scope.abc}} {{scope.def}}</div>
        <div slot="footer">foot1</div>
      </com-a>
      <hr>
      <com-a>con2</com-a>
      <hr>
      <com-a></com-a>
      <!-- 新语法； v-slot指令  v-slot:插槽名称=“作用域数据对象” -->
      <com-a>
      <template v-slot:content="scope">{{scope.abc}}</template>
      </com-a>
    </div>
</template>

<script>
import ComA from '@/components/com-a'
export default {
  components: { ComA }
}
</script>

<style lang="less" scoped>
</style>

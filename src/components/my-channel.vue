<template>
     <el-select :value="value" @change="fn" placeholder="请选择" clearable="">
        <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
     </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  // value 数据 只读
  props: ['value'],
  data () {
    return {
      // 频道当前选中的频道ID
      // value: null,
      // 频道选项数据
      channelOptions: []

    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    fn (channelId) {
      // channelId 当你清空操作 值时空字符串 改成null
      if (channelId === '') channelId = null
      // console.log(channelId)
      // 将修改的id提交给父组件
      this.$emit('input', channelId)
    },
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      this.channelOptions = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
    <div class="container">
      <el-card>
        <div slot="header">
          <my-bread>个人管理</my-bread>
        </div>
        <!-- 栅格布局 -->
        <el-row>
          <el-col :span="12">
            <!-- 表单 -->
            <el-form label-width="120px">
              <el-form-item label="编号：">{{id}}</el-form-item>
              <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
              <el-form-item label="媒体名称：">
                <el-input v-model="userInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍：">
                <el-input type="textarea" v-model="userInfo.intro" :rows="3"></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" v-model="userInfo.email">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="save()">保存设置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-upload
            style="text-align:center"
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="upload">
          <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="text-align:center;font-size:12px"> 修改头像</p>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
import store from '@/store'
import eventBus from '@/components/eventBus'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        intro: '',
        email: '',
        photo: '',
        mobile: ''
      },
      id: null
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async save () {
      const { name, intro, email } = this.userInfo
      console.log(name, intro, email)
      await this.$http.patch('user/profile', { name, intro, email })
      this.$message.success('修改用户信息成功')
      // 更新本地存储
      const user = store.getUser()
      user.name = name
      store.setUser(user)
      // 更新home组件的用户名称
      eventBus.$emit('updateName', name)
    },
    async getUserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
      const user = store.getUser()
      this.id = user.id
    },
    // 当你选择了图片后触发
    async upload (result) {
      // console.log(result.file)
      // 通过axios和formdata提交图片
      const formData = new FormData()
      // 往formdata中追加图片
      formData.append('photo', result.file)
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      this.$message.success('修改头像成功')
      this.userInfo.photo = data.photo
      // 更新本地存储
      const user = store.getUser()
      user.photo = data.photo
      store.setUser(user)
      // 更新home组件的用户名称
      eventBus.$emit('updatePhoto', data.photo)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

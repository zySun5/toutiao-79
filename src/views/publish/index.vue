<template>
    <el-card>
      <div slot="header">
        <my-bread>{{articleId?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <!-- 富文本 -->
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group @change="changeType" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 选择封面图的按钮 -->
         <!-- 封面选择组件 -->
         <div v-if="articleForm.cover.type === 1">
          <my-image v-model="articleForm.cover.images[0]"></my-image>
         </div>
         <div v-if="articleForm.cover.type === 3">
          <my-image v-model="articleForm.cover.images[0]"></my-image>
          <my-image v-model="articleForm.cover.images[1]"></my-image>
          <my-image v-model="articleForm.cover.images[2]"></my-image>
         </div>

        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if='!articleId'>
          <el-button type="primary" @click="submit(false)">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="update(false)">发表</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 富文本的配置对象
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            // 具体的功能选项
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      },
      // 文章对象
      articleForm: {
        title: '',
        cover: {
          type: 1,
          images: []
        },
        content: '',
        channel_id: null
      },
      // 当前的文章id
      articleId: null
    }
  },
  watch: {
    // 监听地址栏id 传参变化
    '$route.query.id': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      // 修改奇幻到发布的时候 重置文章数据 清空文章ID
      this.articleForm = {
        title: '',
        cover: {
          type: 1,
          images: []
        },
        content: '',
        channel_id: null
      }
      // this.getArticle()
      this.articleId = null
    }
  },
  created () {
    this.articleId = this.$route.query.id
    // console.log(id)
    // 如果是编辑
    // this.articleId && this.getArticle()
    if (this.articleId) {
      this.getArticle()
    }
  },
  methods: {
    changeType () {
      this.articleForm.cover.images = []
    },
    async submit (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    async update (draft) {
      // 更新 地址栏多了一个id
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '修改时存入草稿成功' : '修改成功')
      this.$router.push('/article')
    },
    // 获取文章数据
    async getArticle () {
      const { data: { data } } = await this.$http.get(`articles/${this.articleId}`)
      console.log(data)
      this.articleForm = data
    }
  }
}
</script>

<style lang="less" scoped>

</style>

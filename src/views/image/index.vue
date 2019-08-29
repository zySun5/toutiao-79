<template>
    <div class="container">
      <el-card>
        <div slot="header">
          <my-bread>素材管理</my-bread>
        </div>
        <div class="btn-box">
          <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材</el-button>
          <div class="img_list">
            <div class="img_item" v-for="item in images" :key="item.id">
              <img :src="item.url" alt="">
              <div class="option">
                <span @click="toggleCollect(item)" class="el-icon-star-off" :class="{red:item.is_collected}"></span>
                <span @click="delImage(item.id)" class="el-icon-delete"></span>
              </div>
            </div>
          </div>
        </div>
          <!-- 分页 -->
        <el-pagination class="pager" style="text-align:center" hide-on-single-page background layout="prev, pager, next,total" @current-change="changePager" :current-page="reqParams.page" :page-size="reqParams.per_page" :total="total">
        </el-pagination>
      </el-card>
      <!-- 对话框 -->
      <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
        <!-- 上传组件 -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="headers"
          name="image"
          :show-file-list="false"
          :on-success="handleSuccess">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      reqParams: {
        // false 全部 true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 列表数据
      images: [],
      total: 0,
      // 控制对话框 的显示与隐藏
      dialogVisible: false,
      // 上传图片的请求头配置
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      imageUrl: null
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 上传图片成功
    handleSuccess (res) {
      this.$message.success('上传素材成功')
      this.imageUrl = res.data.url
      // console.log(res)
      // 2s后关闭对话框 更新列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      // 清空上一次上传的图片预览
      this.imageUrl = null
    },
    // 删除图片
    async delImage (id) {
      await this.$http.delete(`user/images/${id}`)
      this.$message.success('删除图片成功')
      this.getImages()
    },
    // 切换图片状态
    async toggleCollect (item) {
      // 提交给后台的状态  就是当前状态的取反
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 操作成功( 取消收藏成功  添加收藏成功)
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      // 更新列表 后端有排序 ，收藏的图片靠前
      // 更新当前图片的数据 数据驱动视图  更新图标颜色
      item.is_collected = data.collect
    },
    // 切换了全部与收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.img_list{
  margin-top: 20px;
  .img_item{
    width: 160px;
    height: 160px;
    border:1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img{
      width: 100%;
      height: 100%;
      display: block;
    }
    .option{
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, .3);
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      text-align: center;
      line-height: 30px;
      span{
        margin: 0 20px;
        &.red{
          color:red;
        }
      }
    }
  }
}
.avatar-uploader {
  text-align: center;
}
</style>

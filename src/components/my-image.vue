<template>
    <div class="img_container">
      <!-- 按钮图片 -->
       <div class="btn_img" @click="openDialog">
            <img :src="value || defaultImage" alt="" />
          </div>
      <!-- 对话框 -->
      <el-dialog :visible.sync="dialogVisible" width="750px">
         <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="image">
              <!-- 素材库内容 -->
              <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
                <el-radio-button :label="false">全部</el-radio-button>
                <el-radio-button :label="true">收藏</el-radio-button>
              </el-radio-group>
              <div class="img_list">
                <div class="img_item" :class="{selected:item.url === selectedImageUrl}" @click="selectedImage(item.url)" v-for="item in images" :key="item.id">
                  <img :src="item.url" alt="">
                </div>
              </div>
              <!-- 分页 -->
              <el-pagination class="pager" style="text-align:center" hide-on-single-page background layout="prev, pager, next,total" @current-change="changePager" :current-page="reqParams.page" :page-size="reqParams.per_page" :total="total">
               </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="upload">
               <!-- 上传组件 -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="headers"
          name="image"
          :show-file-list="false"
          :on-success="handleSuccess">
          <img v-if="uploadimageUrl" :src="uploadimageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
            </el-tab-pane>
          </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmImage">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import store from '@/store'
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      // 选项卡name属性的值 选中某一个选项卡 只需要值等于name属性的值
      activeName: 'image',
      // 素材列表请求参数对象
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      // 图片总数量
      total: 0,
      // 纪录点击图片的唯一标识(图片地址)
      selectedImageUrl: null,
      // 上传图片的请求头
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      uploadimageUrl: null,
      // 确认后的图片地址
      // confirmSrc: defaultImage
      // data 中声明一个默认图
      defaultImage
    }
  },
  methods: {

    // 确认图片
    confirmImage () {
      // 校验是否选中或上传了数据
      // 判断的是 用户选中的tab是谁
      let url = null
      if (this.activeName === 'image') {
        if (!this.selectedImageUrl) return this.$message.info('请选中一张图片')
        url = this.selectedImageUrl
      } else {
        if (!this.uploadimageUrl) return this.$message.info('请上传一张图片')
        url = this.uploadimageUrl
      }
      // 给图片按钮的src赋值 看到选择的封面图片
      // this.confirmSrc = url
      // 把确认的图片地址提交给父组件
      this.$emit('input', url)
      this.dialogVisible = false
    },
    // 上传图片成功
    handleSuccess (res) {
      this.$message.success('上传图片成功')
      this.uploadimageUrl = res.data.url
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      // 在遍历图片的时候，比对纪录的url
      // 如果一致 选中  不一致  不选中
    },
    openDialog () {
      this.dialogVisible = true
      // 清除之前对话框的操作数据
      this.activeName = 'image'
      this.selectedImageUrl = null
      this.uploadimageUrl = null
      // 获取素材列表数据
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 全部与收藏切换
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    }
  }
}
</script>

<style lang="less" scoped>
.img_container{
  display: inline-block;
  margin: 0 10px;
}
.btn_img{
  width:160px;
  height: 160px;
  border: 1px dashed #ddd;
  img{
    width:100%;
    height: 100%;
    display:block;
  }
}
.dialog-footer {
  width:100%;
  display: block;
  text-align: center;
}
.img_list{
  margin-top: 10px;
  .img_item{
    width: 160px;
    height: 120px;
    border:1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    &.selected {
      &::after{
        // .img_item.selected::after{} 解析后选择器
        content:'';
        width: 100%;
        height:100%;
        position: absolute;
        top:0;
        left: 0;
        background: rgba(0,0,0,.2) url('../assets/images/selected.png') no-repeat center / 50px;
      }
    }
    img{
      width: 100%;
      height: 100%;
      display: block;
      //新属性  控制 图片的平铺方式
      object-fit: contain;
    }
  }
}
.avatar-uploader {
  text-align: center;
}
</style>

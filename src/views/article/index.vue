<template>
    <div class="container">
      <!-- 筛选项 -->
      <el-card>
        <!-- 头部 -->
        <div slot="header" >
         <!-- my-bread -->
         <my-bread>内容管理</my-bread>
        </div>
        <!-- 表单 -->
        <el-form label-width="80px" size="small">
           <el-form-item label="状态">
              <el-radio-group v-model="reqParams.status">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">待审核</el-radio>
                <el-radio :label="2">审核通过</el-radio>
                <el-radio :label="3">审核失败</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道">
              <my-channel v-model="reqParams.channel_id"></my-channel>
               <!-- <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable="">
                  <el-option
                    v-for="item in channelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="dataArr"
                type="daterange"
                @change="changeDate"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">筛选</el-button>
            </el-form-item>
        </el-form>
      </el-card>
      <!-- 筛选结果 -->
      <el-card>
        <div slot="header">
          根据筛选条件共查询到{{total}}条结果：
        </div>
        <!-- 表格 -->
        <el-table :data="articles">
          <el-table-column label="封面">
            <!-- scope.row 数据组件内部传递的数据 代表当前行数据（每次遍历的item） -->
            <template slot-scope="scope">
              <el-image :src="scope.row.cover.images[0]" fit="cover" style="width:160px;height:100px">
                <div slot="error">
                  <img src="../../assets/images/error.gif" alt="" style="width:160px;height:100px">
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
                <!-- 数据 scope.row.status -->
                <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
                <el-tag v-if="scope.row.status === 1">待审核</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
                <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
                <el-tag v-if="scope.row.status === 4" type="danger">删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间">
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button @click="$router.push('/publish?id='+scope.row.id)" type="primary" icon="el-icon-edit" circle plain></el-button>
              <el-button type="danger" @click="delArticle(scope.row.id)" icon="el-icon-delete" circle plain></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="pager" background layout="prev, pager, next,total" @current-change="changePager" :current-page="reqParams.page" :page-size="reqParams.per_page" :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 提交后台的参数  值为null的时候， 字段是不会发送给后台的
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 10
      },
      // 日期数据 0:起使时间  1:结束时间
      dataArr: [],
      // 频道选择
      channelOptions: [],
      // 文章列表数据
      articles: [],
      // 总条数
      total: 0
    }
  },
  created () {
    // 获取频道选项数据
    // this.getChannelOptions()
    // 获取文章列表数据
    this.getArticles()
  },
  methods: {
    // 删除文章
    delArticle (id) {
      this.$confirm('亲，此操作经永久删除该文章，是否继续？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // delete：删除数据  put：完整修改数据  patch:局部修改数据
        await this.$http.delete(`articles/${id}`)
        // 代表成功lly
        this.$message.success('删除成功')
        // 更新列表
        this.getArticles()
      }).catch(() => {
        // 点击取消触发函数
      })
    },
    // 筛选
    search () {
      // 当你从新查询的时候，当前的页码应该是第一页
      this.reqParams.page = 1
      // // 频道数据值为“”的时候
      // if (this.reqParams.channel_id === '') {
      //   this.reqParams.channel_id = null
      // }
      this.getArticles()
    },
    // 选择时间
    changeDate (valueArr) {
      // console.log(valueArr)
      if (valueArr) {
        // 给请求参数赋值
        this.reqParams.begin_pubdate = valueArr[0]
        this.reqParams.end_pubdate = valueArr[1]
      } else {
        // 清除请求参数的值
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdateb = null
      }
    },
    // 切换分页
    changePager (newPage) {
      // console.log(newPage)
      // 把提交后台的参数改成新的页码
      this.reqParams.page = newPage
      this.getArticles()
    },
    // async getChannelOptions () {
    //   const { data: { data } } = await this.$http.get('channels')
    //   this.channelOptions = data.channels
    // },
    async getArticles () {
      // post 请求 post('地址'，‘数据’)
      // get  请求 get(’地址‘，’{params:数据}‘)
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 列表数据
      this.articles = data.results
      // 总条数
      this.total = data.total_count
      // console.log(this.articles)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  margin-bottom: 20px;
}
.pager {
  text-align: center;
  margin-top: 20px;
}
</style>

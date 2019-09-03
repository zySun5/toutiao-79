<template>
    <div class="container">
      <el-card>
        <div slot="header">
          <my-bread>粉丝管理</my-bread>
        </div>
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="粉丝列表" name="list">
            <div class="fans_list">
              <!-- id默认对象类型， 使用json-bigint  key需要的是字符串/数值类型 使用toString转换字符串类型 -->
              <div class="fans_item" v-for="item in fansList" :key="item.id.toString()">
                <el-avatar :size="80" :src="item.photo"></el-avatar>
                <p>{{item.name}}</p>
                <el-button type="primary" plain size="small">+关注</el-button>
              </div>
            </div>
            <!-- 分页 -->
<el-pagination class="pager" style="text-align:center" hide-on-single-page background layout="prev, pager, next,total" @current-change="changePager" :current-page="reqParams.page" :page-size="reqParams.per_page" :total="total">
        </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="粉丝画像" name="photo">
            <div ref="bar" style="width:600px;height:400px"></div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
import echart from 'echarts'
export default {
  data () {
    return {
      activeName: 'list',
      reqParams: {
        page: 1,
        per_page: 24
      },
      fansList: [],
      total: 0
    }
  },
  created () {
    this.getFans()
  },
  mounted () {
    this.initBar()
  },
  methods: {
    initBar () {
      // 初始化柱状图
      const myEchart = echart.init(this.$refs.bar)
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
      myEchart.setOption(option)
    },
    async getFans () {
      const { data: { data } } = await this.$http.get('followers', { params: this.reqParams })
      console.log(data)
      this.fansList = data.results
      this.total = data.total_count
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getFans()
    }
  }
}
</script>

<style lang="less" scoped>
.fans_item{
  width: 120px;
  height: 180px;
  border: 1px dashed #ddd;
  text-align: center;
  padding-top: 10px;
  display: inline-block;
  margin-right: 50px;
  margin-bottom: 20px;
  p{
    font-size:12px;
  }
}
</style>

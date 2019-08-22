import Vue from 'vue'
import App from './App.vue'

import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// @:src的绝对路径 在vue-cli的项目中才可使用
// 目录的索引文件 index文件  .js  .vue .json 优先级按照现在的顺序
import router from '@/router'
Vue.use(ElementUi)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

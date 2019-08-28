// 负责 配置axios 提供一个配置好的axios即可

import axios from 'axios'
import store from '@/store'
import router from '@/router'
import JSONBIG from 'json-bigint'
// 默认配置 转换响应数据
axios.defaults.transformResponse = [data => {
  // 对data（后端的原始数据）进行转换
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 默认配置 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 默认配置  请求头携带token
// axios.defaults.headers.Authorization = 'Bearer ' + store.getUser().token
// Vue.prototype.$http = axios

// 配置一个请求拦截器（在每次请求的头部加上一个token)
// 在每次发送请求之前会执行拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做什么
  // 加 token
  config.headers.Authorization = 'Bearer ' + store.getUser().token
  // config 请求配置   如果你需要额外的配置 在config进行修改
  // 把修改号的config 返回出去，axios才会使用你的配置
  return config
}, (err) => {
  // 对错误做些什么
  // 拦截失败触发 返回promise对象 而且这个失败的promise
  // new Promise()  可能成功可能失败
  // Promise.reject('错误对象')  失败Promise
  // Promise.resolve() 成功promise
  return Promise.reject(err)
})

// 配置一个响应拦截器（在每次响应失败的时候判断token是否失败
axios.interceptors.response.use((res) => res, err => {
  // 获取响应状态码  判断是否是401
  // err.response  响应对象
  if (err.response.status === 401) {
    // token失效  清除存储的token 重新登陆
    store.delUser()
    // path 是 ’/login‘
    // 1.跳转到登陆页面 hash = #/login 使用location
    // location.hash = '#/login'
    // 2.使用路由来进行跳转
    router.push('/login')
  }
  return Promise.reject(err)
})

export default axios

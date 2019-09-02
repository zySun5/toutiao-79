// 职责：创建一个router实例导出给main.js使用

import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Setting from '@/views/setting'

import NotFound from '@/views/404'

import store from '@/store'
import test from '@/views/test/index1.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  // 路由规则
  routes: [
    // name:'login' 给当前路由取名
    { path: '/login', name: 'login', component: Login },
    { path: '/',
      component: Home,
      children: [
        // 欢迎页面  如果子路由有名字，父路由要删除名字
        { path: '/', name: 'welcome', component: Welcome },
        { path: '/article', name: 'article', component: Article },
        { path: '/image', name: 'image', component: Image },
        { path: '/publish', name: 'publish', component: Publish },
        { path: '/comment', name: 'comment', component: Comment },
        { path: '/setting', name: 'setting', component: Setting }
      ] },
    { path: '/test', name: 'test', component: test },
    { path: '*', name: '404', component: NotFound }
  ]
})
// 前置守卫
router.beforeEach((to, from, next) => {
  const user = store.getUser()
  // // 访问的是登陆页面，放行
  // if (to.path === '/login') return next()
  // // 访问的是其他页面，且没有做过登陆，拦截 去登陆页面
  // if (!user.token) return next('/login')
  // next()
  if (to.path !== '/login' && !user.token) return next('/login')
  next()
})

export default router

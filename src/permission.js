// 权限相关，路由守卫等等..
// 路由的前置守卫，在main.js中引入了所以全局就得经过这里
// 路由的跳转需要经过这个步骤to想跳到那个，from从那个跳，next（）可以放行，next（false）不给跳
import router from '@/router'
import store from '@/store'
// 白名单
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   next()
// token 存在 说明 处于登录状态
// 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页
// token 不存在 说明 不处于登录状态
// 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

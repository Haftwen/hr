import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang 语言i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control权限
// 考虑到自定义指令的复用性所以在这里全局注册自定义指令
// import { imgerror } from '@/directives'
// 不想每次都这样全部引入我们可以把directives中的所有东西都引入进来
import * as directives from '@/directives'
// console.log(directives)
// console.log(Object.keys(directives)) // 名字组成的数组
// 注册全局自定义指令
// Vue.directive('imgerror', imgerror)
// 也不需要一个个注册了直接全给注册了
import Print from 'vue-print-nb'
Vue.use(Print)
Object.keys(directives).forEach(ele => {
  Vue.directive(ele, directives[ele])
})
// 全局注册pagetools组件
import components from '@/components/index'
Vue.use(components)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 不让他模拟数据
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale }) 不适用英文 暂时使用中文 以后再配置多语言包
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

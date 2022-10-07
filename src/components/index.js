// 直接引入vue的方法不采取
// 直接Vue.components（组件名称，组件对象）也可以 但是 不采用引入vue的处理
// import PageTools from './PageTools/index.vue'
// 防止引用多个，然后用数组包括组件进行集中处理
// const components = [PageTools]
// 为了不用一个个import 采用require.context方法
// 导入过滤器相关内容
import * as filters from '@/filters'

const fn = require.context('./', true, /\.vue$/) // 这个返回来的方法可以找到模块
// console.log(fn.keys()) // 路径数组
// console.log(fn('./PageTools/index.vue'))// 根据路径查找模块
const components = fn.keys().map(ele => { // 这个就找到了所有的模块并引入了
  return fn(ele)
})
// console.log(components)
// 利用vue.use来进行处理
// Vue.use(plugins) 如果是对象 那必须有install属性 从而被执行成install方法 这个install的第一个参数是vue
// 如果是函数 会被当成install方法执行 这个方法第一个参数同样是vue切记这样组件必须有名称,在main.js中use就行
// export default {
//   install: function(Vue) {
//     components.forEach(ele => {
//       Vue.component(ele.name, ele)
//     })
//   }
// }
export default (Vue) => {
  components.forEach(ele => {
    //   组件名，组件对象
    Vue.component(ele.default.name, ele.default)
  })
  // Vue.filters('过滤器名'，过滤器方法)******Object.keys
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)
// webpack的批量导入
const req = require.context('./svg', false, /\.svg$/)
// 函数的作用是根据我传入的条件去匹配对应文件
// req函数   后半部分写规则根据路径 找到对应的模块（目录，是否查找子文件，匹配的正则）
// console.log(req)
// const path = './dashboard.svg'
// console.log(req(path))
// // req.keys() 方法
// console.log(req.keys())
// 声明了一个函数
const requireAll = (requireContext) => { return requireContext.keys().map(requireContext) }
requireAll(req)

// const fn = require.context('./svg', false, /\.svg$/)
// fn.keys()==>匹配上的.svg文件的路径组成的数组
// function requireAll(fn) {
//   return fn.keys().map((item) => {
//     return fn(item)
//   })
// }

// requireAll(fn)

// axios的二次封装
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// 为了便于维护在外部定义超时的时间差
const TimeOut = 3600 // s
// 定义一个函数去对比时间是否超时
function IsCheckTimeOut() {
  const currentTime = Date.now() // 时间2当前调用接口的时间+new Date() 都是返回当前时间
  const timeStamp = (currentTime - store.getters.hrsassTime) / 1000 // 1s==1000ms
  return timeStamp > TimeOut // true超时 false没超时
}
// 通过axios.create()创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 通过请求拦截器给每个请求加上token，就不用每次都写了
service.interceptors.request.use(config => {
  console.log(config)
  if (store.getters.token) {
    // 由于每次发送请求都要判断token是不是超时所以定义在请求拦截器更合适
    if (IsCheckTimeOut()) { // 超时
      // 删除数据和token跳转到登录页面
      store.dispatch('user/logout')
      router.push('/login')
      // 返回错误提示超时 请求返回回来的是一个peomise所以要用promise的拒绝状态
      return Promise.reject(new Error('token 超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  // 返回处理后的cofig
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器 因为到达user.js里的数据被axios包装了一层，我们不需要所以在这里做处理
// 接拦截器收两个函数一个成功的一个失败的
service.interceptors.response.use(response => {
  // console.log(response)
  // 1.考虑需要把哪些数据传过去
  // 2.接口成功了，并且业务成功了
  // 3.如果没有成功 Promise.reject 抛出错误
  // response就是包装完的结果
  const { message, data, success } = response.data
  if (success) { // 业务逻辑成功
    // 数据传过去
    return data
  }
  // 请求成功了但是succes没显示success，业务没成功大写MSG是组件的提示框js文件不需要this
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  // console.log(Promise.reject(error))
  // 当token变化报401就是token出问题了再去让用户登录
  if (error.response && error.response.status === 401) {
    // 删除数据和token跳转到登录页面
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('token失效！')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default service

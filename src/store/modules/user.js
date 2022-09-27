import { login } from '@/api/login'
import { getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}, // 如果是null
    hrsassTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    // 存用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    // 当我们退出的时候需要移除用户信息
    REMOVE_USER_INFO(state, userInfo) {
      state.userInfo = {}
    },
    // 退出清除token，插件与本地自动同步
    REMOVE_TOKEN(state) {
      state.token = null
    },
    // 解决401token超时失效问题（思路先获取当前存入token的时间，根据时间差来判定是不是过期）
    SET_HR_TIME(state, time) {
      state.hrsassTime = time
    }
  },
  actions: {
    async  loginAction({ commit }, loginData) {
      // 调接口 响应拦截器处理完就只需要data了
      const data = await login(loginData)
      commit('SET_TOKEN', data)
      // 存储完token以后把当前时间保存
      commit('SET_HR_TIME', +new Date())
    },
    // 获取用户信息的请求
    async getUserInfo({ commit }) {
      // 接口请求
      const data = await getUserInfo()
      // console.log(data)
      // 获取更多用户信息也需要调用
      const info = await getUserDetailById(data.userId)
      // console.log(info)
      // console.log(data)
      // 需要把两者解构之后都存进vuex
      const result = { ...data, ...info }
      commit('SET_USER_INFO', result)
      // state.userInfo = userInfo // 可以做到响应式
      // state.userInfo = { ...userInfo } //  可以做到响应式
      // { ...userInfo } 和 userInfo 是不同的两个对象， 他们本质指向的地址是不一致的
      // 但是直接赋值的话 state.userInfo 和 userInfo 本质指向的地址是一致的
      // 如果 userInfo 的这个对象在给别人 就导致了Vuex.state.user.userInfo 和 外界的值 就执向同一个了
      // 彻底 解决这个问题 深拷贝
      // 数据返回出去后边使用，但是直接返回存在问题，因为是复杂数据类型，所以可以在外边修改data这样会导致vuex里的数据也被修改，需要解决
      // 解决方案：我们可以通过json字符串来解决
      return data
    },
    // 清除token和删除用户信息
    logout({ commit }) {
      // 清除原来的数据和token
      commit('REMOVE_USER_INFO')
      commit('REMOVE_TOKEN')
    }
  }
}

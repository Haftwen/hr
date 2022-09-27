import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// 导入持久化的工具
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'hr',
      reducer(state) {
        // 这个state保存的是每个模块下的state里的东西
        const { user } = state
        // console.log(user)
        // 返回的值作为value存储在本地
        // 结构需要一模一样
        return {
          user: {
            token: user.token,
            hrsassTime: user.hrsassTime
          }
        }
      }
      // 存储完token以后把当前时间保存(另一种持久化的写法)
      // paths: ['user.hrsassTime']
    })
  ],
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store

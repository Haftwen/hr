// 获取用户信息的接口
import request from '@/utils/request.js'
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 接口风格分两种
// resetful 同一个模块接口地址相同 但是请求方式不同
// 传统风格 接口地址不同 但是 方法可以相同
// 获取用户更多信息
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}
/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
// 获取员工的更多信息 去渲染表格下半部分
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}


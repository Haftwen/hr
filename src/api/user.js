// 获取用户信息的接口
import request from '@/utils/request.js'
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户更多信息
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}

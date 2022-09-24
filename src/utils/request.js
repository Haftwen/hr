// axios的二次封装
import axios from 'axios'
// 通过axios.create()创建axios实例
const service = axios.create({
  baseUrl: '/dev',
  timeout: 5000
})
export default service

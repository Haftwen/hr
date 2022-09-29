import request from '@/utils/request'

export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    // 页码每页的条数
    params
  })
}

// 发送新增角色的接口
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
/**
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/** **
 *  删除角色
 *
 * ****/
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

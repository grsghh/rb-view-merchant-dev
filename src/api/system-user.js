import request from '@/utils/request'
// 用户分页信息
export function getUserList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/list/with-page`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
// 根据用户id查询用户详情
export function getUser(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/${id}`,
    method: 'GET'
  })
}
// 添加用户
export function addUser(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users`,
    method: 'POST',
    data
  })
}
// 修改用户信息
export function editUserInfo(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/${data.id}`,
    method: 'PUT',
    data
  })
}
// 删除用户
export function delUser(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/${id}`,
    method: 'DELETE'
  })
}
// 修改密码
export function alterUserPassword(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/users/${data.id}/password`,
    method: 'PUT',
    data
  })
}
// 修改状态
export function alterUserStatus(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/${data.id}/disabled`,
    method: 'PUT',
    // data: { 'disabled': data.disabled }
    data: { 'disabled': parseInt(data.disabled) }
  })
}
// 根据数据字典查询用户状态
export function getStatus() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/100001`,
    method: 'GET'
  })
}
// 新增用户时 用户类型的 下拉框
export function getType() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/100009`,
    method: 'GET'
  })
}
// 查询当前平台下所有角色
export function getAllRoles(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles`,
    method: 'GET'
    ,params
  })
}

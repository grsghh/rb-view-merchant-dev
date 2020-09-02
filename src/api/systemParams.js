import request from '@/utils/request'

// 查询当前商户的信息
export function getSetting() {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/basic-setting`,
    method: 'GET'
  })
}
// 修改商户信息
export function editSetting(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/basic-setting`,
    method: 'PUT',
    data
  })
}
//获取地域
export function area(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbDatadict}/regions/${data.type}/by-type`,
    method: 'get',
    params:data
  })
}
// 查询当前商户指定类型的地址
export function getList(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/list/by-type`,
    method: 'get',
    params
  })
}
// 根据地址id查询地址详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/${id}`,
    method: 'GET'
  })
}
// 添加地址
export function addAddress(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address`,
    method: 'POST',
    data
  })
}
// 修改地址
export function editAddress(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/${data.id}`,
    method: 'put',
    data
  })
}// 设置默认地址
export function setAddress(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/set-default/${id}`,
    method: 'put'
  })
}
// 删除地址
export function delAddress(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/${id}`,
    method: 'DELETE'
  })
}
// 查询当前商户的支付配置信息
export function getPayDetail() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/payment-configs`,
    method: 'GET'
  })
}
// 获取当前经销商代理分佣设置
export function apiRebatesConfig() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/order-awards/rebates-config`,
    method: 'GET'
  })
}
// 设置当前经销商代理分佣设置
export function apiSetRebatesConfig(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/order-awards/rebates-config`,
    method: 'post',
    data
  })
}
// 保存当前商户的支付配置信息
export function setPayDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/payment-configs`,
    method: 'POST',
    data
  })
}

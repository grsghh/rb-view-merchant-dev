import request from '@/utils/request'
// 分页查询优惠券
export function couponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/list`,
    method: 'POST',
    data,
    params:{pageNo:data.pageNo,pageSize:data.pageSize}
  })
}
//新增优惠券
export function addCouponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons`,
    method: 'POST',
    data
  })
}
//根据id查询优惠券基本信息
export function detailCouponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/${data.id}`,
    method: 'GET'
  })
}
//根据id更新优惠券的信息
export function editCouponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/${data.id}`,
    method: 'PUT',
    data
  })
}
//根据id删除优惠券
export function delCouponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/${data.id}`,
    method: 'DELETE'
  })
}
//分页优惠券领取/发放详情列表
export function CouponRecordsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/member-coupons/list`,
    method: 'POST',
    data,
    params:{pageNo: data.pageNo,pageSize: data.pageSize}
  })
}
//根据id将优惠券置为失效
export function expireCoupons(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/${data.id}/unabled/`,
    method: 'PUT'
  })
}
//发放优惠券
export function grantsCoupons(id,data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/grants/${id}`,
    method: 'PUT',
    data
  })
}

















//小程序
//查询当前用户的优惠券
export function miniCouponsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/coupons/me`,
    method: 'GET',
    params:data
  })
}
//根据id查询优惠券使用说明
export function CouponsRule(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/${data.id}`,
    method: 'GET'
  })
}



// 分页查询代理等级信息
export function getLevels(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/list`,
    method: 'get',
    params: {}
  })
}
// 根据代理等级id查询代理等级详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${id}`,
    method: 'GET'
  })
}
// 添加代理等级
export function addLevel(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'POST',
    data
  })
}
// 修改代理等级
export function editLevel(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${data.id}`,
    method: 'put',
    data
  })
}
// 删除代理等级
export function delLevel(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${id}`,
    method: 'DELETE'
  })
}
// 得到普通代理升级条件
export function getGeneralUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/general-upgrade`,
    method: 'GET'
  })
}
// 得到高级代理升级条件
export function getHighUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/advanced-upgrade`,
    method: 'GET'
  })
}
// 得到联创代理升级条件
export function getLianUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/partner-upgrade`,
    method: 'GET'
  })
}
// 设置普通代理升级条件
export function setGeneralUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/general-upgrade`,
    method: 'POST',
    data
  })
}
// 设置高级代理升级条件
export function setHighUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/advanced-upgrade`,
    method: 'POST',
    data
  })
}
// 设置联创代理升级条件
export function setLianUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/partner-upgrade`,
    method: 'POST',
    data
  })
}

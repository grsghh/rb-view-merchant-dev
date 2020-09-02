import request from '@/utils/request'
// 当前经销商下的微信提现日志列表
export function getList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/wechat/list`,
    method: 'post',
    params: {pageNo: data.pageNo, pageSize: data.pageSize},
    data
  })
}
// 分页查询当前经销商所有会员列表 适用场景：微信提现中添加收款人调用
export function getAccountList() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/payees`,
    method: 'GET'
  })
}
// 分页查询当前经销商所有会员列表 适用场景：微信提现中添加收款人调用
export function getAllList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/all/with-page`,
    method: 'post',
    params: {pageNo: data.pageNo, pageSize: data.pageSize},
    data
  })
}
// 微信提现发送验证码
export function sendTheMessage() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/short-messages/wechat-withdrawals/verify-code`,
    method: 'put'
  })
}
// 经销商后台微信提现申请 使用场景：经销商后台-微信工具-微信提现
export function wxWithdrawals(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/wechat`,
    method: 'post',
    data
  })
}
// 新增当前经销商的收款账号
export function addAccounts(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/payees`,
    method: 'post',
    data
  })
}
// 重试失败的商户后台提现 适用场景：经销商后台-微信工具-微信提现
export function wxWithdrawalsAgain(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/wechat/${id}/retry`,
    method: 'put'
  })
}
// 删除当前经销商指定收款账号
export function delAcconut(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/payees/${id}`,
    method: 'DELETE'
  })
}


import request from '@/utils/request'

//提现管理列表 适用场景：经销商管理
export function list(data) {
  let param = {...data};
  delete param.pageNo;
  delete param.pageSize;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/list?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post'
    ,data:param
  })
}
//通过并自动提现
export function passOnline(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/pass-online/${data.id}`,
    method: 'put'
    ,data:param
  })
}
//通过并人工提现
export function passOffline(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/pass-offline/${data.id}`,
    method: 'put'
    ,data:param
  })
}
//提现审核驳回
export function reject(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/reject/${data.id}`,
    method: 'put'
    ,data:param
  })
}
//设置当前经销商提现限制
export function apisSetWithdrawals(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/withdrawals-limit`,
    method: 'post'
    ,data
  })
}
//得到当前经销商提现限制
export function apisWithdrawalsLimit() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/withdrawals-limit`,
    method: 'get'
  })
}
//重试失败的会员收益提现
export function apisRetry(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/withdrawals/member-earnings/${data.id}/retry`,
    method: 'put'
  })
}

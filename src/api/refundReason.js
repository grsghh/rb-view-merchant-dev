import request from '@/utils/request'

// 查询所有退款原因
export function getAllRefund() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons`,
    method: 'GET'
  })
}
// 分页查询退款原因信息
export function refund(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons/list`,
    method: 'GET',
    params: data
  })
}
// 根据供应商id查询退款原因详情
export function getReasonsById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons/${id}`,
    method: 'GET'
  })
}
// 添加退款原因
export function addRefund(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons`,
    method: 'POST',
    data
  })
}
// 修改退款原因
export function editRefund(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons/${data.id}`,
    method: 'put',
    data
  })
}
// 删除退款原因
export function delRefund(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/refund-reasons/${id}`,
    method: 'DELETE'
  })
}


// 查询所有退货原因
export function getAllReturn() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons`,
    method: 'GET'
  })
}
// 分页查询退货原因信息
export function returnList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons/list`,
    method: 'GET',
    params: data
  })
}
// 查询所有退货原因
export function returnAllList() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons`,
    method: 'GET'
  })
}
// 根据供应商id查询退货原因详情
export function getReturnReasonsById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons/${id}`,
    method: 'GET'
  })
}
// 添加退货原因
export function addReturn(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons`,
    method: 'POST',
    data
  })
}
// 修改退货原因
export function editReturn(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons/${data.id}`,
    method: 'put',
    data
  })
}
// 删除退货原因
export function delReturn(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/return-reasons/${id}`,
    method: 'DELETE'
  })
}

import request from '@/utils/request'
// 查询所有粉丝标签
export function getAllFansTags() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag`,
    method: 'get'
  })
}
// 分页查询粉丝分析列表
export function getList(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/list`,
    method: 'get',
    params
  })
}
// 查询第一级商品类别
export function getProductList() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/first-level`,
    method: 'get'
  })
}
// 粉丝分析列表
export function fansList(data) {
  let {pageNo,pageSize} = data;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/fans-analyses/with-page`,
    method: 'POST'
    ,params:{pageNo,pageSize}
    ,data
  })
}
// 根据粉丝标签id查询粉丝标签详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/${id}`,
    method: 'GET'
  })
}
// 根据昵称获取代理商
export function allAgents(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent/list?nickname=${data}`,
    method: 'GET'
  })
}
// 添加粉丝标签
export function addTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag`,
    method: 'POST',
    data
  })
}
// 为粉丝批量添加标签
export function mutiAddTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans/batch/tags`,
    method: 'POST',
    data
  })
}
//分页查询代理升级申请记录信息
export function applyAgent(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/upgrade-apply-records/list`,
    method: 'POST',
    data,
    params:{pageNo: data.pageNo,pageSize: data.pageSize}
  })
}
//审核驳回
export function applyReject(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/upgrade-apply-records/reject/${data.id}`,
    method: 'PUT',
    data
  })
}
//审核通过
export function applyPass(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/upgrade-apply-records/pass/${data.id}`,
    method: 'PUT',
    data
  })
}

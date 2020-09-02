import request from '@/utils/request'

//查询当前经销商的规格树形数据
export function specificationsTrees(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications/me`,
    method: 'GET'
  })
}
//查询规格属性列表
export function specifications(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications`,
    method: 'GET',
    params:data
  })
}
//添加（支持添加规格 添加规格分类 添加规格属性）
export function addSpecifications(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications`,
    method: 'POST',
    data
  })
}
//根据id查详情 支持规格分类 规格属性 规格
export function getspecifications(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications/${data.id}`,
    method: 'GET'
  })
}
//修改 （支持修改规格 修改规格分类 修改规格属性）
export function changeSpecifications(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除（支持删除规格 删除规格属性 删除规格分类）
export function deleteSpecifications(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications/${data.id}`,
    method: 'DELETE'
  })
}

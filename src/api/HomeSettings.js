import request from '@/utils/request'
// 分页查询轮播配置信息
export function loopset(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/slideshows/list/with-page`,
    method: 'get',
    params:data
  })
}
//添加轮播配置信息
export function addLoopset(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/slideshows`,
    method: 'POST',
    data
  })
}
//根据id得到轮播配置
export function detialLoopset(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/slideshows/${data.id}`,
    method: 'GET'
  })
}
//修改轮播配置信息
export function editLoopset(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/slideshows/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除轮播设置
export function delLoopset(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/slideshows/${data.id}`,
    method: 'DELETE'
  })
}


// 分页查询推荐分类信息
export function recommendSort(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/recommend-categories/list/with-page`,
    method: 'get',
    params:data
  })
}
//添加推荐分类
export function addrecommendSort(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/recommend-categories`,
    method: 'POST',
    data
  })
}
//修改推荐分类
export function editrecommendSort(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/recommend-categories/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除推荐分类
export function delrecommendSort(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/recommend-categories/${data.id}`,
    method: 'DELETE'
  })
}


//白名单使用橱窗接口
export function recommendWindow() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/gallery-featured/for-backed`,
    method: 'get'
  })
}
//设置当前经销商橱窗推荐
export function setRecommendWindow(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/systems-config/gallery-featured`,
    method: 'POST',
    data
  })
}

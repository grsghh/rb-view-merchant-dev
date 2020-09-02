import request from '@/utils/request'

// 根据id获取在售商品详情预览（适用场景：B端C端店铺的商品详情页）
export function onSaleDetail(data) {
  return request({
    // url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/on-sale/${data.id}`,
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/preview-for-backed/${data.id}`,
    method: 'get'
  })
}

// 根据id获取商品详情
export function proDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/preview-for-backed/${data.id}`,
    method: 'get'
  })
}

// 分页查询商品列表
export function homeList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/list/with-page?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post'
    ,data
  })
}

// 查询第一级商品类别
export function homeSort(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/first-level`,
    method: 'get'
  })
}


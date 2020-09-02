import request from '@/utils/request'

// 分页查询商品标签信息
export function getTags(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-tag/list`,
    method: 'get',
    params
  })
}

// 根据商品标签id查询商品标签详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-tag/${id}`,
    method: 'GET'
  })
}
// 添加商品标签
export function addTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-tag`,
    method: 'POST',
    data
  })
}
// 修改商品标签
export function editTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-tag/${data.id}`,
    method: 'put',
    data
  })
}
// 删除商品标签
export function delProduct(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/${id}`,
    method: 'DELETE'
  })
}
// 查询所有商品类别
export function allProduct() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/second-level/trees`,
    method: 'GET'
  })
}

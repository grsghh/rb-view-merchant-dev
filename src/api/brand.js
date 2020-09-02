import request from '@/utils/request'

//分页查询品牌信息
export function brand(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand/list`,
    method: 'GET',
    params:data
  })
}
//添加品牌
export function addBrand(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand`,
    method: 'POST',
    data
  })
}
//根据品牌id查询品牌详情
export function getBrand(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand/${data.id}`,
    method: 'GET'
  })
}
//修改品牌
export function changeBrand(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand/${data.id}`,
    method: 'PUT',
    data
  })
}
//根据id删除品牌
export function deleteBrand(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand/${data.id}`,
    method: 'DELETE'
  })
}


//图片回显
export function getPicImg(id) {
  return request({
    url: `/rb-oss/files/${id}/url`,
    method: 'GET'
  })
}

//视频回显
export function videoUrl(id) {
  return request({
    url: `/rb-oss/files/videos/${id}/url`,
    method: 'GET'
  })
}


//分页查询商品类别信息
export function category() {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/tree`,
    method: 'GET'
  })
}
//添加商品类别
export function addCategory(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category`,
    method: 'POST',
    data
  })
}
//查询所有商品类别
export function allCategory() {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category`,
    method: 'GET'
  })
}
//根据商品类别id查询商品类别详情
export function getCategory(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/${data.id}`,
    method: 'GET'
  })
}
//修改商品类别
export function changeCategory(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除商品类别
export function deleteCategory(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/${data.id}`,
    method: 'DELETE'
  })
}

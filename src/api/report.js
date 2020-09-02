import request from '@/utils/request'
// 供应商导出
export function supplierExport(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/list/export`,
    method: 'get',
    params:data
  })
}
// 在售商品、仓库商品、草稿商品导出
export function productExport(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/list/export`,
    method: 'post'
    ,data
  })
}
// 订单列表导出
export function orderExport(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/export/un-despatch`,
    method: 'POST'
    ,data
  })
}
//打单发货导出
export function goDelivery(data){
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/export/invoices-deliveries`,
    method: 'POST'
    ,data
  })
}

// 代理、粉丝列表导出
export function listExport(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/list/export`,
    method: 'post'
    ,data
  })
}

// 报表模板
// export function commonGrf(data) {
//   return request({
//     url: `/ruilang/template/${data.grfType}`,
//     method: 'get'
//   })
// }

// //下载批量发货模板
// export function download() {
//   return request({
//     url: `/${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/batch-despatch/download-template`,
//     method: 'GET'
//   })
// }

//开始批量发货
export function beginDeliver(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/batch-despatch`,
    method: 'POST',
    data
  })
}

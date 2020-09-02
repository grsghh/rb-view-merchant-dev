import request from '@/utils/request'
// 分页查询供应商信息
export function getSupplier(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/list`,
    method: 'get',
    params
  })
}

// 查询所有品牌
export function allBrand() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand`,
    method: 'GET'
  })
}

// 查询所有品牌
export function allBrandWhite() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand/iptable`,
    method: 'GET'
  })
}

// 根据供应商id查询供应商详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/${id}`,
    method: 'GET'
  })
}
// 添加供应商
export function addSupplier(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier`,
    method: 'POST',
    data
  })
}
// 修改供应商
export function editSupplier(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/${data.id}`,
    method: 'put',
    data
  })
}
// 删除供应商
export function delSupplier(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/${id}`,
    method: 'DELETE'
  })
}

//根据dictNO查询数据字典
export function dicts(no) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/${no}`,
    method: 'GET',
  })
}
//获取地域
export function area(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbDatadict}/regions/${data.type}/by-type`,
    method: 'get',
    params:data
  })
}

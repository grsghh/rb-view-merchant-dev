import request from '@/utils/request'
//分页查询商品列表 在售商品、仓库商品、草稿商品中的商品查询列表都用该接口，通过商品状态参数来区分
export function productList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/list/with-page`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}

//查询所有供应商
export function supplier() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier`,
    method: 'get'
  })
}

//查询所有供应商 白名单
export function supplierWhite() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/supplier/iptable`,
    method: 'get'
  })
}

//查询所有品牌
export function brand() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/brand`,
    method: 'get'
  })
}

//查询列表（支持查询所有规格分类，指定分类下的规格，指定规格下的所有规格属性）
export async function specifications(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/specifications`,
    method: 'get'
    ,params
  })
}

//查询当前经销商的运费模板简单对象 供发布商品时使用
export function tempList() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/simple/all`,
    method: 'get'
  })
}
//查询所有商品标签
export function producTag(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-tag`,
    method: 'get'
    ,params
  })
}

//修改商品状态
export function changeProductStatus(params) {
  const data = {
    state:params.state
  };
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/${params.id}`,
    method: 'PATCH'
    ,data
  })
}

//发布商品（支持存入仓库，存为草稿，立即发布三种操作）
export function publishProduct(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products`,
    method: 'POST',
    data
  })
}

//根据id获取商品详情
export function productDetail(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/${params.id}`,
    method: 'get'
  })
}

//得到两级商品类别树（下拉框使用）
export function categorySecond() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/product-category/second-level/trees`,
    method: 'get'
  })
}

//修改商品
export function editProduct(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/${data.id}`,
    method: 'put'
    ,data
  })
}
//查询商品分析列表
export function productAnalysisList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/analysis`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//添加商品标签（支持批量和单条操作）
export function addAnalysisTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/tags`,
    method: 'POST',
    data
  })
}

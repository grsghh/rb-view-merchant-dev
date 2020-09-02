import request from '@/utils/request'
//分页查询推广素材信息
export function materialList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/list/with-page`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//分页查询推广素材信息 白名单
export function materialListWhite(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/list/with-page/iptable`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//添加推广素材
export function addMaterial(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials`,
    method: 'POST'
    ,data
  })
}
//根据推广素材id查询推广素材详情
export function getMaterial(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/${id}`,
    method: 'GET'
  })
}
//修改推广素材
export function editMaterial(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/${data.id}`,
    method: 'PUT'
    ,data
  })
}
//删除推广素材
export function delMaterial(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/${id}`,
    method: 'DELETE'
  })
}
//根据id查询推广素材详情,适用场景：经销商后台使用
export function materialContent(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/${data.id}/iptable`,
    method: 'get'
    ,params:data
  })
}

//获取公众号分享配置参数
export function shareConfig(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/generalization-materials/share-config`,
    method: 'post'
    ,data
  })
}

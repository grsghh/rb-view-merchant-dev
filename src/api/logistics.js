import request from '@/utils/request'

// 根据物流公司类型查询物流公司列表 1-物流 2-快递
export function getLogistics(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPlatform}/logistics-companies/list/by-category`,
    method: 'get',
    params
  })
}
// 查询当前商户的常用物流公司,返回用户常用物流公司的id集合
export function getMyLogistics(category) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/basic-setting/frequent-logistics-id/${category}`,
    method: 'get'
  })
}
// 设置当前商户的常用物流公司
export function setMyLogistics(data) {
  const params = data.list;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/basic-setting/frequent-logistics/${data.category}`,
    method: 'put',
    data: params
  })
}
// 分页查询当前经销商的运费模板列表
export function getTemplateList(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/list/with-page`,
    method: 'GET',
    params
  })
}
// 新增运费模板
export function addTemplateList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates`,
    method: 'POST',
    data
  })
}
//删除指定运费模板
export function delTemplate(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${data.id}`,
    method: 'DELETE'
  })
}
// 查询指定运费模板
export function getTemplateById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${id}/detail`,
    method: 'get'
  })
}
//复制运费模板
export function copyTemplate(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/copy/${data.id}`,
    method: 'POST'
  })
}
// 查询指定运费模板详情 为修改运费模板回显时使用
// export function getDetailById(id) {
//   return request({
//     url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${id}/detail`,
//     method: 'get'
//   })
// }
// // 修改指定运费模板
// export function editDetailById(data) {
//   return request({
//     url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${data.id}`,
//     method: 'put',
//     data
//   })
// }
// 查询指定运费模板详情 为修改运费模板回显时使用
export function gettempDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${id}/detail`,
    method: 'get'
  })
}
//修改指定运费模板
export function changeTempDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/carriage-templates/${data.id}`,
    method: 'put',
    data
  })
}

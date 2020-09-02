import request from '@/utils/request'
// 查询所有模板分类信息
export function getAllTemplate() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories`,
    method: 'get'
  })
}
// 分页查询短信模板类别信息
export function getTemplates(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories/list`,
    method: 'get',
    params
  })
}
// 根据id查询短信模板类别详情
// export function getDetailById(id) {
//   return request({
//     url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/product-tag/${id}`,
//     method: 'GET'
//   })
// }
// 添加短信模板类别
export function addTemplate(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories`,
    method: 'POST',
    data
  })
}
// 修改短信模板类别
export function editTemplate(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories/${data.id}`,
    method: 'put',
    data
  })
}
// 删除短信模板类别
export function delTemplate(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories/${id}`,
    method: 'DELETE'
  })
}


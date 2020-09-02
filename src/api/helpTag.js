import request from '@/utils/request'
// 分页查询帮助文章标签信息
export function getTags(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/list`,
    method: 'get',
    params
  })
}
// 根据帮助文章标签id查询粉丝标签详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/${id}`,
    method: 'GET'
  })
}
// 添加帮助文章标签
export function addTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags`,
    method: 'POST',
    data
  })
}
// 修改帮助文章标签
export function editTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/${data.id}`,
    method: 'put',
    data
  })
}
// 删除帮助文章标签
export function delTags(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/${id}`,
    method: 'DELETE'
  })
}


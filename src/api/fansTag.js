import request from '@/utils/request'
// 分页查询粉丝标签信息
export function getTags(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/list`,
    method: 'get',
    params
  })
}
// 根据粉丝标签id查询粉丝标签详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/${id}`,
    method: 'GET'
  })
}
// 添加粉丝标签
export function addTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag`,
    method: 'POST',
    data
  })
}
// 修改粉丝标签
export function editTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/${data.id}`,
    method: 'put',
    data
  })
}
// 删除粉丝标签
export function delTags(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag/${id}`,
    method: 'DELETE'
  })
}


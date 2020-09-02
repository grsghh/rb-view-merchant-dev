import request from '@/utils/request'
// 查询所有帮助文章标签
export function getAllTags() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags`,
    method: 'get'
  })
}
// 查询所有帮助文章标签
export function AllTags() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/all`,
    method: 'get'
  })
}
//根据所属模块查询帮助手册便签信息 使用场景：经销商后台新增帮助手册时选择标签
export function helpTags(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manual-tags/by-module-id`,
    method: 'get',
    params:data
  })
}
// 分页查询帮助手册列表
export function getList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/list`,
    method: 'post',
    params: { pageNo: data.pageNo, pageSize: data.pageSize },
    data
  })
}
// 根据id查询手册详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/${id}`,
    method: 'GET'
  })
}
// 新增手册
export function addManuals(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals`,
    method: 'POST',
    data
  })
}
// 修改(根据id全量更新手册信息)
export function editManuals(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/${data.id}`,
    method: 'put',
    data
  })
}
// 删除(根据id删除手册)
export function delManuals(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/${id}`,
    method: 'DELETE'
  })
}


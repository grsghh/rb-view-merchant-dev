import request from '@/utils/request'
//分页查询备注信息
export function remark(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs/list`,
    method: 'GET',
    params: data
  })
}
// 根据供应商id查询备注详情
export function getRemarkById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs/${id}`,
    method: 'GET'
  })
}
// 添加备注
export function addRemark(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs`,
    method: 'POST',
    data
  })
}
// 修改备注
export function editRemark(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs/${data.id}`,
    method: 'put',
    data
  })
}
// 删除备注
export function delRemark(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs/${id}`,
    method: 'DELETE'
  })
}

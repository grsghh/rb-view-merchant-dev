import request from '@/utils/request'
// 查询所有代理等级
export function allLevel(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'get'
  })
}
// 分页查询代理等级信息
export function getLevels(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/list`,
    method: 'get',
    params: {}
  })
}
// 根据代理等级id查询代理等级详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${id}`,
    method: 'GET'
  })
}
// 添加代理等级
export function addLevel(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'POST',
    data
  })
}
// 修改代理等级
export function editLevel(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${data.id}`,
    method: 'put',
    data
  })
}
// 删除代理等级
export function delLevel(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/${id}`,
    method: 'DELETE'
  })
}
// 得到普通代理升级条件
export function getGeneralUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/general-upgrade`,
    method: 'GET'
  })
}
// 得到高级代理升级条件
export function getHighUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/advanced-upgrade`,
    method: 'GET'
  })
}
// 得到联创代理升级条件
export function getLianUpgrade() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/partner-upgrade`,
    method: 'GET'
  })
}
// 设置普通代理升级条件
export function setGeneralUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/general-upgrade`,
    method: 'POST',
    data
  })
}
// 设置高级代理升级条件
export function setHighUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/advanced-upgrade`,
    method: 'POST',
    data
  })
}
// 设置联创代理升级条件
export function setLianUpgrade(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level/config/partner-upgrade`,
    method: 'POST',
    data
  })
}

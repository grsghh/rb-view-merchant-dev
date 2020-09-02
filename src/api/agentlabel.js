import request from '@/utils/request'

//分页查询代理标签信息
export function agentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag/list`,
    method: 'GET',
    params:data
  })
}
//添加代理标签
export function addagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag`,
    method: 'POST',
    data
  })
}
//根据代理标签id查询代理标签详情
export function getagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag/${data.id}`,
    method: 'GET'
  })
}
//修改代理标签
export function changeagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除（支持删除规格 删除规格属性 删除规格分类）
export function deleteagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag/${data.id}`,
    method: 'DELETE'
  })
}


//分页查询会员列表
export function members(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/list/with-page`,
    method: 'POST',
    data,
    params:{pageNo:data.pageNo,pageSize:data.pageSize}
  })
}
//查询代理商的推广列表
export function agentPromote(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/generalize/${data.id}/with-page`,
    method: 'POST',
    data
  })
}
//得到代理商标签
export function getpreagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent/tags`,
    method: 'GET',
    params:data
  })
}
//设置代理商标签
export function setpreagentTag(data,id) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent/tags?id=${id}`,
    method: 'post',
    data
  })
}

//得到粉丝标签
export function getprefansTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans/tags`,
    method: 'GET',
    params:data
  })
}
//设置粉丝标签
export function setprefansTag(data,id) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans/tags?id=${id}`,
    method: 'post',
    data
  })
}
//查询所有代理等级
export function getAllagentLevel(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'GET'
  })
}
//查询所有代理标签
export function getAllagentTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag`,
    method: 'GET'
  })
}
//查询所有粉丝标签
export function getAllfansTag(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans-tag`,
    method: 'GET'
  })
}
//根据粉丝id查询该粉丝的地址列表
export function getfansAddress(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/list/${data.id}`,
    method: 'GET'
  })
}
//粉丝升级为代理接口
export function makeAgent(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans/upgrade-agent/${data.id}`,
    method: 'post'
  })
}
// 粉丝更换代理
export function changeTheAgent(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/fans/modify-agent/${data.id}?agentId=${data.agentId}`,
    method: 'PUT',
    data
  })
}
// 修改会员用户的禁用状态，适用场景：代理列表和粉丝列表修改会员的禁用状态
export function apisChangeUserState(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/${data.id}/disabled`,
    method: 'PUT',
    data
  })
}

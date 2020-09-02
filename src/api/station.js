import request from '@/utils/request'
//查询全部代理和全部粉丝人数
export function agentAndFansNum() {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbAccount}/members/agent-fans-counts`,
    method: 'get'
  })
}
//接收人明细
export function receiveDetail(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbAccount}/members/receive-member-details`,
    method: 'POST',
    data
  })
}
//发布消息
export function publishMsg(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages`,
    method: 'POST',
    data
  })
}
//删除某个消息
export function apisDelMsg(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/${data.id}`,
    method: 'delete'
  })
}
//批量删除消息
export function apisDelMulitMsg(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/batch/delete`,
    method: 'POST'
    ,data
  })
}
//消息列表
export function apisMsgList(data) {
  const params = {
    pageNo:data.pageNo
    ,pageSize:data.pageSize
  };
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/list/with-page`,
    method: 'post',
    params
    ,data
  })
}
//根据id查询消息详情（经销商后台使用）
export function msgDetail(id) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/${id}`,
    method: 'get'
  })
}

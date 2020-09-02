import request from '@/utils/request'
// 接单奖励列表
export function getRewardList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards-list`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
// 批量发放奖金
export function batchGiveOut(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/batch/give-out`,
    method: 'POST',
    data
  })
}
// 批量修改奖励记录备注
export function batchRemark(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/batch/remarks`,
    method: 'POST',
    data
  })
}
// 查询所有代理等级
export function getAllLevels() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'get'
  })
}
// 根据奖励记录id修改备注
export function editRemark(data) {
  let param = {...data}
  delete param.id
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/${data.id}/remarks`,
    method: 'PUT',
    data:param
  })
}
//接单奖励明细记录
export function detailsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/award-records/details-list`,
    method: 'post',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//得到指定奖励记录的发放信息
export function getAwards(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/${data.id}/give-out`,
    method: 'get'
  })
}
//发放指定奖励记录的奖金
export function outMoney(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/${data.id}/give-out`,
    method: 'PUT',
    data
  })
}
// 分页查询代理分析列表
export function agentAnalyses(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/members/agent-analyses/with-page`,
    method: 'post',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
// 为代理商批量添加标签
export function addTagsForAgent(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent/batch/tags`,
    method: 'post',
    data
  })
}
//重试发放指定奖励记录的线上付款失败的奖金
export function tryReward(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/${data.id}/retry`,
    method: 'put',
    data
  })
}
//批量线上发放奖金
export function batchOnline(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/batch-online/give-out`,
    method: 'post',
    data,
    timeout:15000
  })
}
//批量线下发放奖金
export function batchOffline(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMember}/member-month-statistics/awards/batch-offline/give-out`,
    method: 'post',
    data
  })
}


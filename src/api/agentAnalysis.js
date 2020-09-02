import request from '@/utils/request'
// 查询所有代理标签
export function getAllTags() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-tag`,
    method: 'get'
  })
}
// 查询所有代理等级
export function getAllLevels() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/agent-level`,
    method: 'get'
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




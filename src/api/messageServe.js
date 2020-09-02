import request from '@/utils/request'
// 得到短信节点配置
export function getMseeageNode(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/message-nodes-config/${data.id}`,
    method: 'get'
  })
}
// 设置短信节点配置
export function setMessageNode(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/message-nodes-config/${data.smsCategoryId}`,
    method: 'put',
    data
  })
}

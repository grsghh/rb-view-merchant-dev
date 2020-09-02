import request from '@/utils/request'
//  数据字典查询消息分类(消息类型）
export function getMessageClassify() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/100016`,
    method: 'get'
  })
}
// 查询指定会员下指定类型的消息列表
export function getMessageList(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/current-member/list`,
    method: 'get',
    params
  })
}
// 删除某条消息(将消息置为不可见)
export function delMyMessage(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/${id}/un-visible`,
    method: 'PUT'
  })
}
// 查看消息（小程序使用,不支持交易物流信息）
export function apiMsgDetail(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/${id}/preview`,
    method: 'GET'
  })
}
// 将消息置为已读（物流消息预览时调用）
export function orderIsRead(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/${id}/read`,
    method: 'PUT'
  })
}
// 查询当前会员的未读消息数量
export function getUnRead() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/messages/current-member/un-read-count`,
    method: 'GET'
  })
}
// 根据id获取在售商品详情预览（适用场景：B端C端店铺的商品详情页）
export function apiArticlesDetail(id) {
  return request({
    // url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/${id}`,
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/slideshows/${id}`,
    method: 'GET'
  })
}

import request from '@/utils/request'

//分页查询短信历史列表
export function messageHistory(data) {
  let param = {...data};
  delete param.pageSize;
  delete param.pageNo;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-messages/list?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post',
    data:param
  })
}
//根据id删除记录
export function delHistory(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-messages/${data.id}`,
    method: 'DELETE'
  })
}
//批量删除
export function delMutiHistory(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-messages/batch/delete`,
    method: 'POST',
    data
  })
}
//查询自定义短信模板类别简单对象列表
export function defineTemp() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories/user-defines`,
    method: 'GET'
  })
}
//根据模板类别得到模板列表
export function TempList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/${data.id}/by-category-id`,
    method: 'GET'
  })
}
//根据模板id得到参数列表
export function paramsList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/${data.id}/params`,
    method: 'GET'
  })
}
//发送短信
export function MsgSend(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-messages/batch/send`,
    method: 'POST',
    data
  })
}

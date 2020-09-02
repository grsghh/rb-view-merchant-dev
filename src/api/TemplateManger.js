import request from '@/utils/request'

// 提取参数
export function apiGetParam(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/extract-params`,
    method: 'GET'
    ,params
  })
}
// 新增短信模板
export function apiAddMsgTmp(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates`,
    method: 'post'
    ,data
  })
}

// 查询自定义短信模板类别简单对象列表
export function apiCusMsgTmp() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/sms-template-categories/user-defines`,
    method: 'GET'
  })
}

// 根据短信模板id查询短信模板详情
export function apiMsgTmpDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/${data.id}`,
    method: 'GET'
  })
}

// 根据短信模板id查询短信模板详情
export function apiEditMsgTmp(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/${data.id}`,
    method: 'put'
    ,data
  })
}

// 删除短信模板
export function apiDelMsgTmp(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/${data.id}`,
    method: 'DELETE'
  })
}

// 分页查询短信模板列表
export function apiMsgList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMessage}/short-message-templates/list`,
    method: 'post'
    ,params:{
      pageNo:data.pageNo
      ,pageSize:data.pageSize
    }
    ,data
  })
}

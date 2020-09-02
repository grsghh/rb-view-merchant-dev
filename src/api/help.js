import request from '@/utils/request'
//根据推广素材id查询推广素材详情
export function apiHelpDetail(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/${id}/detail`,
    method: 'GET'
  })
}
//反馈
export function apiFeedback(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/help-manuals/feedback/${data.id}`,
    method: 'post'
    ,data
  })
}

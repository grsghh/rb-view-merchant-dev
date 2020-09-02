import request from '@/utils/request'
//销售概况七个统计值
export function salesOverviews(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/operation-summaries/sales-overviews`,
    method: 'get',
    params
  })
}
//粉丝概况，代理概况，商品概况
export function overviews(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/operation-summaries/overviews`,
    method: 'get',
    params
  })
}
//近七天销售走势
export function salesTrends() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/operation-summaries/sales-trends`,
    method: 'get'
  })
}

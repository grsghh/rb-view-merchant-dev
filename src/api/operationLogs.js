import request from '@/utils/request'

//日志列表
export function apisLogs(data) {
  let params = {
    pageSize: data.pageSize
    ,pageNo: data.pageNo
  };
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/merchant-operate-records/list/with-page`,
    method: 'post'
    ,data
    ,params
  })
}

import request from '@/utils/request'

//分页查询代理收益信息，应用场景：代理收益列表
export function apisEarnList(data) {
  let params = {
    pageSize: data.pageSize
    ,pageNo: data.pageNo
  };
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbStatistics}/member-statistics/earnings/list-with-page`,
    method: 'post'
    ,data
    ,params
  })
}

//分页查询收益明细，应用场景：代理收益列表详情
export function apisEarnDetail(data) {
  let params = {
    pageSize: data.pageSize
    ,pageNo: data.pageNo
  };
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbStatistics}/member-earning-log/list-with-page`,
    method: 'post'
    ,data
    ,params
  })
}

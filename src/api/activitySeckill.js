import request from '@/utils/request'
// 分页查询秒杀活动信息
export function getActivities(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/list/with-page`,
    method: 'POST',
    params: {pageNo: data.pageNo,pageSize: data.pageSize},
    data
  })
}
// 根据id查询详情
export function getDetailById(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/${id}`,
    method: 'GET'
  })
}
// 添加秒杀活动
export function addActivity(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products`,
    method: 'POST',
    data
  })
}
// 修改秒杀活动
export function editActivity(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/${data.id}`,
    method: 'put',
    data
  })
}
// 停止秒杀活动
export function stopActivity(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/shutdown/${id}`,
    method: 'put'
  })
}
// 删除秒杀活动
export function delActivity(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/${id}`,
    method: 'DELETE'
  })
}
// 复制秒杀活动
export function copyActivity(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbSeckill}/seckill-products/${id}/copy`,
    method: 'POST'
  })
}
// 通过数据字典获得秒杀的状态
export function getSeckillStatus() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/100018`,
    method: 'get'
  })
}

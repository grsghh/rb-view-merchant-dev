import request from '@/utils/request'

//打单发货订单列表
export function orderDelivery(data) {
  let param = {...data};
  delete param.pageSize;
  delete param.pageNo;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/invoices-deliveries/list?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post',
    data:param
  })
}

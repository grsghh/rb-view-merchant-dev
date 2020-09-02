import request from '@/utils/request'

//查询订单列表
export function orders(data) {
  let param = {...data};
  delete param.pageSize;
  delete param.pageNo;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/current-merchants`,
    method: 'post',
    data:param
    ,params:{pageNo:data.pageNo,pageSize:data.pageSize}
  })
}

//查询订单组列表
export function orderGroups(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/current-merchants/settle-down-groups`,
    method: 'post'
    ,data
  })
}

//订单发货
export function despatch(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/despatch/${data.id}`,
    method: 'put',
    data:param
  })
}


//关闭订单
export function closeOrder(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/close/${data.id}`,
    method: 'put'
  })
}

//经销商后台关闭结算组订单
export function closeOrderGroup(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/settle-down-groups/background-close/${data.id}`,
    method: 'put'
    ,data
  })
}

//后台关闭订单
export function adminCloseOrder(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/background-close/${data.id}`,
    method: 'put'
    ,data
  })
}


//订单线下付款
export function offlinePay(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/offline-payment/${data.id}`,
    method: 'put'
    ,data:param
  })
}

//根据结算组id线下付款
export function groupOfflinePay(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/offline-payment/${data.id}/by-groupid`,
    method: 'put'
    ,data:param
  })
}


//根据订单商品详情id查询该条商品订单的详情 (注意 该id指列表返回得该条记录id,不是订单id)
export function orderPro(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/product-properties`,
    method: 'get'
  })
}


//修改订单商品属性
export function productProperties(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/product-properties`,
    method: 'put'
    ,data:param
  })
}


//填写或修改订单卖家备注
export function remark(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/sell-remark/${data.id}`,
    method: 'put'
    ,data:param
  })
}
//批量修改订单卖家备注
export function mutiRemark(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/sell-remark/batch`,
    method: 'put'
    ,data
  })
}

//修改订单物流信息
export function apiChangeLog(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/logistics`,
    method: 'put'
    ,data:param
  })
}

//修改订单收货信息
export function apiReceiveInfos(data) {
  let param = {...data};
  delete param.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/receive-infos`,
    method: 'put'
    ,data:param
  })
}


//查询订单列表各个状态下的统计值
export function count(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/count/me`,
    method: 'POST'
    ,data
  })
}
//打单发货订单的统计值
export function countOrderandDeliver(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/invoices-deliveries/count`,
    method: 'POST'
    ,data
  })
}

//根据商品id获取商品规格库存集合
export function inventories(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/products/inventories/${data.id}`,
    method: 'get'
  })
}

//根据id查询订单详情
export function orderDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}`,
    method: 'get'
  })
}

//根据订单id查询快递物流信息
export function apiKuaidi(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/kuaidi/${data.id}`,
    method: 'get'
  })
}

//修改订单价格时根据id查询订单详情
export function apiPricesInfo(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/prices/${data.id}`,
    method: 'get'
  })
}

//修改订单价格
export function apiPricesChange(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/prices/${data.id}`,
    method: 'post'
    ,data
  })
}

//获取常用备注列表
export function apiNormalList(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/sell-remark-configs`,
    method: 'get'
  })
}

//计算应退金额
export function apiCalculationRefunds(data) {
  let nowData = {...data}
  delete nowData.id;
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/calculation-refunds/${data.id}`,
    method: 'post'
    ,data:nowData.orderProductDetailIds
  })
}

//退款申请接口
export function apiRefundApply(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refund/apply`,
    method: 'post'
    ,data
  })
}

//根据订单id查询当前订单的退款详情（适用于：处理退款或者拒绝退款时信息回显使用）
export function apiRefunds(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/refunds/${data.refundState}`,
    method: 'get'
  })
}

//单个退款审核通过接口
export function apiAuditPass(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refund/audit-pass/${data.id}`,
    method: 'put'
    ,data
  })
}


//单个退款审核拒绝接口
export function apiAuditRefuse(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refund/audit-refuse/${data.id}`,
    method: 'put'
    ,data
  })
}

//批量退款审核拒绝接口
export function apiMutiRefuse(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refund/audit-refuse/batch`,
    method: 'put'
    ,data
  })
}


//批量退款审核通过接口
export function apiMutiPass(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refund/audit-pass/batch`,
    method: 'put'
    ,data
  })
}


//重新支付线上退款
export function apiRepay(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/re-pay-refund/${data.id}`,
    method: 'post'
  })
}

//改为线下人工支付退款（仅当线上支付退款失败时才可以调用该接口）
export function apiManualPay(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/refunds/change-to-offline/${data.id}`,
    method: 'post'
    ,data
  })
}
// 退货申请接口
export function returnApply(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/return-apply`,
    method: 'POST'
    ,data
  })
}
// 根据退货申请id查询退货申请详情
export function apisReturnDetail(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/return-detail/${data.id}/`,
    method: 'get'
  })
}
// 单个退货审核接口
export function returnAuditApply(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/return/audit/${data.id}`,
    method: 'put'
    ,data
  })
}
// 根据退货申请id更新退货方式相关信息
export function apisEditReturn(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/${data.id}/return-type`,
    method: 'put'
    ,data
  })
}
// 查询退货物流快递信息
export function apisTrackInfo(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbOrder}/orders/return-tracking-info/${data.id}`,
    method: 'get'
  })
}

// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 根据订单关闭类型，返回对应文本
 */
export function getCloseReasonValue(string) {
  switch (string) {
    case 1:
      return '买家关闭';
    case 2:
      return '平台关闭';
    case 3:
      return '交易关闭';
    case 4:
      return '后台关闭';
  }
}

/**
 * 根据订单状态返回文本
 */
export function getStateName(v) {
  switch (v) {
    case 0:
      return '已关闭';
    case 1:
      return '待付款';
    case 2:
      return '待发货';
    case 3:
      return '待收货';
    case 4:
      return '已收货';
    case 5:
      return '退货中';
    case 7:
      return '退款中';
    case 8:
      return '退款成功';
    case 9:
      return '退款支付失败';
    case 10:
      return '退货成功';
  }
}
/**
 * 根据线上支付状态返回文本
 */
export function getOnlinePayStateName(v) {
  switch (v) {
    case 1:
      return '支付中';
    case 2:
      return '支付成功';
    case 3:
      return '支付失败';
  }
}

/**
 * 返回代理/粉丝的锁定状态
 */
export function userDisabledState(v){
  switch (v) {
    case 0:
      return '正常';
    case 1:
      return '锁定';
  }
}

import request from '@/utils/request'
//忘记密码发送验证码，适用场景：经商后台或平台忘记密码
export function getCode(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/forget-password/verify-code`,
    method: 'POST',
    data
  })
}
//校验忘记密码验证码,适用场景：经商后台或平台校验忘记密码验证码
export function checkCode(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/forget-password/check`,
    method: 'POST',
    data
  })
}
//修改密码,适用场景：经商后台或平台忘记密码修改密码
export function resetPsw(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/forget-password/reset`,
    method: 'POST',
    data
  })
}

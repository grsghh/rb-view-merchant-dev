import request from '@/utils/request'
export function login(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/login`,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/permissions/me`,
    method: 'get'
  })
}


export function getRouter() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/permissions/me`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbAccount}/logout`,
    method: 'post'
  })
}
//修改密码
export function editPassword(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/users/password/`,
    method: 'put'
    ,data
  })
}

export function refreshToken(data) {
  return request({
    url: `refresh-token`,
    method: 'post'
    ,data
  })
}

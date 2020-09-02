import request from '@/utils/request'
//获取菜单下的按钮集合
export function buttons(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/permissions/buttons/${data.menuId}`,
    method: 'get',
  })
}

//分页查询角色信息
export function roles(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles/list`,
    method: 'GET',
    params: data
  })
}

//查询权限树
export function tree(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/permissions/tree`,
    method: 'GET',
    params: data
  })
}
//
// //根据角色id查询角色详情
// export function getTreeById(data) {
//   return request({
//     url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles/${data.id}`,
//     method: 'GET',
//   })
// }
//根据角色id查询角色详情
export function getTreeById(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles/detail/${data.id}`,
    method: 'GET',
  })
}

//删除角色
export function delRole(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles/${id}`,
    method: 'DELETE',
  })
}

//修改角色
export function editRole(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles/${data.id}`,
    method: 'PUT',
    data
  })
}

//新增角色
export function addRole(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/roles`,
    method: 'POST',
    data
  })
}
//分页查询平台信息
export function platform(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/platforms/list`,
    method: 'post',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//添加平台
export function addPlatforms(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/platforms`,
    method: 'POST',
    data
  })
}
//根据id查询平台信息
export function getPlatformById(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/platforms/${data.id}`,
    method: 'GET'
  })
}
//修改平台
export function editPlatform(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/platforms/${data.id}`,
    method: 'PUT',
    data
  })
}
//删除平台
export function delPlatform(id) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbPermission}/platforms/${id}`,
    method: 'DELETE',
  })
}

// 根据数据字典查询平台状态
export function getPlatState() {
  return request({
    url: `/dicts/100008`,
    method: 'GET'
  })
}

//查询当前平台下所有客户信息
export function customers() {
  return request({
    url: `/customers`,
    method: 'GET',
  })
}

//查询当前平台下所有运营商信息
export function merchants() {
  return request({
    url: `/merchants`,
    method: 'GET',
  })
}

//查询当前平台内的所有司机
export function allDrivers() {
  return request({
    url: `/chauffeurs?name=`,
    method: 'GET'
  })
}


//根据dictNO查询数据字典
export function dicts(no) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbDatadict}/dicts/${no}`,
    method: 'GET',
  })
}


//查询当前商户的常用物流公司实体类
export function frequentLogistics(data) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/basic-setting/frequent-logistics/${data.category}`,
    method: 'GET',
  })
}


//查询当前商户指定类型的地址
export function addressByType(params) {
  return request({
    url: `${JSON.parse(sessionStorage.$moduleName).rbMerchant}/address/list/by-type`,
    method: 'GET',
    params
  })
}

//获取地域
export function area(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbDatadict}/regions/${data.type}/by-type`,
    method: 'get',
    params:data
  })
}


//地域树-只包含区域和省
export function apiRegionsTree(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbDatadict}/regions/tree`,
    method: 'get'
  })
}

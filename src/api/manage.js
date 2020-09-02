import request from '@/utils/request'

const env = process.env.NODE_ENV;

//分页查询部门信息
export function departments(data) {
  return request({
    url: `/departments/list`,
    method: 'GET',
    params: data
  })
}

//添加部门信息
export function addDepartments(data) {
  return request({
    url: `/departments`,
    method: 'POST',
    data
  })
}

//根据配送线路id查询部门信息
export function getDepartmentsById(data) {
  return request({
    url: `/departments/${data.id}`,
    method: 'GET',
  })
}

//修改部门信息
export function changeDepartmentsById(data) {
  return request({
    url: `/departments/${data.id}`,
    method: 'PUT',
    data
  })
}

//删除部门信息
export function delDepartments(id) {
  return request({
    url: `/departments/${id}`,
    method: 'DELETE'
  })
}


//分页查询职员信息
export function Employees(data) {
  return request({
    url: `/employees/list`,
    method: 'post',
    data,
    params: {pageNo: data.pageNo, pageSize: data.pageSize}
  })
}

//添加职员信息
export function addEmployees(data) {
  return request({
    url: `/employees`,
    method: 'POST',
    data
  })
}

//根据配送线路id查询职员信息
export function getEmployeesById(data) {
  return request({
    url: `/employees/${data.id}`,
    method: 'GET',
  })
}

//修改职员信息
export function changeEmployeesById(data) {
  return request({
    url: `/employees/${data.id}`,
    method: 'PUT',
    data
  })
}

//删除职员信息
export function delEmployees(id) {
  return request({
    url: `/employees/${id}`,
    method: 'DELETE'
  })
}

//分页查询职务信息
export function positions(data) {
  return request({
    url: `/positions/page`,
    method: 'GET',
    params: data
  })
}

//  添加职务信息
export function addpositions(data) {
  return request({
    url: `/positions`,
    method: 'POST',
    data
  })
}

// 根据配送线路id查询职务信息
export function getpositionsById(data) {
  return request({
    url: `/positions/${data.id}`,
    method: 'GET',
  });
}

// 修改职务信息
export function changepositionsById(data) {
  return request({
    url: `/positions/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除职务信息
export function delpositions(id) {
  return request({
    url: `/positions/${id}`,
    method: 'DELETE'
  })
}

// 查询部门树
export function getDepartTress() {
  return request({
    url: `/departments/tree`,
    method: 'GET'
  })
}

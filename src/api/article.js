import request from '@/utils/request'

//文章分类列表
export function articleList(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/article-categories/list`,
    method: 'GET',
    params:data
  })
}
//添加文章分类
export function addArticle(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/article-categories`,
    method: 'POST',
    data
  })
}
//根据id全量更新文章分类信息
export function editArticle(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/article-categories/${data.id}`,
    method: 'PUT',
    data
  })
}
//根据id删除文章分类
export function delArticle(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/article-categories/${data.id}`,
    method: 'DELETE'
  })
}
//获取所有文章分类信息
export function allSort() {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/article-categories`,
    method: 'GET'
  })
}

//文章列表
export function paragraphList(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/list`,
    method: 'POST',
    data,
    params: { pageNo: data.pageNo, pageSize: data.pageSize }
  })
}
//添加文章
export function addParagraph(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles`,
    method: 'POST',
    data
  })
}
//根据id查询文章详情
export function getParagraph(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/${data.id}`,
    method: 'GET'
  })
}
//根据id全量更新文章信息
export function editParagraph(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/${data.id}`,
    method: 'PUT',
    data
  })
}
//根据id删除分类
export function delParagraph(data) {
  return request({
    url: `/${JSON.parse(sessionStorage.$moduleName).rbMerchant}/articles/${data.id}`,
    method: 'DELETE'
  })
}

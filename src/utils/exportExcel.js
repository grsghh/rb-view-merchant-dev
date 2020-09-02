/**
 * 导出excel表格
 * @param {Obj} xlsx 表格所需要的对象
 * @param {Array} xlsx.tHeader 表头 必填
 * @param {Array} xlsx.filterVal 表格内容过滤 必填
 * @param {String} xlsx.filename 导出的表格名称 非必填
 * @param {String} xlsx.autoWidth 表格宽度 非必填
 * @param {String} xlsx.bookType 导出表格的类型 非必填
 * @param {Array} xlsx.list 表格内容数据 必填
 * @return {file} 生成并自动下载的excel表格
 */
export function exportExcel(xlsx) {
  import('@/vendor/Export2Excel').then(excel => {
    const {tHeader,filterVal,list} = xlsx;
    const data = formatJson(filterVal, list)
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: xlsx.filename || '导出的表格',
      autoWidth: xlsx.autoWidth || true,
      bookType: xlsx.bookType || 'xlsx'
    })
  })
  function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => {
      return v[j]
    }))
  }
}

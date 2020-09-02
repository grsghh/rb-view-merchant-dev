<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="查询条件" name="1">
              <div class="main-block">
                <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
                  <el-form-item label="名称：" prop="name">
                    <el-input class="myInput" v-model="searchForm.name" placeholder="名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="货号" prop="productNo">
                    <el-input class="myInput" v-model="searchForm.productNo" placeholder="货号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="分类" prop="selectedId">
                    <el-cascader
                      v-model="selectedId"
                      :options="specifications"
                      :props="defaultProps"
                      @change="change"
                    >
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="品牌" prop="brandId">
                    <el-select class="select" v-model="searchForm.brandId" clearable placeholder="请选择">
                      <el-option
                        v-for="item in brand"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="供应商" prop="supplierId">
                    <el-select class="select" v-model="searchForm.supplierId" clearable placeholder="请选择">
                      <el-option
                        v-for="item in supplier"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="getProList(1)">查询</el-button>
                    <el-button size="small" type="warning" @click="reset()">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          v-if="$store.state.user.pageBtns.includes('export')"
          type="primary"
          @click="educe()"
        >导出
        </el-button>
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="proList" border style="width: 100%" highlight-current-row
                  @current-change="handleCurrentChange" :row-class-name="tableRowClassName" v-loading="listLoading" height="590">
          <!--                    <el-table-column-->
          <!--                      type="selection"-->
          <!--                      width="55">-->
          <!--                    </el-table-column>-->
          <el-table-column align="center" label="图片" width="120">
            <template slot-scope="scope">
              <el-image v-if="scope.row.mainImageURL != null"
                style="width: 60px; height: 60px"
                :src="`${scope.row.mainImageURL}`"
                :alt="`${scope.row.name}`"
              ></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属分类" :width="$settings.dateWidth">
            <template slot-scope="scope">{{scope.row.parentProductCategoryName}}-{{ scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.brandName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="货号" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.productNo }}</template>
          </el-table-column>
          <el-table-column align="center" label="供应商" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.supplierName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="进货价" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.purchasePrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="代理价" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.agentPrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="零售价" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.retailPrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="浏览" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.browseNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="销量" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.totalSales}}</template>
          </el-table-column>
          <el-table-column align="center" label="运费" :width="$settings.numberWidth">
            <template slot-scope="scope">{{ scope.row.carriage || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.updateTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" v-if="!flag" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleView(scope)">预览</el-button>
<!--              <el-button-->
<!--                size="small"-->
<!--                type="warning"-->
<!--                @click="handleEditInfo(scope)"-->
<!--              >修改-->
<!--              </el-button>-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
              >下架
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getProList"
      />
    </div>
    <el-dialog
      title=" "
      :visible.sync="dialogPreview"
      custom-class="miniDialog"
      destroy-on-close
    >
      <Preview :miniParam="miniParam" v-if="dialogPreview"></Preview>
    </el-dialog>
  </div>
</template>

<script>
    import {
        getUser,
    } from '@/api/system-user'
    import {productList, supplier, brand, specifications,changeProductStatus,categorySecond} from '@/api/product'
    import {getPicImg} from '@/api/brand'
    import Pagination from '@/components/Pagination'
    import Preview from '@/components/preview/preview'
    import {exportExcel} from '@/utils/exportExcel'
    import {productExport} from '@/api/report'

    export default {
        name: 'saleProduct',
        components: {Pagination,Preview},
        props:["data"],
        data() {
            return {
                activeNames:'',
                flag:false,
                specifications: [],//分类
                supplier: [],
                proList: [],
                brand: [],//品牌
                searchForm: {
                    pageNo: 1
                    , pageSize:20
                    , state: 3,
                    brandId: '',
                    name: '',
                    productCategoryId: '',
                    productCategoryLevel:'',
                    productNo: '',
                    supplierId: '',
                },
                defaultProps:{
                  value:'id'
                  ,label:'name'
                  ,checkStrictly:true
                },
                selectedId:[],
                listLoading: false,
                total: 0
                ,dialogPreview:false
                ,miniParam:{
                    name:'goodDetail'
                    ,param:{id:''}
                }
            }
        },
        methods: {
            //重置
            reset(){
              this.searchForm= {
                pageNo: 1
                , pageSize:20
                , state: 3,
                brandId: '',
                name: '',
                productCategoryId: '',
                productCategoryLevel:'',
                productNo: '',
                supplierId: '',
              };
              if(this.data){
                this.searchForm.state = ''
              }
              this.selectedId = []
            },
            // 查询所有供应商
            getSupplier() {
                supplier().then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['id'] = res.data[i].id;
                            aa['label'] = res.data[i].name;
                            aa['value'] = res.data[i].id;
                            array.push(aa);
                        }
                        this.supplier = array;
                    }
                })
            },
            // 查询所有分类
            getSpecifications() {
              categorySecond().then(res => {
                    if (res.status == 1) {
                        this.specifications = res.data;
                    }
                })
            },
            // 查询所有品牌
            getBrand() {
                brand().then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['id'] = res.data[i].id;
                            aa['label'] = res.data[i].name;
                            aa['value'] = res.data[i].id;
                            array.push(aa);
                        }
                        this.brand = array;
                    }
                })
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            //预览商品
            handleView(score) {
                this.dialogPreview = true;
                this.miniParam.param.id = score.row.id;
            },
            // 修改商品
            handleEditInfo(score) {
                this.$router.push(`/productManger/publish?id=${score.row.id}`)
            },
          change(){
            if(this.selectedId.length == 2){
              this.searchForm.productCategoryId = this.selectedId[1]
              for(let i in this.specifications){
                // debugger
                if(this.selectedId[0] == this.specifications[i].id ){
                  for(let j in this.specifications[i].children){
                    if(this.selectedId[1] == this.specifications[i].children[j].id){
                      this.searchForm.productCategoryLevel = this.specifications[i].children[j].level
                    }
                  }
                }
              }
            }else{
              this.searchForm.productCategoryId = this.selectedId[0]
              for(let i in this.specifications){
                if(this.selectedId[0] == this.specifications[i].id){
                  this.searchForm.productCategoryLevel = this.specifications[i].level
                }
              }
            }
          },
            // 获取商品列表信息
            getProList(num) {
                if (num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                productList(this.searchForm).then(res => {
                    this.proList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 查看 修改
            confirmUser(score) {
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要下架该商品吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await changeProductStatus({id:score.row.id,state:2}).then(res => {
                          if(res.status == 1){
                            this.getProList();
                            this.$message({
                              type: 'success',
                              message: '下架成功!'
                            })
                          }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res) {
                this.selectUserType = res.data.type.toString();
                this.userForm.employeeId = res.data.employeeId;
                this.userForm.employeeName = res.data.employeeName;
                this.userForm.username = res.data.username;
                this.userForm.mobile = res.data.mobile;
                this.userForm.realName = res.data.realName;
                this.userForm.remark = res.data.remark;
                this.userForm.roleId = res.data.roleId ? res.data.roleId.toString() : null;
                this.userForm.type = res.data.type.toString();
            },
          handleCurrentChange(val){
            this.$emit('handleCurrentChange',val)
          },
          tableRowClassName(){
            // console.log(this.rowIndex)
          },
          //导出
          educe(){
            let exl = {
              //表头，必填
              tHeader: ['名称', '所属分类', '品牌', '货号', '供应商', '进货价', '代理价', '零售价', '浏览', '销售', '运费', '时间']
              ,
              //表头对应的数据，顺序要与表头一致 ，必填
              filterVal: ['name', 'sort', 'brandName', 'productNo', "supplierName", 'purchasePrice', 'agentPrice', 'retailPrice' ,"browseNum" ,"totalSales" ,"carriage" ,"updateTime"]
              ,
              filename: '在售商品列表'
            };
            productExport(this.searchForm).then(res => {
              //需要导出的数据 ，必填
              for(let i in res.data){
                res.data[i].sort = res.data[i].parentProductCategoryName + res.data[i].productCategoryName
              }
              exl.list = res.data;
              exportExcel(exl);
            })
          }
        },
        created() {
            //引用组件是否显示按钮操作
            // if(this.data){
            //   this.flag = this.data.show
            //   this.searchForm.state = ""
            // }
            if(this.data) {
                if(this.data.state) {
                    this.flag = this.data.show
                    this.searchForm.state = 3
                } else {
                    this.flag = this.data.show
                    this.searchForm.state = ""
                }
            }
            this.getProList();
            this.getSupplier();
            this.getSpecifications();
            this.getBrand();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }

  .selectName {
    width: 200px;
  }
</style>

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
            <el-form-item label="货号：" prop="productNo">
              <el-input class="myInput" v-model="searchForm.productNo" placeholder="货号" clearable></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="selectedId">
              <el-cascader
                v-model="selectedId"
                :options="productCategoryList"
                :props="defaultProps"
                @change="change"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
              <el-select class="select" v-model="searchForm.brandId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierId">
              <el-select class="select" v-model="searchForm.supplierId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getTagsList(1)">查询</el-button>
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
<!--        <el-button-->
<!--          type="primary"-->
<!--          @click="addDialog"-->
<!--        >新增</el-button>-->
                <el-button
                  type="primary"
                  @click="educe()"
                  v-if="$store.state.user.pageBtns.includes('export')"
                >导出</el-button>
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="590"
                  @selection-change="handleSelectionChange"
                  @current-change="handleCurrentChange">
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="图片" width="120">
            <template slot-scope="scope">
              <el-image v-if="!scope.row.mainImageURL==''"
                style="width: 60px; height: 60px"
                :src="scope.row.mainImageURL"></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 60px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属分类">
            <template slot-scope="scope">{{scope.row.parentProductCategoryName}}-{{ scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌">
            <template slot-scope="scope">{{ scope.row.brandName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="货号">
            <template slot-scope="scope">{{ scope.row.productNo || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="供应商" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.supplierName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="进货价">
            <template slot-scope="scope">{{ scope.row.purchasePrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="代理价">
            <template slot-scope="scope">{{ scope.row.agentPrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="零售价">
            <template slot-scope="scope">{{ scope.row.retailPrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="浏览">
            <template slot-scope="scope">{{ scope.row.browseNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="销量">
            <template slot-scope="scope">{{ scope.row.totalSales || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="运费">
            <template slot-scope="scope">{{ scope.row.carriage || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.updateTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" v-if="!flag" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleView(scope)"
              >预览</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
              >修改</el-button>
              <p style="margin:0;margin-top: 10px;"></p>
              <!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="warning"
                @click="handlePutaway(scope)"
                v-if="$store.state.user.pageBtns.includes('publish')"
              >上架</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getTagsList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name" placeholder="商品标签名称"/>
        </el-form-item>
        <el-form-item label="排序字段" prop="orderNum">
          <el-input v-model="userForm.orderNum" placeholder="必须是数字"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看标签" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>
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
    import { getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import {  delProduct } from '@/api/warehouse'
    import { allBrand } from '@/api/supplier'
    import { supplier, productList, categorySecond, changeProductStatus } from '@/api/product'
    import Pagination from '@/components/Pagination'
    import Preview from '@/components/preview/preview'
    import {exportExcel} from '@/utils/exportExcel'
    import {productExport} from '@/api/report'
    export default {
        name: 'warehouse',
        components: { Pagination,Preview },
        props:["data"],
        // props:{
        //     params:{
        //         type:Object
        //     }
        // },
        data() {
            return {
                activeNames:'',
                flag:false,
                brandList: [],
                supplierList: [],
                productCategoryList: [],
                isReadOnly: false,
                name: '',
                mobile: '',
                value: '',
                userList: [],
                selectedId:[],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1,
                    pageSize:20,
                    name: '',
                    productNo: '',
                    brandId: '',
                    productCategoryId: '',
                    productCategoryLevel:'',
                    supplierId: '',
                    state: 2 // 1草稿 2仓库 3在售
                } ,
                defaultProps:{
                  value:'id'
                  ,label:'name'
                  ,checkStrictly:true
                },
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                userForm: {
                    name: '',
                    orderNum: '',
                    remark: ''
                },
                multipleSelection: [],
                formRule: {
                    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
                    orderNum:[{ required: true, message: '请输入排序字段', trigger: 'blur' }],
                }
                ,dialogPreview:false
                ,miniParam:{
                    name:'goodDetail'
                    ,param:{id:'',}
                }
            }
        },
        methods: {
            //重置
            reset(){
              this.searchForm = {
                pageNo: 1,
                pageSize:20,
                name: '',
                productNo: '',
                brandId: '',
                productCategoryId:'',
                productCategoryLevel:'',
                supplierId: '',
                state: 2 // 1草稿 2仓库 3在售
              }
              this.selectedId = []
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val){
                this.$emit('handleCurrentChange',val)
            },
            // 取消修改
            dialogClose() {
                this.userForm = {};
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增标签
            addDialog() {
                this.dialogType = '新增标签';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                this.dialogPreview = true;
                this.miniParam.param = {
                    id:score.row.id
                }
            },
            // 修改标签
            handleEditInfo(score) {
                this.$router.push({
                        path: '/productManger/publish',
                        query: {id: score.row.id}})
            },
          change(){
            if(this.selectedId.length == 2){
              this.searchForm.productCategoryId = this.selectedId[1]
              for(let i in this.productCategoryList){
                // debugger
                if(this.selectedId[0] == this.productCategoryList[i].id ){
                  for(let j in this.productCategoryList[i].children){
                    if(this.selectedId[1] == this.productCategoryList[i].children[j].id){
                      this.searchForm.productCategoryLevel = this.productCategoryList[i].children[j].level
                    }
                  }
                }
              }
            }else{
              this.searchForm.productCategoryId = this.selectedId[0]
              for(let i in this.productCategoryList){
                if(this.selectedId[0] == this.productCategoryList[i].id){
                  this.searchForm.productCategoryLevel = this.productCategoryList[i].level
                }
              }
            }
          },
            // 获取仓库商品列表信息
            getTagsList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                productList(this.searchForm).then(res => {
                    this.userList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 修改
            confirmUser(score) {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if(this.dialogType == '新增标签') {
                            addTags(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getTagsList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if(this.dialogType == '修改标签') {
                            editTags(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getTagsList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            // 上架  // state 商品状态：1-已保存 2-待发布 3-已发布
            handlePutaway(score) {
                changeProductStatus({ state: 3, id: score.row.id }).then(res => {
                    if (res.status == 1) {

                        this.$alert(`上架成功，是否前往在售页面查看？`, '提示', {
                            confirmButtonText: '前往查看',
                            callback: () => {
                                this.$router.push(`/productManger/saleProduct`);
                            }
                        });
                    }
                })
            },
            // 删除
            handleDelete(score) {
                this.$confirm('确定要删除该商品吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delProduct(score.row.id).then(res => {
                            if(res.status == 1) {
                                this.getTagsList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            }
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res){
                this.userForm = {
                    name: res.data.name,
                    orderNum: res.data.orderNum,
                    remark: res.data.remark
                }
            },
            // 获取所有供应商
            allSupplier() {
                supplier().then(res => {
                    if(res.status == 1) {
                       this.supplierList = res.data;
                    }
                })
            },
            // 获取所有品牌
            allBrand() {
                allBrand().then(res => {
                    if(res.status == 1) {
                        this.brandList = res.data;
                    }
                })
            },
            // 获取所有分类
            allProduct() {
              categorySecond().then(res => {
                    if(res.status == 1) {
                        this.productCategoryList = res.data;
                    }
                })
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
              filename: '仓库商品列表'
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
            // 如果是当组件调用 操作框不再显示
            if(this.data){
                this.flag = this.data.show
            }
            this.getTagsList();
            this.allSupplier();
            this.allBrand();
            this.allProduct();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
</style>

<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="查询条件" name="1">
            <div class="main-block">
              <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
                <div>
                  <el-form-item label="商品名称" prop="name">
                    <el-input class="myInput" v-model="searchForm.name" placeholder="名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="货号" prop="productNo">
                    <el-input class="myInput" v-model="searchForm.productNo" placeholder="货号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" prop="selectedId">
                    <el-cascader
                      v-model="selectedId"
                      :options="productCategoryList"
                      :props="defaultProps"
                      filterable
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
                  <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
                  <el-button size="small" type="warning" @click="reset()">重置</el-button>
                </div>
                <div class="flexBox">
                  <el-form-item class="proTag" label="商品标签">
                    <el-radio-group v-model="searchForm.productTagId" size="" >
                      <el-radio-button label="" >不限</el-radio-button>
                      <el-radio-button :label="item.id" v-for="item in tagList" :key="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item class="proTag" label="业务时间">
                    <el-radio-group v-model="time" size=""  @change="timeInterval()">
                      <el-radio-button label="0" >不限</el-radio-button>
                      <el-radio-button label="1" >1周</el-radio-button>
                      <el-radio-button label="2" >2周</el-radio-button>
                      <el-radio-button label="3" >1个月内</el-radio-button>
                      <el-radio-button label="4" >1个月前</el-radio-button>
                      <el-radio-button label="5" >2个月前</el-radio-button>
                      <el-radio-button label="6" >3个月前</el-radio-button>
                      <el-radio-button label="7" >6个月前</el-radio-button>
                    </el-radio-group>
                    <span class="defined" @click="defined()">自定义</span>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="batchAddTag()"
        >批量添加标签</el-button>
      </div>
      <div class="table">
        <el-table :data="productList" ref="multipleTable" border style="width: 100%" v-loading="listLoading" height="470" @sort-change="sortChange" @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" label="图片" width="120">
            <template slot-scope="scope">
              <el-image v-if="!scope.row.mainImageURL==''"
                        style="width: 100px; height: 100px"
                        :src="scope.row.mainImageURL"></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 60px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.productName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="商品分类" width="140">
            <template slot-scope="scope">{{scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column align="center" label="商品标签" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.productTagNames || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="货号" width="140">
            <template slot-scope="scope">{{ scope.row.productNo || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌" width="140">
            <template slot-scope="scope">{{ scope.row.brandName || '-'}}</template>
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
          <el-table-column align="center" label="销量" prop="accumulateSalesNum" sortable="custom">
            <template slot-scope="scope">{{ scope.row.accumulateSalesNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="销售额" width="100" prop="accumulateSalesMoney" sortable="custom">
            <template slot-scope="scope">{{ scope.row.accumulateSalesMoney || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="销售毛利" width="140" prop="accumulateSalesGrossMargin" sortable="custom">
            <template slot-scope="scope">{{ scope.row.accumulateSalesGrossMargin || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="addTag(scope)"
              >添加标签</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 自定义时间的弹框 -->
    <el-dialog :visible.sync="visibleTime" title="自定义时间" width="34%" @click="visibleTime = false;defineForm = {}">
      <el-form v-if="visibleTime" :model="defineForm" inline>
        <el-form-item>
          <el-date-picker
            v-model="defineForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          <span>--</span>
          <el-date-picker
            v-model="defineForm.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="timeSure()">确定</el-button>
          <el-button size="small" type="warning" @click="visibleTime = false;time='0';">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 标签的弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="添加标签" @close="dialogClose()" width="50%">
      <el-form v-if="dialogVisible" :model="tagForm" label-width="100px">
        <el-form-item label="" label-width="35px">
          <el-checkbox-group v-model="tagForm.tagIds">
            <el-checkbox name="tagIds" v-for="item in tagList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
        <el-button type="danger" @click="cancel()">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { allProduct } from '@/api/warehouse'
  import { allBrand } from '@/api/supplier'
  import { supplier, productAnalysisList, addAnalysisTags, categorySecond,producTag } from '@/api/product'
  import Pagination from '@/components/Pagination'
  import {FormatTime} from '@/utils/index.js'
  export default {
    name: 'analysis',
    components: { Pagination},
    data() {
      return {
        searchForm: {
          pageNo:1,
          pageSize:20,
          brandId: '',
          endDate: "",
          name: "",
          orderRule: "accumulateSalesNum desc",
          productCategoryId: '',
          productCategoryLevel: '',
          productNo: "",
          productTagId: "",
          startDate: "",
          supplierId: ''
        } ,
          activeNames:['1'],
        defineForm:{//自定义时间
          startTime:'',
          endTime:''
        },
        visibleTime:false,
        time:'0',
        brandList: [],//品牌列表
        supplierList: [],//供应商列表
        productCategoryList: [],//分类列表
        tagList:[],//标签列表
        productList: [],
        selectedId:[],//分类选中的id
        dialogVisible: false,
        tagForm:{
          tagIds:[]
        },//标签表单
        defaultProps:{
          value:'id'
          ,label:'name'
          ,checkStrictly:true
        },
        listLoading: false,
        total: 0,
        multipleSelection:[],//批量添加的id集合
        type:'',
        productIds:[]//单个添加标签
      }
    },
    methods: {
      //排序事件
      sortChange(column,prop,order){
        if(column.order == 'ascending'){
          column.order ='asc'
        }else{
          column.order ='desc'
        }
        this.searchForm.orderRule = `${column.prop} ${column.order}`
        this.getList()
      },
      //自定义时间弹窗
      defined(){
        this.defineForm.startTime = this.defineForm.endTime = ''
        this.visibleTime = true
      },
      //自定义时间确定
      timeSure(){
        this.searchForm.startDate = this.defineForm.startTime
        this.searchForm.endDate = this.defineForm.endTime
        this.visibleTime = false
        this.time = ''
      },
      //选择时间
      timeInterval(){
        this.countDate(this.time)
      },
      //计算日期
      countDate(t){
        let date = new Date().getTime();
        let sTime = "";
        let eTime = "";
        switch (t) {
          case '1':
            sTime = date - 7 * 24 * 60 * 60 * 1000;
            eTime = date;
            break;
          case '2':
            sTime = date - 14 * 24 * 60 * 60 * 1000;
            eTime = date;
            break;
          case '3':
            let year = new Date().getFullYear()
            let monthFirst = new Date().getMonth()+1
            sTime = new Date(year + "-" + monthFirst + "-01").getTime();
            eTime = date;
            break;
          case '4':
            sTime = '';
            eTime = date - 30 * 24 * 60 * 60 * 1000;
            break;
          case '5':
            sTime = '';
            eTime = date - 60 * 24 * 60 * 60 * 1000;
            break;
          case '6':
            sTime = '';
            eTime = date - 365/4 * 24 * 60 * 60 * 1000;
            break;
          case '7':
            sTime = '';
            eTime = date - 365/2 * 24 * 60 * 60 * 1000;
            break;
        }
        this.searchForm.startDate = sTime == '' ? '' : FormatTime(new Date(sTime))
        this.searchForm.endDate = eTime == '' ? '' : FormatTime(new Date(eTime))
      },
      //重置
      reset(){
        this.searchForm = {
          pageNo:1,
          pageSize:20,
          brandId: '',
          endDate: "",
          name: "",
          orderRule: "accumulateSalesNum desc",
          productCategoryId: '',
          productCategoryLevel: '',
          productNo: "",
          productTagId: '',
          startDate: "",
          supplierId: ''
        }
        this.selectedId = []
        this.time = '0'
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 关闭弹窗
      dialogClose() {
        this.tagForm.tagIds = []
      },
      //添加标签取消
      cancel(){
        this.dialogVisible = false
        this.tagForm.tagIds = []
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
      },
      // 批量添加标签
      batchAddTag() {
        if(!this.multipleSelection.length){
          this.$message({
            type:'warning',
            message:'请至少选择一件商品'
          })
        }else{
          this.showOrHideDialog();
        }
      },
      // 添加标签
      addTag(score){
        this.showOrHideDialog();
        // let arrId = score.row.productTagIds.split(',')
        // arrId.forEach(item=>{
        //   this.tagForm.tagIds.push(+item)
        // })
        this.productIds = [score.row.productId]
        this.type = 1

      },
      //添加标签的确定按钮
      confirm(){
        if(!this.tagForm.tagIds.length){
          this.$message({
            type:'warning',
            message:'请至少选择一个标签'
          })
          return
        }
        let proArr = []
        if(this.type == 1){
          proArr = this.productIds
        }else{
          for(let i in this.multipleSelection){
            proArr.push(this.multipleSelection.productId)
          }
        }
        addAnalysisTags({productIds:proArr,tagIds:this.tagForm.tagIds}).then(res=>{
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'添加成功！'
            })
            this.showOrHideDialog()
            this.getList()
            this.tagForm.tagIds = []
          }
        })
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
      // 获取商品分析列表信息
      getList(num) {
        if(num == 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true;
        productAnalysisList(this.searchForm).then(res => {
          this.productList = res.data.rows;
          this.total = res.data.total;
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
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
      //获取所有商品标签
      getproducTag(){
        producTag().then(res=>{
          this.tagList = res.data
        })
      }
    },
    created() {
      this.getList();
      this.allSupplier();
      this.allBrand();
      this.allProduct();
      this.getproducTag()
    }
  }
</script>

<style scoped>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }

</style>

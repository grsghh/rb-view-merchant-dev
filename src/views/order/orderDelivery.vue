<template>
  <div class="contentBox orderDelivery">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-collapse v-model="activeNames" class="search">
          <el-collapse-item title="查询条件" name="1">
            <div slot="header" class="clearfix">
              <span class="searchIcon">查询条件</span>
            </div>
            <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="110px" :inline="true">
            <el-form-item label="单号：" prop="orderNO">
              <el-input class="myInput" v-model="searchForm.orderNO"></el-input>
            </el-form-item>
            <el-form-item label="买家：" prop="buyAccountNickname">
              <el-input class="myInput" v-model="searchForm.buyAccountNickname"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="buyAccountMobile">
              <el-input class="myInput" v-model="searchForm.buyAccountMobile"></el-input>
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
            <el-form-item label="宝贝标题：" prop="productName">
              <el-input class="myInput" v-model="searchForm.productName"></el-input>
            </el-form-item>
<!--            <el-form-item label="运单号：" prop="trackingNO">-->
<!--              <el-input class="myInput" v-model="searchForm.trackingNO"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="收件人：" prop="receiveName">
              <el-input class="myInput" v-model="searchForm.receiveName"></el-input>
            </el-form-item>
            <el-form-item label="收件人电话：" prop="receiveMobile">
              <el-input class="myInput" v-model="searchForm.receiveMobile"></el-input>
            </el-form-item>
<!--            <br>-->
            <el-form-item label="成交时间：" prop="startDealTime">
              <el-date-picker
                v-model="searchForm.startDealTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间">
              </el-date-picker>
              <span>--</span>
              <el-date-picker
                v-model="searchForm.endDealTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择截止时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getOrderList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-row>
    <div class="queryContent">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane :label="`${n.label}${n.count?'('+ n.count +')':''}`" :name="n.name" v-for="(n,i) in tabs" :key="i">
          <template v-if="activeName == n.name">
            <deliveryList v-if="orderList" :params="params" :list="orderList" :normalRemarkList="normalRemarkList" :searchForm="searchForm" @changeOrderList="childPageChange" @emitEduce="educe"></deliveryList>
            <template v-else><p style="text-align: center;">暂无数据</p></template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {orderDelivery} from '@/api/orderDelivery'
  import {countOrderandDeliver, apiNormalList} from '@/api/order'
  import Pagination from '@/components/Pagination'
  import deliveryList from './components/deliveryList'
  import {goDelivery} from '@/api/report'
  import {export_json_to_excel} from '@/vendor/Export2Excel';
  import { supplier} from '@/api/product'
  import { trimFormData} from '@/utils'

  export default {
    name: 'orderDelivery',
    components: {Pagination,deliveryList},
    data() {
      return {
        activeNames:'1',
        searchForm: {
          pageNo: 1
          , pageSize:20
          , productName: '',
          buyAccountMobile: '',
          buyAccountNickname: '',
          endDealTime: '',
          orderNO: ''
          , orderState: 2
          , receiveMobile: ''
          , receiveName: ''
          , startDealTime: ''
          , trackingNO: ''
          , type: 0
          , supplierId: ''
        }
        , activeName: '2'
        , orderList: {}//打单发货列表
        ,tabs:[
          {label:'待发货',name:'2',count:''}
          ,{label:'待收货',name:'3',count:''}
        ]
        ,normalRemarkList:[]
        ,supplierList:[],
        params:{
          state:2
        }
      }
    },
    methods: {
      // 获取订单列表
      getOrderList(num) {
        if (num == 1) {
          this.searchForm.pageNo = 1;
        }
        orderDelivery(trimFormData(this.searchForm)).then(res => {
          if(res.status == 1) {
            for(let i in res.data.rows){
              res.data.rows[i].checked = '';
              res.data.rows[i].index = i
            }
            this.orderList = res.data || {};
          }
        });
        this.getListCount();
      },
      //tab切换
      tabClick() {
        this.searchForm.pageNo = 1;
        this.searchForm.orderState = this.activeName;
        this.params.state = this.activeName
        this.orderList = {rows:['']};
        this.getOrderList();
      }
      //订单列表组件页码切换
      , childPageChange(data) {
        this.searchForm.pageNo = data.pageNo;
        this.searchForm.pageSize = data.pageSize;
        this.getOrderList();
      }
      // 查询订单列表各个状态下的统计值
      ,getListCount() {
        let data = {
          type:0
          ,...this.searchForm
        };
        data.orderState = ' ';
        countOrderandDeliver(data).then(res => {
          if(res.status == 1) {
            for(let i in this.tabs){
              switch (this.tabs[i].name) {
                // case "1":
                //   this.tabs[i].count = res.data.waitingForPaymentCount
                //   break;
                case "2":
                  this.tabs[i].count = res.data.waitingForDespatchCount
                  break;
                case "3":
                  this.tabs[i].count = res.data.waitingForReceivingCount
                  break;
              }
            }
          }
        })
      },
      //导出
      educe(){
        let xlsx = {
          //表头，必填
          tHeader: ['订单编号', '收货人', '电话', '收货地址', '商品名称', '货号', '规格', '数量', '买家备注','卖家备注']
          ,
          //表头对应的数据，顺序要与表头一致 ，必填
          filterVal: ['orderNO', 'buyReceiveName', 'buyReceiveMobile', 'buyReceiveAddress', "productName","productNO","specificationName", 'productNum', 'buyRemark','sellRemark']
          ,
          filename: '打单发货列表'
        };
        goDelivery(this.searchForm).then(res => {
          //接口会一次返回多个文件，并且有对应的文件名，所以需要遍历下载
          for(let i in res.data){
            xlsx.filename = res.data[i].fileName;
            xlsx.list = res.data[i].orderExportDataVOS;
            const {tHeader,filterVal,list} = xlsx;
            const data = formatJson(filterVal, list)
            export_json_to_excel({
              header: tHeader,
              data,
              filename: xlsx.filename,
              autoWidth: xlsx.autoWidth,
              bookType: 'xlsx'
            })
          }
        })
        function formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            return v[j]
          }))
        }
      },
      //获取常用备注列表
      getNormalRemark(){
        apiNormalList().then(res=>{
          if(res.status == 1){
            this.normalRemarkList = res.data;
          }
        });
      }
      // 获取所有供应商
      ,allSupplier() {
        supplier().then(res => {
          if(res.status == 1) {
            this.supplierList = res.data;
          }
        })
      },
    },
    created() {
      // if(this.$route.query.orderSort){
      //   let state = this.$route.query.orderSort || ' ';
      //   this.searchForm.orderState = this.activeName = state;
      // }
      this.allSupplier();
      this.getNormalRemark();
      this.getOrderList();
    }
  }
</script>

<style lang="scss">
  .orderDelivery{
    .search{
      .el-collapse-item {
        .el-collapse-item__arrow {
          padding: 8px;
          background-color: rgba(0, 0, 0, 0.3)
        }
      }
    }
    .el-tabs{z-index: auto;}
    .el-card {
      border-bottom: none;
      .el-collapse {
        border-bottom: none;

        .el-collapse-item__header {
          font-size: 18px;
          margin-bottom: 20px;
          border-bottom: none;
        }
        .el-collapse-item__wrap{
          border-bottom: none;
        }
      }
    }
  }
</style>

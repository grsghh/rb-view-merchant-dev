<template>
  <div class="togather contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>销售概况</span>
        </div>
        <div class="main-block">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in tabs" :key="index">
              <ul class="dashboard">
                <li class="noPointer">
                  <p class="dashboard-title">销售金额：<span class="dashboard-content">{{salesOverviewsInfo.accumulateSalesMoney}}</span></p>
                </li>
                <li class="noPointer">
                  <p class="dashboard-title">销售笔数：<span class="dashboard-content">{{salesOverviewsInfo.accumulateOrderNum}}</span></p>
                </li>
                <li class="noPointer">
                  <p class="dashboard-title">销售数量：<span class="dashboard-content">{{salesOverviewsInfo.accumulateProductNum}}</span></p>
                </li>
                <li class="dashboard-line"></li>
                <li @click="jumpPage({path:`/order/theorder`, query: {orderSort:'1'}})">
                  <p class="dashboard-content">{{salesOverviewsInfo.waitingForPaymentCount}}</p>
                  <p class="dashboard-title">待付款</p>
                </li>
                <li @click="jumpPage({path:`/order/theorder`, query: {orderSort:'2'}})">
                  <p class="dashboard-content">{{salesOverviewsInfo.waitingForDespatchCount}}</p>
                  <p class="dashboard-title">待发货</p>
                </li>
                <li @click="jumpPage({path:`/order/theorder`, query: {orderSort:'3'}})">
                  <p class="dashboard-content">{{salesOverviewsInfo.waitingForReceivingCount}}</p>
                  <p class="dashboard-title">待收货</p>
                </li>
                <li @click="jumpPage({path:`/order/theorder`, query: {orderSort:'5'}})">
                  <p class="dashboard-content">{{salesOverviewsInfo.returningCount}}</p>
                  <p class="dashboard-title">待退款/售后</p>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>近7天销售走势</span>
        </div>
        <div class="main-block">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block" v-if="overviewsInfo.fansOverviewVOs">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>粉丝概况</span>
        </div>
        <div class="main-block">
          <ul class="dashboard">
            <li @click="jumpPage({path:`/fans/list`, query: {selectTime:'0'}})">
              <p class="dashboard-title">今日新增</p>
              <p class="dashboard-content">{{overviewsInfo.fansOverviewVOs.todayIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/fans/list`, query: {selectTime:'1'}})">
              <p class="dashboard-title">近七天新增</p>
              <p class="dashboard-content">{{overviewsInfo.fansOverviewVOs.weekIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/fans/list`, query: {selectTime:'2'}})">
              <p class="dashboard-title">本月新增</p>
              <p class="dashboard-content">{{overviewsInfo.fansOverviewVOs.monthIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/fans/list`, query: {selectTime:'3'}})">
              <p class="dashboard-title">粉丝总数</p>
              <p class="dashboard-content">{{overviewsInfo.fansOverviewVOs.totalCount}}</p>
            </li>
          </ul>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block" v-if="overviewsInfo.agentOverviewVOs">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>代理概况</span>
        </div>
        <div class="main-block">
          <ul class="dashboard">
            <li @click="jumpPage({path:`/agent/list`, query: {selectTime:'0'}})">
              <p class="dashboard-title">今日新增</p>
              <p class="dashboard-content">{{overviewsInfo.agentOverviewVOs.todayIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/agent/list`, query: {selectTime:'1'}})">
              <p class="dashboard-title">近七天新增</p>
              <p class="dashboard-content">{{overviewsInfo.agentOverviewVOs.weekIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/agent/list`, query: {selectTime:'2'}})">
              <p class="dashboard-title">本月新增</p>
              <p class="dashboard-content">{{overviewsInfo.agentOverviewVOs.monthIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/agent/list`, query: {selectTime:'3'}})">
              <p class="dashboard-title">代理总数</p>
              <p class="dashboard-content">{{overviewsInfo.agentOverviewVOs.totalCount}}</p>
            </li>
          </ul>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block" v-if="overviewsInfo.productOverviewVOs">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品概况</span>
        </div>
        <div class="main-block">
          <ul class="dashboard">
            <li @click="jumpPage({path:`/productManger/saleProduct`})">
              <p class="dashboard-title">今日新增</p>
              <p class="dashboard-content">{{overviewsInfo.productOverviewVOs.todayIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/productManger/saleProduct`})">
              <p class="dashboard-title">近七天新增</p>
              <p class="dashboard-content">{{overviewsInfo.productOverviewVOs.weekIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/productManger/saleProduct`})">
              <p class="dashboard-title">本月新增</p>
              <p class="dashboard-content">{{overviewsInfo.productOverviewVOs.monthIncrement}}</p>
            </li>
            <li @click="jumpPage({path:`/productManger/saleProduct`})">
              <p class="dashboard-title">商品总数</p>
              <p class="dashboard-content">{{overviewsInfo.productOverviewVOs.totalCount}}</p>
            </li>
          </ul>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
    import LineChart from './components/LineChart'
    import {salesOverviews,overviews,salesTrends} from '@/api/togather'
    import {getRouteId} from '@/utils'
    export default {
        name: 'togather',
        components: {LineChart}
        , data() {
            return {
                tabs:[
                    {label:'今日',name:'1'}
                    ,{label:'昨日',name:'2'}
                    ,{label:'近7天',name:'3'}
                    ,{label:'近30天',name:'4'}
                ]
                ,activeName:'1'
                ,lineChartData: {
                    date:[]
                    ,data:[]
                }
                ,salesOverviewsInfo:{}
                ,overviewsInfo:{}
                ,jumpObjList: []
            }
        }
        ,methods:{
            //销售概况tab点击
            handleClick(){
                this.getSalesOverviews();
            }
            //销售概况七个统计值
            ,getSalesOverviews(){
                salesOverviews({queryType:this.activeName}).then(res=>{
                    if(res.status == 1){
                        this.salesOverviewsInfo = res.data;
                    }
                })
            }
            //粉丝概况，代理概况，商品概况
            ,getOverviews(){
                overviews().then(res=>{
                    if(res.status == 1){
                        this.overviewsInfo = res.data;
                    }
                })
            }
            //近七天销售走势
            ,getSalesTrends(){
                salesTrends().then(res=>{
                    if(res.status == 1){
                        for(let i in res.data){
                            this.lineChartData.date.push(res.data[i].statisticsDate);
                            this.lineChartData.data.push(res.data[i].accumulateSalesMoney);
                        }
                    }
                })
            },
            //页面的跳转
            jumpPage(param){
              //param.path 跳转的路径带参数
                this.$router.push({
                    path: param.path,
                    query: {
                        menuId: getRouteId(param.path),
                        ...param.query
                    }
                })
            }
        }
        ,created() {
            // getMenuIdList({
            //     vue:this
            //     ,vueDataName:'jumpObjList'
            //     ,array:['/productManger/saleProduct','/agent/list','/fans/list','/order/theorder']
            // });
            this.getSalesTrends();
            this.getSalesOverviews();
            this.getOverviews();
        }
    }
</script>

<style scoped lang="scss">
  $blue:#409EFF;
  .blue{color: $blue;}
  .dashboard{display: flex;justify-content: space-around;align-items: center;
    li:not(.noPointer){cursor: pointer;}
  }
  .dashboard-title{color: #666;}
  .dashboard-content{color: $blue;text-align: center;}
  .dashboard-line{width: 1px;background: #E4E7ED;height: 50px;}
</style>

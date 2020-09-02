<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label="代理名称：" prop="agentName">
              <el-input v-model="searchForm.agentName" clearable placeholder="请输入代理名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="searchForm.mobile" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getEarnList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-table :data="earnList" style="width: 100%;"
                  border
                  v-loading="listLoading"
        >
          <el-table-column align="center" label="代理名称">
            <template slot-scope="scope">
              {{ scope.row.agentName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              {{ scope.row.mobile }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="总收益">
            <template slot-scope="scope">
              {{ scope.row.accumulateEarnings }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="在途收益">
            <template slot-scope="scope">
              <el-link type="primary"
                @click="showEarnCpt({
                  name:'EarnIng'
                  ,title:'在途收益'
                  ,memberId:scope.row.memberId
                  ,orderEarningsType:1
                })"
              >{{ scope.row.onwayEarnings }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="可提现收益">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="showEarnCpt({
                  name:'EarnCanGet'
                  ,title:'可提现收益'
                  ,memberId:scope.row.memberId
                  ,orderEarningsType:3
                })"
              >{{ scope.row.avaliableEarnings }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="冻结收益">
            <template slot-scope="scope">
              <el-link type="primary"
                       @click="showEarnCpt({
                  name:'EarnFreeze'
                  ,title:'冻结收益'
                  ,memberId:scope.row.memberId
                  ,orderEarningsType:2
                })"
              >{{ scope.row.blockEarnings }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="加入时间" :width="$settings.dateWidth">
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getEarnList"/>
      </el-card>
    </el-row>
    <el-dialog
      :title="earnCptsData.title"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="70%"
    >
      <component :is="earnCptsData.name"
                 :lists="earnCptsDataList"
      ></component>
      <pagination v-show="earnCptsForm.total>0" :total="earnCptsForm.total" :page.sync="earnCptsForm.pageNo" :limit.sync="earnCptsForm.pageSize"
                  @pagination="getEarnDetail"/>
    </el-dialog>
  </div>
</template>

<script>
    import {apisEarnList,apisEarnDetail} from '@/api/earn'
    import EarnIng from './components/EarnIng' // 在途收益
    import EarnFreeze from './components/EarnFreeze' // 冻结收益
    import EarnCanGet from './components/EarnCanGet' // 可提现收益
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    export default {
        name: 'earn',
        components: {
            Pagination
            ,EarnIng
            ,EarnFreeze
            ,EarnCanGet
        }
        , data() {
            return {
                searchForm: {
                    pageNo: 1
                    , pageSize: 20
                    , agentName: ''
                    , mobile: ''
                }
                , total: 0
                , listLoading: true
                ,earnCptsData:{
                    name:'EarnIng'
                    ,title:'在途收益'
                }
                ,earnCptsForm:{
                    pageSize:20
                    ,pageNo:1
                    ,orderEarningsType:''
                    ,memberId:''
                    ,total:0
                }
                ,earnCptsDataList:[]
                ,earnList:[]
                ,dialogVisible:false
            }
        }
        ,mounted() {
            this.getEarnList();
        }
        ,methods:{
            //获取收益列表
            getEarnList(num){
                if (num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                apisEarnList(this.searchForm).then(res => {
                    if (res.status == 1) {
                        this.earnList = res.data.rows;
                        this.total = res.data.total;
                        setTimeout(() => {
                            this.listLoading = false
                        }, 500)
                    }
                })
            }
            //弹出对应的收益列表组件
            ,showEarnCpt(data){
                //收益组件赋值
                this.earnCptsData.name = data.name;
                this.earnCptsData.title = data.title;
                //查询收益接口参数
                this.earnCptsForm.orderEarningsType = data.orderEarningsType;
                this.earnCptsForm.memberId = data.memberId;

                this.getEarnDetail();
            }
            //获取在途等收益详情列表
            ,getEarnDetail(){
                apisEarnDetail(this.earnCptsForm).then(res => {
                    if (res.status === 1) {
                        this.earnCptsDataList = res.data.rows;
                        this.dialogVisible = true;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>

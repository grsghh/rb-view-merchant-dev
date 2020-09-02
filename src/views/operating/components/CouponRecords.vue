<template>
  <div class="">
    <el-row class="main-block">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
      </div>
      <div class="main-block">
        <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
          <el-form-item label="使用状态：" prop="state">
            <el-select v-model="searchForm.state">
              <el-option
                v-for="item in couponStatus"
                :key="item.entryKey"
                :label="item.entryValue"
                :value="item.entryKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取人：" prop="memberName">
            <el-input class="myInput" v-model="searchForm.memberName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input class="myInput" v-model="searchForm.mobile" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="使用时间：" prop="useStartTime">
            <el-date-picker
              v-model="searchForm.useStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="useEndTime">
            <el-date-picker
              v-model="searchForm.useEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="所属代理：" prop="agentId">
            <el-select
              v-model="searchForm.agentId"
              filterable
              remote
              clearable
              :remote-method="remoteMethod"
              :loading="searchLoading">
              <el-option
                v-for="item in higherSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="getRecordList(1)">查询</el-button>
            <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
    <div class="queryContent">
      <div class="table">
        <el-table :data="recordList" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="领取人" width="160">
            <template slot-scope="scope">{{ scope.row.memberName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="120">
            <template slot-scope="scope">{{ scope.row.memberMobile || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属代理" width="160">
            <template slot-scope="scope">{{ scope.row.agentName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="面值">
            <template slot-scope="scope">{{ scope.row.parValue || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1">未使用</span>
              <span v-if="scope.row.state == 2">已使用</span>
              <span v-if="scope.row.state == 3">已失效</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用时间" width="160">
            <template slot-scope="scope">{{ scope.row.useTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="订单编号" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.orderNOs || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="订单金额">
            <template slot-scope="scope">{{ scope.row.orderPrice || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" width="160">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getRecordList"
      />
    </div>
  </div>
</template>

<script>
    import { CouponRecordsList } from '@/api/coupons'
    import {allAgents} from '@/api/fansAnalysis'
    import {dicts} from '@/api/system'
    import Pagination from '@/components/Pagination'
    export default {
        name: "CouponRecords"
        ,components: {Pagination}
        ,props:{
            couponParams:{
                type:Object
            }
        }
        ,data(){
            return {
                highList:[],//所有所属上级列表
                higherSelectList:[],//筛选的所属上级列表
                searchForm:{
                    pageNo:1
                    ,pageSize:20
                  ,agentId: '',
                  couponsId: this.couponParams.recordId,
                  memberName: "",
                  mobile: "",
                  state: '',
                  useEndTime: "",
                  useStartTime: ""
                }
                ,listLoading:true
                ,recordList:[]
                ,total:0
                ,searchLoading:false
                ,couponStatus:[]
            }
        }
        ,mounted() {
            this.getCouponStatus();
            this.getHighList();
            this.getRecordList();
        }
        ,methods:{
            getHighList(){
                allAgents('').then(res=>{
                    let arr = []
                    for(let i in res.data){
                        arr.push({
                            value:res.data[i].id,
                            label:res.data[i].nickname
                        })
                    }
                    this.highList = arr
                })
            },
            getRecordList(num = 0){
                if(num === 1) this.searchForm.pageNo = 1;
                this.listLoading = true;
                CouponRecordsList(this.searchForm).then(res => {
                    this.recordList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                      this.listLoading = false
                    }, 500)
                })
                /*
                * 1 ：领取记录
                * 2 ：发放记录
                * */
                // switch (this.recordType) {
                //     case 1:
                //         break;
                //     case 2:
                //         break;
                // }
            }
            //检索所属上级列表
            ,remoteMethod(query) {
                if (query !== '') {
                    this.searchLoading = true;
                    setTimeout(() => {
                        this.searchLoading = false;
                        this.higherSelectList = this.highList.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.higherSelectList = [];
                }
            }
            //获取优惠券使用状态
            ,async getCouponStatus(){
                await dicts('100017').then(res=>{
                    if(res.status === 1){
                        this.couponStatus = res.data;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>

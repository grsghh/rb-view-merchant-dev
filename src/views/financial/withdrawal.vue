<template>
  <div class="withdrawal contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" :inline="true">
            <el-form-item label="会员名称：" prop="memberName">
              <el-input class="myInput" v-model="searchForm.memberName" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="提现状态" prop="withdrawalsState">
              <el-select class="select" v-model="searchForm.withdrawalsState" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in status"
                  :key="item.id"
                  :label="item.entryValue"
                  :value="item.entryKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间：" prop="startDate">
              <el-date-picker
                v-model="searchForm.startDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="endDate">
              <el-date-picker
                v-model="searchForm.endDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getWithdrawalsList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields();selectedId=[]">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
<!--        <el-button-->
<!--          type="primary"-->
<!--          @click="multiAutoWithdrawal"-->
<!--        >批量自动提现-->
<!--        </el-button>-->
        <el-button
          type="warning"
          @click="showWithdrewSet"
        >提现限制
        </el-button>
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
        <!--        <el-button type="danger" v-if="$store.state.user.pageBtns.includes('del')"><i class="el-icon-delete"></i></el-button>-->
      </div>
      <div class="table">
        <el-table :data="withdrawalList" border style="width: 100%" v-loading="listLoading" height="470"
                  @selection-change="handleSelectionChange">
<!--          <el-table-column-->
<!--            fixed-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="申请人">
            <template slot-scope="scope">{{ scope.row.memberName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="提现金额">
            <template slot-scope="scope">{{ scope.row.withdrawalsAmount || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">{{ scope.row.withdrawalsStateName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="付款方式">
            <template slot-scope="scope">{{ scope.row.paymentType | paymentType}}</template>
          </el-table-column>
          <el-table-column align="center" label="线上支付状态">
            <template slot-scope="scope">{{ scope.row.onlinePayState | onlinePayState}}</template>
          </el-table-column>
          <el-table-column align="center" label="线上支付失败原因">
            <template slot-scope="scope">{{ scope.row.onlinePayFailReason || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="申请时间" width="310">
            <template slot-scope="scope">{{ scope.row.applyTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="310" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
                v-if="scope.row.withdrawalsState == 1 && $store.state.user.pageBtns.includes('audit')"
              >审核</el-button>
              <el-button
                v-if="scope.row.onlinePayState === 3 && $store.state.user.pageBtns.includes('retry')"
                :loading="retrying"
                size="small" type="danger" @click="handleRetry(scope)">重试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getWithdrawalsList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose" destroy-on-close>
      <el-form
        :disabled="isReadOnly"
        :model="verifyForm"
        label-width="140px"
      >
        <el-form-item label="申请人：">
          {{dialogData.memberName}}
        </el-form-item>
        <el-form-item label="提现金额：">
          {{dialogData.withdrawalsAmount}}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{dialogData.applyTime}}
        </el-form-item>
        <el-form-item label="申请状态：">
          {{dialogData.withdrawalsStateName}}
        </el-form-item>
        <el-form-item label="付款方式：">
          {{dialogData.paymentType | paymentType}}
        </el-form-item>
        <template
          v-if="dialogData.paymentType === 1"
        >
          <el-form-item label="线上支付状态：">
            {{dialogData.onlinePayState | onlinePayState}}
          </el-form-item>
          <el-form-item
            v-if="dialogData.onlinePayFailReason"
            label="线上支付失败原因：">
            {{dialogData.onlinePayFailReason}}
          </el-form-item>
        </template>
        <el-form-item label="审核意见：" prop="opinion">
          <el-input
            type="textarea"
            :rows="2"
            v-model="verifyForm.opinion">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType !=="查看"'>
        <el-button type="primary" :loading="verifying" @click="confirmVerify(1)">通过并自动提现</el-button>
        <el-button type="primary" :loading="verifying" @click="confirmVerify(2)">通过并人工提现</el-button>
        <el-button type="danger" :loading="verifying" @click="confirmVerify(0)">驳回</el-button>
      </div>
      <template v-if="dialogType !== '查看'">
        <p class="tipMsg">通过并自动提现是指同意提现，并通过企业微信支付自动付款到用户微信零钱账户，前提是必须已在微信商户后台开通企业付款功能。</p>
        <p class="tipMsg">通过并人工提现是指同意提现，线下转账给用户。</p>
      </template>
    </el-dialog>
    <!-- 提现限制 -->
    <el-dialog :visible.sync="withdrewSetVis" title="提现限制" @close="dialogClose" destroy-on-close
       :close-on-click-modal="false" width="35%"
    >
      <el-form
        :model="withdrewSetForm"
        label-width="100px"
      >
        <el-form-item label="限制金额：" prop="opinion" style="width: 300px;">
          <el-input
            v-model.number="withdrewSetForm.limit">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="toSetWith">确定</el-button>
        <el-button @click="withdrewSetVis = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { list ,reject ,passOnline,passOffline,apisWithdrawalsLimit,apisSetWithdrawals,apisRetry} from '@/api/withdrawal'
    import { dicts } from '@/api/system'
    import Pagination from '@/components/Pagination'
    export default {
        name: 'withdrawal',
        components: { Pagination },
        data() {
            return {
                status: [],
                isReadOnly: false,
                withdrawalList: [],
                dialogVisible: false,
                searchForm: {
                    pageNo: 1,
                    pageSize:20,
                    endDate: '',
                    memberName: '',
                    startDate: '',
                    withdrawalsState: '',
                } ,
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                verifyForm: {
                    opinion:''
                    ,id:''
                },
                dialogData:{}
                ,multipleSelection:[]
                ,withdrewSetVis:false
                ,withdrewSetForm:{
                    limit:0
                }
                ,verifying:false
                ,retrying:false
            }
        },
        methods: {
            // 取消
            dialogClose() {
                this.verifyForm = this.multipleSelection = {};
            },
            //显示/隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 审核
            handleEditInfo(score) {
                this.dialogType = '审核';
                this.isReadOnly = false;
                this.dialogData = score.row;
                this.verifyForm.id = score.row.id;
                this.showOrHideDialog();
            },
            //查看标签
            handleView(score) {
                this.dialogType = '查看';
                this.isReadOnly = true;
                this.dialogData = score.row;
                this.verifyForm.opinion = score.row.opinion;
                this.showOrHideDialog();
            },
            //重试
            handleRetry(score) {
                this.$confirm(`确定要重试吗？`, '提示', {
                    confirmButtonText: '确定'
                    ,type: 'warning'
                }).then(() => {
                    this.retrying = true;
                    apisRetry({id:score.row.id}).then(res=>{
                        if(res.status === 1){
                            this.$message({
                                type: 'success',
                                message: '操作成功！'
                            });
                        }
                        this.getWithdrawalsList();
                        this.retrying = false;
                    })
                }).catch(()=>{
                    this.retrying = false;
                })
            },
            //打开提现限制
            showWithdrewSet() {
                this.withdrewSetVis = true;
                apisWithdrawalsLimit().then(res=>{
                    if(res.status === 1){
                        this.withdrewSetForm.limit = res.data;
                    }
                })
            },
            // 获取提现列表
            getWithdrawalsList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                list(this.searchForm).then(res => {
                    this.withdrawalList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            }
            //设置提现限制
            ,toSetWith(){
                if(typeof this.withdrewSetForm.limit !== 'number' || this.withdrewSetForm.limit < 5){
                    this.$message({
                        type: 'error',
                        message: '提现金额不能小于5元'
                    });
                    return
                }
                apisSetWithdrawals(this.withdrewSetForm).then(res=>{
                    if(res.status === 1){
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                        this.withdrewSetVis = false;
                    }
                })
            }
            //校验是否选择了一条数据
            ,checkMultiSelect(){
                if(!this.multipleSelection.length){
                    this.$message({
                        type: 'error',
                        message: '至少选择一条记录!'
                    })
                    return false;
                }
                return true;
            }
            //批量选择
            ,handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            //批量自动提现
            ,multiAutoWithdrawal(){
                if(this.checkMultiSelect()){
                    this.$confirm(`确定要对选中的记录进行批量自动提现吗？`, '提示', {
                        confirmButtonText: '确定'
                        ,type: 'warning'
                    }).then(() => {
                        // this.$message({
                        //     type: 'success',
                        //     message: '删除成功!'
                        // });
                    }).catch(()=>{

                    })
                }
            }
            // 审核/驳回
            ,confirmVerify(type) {
                this.verifying = true;
                //驳回
                if(type == 0) {
                    reject(this.verifyForm).then(res => {
                        if(res.status == 1) {
                            this.$message({
                                type: 'success',
                                message: '驳回成功！'
                            });
                            this.getWithdrawalsList();
                        }
                        this.showOrHideDialog();
                        this.verifying = false;
                    })
                }
                if(type == 1){
                    //通过并自动提现
                    passOnline(this.verifyForm).then(res => {
                        if(res.status == 1) {
                            this.$message({
                                type: 'success',
                                message: '审核通过！'
                            });
                        }
                        this.getWithdrawalsList();
                        this.showOrHideDialog();
                        this.verifying = false;
                    })
                }
                if(type == 2){
                    //通过并人工提现
                    passOffline(this.verifyForm).then(res => {
                        if(res.status == 1) {
                            this.$message({
                                type: 'success',
                                message: '审核通过！'
                            });
                        }
                        this.getWithdrawalsList();
                        this.showOrHideDialog();
                        this.verifying = false;
                    });
                }
            },
            // 获取提现状态
            getTypeList() {
                dicts(100011).then(res => {
                    this.status = res.data;
                })
            }
        },
        created() {
            this.getWithdrawalsList();
            this.getTypeList();
        }
        ,filters:{
            onlinePayState(v){
                switch (v) {
                    case 1 :
                        return '待支付';
                    case 2 :
                        return '支付成功';
                    case 3 :
                        return '支付失败';
                }
                return '-';
            }
            ,paymentType(v){
                switch (v) {
                    case 1 :
                        return '线上';
                    case 2 :
                        return '线下';
                }
                return '-';
            }
        }
    }
</script>

<style scoped>

</style>


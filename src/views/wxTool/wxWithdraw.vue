<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="手机号:" prop="mobile">
              <el-input class="myInput" v-model="searchForm.mobile" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="提现时间：" prop="withdrawalStartTime" label-width="100px">
              <el-date-picker
                v-model="searchForm.withdrawalStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <span class="pcikerJoin">____</span>
            <el-form-item label-width="35px" prop="withdrawalEndTime">
              <el-date-picker
                v-model="searchForm.withdrawalEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getTheList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="wxDialog"
        >微信提现</el-button>
        <el-button
          type="primary"
          @click="gathering"
        >收款账户</el-button>
      </div>
      <div class="table">
        <el-table :data="userList" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="收款账户">
            <template slot-scope="scope">{{ scope.row.nickname || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="收款手机号">
            <template slot-scope="scope">{{ scope.row.mobile}}</template>
          </el-table-column>
          <el-table-column align="center" label="提现金额">
            <template slot-scope="scope">{{ scope.row.amount || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="提现日期">
            <template slot-scope="scope">{{ scope.row.withdrawalTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="支付状态">
            <template slot-scope="scope">{{ scope.row.paymentStatus == 0 ? "支付失败" : "支付成功"}}</template>
          </el-table-column>
          <el-table-column align="center" label="线上支付失败原因">
            <template slot-scope="scope">{{ scope.row.onlinePayFailReason || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="handleAgain(scope)"
                v-if="scope.row.paymentStatus == 0"
                :loading="againLoading"
              >重试</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getTheList"
      />
    </div>
    <!-- 微信提现的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose" :close-on-click-modal = "false">
      <!--    选择账户的再次弹框-->
      <el-dialog
        class="GatheringAccount"
        width="70%"
        title="选择收款账户"
        :visible.sync="selectAccount"
        append-to-body>
          <gathering-account v-if="selectAccount" :params="params" @handleCurrentChange="handleCurrentChange"></gathering-account>
      </el-dialog>
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <el-form-item label="选择账户" prop="account">
          <el-button @click="toSelect">选择收款账户</el-button>
        </el-form-item>
        <el-form-item label="收款账户" prop="mobile">
            <el-input class="widthStyle" v-model="userForm.mobile" placeholder="请选择收款账户" disabled/>
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
            <el-input class="widthStyle" v-model="userForm.amount" placeholder="5元以上"/>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <div class="myStyle">
            <el-input class="widthStyle" v-model="userForm.verifyCode" placeholder="请输入验证码"/>
            <el-button @click="sendMessage" class="widthStyle1" v-if="noSend">发送验证码</el-button>
            <el-input v-else class="widthStyle1" v-model="sendMsg" disabled/>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看标签" ? false : true '>
        <el-button type="primary" :loading="confirmLoading" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>

    <!--  收款账户的弹框 -->
    <el-dialog
      class="GatheringAccount"
      width="70%"
      title="收款账户"
      :visible.sync="gatheringDialog"
      append-to-body>
      <gathering-account v-if="gatheringDialog"></gathering-account>
    </el-dialog>
  </div>
</template>

<script>
    // import { getDetailById, addTags, editTags, delTags } from '@/api/productTag'
    import { getList, sendTheMessage, wxWithdrawals, wxWithdrawalsAgain } from '@/api/wxTool'
    import Pagination from '@/components/Pagination'
    import GatheringAccount from './components/GatheringAccount'
    var tm = ""
    export default {
        name: 'productTag',
        components: { Pagination, GatheringAccount },
        data() {
            return {
                params: {
                    isSelectAccount: true
                },
                sendMsg: "60s",
                sendTime: 60,
                noSend: true,
                isReadOnly: false,
                name: '',
                mobile: '',
                value: '',
                userList: [],
                dialogVisible: false, // 微信提现弹框
                gatheringDialog: false, // 收款账户弹框
                selectAccount: false, // 选择账户的弹框
                searchForm: {
                    pageNo: 1
                    , pageSize:20,
                    mobile: '',
                    withdrawalEndTime: "",
                    withdrawalStartTime: ""
                } ,
                listLoading: false,
                againLoading: false,
                confirmLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                userForm: {
                    amount: '',
                    memberId: '',
                    verifyCode: ''
                },
                multipleSelection: [],
                formRule: {
                    // mobile: [{ required: true, message: '请选择收款账户', trigger: 'blur' }],
                    amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
                    verifyCode:[{ required: true, message: '请输入验证码', trigger: 'blur' }],
                }
            }
        },
        methods: {
            handleCurrentChange(data) {
                this.userForm.memberId = data.id;
                this.userForm.mobile = data.mobile;
                this.selectAccount = false;
            },
            sendMessage() {
                if(!this.userForm.mobile) {
                    return this.$message({
                        type: 'warning',
                        message: '请先选择账户！'
                    });
                }
                let that = this;
                // this.noSend = false;
                // this.setTime();
                sendTheMessage().then(res => {
                    if(res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '发送成功！'
                        });
                        that.noSend = false;
                        that.setTime();
                    }
                })
            },
            setTime() {
                let that = this;
                tm = setInterval(function() {
                    if(that.sendTime < 1) {
                        that.noSend = true;
                        that.sendMsg = "60s";
                        that.sendTime = 60;
                        window.clearInterval(tm);
                    } else {
                        that.sendTime--;
                        that.sendMsg = that.sendTime + 's';
                    }
                },1000);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 取消修改
            dialogClose() {
                this.userForm = {
                    amount: '',
                    memberId: '',
                    verifyCode: '',
                    mobile: ''
                };
                if(tm) {
                    this.noSend = true;
                    this.sendMsg = "60s";
                    this.sendTime = 60;
                    clearInterval(tm);
                };
                this.dialogVisible = false;
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 微信提现
            wxDialog() {
                this.dialogType = '微信提现';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            toSelect() {
                this.selectAccount = true;
            },
            // 收款弹框
            gathering() {
                this.gatheringDialog = true;
            },
            //查看标签
            handleView(score) {
                this.isReadOnly = true;
                getDetailById(score.row.id).then(res =>{
                    this.dialogType = '查看标签';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 修改标签
            // handleEditInfo(score) {
            //     this.isReadOnly = false;
            //     getDetailById(score.row.id).then(res =>{
            //         this.dialogType = '修改标签';
            //         this.setDetailData(res);
            //         this.showOrHideDialog();
            //         this.userForm.id = res.data.id;
            //     })
            // },
            // 获取用户列表信息
            getTheList(num) {
                if(num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                getList(this.searchForm).then(res => {
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
                        this.confirmLoading = true;
                        // let that = this;
                        // setTimeout(function () {
                        //     that.confirmLoading = false;
                        //     that.showOrHideDialog();
                        // },2000);
                        wxWithdrawals(this.userForm).then(res => {
                                if(res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '已提交申请！'
                                    });
                                    // this.getTheList();
                                }
                            this.confirmLoading = false;
                            this.showOrHideDialog();
                            this.getTheList();
                            this.noSend = true;
                            this.sendMsg = "60s";
                            this.sendTime = 60;
                            clearInterval(tm);
                        });
                    }
                })
            },
            // 重试
            handleAgain(score) {
                this.$confirm('确定要重试吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        this.againLoading = true;
                        await wxWithdrawalsAgain(score.row.id).then(res => {
                            if(res.status == 1){
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                })
                            }
                            this.againLoading = false;
                            this.getTheList();
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
        },
        created() {
            this.getTheList();
        }
    }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }
  .myStyle: {
    display: flex;
  }
  .widthStyle {
    width: 220px;
  }
  .widthStyle1 {
    display: flex;
    width: 120px;
    margin-left: 20px;
  }
  .widthStyle1 .el-input__inner {
    text-align: center;
  }
  .timeDiv {
    width: 100px;
    margin-left: 20px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid #DCDFE6;
  }
  .GatheringAccount .el-dialog__body {
    padding: 0;
  }
</style>

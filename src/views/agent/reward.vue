<template>
  <div class="main-content">
    <el-row class="main-block main-ipt">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="82px" :inline="true">
            <el-form-item label="名称：" prop="agentName">
              <el-input v-model="searchForm.agentName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="代理身份：" prop="agentLevel">
              <div class="">
                <el-select v-model="searchForm.agentLevel" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in levelsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="年份:" prop="createTimeStart">
              <el-select v-model="searchForm.year" filterable clearable placeholder="全部">
                <el-option
                  v-for="item in yearList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="月份:" prop="createTimeStart">
              <el-select popper-class="longSelect" v-model="searchForm.month" filterable clearable placeholder="全部">
                <el-option
                  v-for="item in monthList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="isGiveOut">
                <el-select v-model="searchForm.isGiveOut" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in statusList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="searchForm.remark" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="reset()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
<!--          <el-button v-if="$store.state.user.pageBtns.includes('export')" size="small" type="primary" @click="educe()">导出</el-button>-->
          <el-button size="small" type="primary" @click="grantAll(1)" v-if="$store.state.user.pageBtns.includes('batchOnlineSend')">批量线上发放</el-button>
          <el-button size="small" type="primary" @click="grantAll(2)" v-if="$store.state.user.pageBtns.includes('batchOfflineSend')">批量线下发放</el-button>
          <el-button size="small" type="primary" @click="remarkAll" v-if="$store.state.user.pageBtns.includes('batchRemark')">批量备注</el-button>
          <div class="detailCount">
            <span class="countLeft">奖金合计: {{ totalAwards }}</span>
            <span>业绩合计: {{ totalSales }}</span>
          </div>
        </el-row>
        <el-table :data="List" style="width: 100%;"
                  border
                  v-loading="listLoading"
                  height="470"
                  @selection-change="handleSelectionChange">
        >
          <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" label="代理名称" width="120">
            <template slot-scope="scope">
              {{ scope.row.agentName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="160">
            <template slot-scope="scope">
              {{ scope.row.mobile || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="身份">
            <template slot-scope="scope">
              {{ scope.row.agentLevelName || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="接单奖励">
            <template slot-scope="scope">
              {{ scope.row.orderAward || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="业绩">
            <template slot-scope="scope">
              {{ scope.row.orderSales || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="年份">
            <template slot-scope="scope">
              {{ scope.row.year || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="月份">
            <template slot-scope="scope">
              {{ scope.row.month || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="发放状态">
            <template slot-scope="scope">
              <span class="statusColorReady" v-if="scope.row.isGivenOut == 1">
                {{ scope.row.isGivenOut == 1 ?  '已发放' : '未发放' }}
              </span>
              <span class="statusColor" v-else>
                {{ scope.row.isGivenOut == 1 ?  '已发放' : '未发放'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="付款方式" width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.paymentType == 1">线上支付</span>
              <span v-if="scope.row.paymentType == 2">线下支付</span>
              <span v-if="scope.row.paymentType == null">-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="线上付款状态" width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.onlinePayState == 1">待支付</span>
              <span v-if="scope.row.onlinePayState == 2">支付成功</span>
              <span v-if="scope.row.onlinePayState == 3">支付失败</span>
              <span v-if="scope.row.onlinePayState == null">-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="线上付款失败原因" width="220">
            <template slot-scope="scope">
              {{ scope.row.onlinePayFailReason || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="220">
            <template slot-scope="scope">
              {{ scope.row.remark || '-'}}
            </template>
          </el-table-column>
          <el-table-column align="center"  fixed="right" label="操作" width="350">
            <template slot-scope="scope">
              <template v-if="scope.row.onlinePayState == 3">
                <el-button type="danger" size="mini" @click="handleRetry(scope)" :loading="retrying">重试</el-button>
              </template>
              <el-button type="primary" size="mini" @click="handleEdit(scope)">
                明细
              </el-button>
              <el-button type="warning" size="mini" @click="handleOut(scope)" v-if="$store.state.user.pageBtns.includes('send')">
                发放
              </el-button>
              <el-button type="success" size="mini" @click="handleRemark(scope)" v-if="$store.state.user.pageBtns.includes('remark')">
                备注
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getList"/>
      </el-card>
    </el-row>

    <!--    明细弹窗-->
    <el-dialog :visible.sync="dialogPromote" title="接单明细"  @close="Close()" width="52%">
      <el-row class="main-block main-ipt">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>查询条件</span>
          </div>
          <div class="main-block">
            <el-form ref="searchForm" :model="detailForm" label-width="70px" :inline="true">
              <el-form-item label="名称：" prop="nickname">
                <span>{{detailForm.agentName}}</span>
              </el-form-item>
              <el-form-item label="手机号：" prop="mobile">
                <span>{{detailForm.mobile}}</span>
              </el-form-item>
              <el-form-item label="身份：" prop="agentLevel">
                <span>{{detailForm.agentLevelName}}</span>
              </el-form-item>
              <el-form-item label="年份：" prop="createTimeStart">
                <el-select v-model="detailForm.year" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in yearList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="月份:" prop="createTimeStart">
                <el-select v-model="detailForm.month" filterable clearable placeholder="全部">
                  <el-option
                    v-for="item in monthList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="query(1)">查询</el-button>
                <el-button size="small" type="warning" @click="detailReset()">清空</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-row>
      <el-tabs v-model="tgtype" type="border-card" @tab-click="agentAndfans">
        <el-tab-pane name="first" label="直属代理接单">
          <el-table style="width: 100%;" :data="recList" border height="500px">
            <el-table-column align="center" label="名称">
              <template slot-scope="scope">
                {{ scope.row.agentName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="手机号">
              <template slot-scope="scope">
                {{ scope.row.mobile || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="身份">
              <template slot-scope="scope">
                {{ scope.row.agentLevelName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖金">
              <template slot-scope="scope">
                {{ scope.row.orderAward || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="单号">
              <template slot-scope="scope">
                {{ scope.row.orderNO}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="下单时间" width="160">
              <template slot-scope="scope">
                {{ scope.row.createTime}}
              </template>
            </el-table-column>
          </el-table>
          <div class="totalCount">合计：{{totalMoney}}</div>
          <pagination v-show="totalPage>0" :total="totalPage" :page.sync="detailForm.pageNo" :limit.sync="detailForm.pageSize"
                      @pagination="this.getdetailList()"/>
        </el-tab-pane>
        <el-tab-pane name="two" label="间推代理接单">
          <el-table style="width: 100%;" :data="recList" border height="500px">
            <el-table-column align="center" label="名称">
              <template slot-scope="scope">
                {{ scope.row.agentName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="手机号">
              <template slot-scope="scope">
                {{ scope.row.mobile || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="身份">
              <template slot-scope="scope">
                {{ scope.row.agentLevelName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖金">
              <template slot-scope="scope">
                {{ scope.row.orderAward || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="单号">
              <template slot-scope="scope">
                {{ scope.row.orderNO}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="下单时间" width="160">
              <template slot-scope="scope">
                {{ scope.row.createTime}}
              </template>
            </el-table-column>
          </el-table>
          <div class="totalCount">合计：{{totalMoney}}</div>
          <pagination v-show="totalPage>0" :total="totalPage" :page.sync="detailForm.pageNo" :limit.sync="detailForm.pageSize"
                      @pagination="this.getdetailList()"/>
        </el-tab-pane>
        <el-tab-pane name="three" label="三级代理接单">
          <el-table style="width: 100%;" :data="recList" border height="500px">
            <el-table-column align="center" label="名称">
              <template slot-scope="scope">
                {{ scope.row.agentName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="手机号">
              <template slot-scope="scope">
                {{ scope.row.mobile || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="身份">
              <template slot-scope="scope">
                {{ scope.row.agentLevelName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖金">
              <template slot-scope="scope">
                {{ scope.row.orderAward || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="单号">
              <template slot-scope="scope">
                {{ scope.row.orderNO}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="下单时间" width="160">
              <template slot-scope="scope">
                {{ scope.row.createTime}}
              </template>
            </el-table-column>
          </el-table>
          <div class="totalCount">合计：{{totalMoney}}</div>
          <pagination v-show="totalPage>0" :total="totalPage" :page.sync="detailForm.pageNo" :limit.sync="detailForm.pageSize"
                      @pagination="this.getdetailList()"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--    发放弹窗-->
    <el-dialog :visible.sync="dialogVisible" title="发放奖金" @close="dialogClose()" width="50%">
      <el-form v-if="dialogVisible" :model="outForm" ref="outForm" :rules="outFormRules" label-width="80px">
        <el-form-item label="代理名称">
          <span>{{outForm.agentName}}</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span>{{outForm.mobile}}</span>
        </el-form-item>
        <el-form-item label="应发奖励" v-if="outForm.paymentType == 2">
          <span>{{outForm.realGiveOutMoney}}</span>
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentType">
          <el-radio-group v-model="outForm.paymentType">
            <el-radio label="1">线上支付</el-radio>
            <el-radio label="2">线下支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="outForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="上传凭证" v-if="outForm.paymentType == 2">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImg"
            :on-remove="remove"
            accept="image/*"
            :limit="5"
            multiple
            :file-list="imgList"
            :on-exceed="productImageExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmChauffeur">
          确认
        </el-button>
        <el-button type="danger" @click="noConfirmChauffeur">
          取消
        </el-button>
      </div>
      <template>
        <p class="tipMsg">通过线上付款是指同意发放奖励，并通过企业微信支付自动付款到用户微信零钱账户，前提是必须已在微信商户后台开通企业付款功能。</p>
        <p class="tipMsg">通过线下付款是指同意发放奖励，线下转账给用户。</p>
      </template>
    </el-dialog>
    <!--备注弹窗-->
    <el-dialog :visible.sync="dialogRemark" :title="title" @close="dialogRemark = false">
      <el-form v-if="dialogRemark" :model="remarkForm">
        <el-form-item label="备注" label-width="85px">
          <el-input type="textarea" v-model="remarkForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRemark">
          确认
        </el-button>
        <el-button type="danger" @click="dialogRemark=false;remarkForm={}">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getRewardList, editRemark,detailsList,getAwards,outMoney,batchGiveOut, batchRemark,tryReward,batchOnline,batchOffline } from '@/api/reward'
  import {getAllagentLevel, getAllagentTag, members, agentPromote ,getpreagentTag, setpreagentTag ,getfansAddress} from '@/api/agentlabel'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {getToken} from '@/utils/auth'
  import Preview from '@/components/preview/preview'
  import {exportExcel} from '@/utils/exportExcel'
  import {listExport} from '@/api/report'
  import {setTimer, trimFormData} from '@/utils/index'

  export default {
    name: 'reward',
    components: { Pagination,Preview },
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize:20,
          agentLevel:'',
          agentName: "",
          isGiveOut: "",
          remark: "",
          mobile: "",
          month: '',
          year: ''
        },
          monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
          yearList: [],
          statusList: [
              {id: '1', label: '已发放'},
              {id: '0', label: '未发放'}
          ],
          multipleSelection: [],
          totalAwards: '', //奖金合计
          totalSales: '', // 业绩合计
        //线下支付
        upLoadHeader: {
            Authorization: getToken()
          }
        , imgList: [],
        dialogVisible: false,
        dialogPromote: false,
        //备注
        dialogRemark: false,
        remarkForm:{
          remark:'',
          id:''
        },
        bitch:1,
        title:'',
        //明细弹窗
        detailForm:{
          pageNo:1,
          pageSize:20,
          agentId: "",
          level: 1,
          month: new Date().getMonth()+1,
          year: new Date().getFullYear(),
          mobile:'',
          agentLevelName:'',
          agentName:''
        },
        totalPage:0,
        totalMoney:'',//明细合计
        tgtype:'first',
        recList:[],//明细列表
        //发放奖励
        outForm:{
          id:'',
          realGiveOutMoney: "",
          remark: "",
          vouchersIds: [],
          vouchersImageURLs: [],
          mobile:'',
          agentName:'',
          paymentType:''
        },
          outFormRules:{
              paymentType: [{ required: true, trigger: 'blur', message: '请选择付款方式' }]
          },
        List: [],//列表
        listLoading: true,
        total: 0,
        levelsList:[],//等级
        dialogPreview:false,
        retrying:false
      }
    },
    created() {
      this.getYearList();
      this.getList()
      //所有代理等级
      getAllagentLevel().then(res => {
        if (res.status == 1) {
          this.levelsList = res.data
        }
      })
    },
    methods: {
        //重试
        handleRetry(score) {
            this.$confirm(`确定要重试吗？`, '提示', {
                confirmButtonText: '确定'
                ,type: 'warning'
            }).then(() => {
                this.retrying = true;
                tryReward({id:score.row.id}).then(res=>{
                    if(res.status === 1){
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        });
                    }
                    this.getList();
                    this.retrying = false;
                })
            }).catch(()=>{
                this.retrying = false;
            })
        },
        // 获取年列表
        getYearList() {
            let time = new Date();
            let now = time.getFullYear();
            this.searchForm.year = now;
            this.searchForm.month = time.getMonth() + 1;
            let yearList = [];
            for(let i = now; i >= 1970; i--) {
                yearList.push(i);
            }
            this.yearList = yearList;
        },
        // 点击选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 批量发放
        grantAll(type) {
            if(this.multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据！'
                })
                return;
            }
            if(type == 1){
                this.$confirm('确定要批量线上发放吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const loading = this.$loading({
                        lock: true,
                        text: '加载中，请耐心等待......',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    let arr = [];
                    this.multipleSelection.forEach(item => {
                        arr.push(item.id);
                    })
                    await batchOnline(arr).then(res => {
                        loading.close()
                        if (res.status == 1) {
                            setTimeout(()=>{
                                this.getList()
                                this.$message({
                                    type: 'success',
                                    message: '批量线上发放成功！'
                                })
                            },2000)
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            }else{
                this.$confirm('确定要批量线下发放吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let arr = [];
                    this.multipleSelection.forEach(item => {
                        arr.push(item.id);
                    })
                    await batchOffline(arr).then(res => {
                        if (res.status == 1) {
                            this.getList()
                            this.$message({
                                type: 'success',
                                message: '批量线下发放成功！'
                            })
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        // 批量备注
        remarkAll() {
            if(this.multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据！'
                })
                return;
            }
            this.dialogRemark = true
            this.title = '批量备注';
            this.bitch = 1;

        },
      // 清空
      reset() {
        this.searchForm = {
            pageNo: 1,
            pageSize:20,
            agentLevel:'',
            agentName: "",
            isGiveOut: "",
            remark: "",
            mobile: "",
            month: '',
            year: ''
        }
      },
      //明细清空
      detailReset(){
        this.detailForm.month = ''
        this.detailForm.year = ''
      },
      //显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      //关闭弹框时
      dialogClose() {
        this.dialogVisible = false
      },
      //代理列表
      getList(num) {
            if(!this.searchForm.year) {
                if(this.searchForm.month) {
                    this.$message({
                        type: 'warning',
                        message: '不能单独选择月份！'
                    })
                    return;
                }
            }
        this.listLoading = true
        if(num == 1) this.searchForm.pageNo = num
          getRewardList(trimFormData(this.searchForm)).then(res=> {
              if(res.status == 1) {
                  this.totalAwards = res.data.totalAwards;
                  this.totalSales = res.data.totalSales;
                  this.List = res.data.pageResult == null ? [] : res.data.pageResult.rows;
                  this.total = res.data.pageResult == null ? 0 :res.data.pageResult.total;
                  setTimeout(() => {
                      this.listLoading = false
                  },500)
              }
          })
      },
      //提交
      confirmChauffeur(){
          this.$refs['outForm'].validate((valid) => {
              if (valid) {
                  let param = {...this.outForm}
                  delete param.agentName
                  delete param.mobile
                  outMoney(param).then(res=>{
                      if(res.status == 1){
                          this.$message({
                              type:'success',
                              message:'发放奖励成功！'
                          })
                      }
                      this.showOrHideDialog()
                      this.getList()
                  })
              }
          })

      },
      noConfirmChauffeur() {
        this.showOrHideDialog();
      },
      // 备注
      handleRemark(score) {
        this.dialogRemark = true
        this.title = '备注'
        this.remarkForm = {
          remark: score.row.remark,
          id:score.row.id
        }
        this.bitch = 2
      },
      //备注的确定
      confirmRemark(){
        if(this.bitch ==1) {
            let arr = [];
            this.multipleSelection.forEach(item => {
                arr.push(item.id);
            });
            batchRemark({ids: arr, remark: this.remarkForm.remark}).then(res => {
                if(res.status == 1){
                    this.$message({
                        type:'success',
                        message:'批量备注成功！'
                    })
                    this.getList()
                    this.dialogRemark = false
                }
            })
        }
        if(this.bitch == 2){
          editRemark(this.remarkForm).then(res=>{
            if(res.status == 1){
              this.$message({
                type:'success',
                message:'备注修改成功！'
              })
              this.getList()
              this.dialogRemark = false
            }
          })
        }
      },
      //明细弹窗
      handleEdit(score) {
        this.dialogPromote = !this.dialogPromote
        this.detailForm = {
          pageNo:1,
          pageSize:20,
          agentId: score.row.agentId,
          level: 1,
          month: score.row.month,
          year: score.row.year,
          mobile:score.row.mobile,
          agentLevelName:score.row.agentLevelName,
          agentName:score.row.agentName
        }
        this.getdetailList()
      },
      //点击tab切换
      agentAndfans(){
        if(this.tgtype == "first"){
          this.detailForm.level = 1
        }else if(this.tgtype == "two"){
          this.detailForm.level = 2
        }else{
          this.detailForm.level = 3
        }
        this.getdetailList()
      },
      //查询
      query(x){
        this.getdetailList(x)
      },
      //明细的请求列表
      getdetailList(num){
        if(!this.detailForm.year) {
          if(this.detailForm.month) {
            this.$message({
              type: 'warning',
              message: '不能单独选择月份！'
            })
            return;
          }
        }
        if(num == 1) this.detailForm.pageNo = num
        let param = {...this.detailForm}
        delete param.agentName
        delete param.agentLevelName
        delete param.mobile
        detailsList(param).then(res=>{
          if(res.status == 1){
            this.recList = res.data.pageResult == null ? [] : res.data.pageResult.rows;
            this.totalPage = res.data.pageResult == null ? 0 :res.data.pageResult.total;
            this.totalMoney = res.data.totalAwards
          }
        })
      },
      Close(){
        this.dialogPromote = false
        this.tgtype = 'first'
      },
      //上传图片成功
      upIdImg(res) {
        this.outForm.vouchersIds.push(res.data)
      }
      //删除图片
      , remove(file) {
        for (let i in this.outForm.vouchersIds) {
          if (this.outForm.vouchersIds[i] == file.response.data) {
            this.outForm.vouchersIds.splice(i, 1)
          }
        }
      }
      //商品图片上传数量超过五张
      , productImageExceed() {
        this.$message.warning('最多只能上传五张图片');
      },
      //发放奖励弹窗
      handleOut(score){
        if(score.row.isGivenOut){
          this.$message({
            type:'error',
            message:'该记录已经发放奖励！'
          })
          return
        }
        this.showOrHideDialog()
        this.outForm = {
          id:score.row.id,
          realGiveOutMoney: score.row.orderAward,
          remark: score.row.remark,
          vouchersIds: [],
          vouchersImageURLs: [],
          mobile:score.row.mobile,
          agentName:score.row.agentName
        }
      }
    }
  }
</script>

<style scoped>
.detailCount {
  float: right;
  line-height: 32px;
  color: #02B74F;
  font-size: 20px;
  font-weight: 600;
  padding-right: 50px;
}
.totalCount{
  color: red;
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
  padding-left: 16px;
  padding-top: 16px;
}
  .countLeft {
    margin-right: 30px;
  }
  .statusColor {
    color: #FFBA00;
  }
.statusColorReady {
  color: #02B74F;
}

</style>

<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label="优惠券名称：" prop="name">
              <el-input class="myInput" v-model="searchForm.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="领取方式：" prop="acquireType">
              <el-radio-group v-model="searchForm.acquireType">
                <el-radio :label="1">主动领取</el-radio>
                <el-radio :label="2">主动发放</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          v-if="$store.state.user.pageBtns.includes('add')"
          type="primary"
          @click="addDialog"
        >新增
        </el-button>
      </div>
      <div class="table">
        <el-table :data="couponsList" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="优惠券名称" width="160">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="面值">
            <template slot-scope="scope">{{ scope.row.parValue || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="领取限制" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.limitCount == 0">不限制</span>
              <span v-else>每人限领{{ scope.row.limitCount}}张</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用条件" :width="$settings.dateWidth">
            <template slot-scope="scope">
              <span v-if="scope.row.isLimit == 1">满{{scope.row.limitMoney}}可使用</span>
              <span v-else>无门槛</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发放量">
            <template slot-scope="scope">{{ scope.row.grantNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="开始日期" width="160">
            <template slot-scope="scope">{{ scope.row.startDate || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="结束日期" width="160">
            <template slot-scope="scope">{{ scope.row.expireDate || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="领取人次">
            <template slot-scope="scope">{{ scope.row.acquireNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="已使用">
            <template slot-scope="scope">{{ scope.row.usdedNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span style="color: #FFBA00" v-if="scope.row.usageState == 1">未开始</span>
              <span style="color: #13ce66" v-if="scope.row.usageState == 2">进行中</span>
              <span style="color: #ff4949" v-if="scope.row.usageState == 3">已过期</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否有效">
            <template slot-scope="scope">
              <span style="color: #13ce66" v-if="scope.row.state == 1">有效</span>
              <span style="color: #ff4949" v-if="scope.row.state == 0">无效</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="140">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="460" fixed="right">
            <template slot-scope="scope">
              <template v-if="scope.row.acquireType == 1">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('receiveDetail')"
                  size="small" type="primary" @click="showRecords({type:1,title:'领取记录',scope})">领取详情</el-button>
              </template>
              <template v-if="scope.row.acquireType == 2">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('grantDetail')"
                  size="small" type="primary" @click="showRecords({type:2,title:'发放记录',scope})">发放详情</el-button>
              </template>
              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>
              <template v-if="scope.row.acquireType == 2 && scope.row.usageState != 3 && scope.row.state == 1">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('grant')"
                  size="small" type="success" @click="handleGrant(scope)">发放</el-button>
              </template>
              <template v-if="scope.row.usageState != 3 && scope.row.state == 1">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('invalid')"
                  size="small" type="info" @click="handleUnabled(scope)">失效</el-button>
              </template>
              <template v-if="scope.row.state == 1 && scope.row.usageState == 1">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('edit')"
                  size="small"
                  type="warning"
                  @click="handleEditInfo(scope)"
                >修改
                </el-button>
              </template>
              <template v-if="scope.row.usageState != 2">
                <el-button
                  v-if="$store.state.user.pageBtns.includes('del')"
                  size="small"
                  type="danger"
                  @click="handleDelete(scope)"
                >删除
                </el-button>
              </template>
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
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="couponForm"
        label-width="120px"
        ref="couponForm"
        :rules="formRule"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="couponForm.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="面值：" prop="parValue">
          <el-input v-model="couponForm.parValue" placeholder=""/>
        </el-form-item>
        <el-form-item label="每人限领：" prop="limitCount">
          <el-input v-model="couponForm.limitCount" placeholder=""/>
          <span class="tipMsg">0表示不限制</span>
        </el-form-item>
        <el-form-item label="使用限制：" prop="isLimit">
          <el-radio-group v-model="couponForm.isLimit">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1">
              满 <el-input :disabled="couponForm.isLimit == 0" v-model="couponForm.limitMoney" placeholder=""/> 元可使用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发放总量：" prop="grantNum">
          <el-input v-model="couponForm.grantNum" placeholder=""/>
          <span class="tipMsg">0表示不限制</span>
        </el-form-item>
        <el-form-item label="开始日期：" prop="startDate">
          <el-date-picker
            v-model="couponForm.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期：" prop="expireDate">
          <el-date-picker
            v-model="couponForm.expireDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="失效日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领取方式：" prop="acquireType">
          <el-radio-group v-model="couponForm.acquireType">
            <el-radio :label="1">主动领取</el-radio>
            <el-radio :label="2">主动发放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="couponForm.remark" row="3" type="textarea"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;margin-top: 10px;" v-show='dialogType !== "查看"'>
        <el-button type="primary" @click="confirmUser" v-if="!isReadOnly">确定</el-button>
        <el-button type="danger" @click="dialogVisible = false;couponForm = {};">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 优惠券领取/发放记录 -->
    <el-dialog :visible.sync="couponRecordsVisible" :title="couponRecordsTit" width="70%">
      <coupon-records v-if="couponRecordsVisible" :couponParams="couponParams"></coupon-records>
    </el-dialog>
    <!-- 自定义接收人 -->
    <define-person v-if="defineData.defineDialog" :define-data="defineData" @defineComfirm = 'defineComfirm'></define-person>
  </div>
</template>

<script>
    import { couponsList, addCouponsList, detailCouponsList, editCouponsList, delCouponsList, expireCoupons, grantsCoupons } from '@/api/coupons'
    import Pagination from '@/components/Pagination'
    import CouponRecords from './components/CouponRecords'
    import DefinePerson from '@/views/station/components/DefinePerson'
    export default {
        name: 'coupons',
        components: {Pagination,CouponRecords,DefinePerson},
        data() {
            return {
                isReadOnly: false,
                couponsList: [],//优惠券列表
                dialogVisible: false,
                searchForm: {
                    pageNo: 1
                    , pageSize: 20,
                  acquireType: '',
                  name: ""
                },
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                couponForm: {
                  acquireType: "",
                  expireDate: "",
                  grantNum: "",
                  id: "",
                  isLimit: "",
                  limitCount: "",
                  limitMoney: "",
                  name: "",
                  parValue: "",
                  remark: "",
                  startDate: ""
                },
                formRule: {
                    name: [{required: true, message: '请输入优惠券名称', trigger: 'blur'}],
                    parValue: [{required: true, message: '请输入优惠券面值', trigger: 'blur'}],
                    limitCount: [{required: true, message: '每人限领几张', trigger: 'blur'}],
                    grantNum: [{required: true, message: '请输入发放总量', trigger: 'blur'}],
                    startDate: [{required: true, message: '请选择开始日期', trigger: 'blur'}],
                    expireDate: [{required: true, message: '请选择失效日期', trigger: 'blur'}],
                    acquireType: [{required: true, message: '请选择领取方式', trigger: 'blur'}]
                }
                ,couponRecordsVisible:false
                ,couponRecordsTit:'发放记录'
                ,couponParams:{
                    recordType:1
                    ,recordId:''
                }
                ,defineData:{
                    defineDialog:false
                }
            }
        },
        methods: {
            // 取消修改
            dialogClose() {
                this.couponForm = {
                    acquireType: "",
                    expireDate: "",
                    grantNum: "",
                    id: "",
                    isLimit: "",
                    limitCount: "",
                    limitMoney: "",
                    name: "",
                    parValue: "",
                    remark: "",
                    startDate: ""
                }
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            // 新增
            addDialog() {
                this.dialogType = '新增优惠券';
                this.isReadOnly = false;
                this.showOrHideDialog();
            },
            //查看用户
            handleView(score) {
                this.isReadOnly = true;
                detailCouponsList({id:score.row.id}).then(res => {
                    this.dialogType = '查看';
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 修改
            handleEditInfo(score) {
                this.isReadOnly = false;
                detailCouponsList({id:score.row.id}).then(res => {
                    this.dialogType = '修改优惠券';
                    this.couponForm.id = res.data.id;
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 获取列表
            getList(num) {
                if (num === 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                couponsList(this.searchForm).then(res => {
                    this.couponsList = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 查看 修改
            confirmUser() {
                this.$refs['couponForm'].validate((valid) => {
                    if (valid) {
                        if (this.dialogType === '新增优惠券') {
                            let param = {...this.couponForm};
                            delete param.id;
                            addCouponsList(param).then(res => {
                                if (res.status === 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if (this.dialogType === '修改优惠券') {
                            editCouponsList(this.couponForm).then(res => {
                                if (res.status === 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除
            handleDelete(score) {
                this.$confirm('确定要删除该优惠券吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delCouponsList({id:score.row.id}).then(res => {
                            if(res.status === 1){
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            }
                        });
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //失效
            handleUnabled(score) {
                this.$confirm('确定把该优惠券置为失效吗？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(async() => {
                    await expireCoupons({ id: score.row.id }).then(res => {
                      if (res.status === 1) {
                        this.getList();
                        this.$message({
                          type: 'success',
                          message: '已失效!'
                        })
                      }
                    });
                  })
                  .catch(err => {
                    console.error(err)
                  })
            },
            //发放
            handleGrant(score){
              this.couponForm.id = score.row.id
              this.defineData.defineDialog = true
            },
            //确定发放
            defineComfirm(data){
              grantsCoupons(this.couponForm.id,data).then(res=>{
                if(res.status == 1){
                  this.$message({
                    type:'success',
                    message:'已发放'
                  })
                  this.getList();
                }
              })
            },
            //查看/修改信息时赋值
            setDetailData(res) {
                this.couponForm = res.data;
            },
            //弹出发放/领取记录
            showRecords(data){
                this.couponParams = {
                    recordType:data.type
                    ,recordId:data.scope.row.id
                }
                this.couponRecordsTit = data.title;
                this.couponRecordsVisible = true;
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style>
</style>

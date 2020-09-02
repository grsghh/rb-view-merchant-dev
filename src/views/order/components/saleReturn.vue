<template>
  <div>
    <el-dialog
      :visible.sync="refundDialog"
      :title="comData.title"
      @close="dialogClose"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="formRule"
        label-width="120px"
        v-loading="loading"
      >
        <el-table
          style="width: 100%"
          :data="detail.orderProducts"
          :span-method="objectSpanMethod"
          border
          ref="goodTable"
          @selection-change="handleSelectionChange"
        >
          <!--        :selectable="selecttableSet"-->
          <el-table-column
            type="selection"
            v-if="comData.state == 1"
            :selectable="selecttableSet"
            width="55">
          </el-table-column>
          <el-table-column
            label="宝贝信息"
          >
            <template slot-scope="scope">
              <div class="goodInfo">
                <el-image
                  :src="scope.row.productMainImageURL">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <h2>{{scope.row.productName}}</h2>
                <p>{{scope.row.propertyName}}</p>
                <p>
                  <OrderStateTag
                    :stateData="scope.row"
                  ></OrderStateTag>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="状态"
            v-if="comData.state == 1"
          width="150">
            <template slot-scope="scope">
              <OrderStateTag
                :stateData="scope.row"
              ></OrderStateTag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单价/数量"
            v-if="comData.state == 1"
            width="150">
            <template slot-scope="scope">
              <p v-if="scope.row.totalDiscountMoney != 0.00 && scope.row.totalDiscountMoney" style="font-size: 12px;text-decoration:line-through;">原价：￥{{scope.row.beforeDiscountUnitPrice}}</p>
              ￥{{scope.row.productUnitPrice}} x {{scope.row.productNum}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="优惠"
            width="150">
            <template slot-scope="scope">-￥{{scope.row.totalDiscountMoney || '0.00'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品总价">
            <template slot-scope="scope">
              <div class="mid">
                <dl>
                  <dt>
                    ￥<span class="" style="font-size: 16px">{{scope.row.productUnitPrice}}</span>
                    <br>
                    <p style="margin: 5px 0;">x{{scope.row.productNum}}</p>
                  </dt>
                </dl>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <dl class="orderInfo">
          <template
            v-if="comData.state === 1"
          >
            <dd>
              <i v-if="detail.isCarDelivery" class="iconfont icon-songche sendcar"></i>
              <span>订单编号：</span>{{detail.orderNO}}&nbsp;&nbsp;
              <i class="el-icon-document-copy"
                 v-clipboard:copy="`${detail.orderNO}`"
                 v-clipboard:success="onCopy"></i>
              <span>下单时间：</span>{{detail.createTime}}&nbsp;&nbsp;
              <template v-if="detail.paymentTime"><span>付款时间：</span>{{detail.paymentTime}}&nbsp;&nbsp;</template>
            </dd>
            <dd>
              <span>收货地址：</span>{{detail.buyReceiveName}} {{detail.buyReceiveMobile}} {{detail.buyReceiveAddress}}<i
              class="el-icon-document-copy"
              v-clipboard:copy="`${detail.buyReceiveName},${detail.buyReceiveMobile},${detail.buyReceiveAddress}`"
              v-clipboard:success="onCopy"></i>
            </dd>
          </template>
        </dl>
        <el-form-item label="退货地址：" prop="returnAddressId" >
          <el-select v-model="form.returnAddressId" placeholder="请选择" style="width: 700px" :disabled = "comData.state != 1">
            <el-option
              v-for="item in returnAddress"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundMoney">
          <el-input class="myInput" v-model="form.refundMoney" style="width: 200px;" :disabled = "comData.state != 1"></el-input>
          <el-button type="text"
                     v-if="comData.state === 1"
                     @click="countMoney">计算应退金额</el-button>
        </el-form-item>
        <el-form-item label="退货原因：" prop="returnReasonId">
          <el-select placeholder="请选择" v-model="form.returnReasonId" :disabled = "comData.state != 1">
            <el-option
              v-for="item in returnCauseList"
              :key="item.id"
              :label="item.content"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货说明：" prop="remark">
          <el-input
            type="textarea"
            v-model="form.returnDescription"
            maxlength="255"
            rows="4"
            :disabled = "comData.state !== 1"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="退货方式：">
          <el-radio-group v-model="form.returnType" :disabled = "comData.state == 2 || comData.state == 4">
            <el-radio :label="1">快递</el-radio>
            <el-radio :label="2">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.returnType == 1">
          <el-form-item label="快递公司：" prop="logisticsId">
            <el-select
              v-model="form.logisticsId" placeholder="请选择" :disabled = "comData.state == 2 || comData.state == 4">
              <el-option
                v-for="item in logisticsList"
                :key="item.logisticsId"
                :label="item.logisticsName"
                :value="item.logisticsId">
              </el-option>
            </el-select>
            <el-button
              v-if="form.returnType === 1 && comData.state !== 1"
              size="mini"
              style="margin-left: 10px;"
              type="primary" @click="showLogisticsDialog({
                id:comData.returnApplyRecordId
                ,trackingNO:form.trackingNO
                ,logisticsName:form.logisticsName
              })">查看物流</el-button>
          </el-form-item>
          <el-form-item label="运单号：" prop="trackingNO">
            <el-input class="myInput" v-model="form.trackingNO" style="width: 200px;" :disabled = "comData.state == 2 || comData.state == 4"></el-input>
          </el-form-item>
          <el-form-item label="寄件人电话：" prop="despatchMobile">
            <el-input class="myInput" v-model="form.despatchMobile" style="width: 200px;" :disabled = "comData.state == 2 || comData.state == 4"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="退货方式说明：" v-if="form.returnType == 2">
          <el-input
            :disabled = "comData.state == 2 || comData.state == 4"
            type="textarea"
            v-model="form.returnTypeDescription"
            maxlength="255"
            rows="4"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="退货凭证：" prop="returnApplyVouchersIds">
          <el-upload
            :disabled = "comData.state !== 1"
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
      <!--    v-if="comData.state == 4"-->
      <el-form
        v-if="comData.state === 4"
        :model="auditForm"
        ref="auditFormRef"
        :rules="auditFormRule"
        label-width="120px">
        <el-form-item label="审验凭证：" prop="aduitImg">
          <el-upload
            :disabled="auditing"
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImgAudit"
            :on-remove="removeAudit"
            accept="image/*"
            :limit="5"
            multiple
            :file-list="auditImgList"
            :on-exceed="productImageExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="审验结果：">
          <el-radio-group
            :disabled="auditing"
            v-model="auditForm.auditResult">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拒绝原因："v-if="auditForm.auditResult == 2">
          <el-input
            :disabled="auditing"
            type="textarea"
            v-model="form.refuseReason"
            maxlength="255"
            rows="4"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="支付方式："v-if="auditForm.auditResult == 1">
          <el-radio-group
            :disabled="auditing"
            v-model="auditForm.paymentType">
            <el-radio :label="1">线上</el-radio>
            <el-radio :label="2">线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="线下付款方式：" prop="offlinePaymentType" v-if="auditForm.paymentType == 2">
          <el-select v-model="auditForm.offlinePaymentType" placeholder="请选择" style="width: 700px">
            <el-option
              v-for="item in offlinePaymentTypeList"
              :key="item.entryKey"
              :label="item.entryValue"
              :value="item.entryKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线下支付凭证：" prop="returnAuditVouchersIds" v-if="auditForm.paymentType == 2">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImgLine"
            :on-remove="removeLine"
            accept="image/*"
            :limit="5"
            multiple
            :file-list="offlinePayImgs"
            :on-exceed="productImageExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <template
        v-if="comData.state !== 2"
      >
        <el-button
          v-if="comData.state === 1"
          type="primary" @click="comfirm">提交申请</el-button>
        <el-button
          v-if="comData.state === 3"
          type="primary" @click="comfirmEdit">确认修改</el-button>
        <el-button
          v-if="comData.state === 4"
          type="primary" @click="comfirmAduit">提交审核</el-button>
      </template>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    申请退款弹窗-->

    <el-dialog :visible.sync="logisticsVis" title="查看物流" destroy-on-close>
      <logisticsEditor v-if="logisticsVis" :detail="logDetail"
                       @logisticsChanged="componentsDialogComfirm({dialogName:'logisticsVis'})"></logisticsEditor>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
    <!--  查看物流  -->
  </div>
</template>

<script>
    import { addressByType, frequentLogistics, dicts } from '@/api/system'
    import { returnAllList } from '@/api/refundReason'
    import {
        apiRefundApply
        ,orderDetail
        ,apiCalculationRefunds
        ,returnApply
        ,apisReturnDetail
        ,apisEditReturn
        ,apisTrackInfo
        ,returnAuditApply
    } from '@/api/order'
    import {getToken} from '@/utils/auth'
    import OrderStateTag from './OrderStateTag'
    import logisticsEditor from './logisticsEditor'
    export default {
        name: "saleReturn"
        ,props:['comData','visible']
        , components: {OrderStateTag,logisticsEditor}
        , data() {
            return {
                detail:{}
                ,form: {
                    orderId:this.comData.id
                    ,title: this.comData.title
                    , returnAddressId: ''
                    , orderProductDetailIds: ''
                    , refundApplyDescription: ''
                    , refundMoney: ''
                    , returnApplyVouchersIds: []
                    , returnReasonId: ''
                    , returnType: ''
                    , remark: ''
                    , logisticsId: ''
                    , trackingNO: ''
                    , returnTypeDescription: ''
                    , despatchMobile: ''
                }
                , auditForm: {
                    id: this.comData.returnApplyRecordId
                    ,auditResult:''
                    ,offlinePaymentType:''
                    ,offlinePaymentVouchersIds: []
                    ,paymentType:''
                    ,refuseReason:''
                    ,returnAuditVouchersIds: []
                }
                , formRule: {
                    returnAddressId: [{required: true, message: '请选择退货地址', trigger: 'change'}],
                    returnReasonId: [{required: true, message: '请选择退款原因', trigger: 'change'}],
                    refundType: [{required: true, message: '请选择退款类型', trigger: 'change'}],
                    refundMoney: [{required: true, message: '请填写退款金额', trigger: 'blur'}]
                }
                , auditFormRule: {

                }
                ,logisticsVis:false
                , returnCauseList: []
                , returnAddress: []
                ,refundDialog:this.visible
                //线下支付
                , upLoadHeader: {
                    Authorization: getToken()
                }
                , imgList: []
                , auditImgList: []
                ,loading:true
                ,multipleSelection:[]
                ,refundTypeList:[]
                ,logisticsList: [] // 快递公司
                ,offlinePaymentTypeList: [] //线下付款方式
                ,logDetail:{}
                ,offlinePayImgs:[]
                ,auditing:false
            }
        }
        , methods:{
            // 复制订单
            onCopy() {
              this.$message({
                type: 'success',
                message: '复制成功'
              })
            },
            //提交申请退货
            comfirm() {
                this.$refs['formRef'].validate((valid) => {
                    if (valid) {
                        this.form.orderProductDetailIds = [];
                        for(let i in this.multipleSelection){
                            this.form.orderProductDetailIds += `${this.multipleSelection[i].id},`;
                        }
                        this.form.orderProductDetailIds = this.form.orderProductDetailIds.substr(0,this.form.orderProductDetailIds.length - 1);
                        returnApply(this.form).then(res => {
                            if (res.status == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '申请退货成功!'
                                });
                                this.$emit('componentsDialogComfirm');
                            }
                        })
                    }
                });
            }
            // 提交审核
            ,comfirmAduit() {
                returnAuditApply(this.auditForm).then(res => {
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '审核成功!'
                        });
                        this.$emit('componentsDialogComfirm');
                    }
                })
            }
            //修改退货
            ,comfirmEdit() {
                apisEditReturn(this.form).then(res => {
                    if (res.status === 1) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.$emit('componentsDialogComfirm');
                    }
                })
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
            //获取所有退货原因
            , getAllReason() {
                returnAllList().then(res => {
                    if (res.status == 1) this.returnCauseList = res.data;
                })
            }
            //上传图片成功
            , upIdImg(res) {
                this.form.returnApplyVouchersIds.push(res.data)
            }
            // 审验凭证上传图片成功
            , upIdImgAudit(res) {
                this.auditForm.returnAuditVouchersIds.push(res.data)
            }
            // 线下支付凭证上传图片成功
            , upIdImgLine(res) {
                this.auditForm.offlinePaymentVouchersIds.push(res.data)
            }
            //删除图片
            , remove(file) {
                for (let i in this.form.returnApplyVouchersIds) {
                    if (this.form.returnApplyVouchersIds[i] == file.response.data) {
                        this.form.returnApplyVouchersIds.splice(i, 1)
                    }
                }
            }
            //删除审验凭证图片
            , removeAudit(file) {
                for (let i in this.auditForm.returnAuditVouchersIds) {
                    if (this.auditForm.returnAuditVouchersIds[i] == file.response.data) {
                        this.auditForm.returnAuditVouchersIds.splice(i, 1)
                    }
                }
            }
            //删除线下支付凭证图片
            , removeLine(file) {
                for (let i in this.auditForm.offlinePaymentVouchersIds) {
                    if (this.auditForm.offlinePaymentVouchersIds[i] == file.response.data) {
                        this.auditForm.offlinePaymentVouchersIds.splice(i, 1)
                    }
                }
            }
            //商品图片上传数量超过五张
            , productImageExceed() {
                this.$message.warning('最多只能上传五张图片');
            }
            //申请退货时的详情
            ,getOrderDetail(){
                orderDetail({id:this.comData.id}).then(res=>{
                    if(res.status === 1){
                        this.detail = res.data;
                        this.loading = false;
                    }
                })
            }
            //获取退货详情
            ,getDetail(){
                apisReturnDetail({id:this.comData.returnApplyRecordId}).then(res=>{
                    if(res.status === 1){
                        this.form = res.data;
                        this.detail.orderProducts = res.data.returnOrderProducts;
                        this.auditForm.auditResult = res.data.auditResult;
                        if(this.auditForm.auditResult)this.auditing = true;
                        this.auditForm.refuseReason = res.data.refuseReason;
                        this.auditForm.paymentType = res.data.paymentType;
                        this.auditForm.offlinePaymentType = res.data.offlinePaymentType;
                        this.auditForm.paymentType = res.data.paymentType;
                        //如果有退货凭证
                        if(res.data.returnVouchersImageUrls){
                            this.imgList = res.data.returnVouchersImageUrls.map(item => {
                                return {url:item};
                            });
                        }
                        //如果有审验凭证
                        if(res.data.auditVouchersImageUrls){
                            this.auditImgList = res.data.auditVouchersImageUrls.map(item => {
                                return {url:item};
                            });
                        }
                        this.loading = false;
                    }
                })
            }
            //计算应退金额
            ,countMoney(){
                if(!this.multipleSelection.length){
                    this.$message({
                        type: 'error',
                        message: '至少选择一件商品'
                    });
                    return;
                }
                let data = {
                    id:this.detail.id
                    ,orderProductDetailIds:[]
                };
                for(let i in this.multipleSelection){
                    data.orderProductDetailIds.push(this.multipleSelection[i].id)
                }
                apiCalculationRefunds(data).then(res=>{
                    if(res.status === 1){
                        this.form.refundMoney = res.data;
                    }
                })
            }
            , handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            //获取退货和发货地址
            , getReturnAddress() {
                //退货地址
                addressByType({type: 2}).then(res => {
                    if (res.status == 1) {
                        this.initAddress(res, 'returnAddress', 'returnAddressId');
                    }
                });
            }
            //组装地址列表
            , initAddress(res, addressName, defName) {
                /*
                * res :地址接口回调数据
                * addressName：地址select选择器绑定列表名
                * defName：默认选中的地址名
                * */
                let array = [];
                let len = res.data.length;
                for (let i = 0; i < len; i++) {
                    let aa = {};
                    aa['value'] = res.data[i].id;
                    let address = `${res.data[i].provinceName} ${res.data[i].cityName} ${res.data[i].countyName} ${res.data[i].address} ${res.data[i].linkMan} ${res.data[i].mobile}`;
                    //如果是默认
                    if (res.data[i].isDefault) {
                        aa['label'] = `(默认地址)${address}`
                        // this.deliverForm[defName] = res.data[i].id;
                        this.form[defName] = res.data[i].id;
                    } else {
                        aa['label'] = `${address}`
                    }
                    array.push(aa);
                }
                this[addressName] = array;
            }
            ,selecttableSet(row){
                return row.orderState === 3 || row.orderState === 4;
            },
            // 获取所有快递公司
            getFrequentLogistics() {
                frequentLogistics({category: 2}).then(res => {
                    if(res.status == 1) {
                        this.logisticsList = res.data;
                    }
                })
            },
            // 获得线下付款方式
            getOfflinePaymentTypeList() {
                dicts(100006).then(res => {
                    if(res.status == 1) {
                        this.offlinePaymentTypeList = res.data;
                    }
                })
            }
            //显示查看物流
            , showLogisticsDialog(item) {
                this.logDetail.id = item.id;
                this.logisticsVis = true;
                //获取物流信息
                apisTrackInfo({id: item.id}).then(res => {
                    if (res.status == 1) {
                        this.logDetail = res.data;
                        this.logDetail.noEdit = true;
                        this.logDetail.loaded = true;
                    }
                });
            }
            //table表格合并最后一行
            , objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 5) {
                    return {
                        rowspan: this.detail.orderProducts.length,
                        colspan: 1
                    };
                }
            }
        }
        ,mounted() {
            // this.getRefundTyps();
            this.getOfflinePaymentTypeList();
            this.getFrequentLogistics();
            this.getReturnAddress();
            this.getAllReason();
            //申请退货时的详情
            if(this.comData.state === 1) this.getOrderDetail();
            //查看退货/修改/审核时的详情
            if(this.comData.state !== 1) this.getDetail();
        }
    }
</script>

<style scoped lang="scss">
  .goodInfo{border: none;}
</style>

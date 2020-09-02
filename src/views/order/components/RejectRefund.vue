<template>
  <div>
    <el-dialog
      :visible.sync="refundDialog"
      title="退款申请"
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
          border
          ref="goodTable"
          @selection-change="handleSelectionChange"
        >
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55">-->
<!--          </el-table-column>-->
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
            width="100"
            label="价格数量"
            align="center"
          >
            <template slot-scope="scope">
              ￥{{scope.row.productUnitPrice}}
              <br>
              x{{scope.row.productNum}}
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="运费：">
          <span class="red">￥{{detail.orderCarriage}}</span>
        </el-form-item>
        <el-form-item label="订单总计：">
          <span class="red">￥{{detail.orderMoney}}</span>
        </el-form-item>
        <el-form-item label="买家昵称：">
          {{detail.buyAccountNickname}} <el-link type="primary" :underline="false">{{detail.buyMobile}}</el-link>
        </el-form-item>
        <el-form-item label="收货地址：">
          {{detail.buyReceiveAddress}}
        </el-form-item>
        <el-form-item label="退款金额：" prop="">
          {{detail.refundMoney}}
        </el-form-item>
        <el-form-item label="退款原因：" prop="">
          {{detail.refundReasonContent}}
          <el-button type="text" @click="showImgsDialog = true" v-if="detail.refundApplyImageURLs && detail.refundApplyImageURLs.length">查看凭证</el-button>
        </el-form-item>
        <el-form-item label="退款说明：" prop="refundApplyDescription">
          {{detail.refundApplyDescription}}
        </el-form-item>
<!--        <el-form-item label="实退金额：" prop="realRefundMoney" v-if="!comData.isReject">-->
<!--          <el-input-->
<!--            v-model="form.realRefundMoney"-->
<!--            style="width: 200px;"-->
<!--          ></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="拒绝说明：" prop="refuseDescription" v-if="comData.isReject">
          <el-input
            type="textarea"
            v-model="form.refuseDescription"
            maxlength="200"
            rows="4"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="退款方式：" prop="paymentType" v-if="!comData.isReject">
          <el-radio-group v-model="form.paymentType"
            :disabled="comData.refundState !== 1"
          >
            <el-radio :label="1" >线上</el-radio>
            <el-radio :label="2" >线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="线上支付状态："v-if="detail.onlinePaymentState">
          {{detail.onlinePaymentState | getOnlinePayStateName}}
        </el-form-item>
        <template
          v-if="form.paymentType === 2"
        >
          <el-form-item label="线下退款方式：" prop="refundPaymentType">
            <el-radio-group v-model="form.refundPaymentType">
              <el-radio :label="n.entryKey" v-for="n in refundTypeList" :key="n.entryKey">{{n.entryValue}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款凭证：" prop="refundAuditVouchersIds">
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
        </template>
      </el-form>
      <div
        v-if="comData.refundState"
        style="text-align:right;">
        <template
          v-if="comData.refundState === 3"
        >
          <el-button type="primary" @click="rePay">重新支付</el-button>
          <el-button type="success" @click="manualPayDialog = true">人工支付</el-button>
        </template>
        <template
          v-if="comData.refundState === 1"
        >
          <el-button type="primary" @click="comfirm" v-if="!comData.isReject">退款</el-button>
          <el-button type="primary" @click="comfirm" v-else>拒绝</el-button>
        </template>
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
    <!--    申请退款弹窗-->
    <el-dialog
      title="凭证"
      :visible.sync="showImgsDialog"
    >
      <el-image
        v-for="item in detail.refundApplyImageURLs"
        style="width: 100px; height: 100px;margin-right: 15px;"
        :src="item"
        :key="item"
        :preview-src-list="detail.refundApplyImageURLs"
        ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showImgsDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="人工支付方式" :visible.sync="manualPayDialog" destroy-on-close>
      <el-form
        :model="form"
        ref="formRef"
        :rules="formRule"
        label-width="120px"
      >
        <el-form-item label="退款方式：" prop="refundPaymentType">
          <el-radio-group v-model="form.refundPaymentType">
            <el-radio :label="n.entryKey" v-for="n in refundTypeList" :key="n.entryKey">{{n.entryValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款凭证：" prop="refundAuditVouchersIds">
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
      <div
        style="text-align:right;">
        <el-button type="primary" @click="comfirmToManualPay" >确定</el-button>
        <el-button type="danger" @click="manualPayDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        apiAuditPass
        ,apiRefunds
        ,apiAuditRefuse
        ,apiRepay
        ,apiManualPay
    } from '@/api/order'
    import {getToken} from '@/utils/auth'
    import {dicts} from '@/api/system'
    import OrderStateTag from './OrderStateTag'
    export default {
        name: "RejectRefund"
        ,props:['comData','visible']
        , components: {OrderStateTag}
        , data() {
            return {
                detail:{}
                ,form: {
                     refuseDescription: ''
                    // , realRefundMoney: ''
                    , refundAuditVouchersIds: []
                    , id: ''
                    ,paymentType:1
                    ,refundPaymentType:''
                }
                , formRule: {
                    // refundApplyDescription: [{required: true, message: '请输入退款原因', trigger: 'blur'}],
                    // refundMoney: [{required: true, message: '请填写退款金额', trigger: 'blur'}]
                }
                , reasonList: []
                ,refundDialog:this.visible
                //线下支付
                , upLoadHeader: {
                    Authorization: getToken()
                }
                , imgList: []
                ,loading:true
                ,multipleSelection:[]
                ,showImgsDialog:false
                ,refundTypeList:[]
                ,manualPayDialog:false
            }
        }
        , methods: {
            //确认退款/拒绝
            comfirm() {
                let successTxt = '';
                let toDo = ()=>{
                    this.$message({
                        type: 'success',
                        message: successTxt
                    });
                    this.$emit('componentsDialogComfirm');
                };
                //拒绝退款
                if(this.comData.isReject){
                    successTxt = '拒绝退款成功'
                    apiAuditRefuse(this.form).then(res => {
                        if (res.status == 1) {
                            toDo();
                        }
                    });
                }else{
                    //确认退款
                    successTxt = '退款成功';
                    apiAuditPass(this.form).then(res => {
                        if (res.status == 1) {
                            toDo();
                        }
                    });
                }
            }
            //重新支付
            , rePay() {
                apiRepay({id:this.form.id}).then(res=>{
                    if(res.status === 1){
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.$emit('componentsDialogComfirm');
                    }
                })
            }
            //确定人工支付
            ,comfirmToManualPay(){
                apiManualPay(this.form).then(res=>{
                    if(res.status === 1){
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.$emit('componentsDialogComfirm');
                    }
                })
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
            //上传图片成功
            , upIdImg(res) {
                this.form.refundAuditVouchersIds.push(res.data)
            }
            //删除图片
            , remove(file) {
                for (let i in this.form.refundAuditVouchersIds) {
                    if (this.form.refundAuditVouchersIds[i] == file.response.data) {
                        this.form.refundAuditVouchersIds.splice(i, 1)
                    }
                }
            }
            //商品图片上传数量超过五张
            , productImageExceed() {
                this.$message.warning('最多只能上传五张图片');
            }
            ,getDetail(){
                apiRefunds({id:this.comData.id,refundState:this.comData.refundState}).then(res=>{
                    if(res.status === 1){
                        this.detail = res.data;
                        this.form.id = res.data.id;
                        // this.form.realRefundMoney = res.data.refundMoney;
                        this.loading = false;
                    }
                })
            }
            ,handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            //获取退款类型
            ,getRefundTyps(){
                dicts('100015').then(res=>{
                    if(res.status === 1){
                        this.refundTypeList = res.data.map(item =>{
                            item.entryKey -= 0;
                            return item;
                        });
                    }
                })
            }
        }
        ,mounted() {
            this.getRefundTyps();
            this.getDetail();
        }
    }
</script>

<style scoped lang="scss">
  .goodInfo{border: none;}
</style>

<template>
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
        <el-table-column
          type="selection"
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
      <el-form-item label="退款金额：" prop="refundMoney">
        <el-input class="myInput" v-model="form.refundMoney" style="width: 200px;"></el-input>
        <el-button type="text" @click="countMoney">计算应退金额</el-button>
      </el-form-item>
      <el-form-item label="退款原因：" prop="refundReasonId">
        <el-select placeholder="请选择" v-model="form.refundReasonId">
          <el-option
            v-for="item in reasonList"
            :key="item.id"
            :label="item.content"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="退款类型：" prop="refundType">-->
<!--        <el-radio-group v-model="form.refundType">-->
<!--          <el-radio v-for="item in refundTypeList" :label="item.entryKey" :key="item.entryKey">{{item.entryValue}}</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <el-form-item label="退款说明：" prop="refundApplyDescription">
        <el-input
          type="textarea"
          v-model="form.refundApplyDescription"
          maxlength="200"
          rows="4"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="申请凭证：" prop="refundApplyVouchersIds">
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
      <el-button type="primary" @click="comfirm">确定</el-button>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    申请退款弹窗-->
</template>

<script>
    import { getAllRefund } from '@/api/refundReason'
    import {
        apiRefundApply
        ,orderDetail
        ,apiCalculationRefunds
    } from '@/api/order'
    import {getToken} from '@/utils/auth'
    import {dicts} from '@/api/system'
    import OrderStateTag from './OrderStateTag'
    export default {
        name: "RefundEditor"
        ,props:['comData','visible']
        , components: {OrderStateTag}
        , data() {
            return {
                detail:{}
                ,form: {
                    orderId:this.comData.id
                    , orderProductDetailIds: ''
                    , refundApplyDescription: ''
                    , refundMoney: ''
                    , refundApplyVouchersIds: []
                    , refundReasonId: ''
                }
                , formRule: {
                    refundReasonId: [{required: true, message: '请选择退款原因', trigger: 'change'}],
                    refundType: [{required: true, message: '请选择退款类型', trigger: 'change'}],
                    refundMoney: [{required: true, message: '请填写退款金额', trigger: 'blur'}]
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
                ,refundTypeList:[]
            }
        }
        , methods: {
            //确认
            comfirm() {
                this.$refs['formRef'].validate((valid) => {
                    if (valid) {
                        this.form.orderProductDetailIds = [];
                        for(let i in this.multipleSelection){
                            this.form.orderProductDetailIds += `${this.multipleSelection[i].id},`;
                        }
                        this.form.orderProductDetailIds = this.form.orderProductDetailIds.substr(0,this.form.orderProductDetailIds.length - 1);
                        apiRefundApply(this.form).then(res => {
                            if (res.status == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '申请退款成功!'
                                });
                                this.$emit('componentsDialogComfirm');
                            }
                        })
                    }
                });
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
            //获取所有退款原因
            , getAllReason() {
                getAllRefund().then(res => {
                    if (res.status == 1) this.reasonList = res.data;
                })
            }
            //上传图片成功
            , upIdImg(res) {
                this.form.refundApplyVouchersIds.push(res.data)
            }
            //删除图片
            , remove(file) {
                for (let i in this.form.refundApplyVouchersIds) {
                    if (this.form.refundApplyVouchersIds[i] == file.response.data) {
                        this.form.refundApplyVouchersIds.splice(i, 1)
                    }
                }
            }
            //商品图片上传数量超过五张
            , productImageExceed() {
                this.$message.warning('最多只能上传五张图片');
            }
            ,getDetail(){
                orderDetail({id:this.comData.id}).then(res=>{
                    if(res.status === 1){
                        this.detail = res.data;
                        this.$refs.goodTable.toggleAllSelection();
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
            ,
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            //获取退款类型
            // ,getRefundTyps(){
            //     dicts('100014').then(res=>{
            //         if(res.status === 1){
            //             this.refundTypeList = res.data;
            //         }
            //     })
            // }
            ,selecttableSet(row){
                return row.orderState === 2 ;
            }
        }
        ,mounted() {
            // this.getRefundTyps();
            this.getAllReason();
            this.getDetail();
        }
    }
</script>

<style scoped lang="scss">
  .goodInfo{border: none;}
</style>

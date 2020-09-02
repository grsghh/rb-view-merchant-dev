<template>
  <el-dialog :visible.sync="offlinePayDialog" title="线下付款" @close="dialogClose" destroy-on-close>
    <el-form
      :model="offlinePayForm"
      ref="offlinePayFormRef"
      :rules="offlinePayFormRule"
      label-width="120px"
    >
      <el-form-item label="订单金额：" prop="orderMoney">
        {{offlinePayForm.orderMoney}}
      </el-form-item>
      <el-form-item
        v-if="!offlinePayData.isGroup"
        label="运费：" prop="discountMoney">
        {{offlinePayForm.orderCarriage}}
      </el-form-item>
      <el-form-item label="实收金额：" :prop="offlinePayData.isGroup ? '' : 'realOrderMoney'">
        <el-input
          v-if="!offlinePayData.isGroup"
          class="myInput" v-model="offlinePayForm.realOrderMoney"></el-input>
        <template
          v-else
        >
          {{offlinePayForm.orderMoney}}
        </template>
      </el-form-item>
      <el-form-item label="付款方式：" prop="offlinePaymentType">
        <el-radio-group v-model="offlinePayForm.offlinePaymentType">
          <el-radio :label="n.entryKey" v-for="n in payType" :key="n.entryKey">{{n.entryValue}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="转账凭证：" prop="">
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
      <el-button type="primary" @click="comfirmToOfflinePay">确定</el-button>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    线下付款弹窗-->
</template>

<script>
    import {dicts} from '@/api/system'
    import {
        offlinePay
        ,groupOfflinePay
    } from '@/api/order'
    import {getToken} from '@/utils/auth'
    export default {
        name: "offlinePay"
        ,props:['offlinePayData','visible']
        , data() {
            return {
                offlinePayForm: {
                    id:this.offlinePayData.id || this.offlinePayData.groupId
                    , orderCarriage: this.offlinePayData.orderCarriage
                    , orderMoney: this.offlinePayData.orderMoney || this.offlinePayData.totalMoney
                    , realOrderMoney: this.offlinePayData.orderMoney
                    , offlinePaymentType: ''
                    , vouchersIds: []
                }
                , offlinePayFormRule: {
                    offlinePaymentType: [{required: true, message: '请选择付款方式', trigger: 'change'}],
                    realOrderMoney: [{required: true, message: '请填写实收金额', trigger: 'blur'}]
                }
                , payType: []
                ,offlinePayDialog:this.visible
                //线下支付
                , upLoadHeader: {
                    Authorization: getToken()
                }
                , imgList: []
            }
        }
        , methods: {
            //确认线下付款
            comfirmToOfflinePay() {
                let toDo = () => {
                    this.$message({
                        type: 'success',
                        message: '线下付款成功!'
                    });
                    this.$emit('componentsDialogComfirm');
                };
                this.$refs['offlinePayFormRef'].validate((valid) => {
                    if (valid) {
                        let param = {...this.offlinePayForm};
                        delete param.orderMoney;
                        delete param.orderCarriage;
                        //非订单组
                        if(!this.offlinePayData.isGroup){
                            offlinePay(param).then(res => {
                                if (res.status === 1) {
                                    toDo();
                                }
                            })
                        }else{
                            groupOfflinePay(param).then(res => {
                                if (res.status === 1) {
                                    toDo();
                                }
                            })
                        }
                    }
                });
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
            //获取线下支付方式
            , getPayType() {
                dicts('100006').then(res => {
                    if (res.status == 1) this.payType = res.data;
                })
            }
            //上传图片成功
            , upIdImg(res) {
                this.offlinePayForm.vouchersIds.push(res.data)
            }
            //删除图片
            , remove(file) {
                for (let i in this.offlinePayForm.vouchersIds) {
                    if (this.offlinePayForm.vouchersIds[i] == file.response.data) {
                        this.offlinePayForm.vouchersIds.splice(i, 1)
                    }
                }
            }
            //商品图片上传数量超过五张
            , productImageExceed() {
                this.$message.warning('最多只能上传五张图片');
            }
        }
        ,mounted() {
            this.getPayType();
        }
    }
</script>

<style scoped>

</style>

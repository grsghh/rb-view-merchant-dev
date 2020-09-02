<template>
  <el-dialog :visible.sync="deliverDialog" title="去发货" @close="dialogClose" destroy-on-close>
    <el-form
      :model="deliverForm"
      ref="deliverFormRef"
      :rules="deliverFormRule"
      label-width="120px"
    >
      <dl class="goodsList">
        <dt>宝贝信息</dt>
        <dd v-for="(pro,i) in deliverGoods" :key="i">
          <div class="goodInfo">
            <el-image
              :src="pro.productMainImageURL">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <h2>{{pro.productName}}</h2>
            <div class="count">数量：{{pro.productNum}}</div>
            <p>{{pro.propertyName}}</p>
            <OrderStateTag
              v-if="pro.orderState !== 0"
              :stateData="pro"
            ></OrderStateTag>
          </div>
          <el-divider></el-divider>
        </dd>
        <dd>收货地址：{{deliverGetAdd}}</dd>
      </dl>
      <el-form-item label="选择物流方式：" prop="despatchMode">
        <el-radio-group v-model="deliverForm.despatchMode">
          <el-radio :label="n.entryKey" v-for="n in deliverTypes" :key="n.entryKey" @change="deliverTypesChange">
            {{n.entryValue}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="showCompany">
        <el-form-item :label="`选择${logisticsTxt}公司：`" prop="logisticsId">
          <el-select v-model="deliverForm.logisticsId" placeholder="请选择">
            <el-option
              v-for="item in company"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${logisticsTxt}单号：`" prop="trackingNO">
          <el-input v-model="deliverForm.trackingNO" placeholder="" style="width: 200px"/>
        </el-form-item>
      </template>
      <el-divider></el-divider>
      <el-form-item label="选择发货地址：" prop="sellDespatchAddressId">
        <el-select v-model="deliverForm.sellDespatchAddressId" placeholder="请选择" style="width: 700px">
          <el-option
            v-for="item in deliverAddress"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择退货地址：" prop="sellReturnAddressId">
        <el-select v-model="deliverForm.sellReturnAddressId" placeholder="请选择" style="width: 700px">
          <el-option
            v-for="item in returnAddress"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="comfirmToDeliver">发货</el-button>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    发货弹窗-->
</template>

<script>
    import {dicts, frequentLogistics, addressByType} from '@/api/system'
    import {
        despatch
    } from '@/api/order'
    import OrderStateTag from './OrderStateTag'
    export default {
        name: "deliver"
        ,props:['deliverData','visible']
        , components: {OrderStateTag}
        , data() {
            return {
                deliverForm: {
                    id:this.deliverData.orderId
                    , despatchMode: '3'
                    , logisticsId: ''
                    , sellDespatchAddressId: ''
                    , sellReturnAddressId: ''
                    , trackingNO: ''
                }
                , deliverTypes: []
                , deliverFormRule: {
                    despatchMode: [{required: true, message: '请选择物流方式', trigger: 'change'}],
                    sellDespatchAddressId: [{required: true, message: '请选择发货地址', trigger: 'change'}],
                    sellReturnAddressId: [{required: true, message: '请选择退货地址', trigger: 'change'}],
                    deliveryType: [{required: true, message: '请选择发货方式', trigger: 'change'}]
                }
                , company: []
                , deliverAddress: []
                , returnAddress: []
                , logisticsTxt: '快递'
                , showCompany: true
                , deliverGoods: this.deliverData.items
                , deliverGetAdd: this.deliverData.buyReceiveAddress
                ,deliverDialog:this.visible
            }
        }
        , methods: {
            //获取退货和发货地址
            getReturnAddress() {
                //退货地址
                addressByType({type: 2}).then(res => {
                    if (res.status == 1) {
                        this.initAddress(res, 'returnAddress', 'sellReturnAddressId');
                    }
                });
                //发货地址
                addressByType({type: 3}).then(res => {
                    if (res.status == 1) {
                        this.initAddress(res, 'deliverAddress', 'sellDespatchAddressId');
                    }
                })
            }
            //查询快递公司
            , getCompany(category = 2) {
                frequentLogistics({category}).then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['label'] = res.data[i].logisticsName;
                            aa['value'] = res.data[i].logisticsId;
                            array.push(aa);
                        }
                        this.company = array;
                    }
                })
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
                        this.deliverForm[defName] = res.data[i].id;
                    } else {
                        aa['label'] = `${address}`
                    }
                    array.push(aa);
                }
                this[addressName] = array;
            }
            //物流方式切换
            , deliverTypesChange() {
                //快递
                if (this.deliverForm.despatchMode == '3') {
                    this.getCompany(2)
                    this.showCompany = true;
                    this.logisticsTxt = '快递';
                    this.deliverForm.logisticsId = '';
                    return;
                }
                //物流
                if (this.deliverForm.despatchMode == '4') {
                    this.getCompany(1)
                    this.showCompany = true;
                    this.logisticsTxt = '物流';
                    this.deliverForm.logisticsId = '';
                    return;
                }
                this.deliverForm.logisticsId = '';
                this.showCompany = false;
            }
            //获取物流方式字典
            , getDeliverType() {
                dicts('100007').then(res => {
                    if (res.status == 1) this.deliverTypes = res.data;
                })
            }
            //确认发货
            , comfirmToDeliver() {
                this.$refs['deliverFormRef'].validate((valid) => {
                    if (valid) {
                        despatch(this.deliverForm).then(res => {
                            if (res.status == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '发货成功!'
                                });
                                this.$emit('deliverSuccess');
                            }
                        })
                    }
                });
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
        }
        ,mounted() {
            this.getDeliverType();
            this.getCompany();
            this.getReturnAddress();
        }
    }
</script>

<style scoped>
  .goodInfo /deep/ .state {
    padding-top: 5px;
  }
</style>

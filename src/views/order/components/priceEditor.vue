<template>
  <el-dialog :visible.sync="priceDialog" title="修改价格" @close="dialogClose" destroy-on-close>
    <el-form
      :model="priceForm"
      label-width="120px"
    >

      <div class="goodItem-title">
        <ol>
          <li>单号 {{detailData.orderNO}}
          </li>
          <li>成交时间 {{detailData.createTime}}</li>
        </ol>
        <span class="state fr"
              :class="{'base-red':detailData.orderState == 1,'base-blue':detailData.orderState == 3
              ,'base-org':detailData.orderState == 2 ,'base-gray':detailData.orderState == 0 || detailData.orderState == 5
              ,'base-green':detailData.orderState == 4}">{{detailData.orderState | getStateName}}
        </span>
      </div>
      <!--      title-->
      <el-table
        :data="detailData.orderProductVOs"
        :show-header="false"
        border
        class="r-table"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="商品信息"
          width="400"
        >
          <template slot-scope="scope">
            <div class="goodInfo">
              <el-image :src="scope.row.productMainImageURL"></el-image>
              <h2>{{scope.row.productName}}</h2>
              <p>零售价：<span class="red">{{scope.row.retailPrice}}</span></p>
              <p>代理价：<span class="red">{{scope.row.productAgentPrice}}</span></p>
            </div>
            <!--            goodInfo-->
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="单价"
          width="250"
        >
          <template slot-scope="scope">
            <el-form-item label="销售单价：" prop="trackingNO">
              <el-input @blur="blur" min="0" v-model="priceForm.productPriceUpdateParams[scope.$index].productUnitPrice" placeholder="" style="width: 100px"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="单价x数量">
          <template slot-scope="scope">
            ￥{{priceForm.productPriceUpdateParams[scope.$index].productUnitPrice}}x{{scope.row.productNum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="小计">
          <template slot-scope="scope">
            小计：
            <p><span class="red">￥{{priceForm.productPriceUpdateParams[scope.$index].productUnitPrice * scope.row.productNum}}</span></p>
          </template>
        </el-table-column>
      </el-table>
      <p>收货地址：{{detailData.buyReceiveAddress}}</p>
      <el-form-item label="运费：" prop="trackingNO">
        <el-input min="0" v-model="priceForm.orderCarriage" placeholder="" style="width: 100px" :disabled="isBaoYou"/>
        <el-checkbox v-model="isBaoYou" style="margin-left: 10px" @change="checkboxChange">包邮</el-checkbox>
      </el-form-item>
      <el-form-item label="订单合计：" prop="trackingNO">
        {{allMoney}}
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="toComfirm">确定</el-button>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    发货弹窗-->
</template>

<script>
    import {
        apiPricesInfo,apiPricesChange
    } from '@/api/order'
    export default {
        name: "priceEditor"
        ,props:['priceData','visible']
        , data() {
            return {
                priceForm: {
                    id:this.priceData.id
                    ,orderCarriage:0
                    ,productPriceUpdateParams:[]
                }
                ,priceDialog:this.visible
                ,detailData:{}
                ,isBaoYou:false
            }
        }
        , methods: {
            getData() {
                apiPricesInfo({id:this.priceData.id}).then(res => {
                    if (res.status == 1) {
                        this.detailData = res.data;
                        this.priceForm.orderCarriage = res.data.orderCarriage - 0;
                        if(this.priceForm.orderCarriage === 0) this.isBaoYou = true;
                        for(let i in res.data.orderProductVOs){
                            this.priceForm.productPriceUpdateParams.push(
                                {id:res.data.orderProductVOs[i].id,productUnitPrice:res.data.orderProductVOs[i].productUnitPrice}
                            )
                        }
                    }
                })
            }
            //物流方式切换
            , deliverTypesChange() {
                this.priceForm.logisticsId = '';
            },
            //失去焦点
            blur(){
              if(this.priceForm.productPriceUpdateParams[0].productUnitPrice < this.detailData.orderProductVOs[0].productAgentPrice){
                this.$message({
                  type:'error',
                  message:'销售单价不能低于代理价！'
                })
              }
            }
            //确认
            , toComfirm() {
                if(this.priceForm.productPriceUpdateParams[0].productUnitPrice < this.detailData.orderProductVOs[0].productAgentPrice){
                  this.$message({
                    type:'error',
                    message:'销售单价不能低于代理价！'
                  })
                  return
                }
                apiPricesChange(this.priceForm).then(res => {
                      if (res.status == 1) {
                          this.$message({
                              type: 'success',
                              message: '改价成功!'
                          });
                          this.$emit('componentsDialogComfirm');
                      }
                  })
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
            ,checkboxChange(){
                if(this.isBaoYou) this.priceForm.orderCarriage = 0;
            }
        }
        ,mounted() {
            this.getData();
        }
        , filters: {
            getStateName(v) {
                switch (v) {
                    case 0:
                        return '已关闭';
                    case 1:
                        return '待付款';
                    case 2:
                        return '待发货';
                    case 3:
                        return '待收货';
                    case 4:
                        return '已收货';
                    case 5:
                        return '退货中';
                }
            }
        }
        ,computed:{
            allMoney(){
                let money = 0;
                let form = this.priceForm.productPriceUpdateParams;
                for(let i in form){
                    money += form[i].productUnitPrice * this.detailData.orderProductVOs[i].productNum;

                }
                money += this.priceForm.orderCarriage - 0;
                return money;
            }
        }
    }
</script>

<style scoped lang="scss">
  .goodItem-title{justify-content: space-between;padding-right: 20px;}
  .goodInfo{width: auto;border: none;}
  .r-table{
    td{text-align: center;}
  }
  /deep/ .el-table__row{
    td{text-align: center;}
    td:first-child{text-align: left;}
  }
  .red{color: #ff6d6d;font-weight: bold;font-size: 20px;}
</style>

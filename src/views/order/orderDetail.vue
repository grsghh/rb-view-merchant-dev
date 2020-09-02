<template>
  <div class="orderDetail">
    <div class="contentBox">
      <div class="queryContent">
        <el-page-header @back="$router.back()" content="订单详情"></el-page-header>
        <h1>
          订单状态：
          <OrderStateTag
            v-if="detail.orderState !== 0"
            :stateData="detail"
          ></OrderStateTag>
          <span class="state base-gray"
                v-else
          >{{detail.closeReasonType | getCloseReasonValue}}</span>
        </h1>
        <el-divider></el-divider>
        <dl>
          <dd style="margin-bottom: 10px;">买家备注：<span class="red">{{detail.buyRemark}}</span></dd>
          <dd>卖家备注：
            <i class="el-icon-s-flag"
               v-if="detail.sellRemarkLevel"
               :class="{
          'icon-gray':detail.sellRemarkLevel === 1
          ,'icon-red':detail.sellRemarkLevel === 2
          ,'icon-org':detail.sellRemarkLevel === 3
          ,'icon-green':detail.sellRemarkLevel === 4
          ,'icon-blue':detail.sellRemarkLevel === 5
          ,'icon-purple':detail.sellRemarkLevel === 6}"></i>
            <span class="red">{{detail.sellRemark}}</span>
            <i class="el-icon-edit"
               @click="toRemark({id:detail.id,sellRemark:detail.sellRemark,sellRemarkLevel:detail.sellRemarkLevel})"
               v-if="detail.orderState === 2 || detail.orderState === 1 || detail.orderState === 3"></i>
          </dd>
        </dl>
        <el-divider></el-divider>
        <div class="btns" v-if="!$route.query.isGroup">
          <el-button size="small" type="primary" @click="cancelOrder({orderId:detail.id})"
                     v-if="detail.orderState === 1">取消订单
          </el-button>
          <el-button size="small" type="primary" @click="toOfflinePay(detail)" v-if="detail.orderState === 1">线下付款
          </el-button>
          <el-button size="small" type="primary" @click="showBuilding" v-if="detail.orderState === 3">延时收货</el-button>
          <el-button size="small" type="primary"
                     @click="toDeliver({orderId:detail.id,items:detail.orderProducts,buyReceiveAddress:detail.buyReceiveAddress})"
                     v-if="detail.orderState === 2">去发货
          </el-button>
          <el-button size="small" type="primary" @click="showBuilding" v-if="detail.orderState === 2">去打单</el-button>
        </div>
        <!--        btns-->
        <h2>订单信息：</h2>
        <el-divider></el-divider>
        <h3>买家：
          <el-image
            :src="detail.buyAccountAvatar" class="avatar">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          {{detail.buyAccountNickname}}&nbsp;&nbsp;联系电话：{{detail.buyMobile}}&nbsp;&nbsp;代理：{{detail.agentName}}&nbsp;&nbsp;
        </h3>
        <div class="goodItem">
          <el-table
            :data="detail.orderProducts"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 10px">
            <el-table-column
              align="center"
              label="宝贝信息">
              <template slot-scope="scope">
                <div class="goodInfo">
                  <el-image
                    :src="scope.row.productMainImageURL">
                  </el-image>
                  <h2>{{scope.row.productName}}</h2>
                  <p>{{scope.row.propertyName}}</p>
                  <span class="link"
                        @click="changeOrderProperty({id:detail.id,productId:scope.row.productId,rowId:scope.row.id})"
                        v-if="detail.orderState === 1 || detail.orderState === 2 && scope.row.propertyName">[修改订单属性]</span>
                </div>
                <!--            goodInfo-->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="状态">
              <template slot-scope="scope">
                <OrderStateTag
                  :stateData="scope.row"
                ></OrderStateTag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="单价/数量">
              <template slot-scope="scope">
                <p v-if="scope.row.totalDiscountMoney != 0.00 && scope.row.totalDiscountMoney" style="font-size: 12px;text-decoration:line-through;">原价：￥{{scope.row.beforeDiscountUnitPrice}}</p>
                ￥{{scope.row.productUnitPrice}} x {{scope.row.productNum}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="优惠">
              <template slot-scope="scope">-￥{{scope.row.totalDiscountMoney || '0.00'}}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="商品总价">
              <template slot-scope="scope">
                <div class="mid">
                  <dl>
                    <dt>
                      ￥<b class="red" style="font-size: 18px">{{detail.orderMoney}}</b>
                      <br>
                      <p style="margin: 10px 0;">(含运费：{{detail.orderCarriage}})</p>
                    </dt>
                  </dl>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="count" v-if="detail.orderProducts">共{{detail? 1 : '--'}}单，{{proNum}}件商品 实收款：
            <template v-if="detail.realOrderMoney">
              ￥<b class="red">{{detail.realOrderMoney}}</b>
            </template>
            <template v-else>
              --
            </template>
          </div>
        </div>
        <!--        goodItem-->
        <dl class="orderInfo">
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
        </dl>
        <el-divider></el-divider>
        <div class="bottom">
          <ul class="fl">
            <li v-if="detail.paymentType">
              <span>付款方式：</span>{{detail.paymentType | getPayType}}
            </li>
            <li>
              <span>订单日志：</span>
              <ol>
                <li v-for="(n,i) in detail.orderLogs" :key="i">
                  {{n.operateTime}}&nbsp;&nbsp;{{n.description}}
                </li>
              </ol>
            </li>
            <li v-if="detail.afterSalesLogs && detail.afterSalesLogs.length">
              <span>协商历史：</span>
              <ol>
                <li v-for="(n,i) in detail.afterSalesLogs" :key="i">
                  {{n.operateTime}}&nbsp;&nbsp;{{n.description}}
                </li>
              </ol>
            </li>
          </ul>
          <div class="fr" style="position: relative;">
            <li
              v-show="detail.despatchMode"
            >
              <span>物流方式：</span>{{detail.despatchMode | getDespatchMode}}
              <i v-if="detail.despatchMode >= 3 || detail.despatchMode > 2" class="el-icon-view"
                 @click="showOrHideDialog('logisticsVis')"></i>
            </li>
          </div>
        </div>
        <!--        bottom-->
      </div>
    </div>
    <el-dialog :visible.sync="remarkDialog" title="修改备注/旗帜" @close="dialogClose" destroy-on-close>
      <el-form
        :model="remarkForm"
        label-width="100px"
      >
        <el-form-item label="旗帜：">
          <el-radio-group v-model="remarkForm.sellRemarkLevel">
            <el-radio v-for="(item,index) in flags" :label="index + 1" :key="index"><i class="el-icon-s-flag"
                                                                                       :class="[item]"></i></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="常用备注：">
          <el-select v-model="normalRemarkList" placeholder="请选择备注短语" clearable @change="norRemarkChange">
            <el-option
              v-for="item in normalRemarkList"
              :key="item.id"
              :value="item.content">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="$router.push('/system/useRemark')">设置常用</el-button>
        </el-form-item>
        <el-form-item label="卖家备注：">
          <el-input
            type="textarea"
            maxlength="200"
            rows="2"
            show-word-limit
            placeholder="请输入内容"
            v-model="remarkForm.sellRemark">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="remarkForm.autoSaveOperator">自动添加备注人</el-checkbox>
          <el-checkbox v-model="remarkForm.autoSaveOperateTime">自动添加备注时间</el-checkbox>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="comfirmToRemark">确定</el-button>
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
    <!--    备注弹窗-->
    <el-dialog :visible.sync="logisticsVis" title="查看物流" destroy-on-close>
      <logisticsEditor v-if="logisticsVis" :detail="detail"
                       @logisticsChanged="componentsDialogComfirm({dialogName:'logisticsVis'})"></logisticsEditor>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
    <!--  查看物流  -->

    <deliver v-if="deliverDialog" :deliverData="deliverData" :visible="deliverDialog"
             @componentsClose="deliverDialog = false;"
             @deliverSuccess="componentsDialogComfirm({dialogName:'deliverDialog'})"></deliver>
    <!--    去发货组件-->
    <offlinePay v-if="offlinePayDialog" :offlinePayData="offlinePayData" :visible="offlinePayDialog"
                @componentsClose="offlinePayDialog = false;"
                @componentsDialogComfirm="componentsDialogComfirm({dialogName:'offlinePayDialog'})"></offlinePay>
    <!--    线下付款-->
    <propertyEditor v-if="orderPropertyDialog" :propertyData="propertyData" :visible="orderPropertyDialog"
                    @componentsClose="orderPropertyDialog = false;"
                    @componentsDialogComfirm="componentsDialogComfirm({dialogName:'orderPropertyDialog'})"></propertyEditor>
    <!--    修改订单商品属性-->
  </div>
</template>

<script>
    import {dicts} from '@/api/system'
    import {
        closeOrder,
        remark,
        orderDetail
        , apiNormalList
    } from '@/api/order'
    import logisticsEditor from './components/logisticsEditor'
    import deliver from './components/deliver'
    import offlinePay from './components/offlinePay'
    import propertyEditor from './components/propertyEditor'
    import OrderStateTag from './components/OrderStateTag'

    let _this = '';
    export default {
        name: "orderDetail"
        , components: {logisticsEditor, deliver,offlinePay,propertyEditor,OrderStateTag}
        , data() {
            return {
                //去发货
                deliverDialog: false
                , offlinePayDialog: false
                , showAllLogInfo: false
                , disabled: false
                //备注
                , flags: ['icon-gray', 'icon-red', 'icon-org', 'icon-green', 'icon-blue', 'icon-purple',]
                , remarkDialog: false
                , remarkForm: {
                    id: ''
                    , sellRemark: ''
                    , sellRemarkLevel: ''
                    , autoSaveOperateTime: false
                    , autoSaveOperator: false
                }
                , detail: {}
                , proNum: 0
                , normalRemarkList: []
                , nowNormalRemark: ''
                , logisticsVis: false
                , deliverData: {}
                , offlinePayData: {}
                , propertyData: {}
                ,orderPropertyDialog:false
            }
        }
        , methods: {
            showBuilding() {
                this.$message('正在开发中');
            }
            , onCopy() {
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
            //去发货
            , toDeliver(param) {
                this.deliverData = param;
                this.showOrHideDialog('deliverDialog');
            }
            //去线下付款
            , toOfflinePay(param) {
                this.offlinePayData = param;
                this.showOrHideDialog('offlinePayDialog');
            }
            //去备注
            , toRemark(param) {
                this.remarkForm.id = param.id;
                this.remarkForm.sellRemark = param.sellRemark || '';
                this.remarkForm.sellRemarkLevel = param.sellRemarkLevel || '';
                this.showOrHideDialog('remarkDialog');
            }
            , showOrHideDialog(dialogName) {
                this[dialogName] = !this[dialogName];
            }
            , dialogClose() {
                this.logisticsVis = this.remarkDialog = false;
                this.remarkForm = {
                    id: ''
                    , orderIds: []
                    , sellRemark: ''
                    , sellRemarkLevel: ''
                    , autoSaveOperateTime: false
                    , autoSaveOperator: false
                };
            }
            ,changeOrderProperty(param){
                this.propertyData = param;
                this.showOrHideDialog('orderPropertyDialog');
            }
            //获取线下支付方式
            , getPayType() {
                dicts('100006').then(res => {
                    if (res.status === 1) this.payType = res.data;
                })
            }
            //取消订单
            , cancelOrder(param) {
                this.$confirm('确定取消订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await closeOrder({id: param.orderId}).then(res => {
                        if (res.status === 1) {
                            this.getData();
                            this.$message({
                                type: 'success',
                                message: '取消成功!'
                            });
                        }
                    });
                }).catch(() => {
                });
            }
            //确认备注
            , comfirmToRemark() {
                remark(this.remarkForm).then(res => {
                    if (res.status === 1) {
                        this.$message({
                            type: 'success',
                            message: '备注成功!'
                        });
                        this.getData();
                        this.showOrHideDialog('remarkDialog');
                    }
                })
            }
            , getData() {
                orderDetail({id: this.$route.query.id}).then(res => {
                    if (res.status === 1) {
                        this.detail = res.data;
                        this.detail.loaded = true;
                        this.countProNum();
                    }
                })
            }
            //table表格合并最后一行
            , objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 4) {
                    return {
                        rowspan: this.detail.orderProducts.length,
                        colspan: 1
                    };
                }
            }
            //计算商品数量
            , countProNum() {
                this.proNum = 0;
                for (let i in this.detail.orderProducts) {
                    this.proNum += this.detail.orderProducts[i].productNum;
                }
            }
            //获取常用备注列表
            , getNormalRemark() {
                apiNormalList().then(res => {
                    if (res.status === 1) {
                        this.normalRemarkList = res.data;
                    }
                });
            }
            , norRemarkChange(v) {
                this.remarkForm.sellRemark = v;
            }
            //发货/修改物流等弹窗子组件保存成功
            , componentsDialogComfirm(data) {
                this[data.dialogName] = false;
                this.getData();
            }
        }
        , created() {
            _this = this;
            this.getData();
            this.getNormalRemark();
        }
        , filters: {
             getPayType(v) {
                switch (v) {
                    case 1:
                        return '线上';
                    case 2:
                        return '线下';
                }
            }
            , getDespatchMode(v) {
                for (let i in _this.deliverTypes) {
                    if (_this.deliverTypes[i].entryKey === v) {
                        return _this.deliverTypes[i].entryValue;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
  .orderDetail {
    .half {
      height: 35px;
    }

    .showBtn {
      border: 1px solid #DCDFE6;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      cursor: pointer;
      display: inline-block;
      margin-top: 5px !important;
    }

    background: #e3e3e3;
    min-height: 100%;

    .goodInfo, .goodItem {
      border: none;
    }

    .org {
      color: #E6A23C
    }

    .red {
      color: #F56C6C
    }
    .sendcar{color: #ff4949;font-size: 18px;}
    .queryContent {
      margin-top: 0;

      & > h1 {
        display: flex;
        align-items: center;
        font-weight: normal;
        font-size: 14px;
        margin-top: 10px;

        button {
          margin-right: 10px;
        }
      }

      & > dl:not(.goodsList) {
        dd {
          font-size: 14px;
        }
      }

      .btns {
        display: flex;
        justify-content: center;
      }

      & > h2 {
        font-size: 16px;
        margin-top: 15px;
      }

      & > h3 {
        font-size: 14px;
        font-weight: normal;
      }

      .count {
        text-align: right;
        margin-top: 20px;

        b {
          font-size: 18px;
        }
      }

      .orderInfo {
        dd {
          margin-bottom: 10px;
        }

        span {
          color: #999;
        }
      }

      .bottom {
        display: flex;
        overflow: hidden;

        .fl, .fr {
          width: 50%;
          font-size: 14px;

          & > li {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;

            span {
              width: 80px;
              margin-left: 20px;
            }

            span:first-child {
              margin-left: 0;
            }

            dt {
              margin-bottom: 5px;
            }

            dd {
              margin: 0;
            }

            dl {
              margin-top: 0;
            }
          }

          ol {
            width: 80%;
            padding: 0;
          }
        }
      }
    }
  }
</style>

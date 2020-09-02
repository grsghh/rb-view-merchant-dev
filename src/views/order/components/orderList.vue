<template>
  <div class="orderList">
    <div class="top">
      <el-checkbox
        v-model="allChecked"
        @change="selectAll"
        style="margin: 0 10px;"
      >
      </el-checkbox>
      <el-button
        type="primary"
        size="mini"
        @click="childEduce()"
      >导出
      </el-button>
      <el-button
        v-if="searchForm.orderState === '7'"
        type="success"
        size="mini"
        @click="mutiRefund()"
      >批量退款
      </el-button>
      <el-button
        v-if="searchForm.orderState === '2'
        || searchForm.orderState === '1'
        || searchForm.orderState === '3'
        || searchForm.orderState === ''
        || searchForm.orderState === 'group'
        "
        type="primary"
        size="mini"
        @click="mutiSetRemark()"
      >批量备注
      </el-button>
      <el-button
        v-if="searchForm.orderState === '7'"
        type="danger"
        size="mini"
        @click="mutiReject()"
      >批量拒绝
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="showBuilding()"
      >批量发送消息
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="showBuilding()"
      >批量发送短信
      </el-button>
    </div>
    <div class="goodItem group"
         v-if="groupList"
         v-for="item in groupList" :key="item.groupId"
    >
      <template
        v-for="(orderItem,orderIndex) in item.orders"
      >
        <div class="title">
          <div class="selection">
            <el-checkbox v-model="orderItem.checked" :true-label="orderItem.orderId" false-label=""
                         @change="checkAllCheckedState"></el-checkbox>
          </div>
          <span class="state"
                v-if="orderItem.orderState !== 0"
                :class="{
              'base-red':orderItem.orderState === 1
              ,'base-blue':orderItem.orderState === 3
              ,'base-org':orderItem.orderState === 2
              ,'base-gray':orderItem.orderState === 0 || orderItem.orderState === 5 || orderItem.orderState === 7 || orderItem.orderState === 9
              ,'base-green':orderItem.orderState === 4 || orderItem.orderState === 10
              }"
          >{{orderItem.orderState | getStateName}}</span>
          <span class="state base-gray"
                v-else
          >{{orderItem.closeReasonType | getCloseReasonValue}}</span>
          <ol>
            <li>
              <el-image
                :src="orderItem.buyAccountAvatar" class="avatar">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              {{orderItem.buyAccountNickname}}
            </li>
            <li>
              单号 {{orderItem.orderNO}}
              <i class="el-icon-document-copy"
                 v-clipboard:copy="`${orderItem.orderNO}`"
                 v-clipboard:success="onCopy"></i>
            </li>
            <li>成交时间 {{orderItem.createTime}}</li>
          </ol>
        </div>
        <!--      title-->
        <div class="top">
          <ul class="left">
            <li v-for="(pro,proIndex) in orderItem.orderProducts" :key="proIndex">
              <div class="goodInfo">
                <el-image
                  :src="pro.productMainImageURL">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <h2>{{pro.productName}}</h2>
                <p>{{pro.propertyName}}</p>
                <span class="link"
                      @click="changeOrderProperty({id:orderItem.orderId,productId:pro.productId,rowId:pro.id})"
                      v-if="orderItem.orderState == 1 || orderItem.orderState == 2 && pro.propertyName">[修改订单属性]</span>
                <br>
                <br>
                <OrderStateTag
                  v-if="pro.orderState !== 0"
                  :stateData="pro"
                ></OrderStateTag>
                <span class="base-gray" v-else>{{orderItem.closeReasonType | getCloseReasonValue}}</span>
              </div>
              <div class="count">
                ￥{{pro.productUnitPrice}} x {{pro.productNum}}
              </div>
              <!--            goodInfo-->
            </li>
          </ul>
          <!--          left-->
          <div class="mid">
            <dl>
              <dt>
                <h2 class="h2"><span>供货商：</span>{{orderItem.supplierName}}</h2>
                订单总价：￥<b class="red" style="font-size: 18px">{{orderItem.orderMoney}}</b>
                <br>
                实付金额：
                <template v-if="orderItem.realOrderMoney">
                  ￥<b class="red" style="font-size: 18px">{{orderItem.realOrderMoney}}</b>
                </template>
                <template v-else>
                  --
                </template>
                <p style="margin: 10px 0;">(含运费：{{orderItem.orderCarriage}})</p>
              </dt>
              <dd>
                <span class="link" @click="$router.push(`/order/orderDetail?id=${orderItem.orderId}&isGroup=1`)">[订单详情]</span>
              </dd>
            </dl>
          </div>
          <!--          mid-->
          <div class="right"></div>
          <!--          right-->
        </div>
        <!--        top-->
        <div class="bottom">
          <h3 class="red">买家备注：{{orderItem.buyRemark}} </h3>
          <h3>卖家备注：
            <i class="el-icon-s-flag"
               v-if="orderItem.sellRemarkLevel"
               :class="{
          'icon-gray':orderItem.sellRemarkLevel == 1
          ,'icon-red':orderItem.sellRemarkLevel == 2
          ,'icon-org':orderItem.sellRemarkLevel == 3
          ,'icon-green':orderItem.sellRemarkLevel == 4
          ,'icon-blue':orderItem.sellRemarkLevel == 5
          ,'icon-purple':orderItem.sellRemarkLevel == 6}"></i>
            {{orderItem.sellRemark}}
            <i class="el-icon-edit"
               @click="toRemark({id:orderItem.orderId,sellRemarkLevel:orderItem.sellRemarkLevel,sellRemark:orderItem.sellRemark})"
               v-if="orderItem.orderState == 2 || orderItem.orderState == 1 || orderItem.orderState == 3"></i>
          </h3>
        </div>
      </template>
      <div class="rightContent bgw">
        <h2 class="h2"><span>共</span>{{item.totalProductNum}}<span>件</span></h2>
        <h2 class="h2"><span>总计：</span>{{item.totalMoney}}</h2>
        <h2 class="h2"><span>优惠：</span>{{item.couponsPrice || '--'}}</h2>
        <div class="btns">
          <el-button size="small" type="primary" @click="cancelOrder({id:item.groupId,isGroup:1})">
            取消订单
          </el-button>
          <el-button size="small" type="primary" @click="toOfflinePay({isGroup:1,...item})">线下付款</el-button>
        </div>
      </div>
      <!--          right-->
      <div class="bottom">
        <p>收货地址：{{item.buyReceiveName}} {{item.buyReceiveMobile}} {{item.buyReceiveAddress}}
          <i class="el-icon-document-copy"
             v-clipboard:copy="`${item.buyReceiveName},${item.buyReceiveMobile},${item.buyReceiveAddress}`"
             v-clipboard:success="onCopy"></i>
        </p>
      </div>
    </div>
<!--    订单组列表-->
    <div class="goodItem"
         v-if="list.rows"
         v-for="(item,index) in list.rows" :key="index">
      <div class="title">
        <div class="selection">
          <el-checkbox v-model="item.checked" :true-label="item.id" false-label=""
                       @change="checkAllCheckedState"></el-checkbox>
        </div>
        <OrderStateTag
          v-if="item.orderState !== 0"
          :stateData="item"
        ></OrderStateTag>
        <span class="state base-gray"
              v-else
        >{{item.closeReasonType | getCloseReasonValue}}</span>
        <ol>
          <li>
            <el-image
              :src="item.buyAccountAvatar" class="avatar">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            {{item.buyAccountNickname}}
          </li>
          <li class="send" v-if="item.isExport"><p>导</p></li>
          <li class="send" v-if="item.isCarDelivery"><i class="iconfont icon-songche sendcar"></i></li>
          <li class="send" v-if="item.isRefund"><i class="iconfont icon-tui3 sendcar"></i></li>
          <li>
            单号 {{item.orderNO}}
            <i class="el-icon-document-copy"
               v-clipboard:copy="`${item.orderNO}`"
               v-clipboard:success="onCopy"></i>
          </li>
          <li>成交时间 {{item.createTime}}</li>
        </ol>
      </div>
      <!--      title-->
      <div class="top">
        <ul class="left">
          <li v-for="(pro,proIndex) in item.orderProducts" :key="proIndex">
            <div class="goodInfo">
              <el-image
                :src="pro.productMainImageURL">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <h2>{{pro.productName}}</h2>
              <p>{{pro.propertyName}}</p>
              <span class="link"
                    @click="changeOrderProperty({id:item.id,productId:pro.productId,rowId:pro.id})"
                    v-if="item.orderState == 1 || item.orderState == 2 && pro.propertyName">[修改订单属性]</span>
              <br>
              <br>
              <OrderStateTag
                v-if="pro.orderState !== 0"
                :stateData="pro"
              ></OrderStateTag>
              <span class="base-gray" v-else>{{item.closeReasonType | getCloseReasonValue}}</span>
            </div>
            <div class="count">
              ￥{{pro.productUnitPrice}} x {{pro.productNum}}
            </div>
            <!--            goodInfo-->
          </li>
        </ul>
        <!--          left-->
        <div class="mid">
          <dl>
            <dt>
              订单总价：￥<b class="red" style="font-size: 18px">{{item.orderMoney}}</b>
              <br>
              实付金额：
                <template v-if="item.realOrderMoney">
                  ￥<b class="red" style="font-size: 18px">{{item.realOrderMoney}}</b>
                </template>
                <template v-else>
                  --
                </template>
              <p style="margin: 10px 0;">(含运费：{{item.orderCarriage}})</p>
            </dt>
            <dd>
              <span class="link" @click="$router.push(`/order/orderDetail?id=${item.id}`)">[订单详情]</span>
              <template v-if="item.orderState >= 3 && item.despatchMode > 2">
                <br>
                <br>
                <span class="link org"
                      @click="showLogisticsDialog({id:item.id,type:1})">[查看物流]</span>
                <span class="link org"
                      v-if="item.returnTrackingNO"
                      @click="showLogisticsDialog({
                        id:item.returnApplyRecordId,type:2
                        ,trackingNO:item.returnTrackingNO
                        ,logisticsId:item.returnLogisticsId
                      })">[查看退货物流]</span>
              </template>
            </dd>
          </dl>
        </div>
        <!--          mid-->
        <div class="right">
          <h2 class="h2"><span>供货商：</span>{{item.supplierName}}</h2>
          <div class="btns">
            <el-button size="small" type="warning" @click="changePrice({id:item.id})" v-if="item.orderState == 1">
              改价
            </el-button>
            <el-button size="small" type="primary" @click="cancelOrder({id:item.id})" v-if="item.orderState == 1">
              取消订单
            </el-button>
            <el-button size="small" type="primary" @click="toOfflinePay(item)" v-if="item.orderState == 1">线下付款
            </el-button>
            <el-button size="small" type="primary" @click="toSaleReturn({
              id: item.id, returnApplyRecordId:item.returnApplyRecordId,title: '退货申请', state: 1
            })" v-if="searchForm.orderState === '3' || item.ifCanReturn">退货申请</el-button>
<!--            <el-button size="small" type="primary" @click="showBuilding" v-if="item.orderState == 3">延时收货</el-button>-->
            <template
              v-if="item.orderState == 2 && !item.refundState"
            >
              <el-button size="small" type="primary"
                         @click="toDeliver({orderId:item.id,items:item.orderProducts,buyReceiveAddress:item.buyReceiveAddress})"
              >去发货
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="toRefund({
                  id:item.id
                })"
              >
                退款申请
              </el-button>
            </template>
            <el-button
              v-if="item.refundState === 2 || item.refundState === 3"
              size="small"
              type="success"
              @click="toRejectRefund({id:item.id,refundState:item.refundState})"
            >
              查看详情
            </el-button>
            <template v-if="searchForm.orderState === '5'">
              <el-button
                size="small"
                type="success"
                @click="toSaleReturn({
                  id: item.id,returnApplyRecordId:item.returnApplyRecordId, title: '查看退货详情', state: 2
                })"
              >
                查看详情
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="toSaleReturn({
                  id: item.id,returnApplyRecordId:item.returnApplyRecordId,  title: '修改退货申请', state: 3
                })"
              >
                修改
              </el-button>
              <el-button
                v-if="item.returnType"
                size="small"
                type="primary"
                @click="toSaleReturn({
                  id: item.id,returnApplyRecordId:item.returnApplyRecordId,  title: '退货审验', state: 4
                })"
              >
                审核
              </el-button>
            </template>
            <template v-if="item.refundState === 1">
              <el-button
                size="small"
                type="success"
                @click="toRejectRefund({id:item.id,refundState:item.refundState})"
              >
                退款处理
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="toRejectRefund({id:item.id,isReject:1,refundState:item.refundState})"
              >
                拒绝申请
              </el-button>
            </template>
          </div>
        </div>
        <!--          right-->
      </div>
      <!--        top-->
      <div class="bottom">
        <h3 class="red">买家备注：{{item.buyRemark}} </h3>
        <h3>卖家备注：
          <i class="el-icon-s-flag"
             v-if="item.sellRemarkLevel"
             :class="{
          'icon-gray':item.sellRemarkLevel == 1
          ,'icon-red':item.sellRemarkLevel == 2
          ,'icon-org':item.sellRemarkLevel == 3
          ,'icon-green':item.sellRemarkLevel == 4
          ,'icon-blue':item.sellRemarkLevel == 5
          ,'icon-purple':item.sellRemarkLevel == 6}"></i>
          {{item.sellRemark}}
          <i class="el-icon-edit"
             @click="toRemark({id:item.id,sellRemarkLevel:item.sellRemarkLevel,sellRemark:item.sellRemark})"
             v-if="item.orderState == 2 || item.orderState == 1 || item.orderState == 3"></i>
        </h3>
        <p>收货地址：{{item.buyReceiveName}} {{item.buyReceiveMobile}} {{item.buyReceiveAddress}}
          <i class="el-icon-document-copy"
             v-clipboard:copy="`${item.buyReceiveName},${item.buyReceiveMobile},${item.buyReceiveAddress}`"
             v-clipboard:success="onCopy"></i>
          <i class="el-icon-edit" @click="editRecive(item)"
             v-if="item.orderState == 2"></i>
        </p>
      </div>
    </div>
<!--    普通订单列表-->
    <pagination
      v-if="list && list.total > 0"
      :total="list.total"
      :page.sync="searchForm.pageNo"
      :limit.sync="searchForm.pageSize"
      @pagination="changeList"
    />
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
          <el-select v-model="nowNormalRemark" placeholder="请选择备注短语" clearable @change="norRemarkChange">
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
            rows="4"
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
    <el-dialog :visible.sync="rejectDialog" title="批量拒绝" @close="dialogClose" destroy-on-close>
      <el-form
        :model="rejectForm"
        label-width="100px"
      >
        <el-form-item label="拒绝说明：">
          <el-input
            type="textarea"
            maxlength="200"
            rows="4"
            show-word-limit
            placeholder=""
            v-model="rejectForm.refuseDescription">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="comfirmToReject">确定</el-button>
        <el-button type="danger" @click="rejectDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量拒绝-->
    <el-dialog :visible.sync="mutiRefundDialog" title="批量退款" @close="dialogClose" destroy-on-close>
      <el-form
        :model="refundForm"
        label-width="100px"
        :rules="{
           refundPaymentType: [{required: true, message: '请选择退款退款方式', trigger: 'change'}]
        }"
        ref="refundFormRef"
      >
        <el-form-item label="退款方式：" prop="refundPaymentType">
          <el-radio-group v-model="refundForm.refundPaymentType">
            <el-radio :label="n.entryKey" v-for="n in refundTypeList" :key="n.entryKey">{{n.entryValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="comfirmToMutiRefund">确定</el-button>
        <el-button type="danger" @click="mutiRefundDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    批量退款-->
    <receiveInfosEditor v-if="receiveInfosDialog" :visible="receiveInfosDialog" :receiveInfos="receiveInfos"
                        @receiveConfirm="receiveConfirm" @receiveClose="receiveClose"></receiveInfosEditor>
    <!--    更改收货地址弹窗组件-->
    <el-dialog
      :visible.sync="logisticsVis"
      title="查看物流"
      destroy-on-close
      @close="detail = {}"
    >
      <logisticsEditor
        v-if="logisticsVis"
        :detail="detail"
        @logisticsChanged="componentsDialogComfirm({dialogName:'logisticsVis'})"
      ></logisticsEditor>
      <div style="text-align:right;">
        <el-button type="danger" @click="logisticsVis = false">关闭</el-button>
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
    <priceEditor v-if="priceDialog" :priceData="priceData" :visible="priceDialog"
                 @componentsClose="priceDialog = false;"
                 @componentsDialogComfirm="componentsDialogComfirm({dialogName:'priceDialog'})"></priceEditor>
    <!--    修改订单商品价格-->
    <RefundEditor v-if="refundDialog" :com-data="refundData" :visible="refundDialog"
                  @componentsClose="refundDialog = false;"
                  @componentsDialogComfirm="componentsDialogComfirm({dialogName:'refundDialog'})"></RefundEditor>
    <!--    申请退款-->
    <rejectRefund v-if="rejectRefundDialog" :com-data="rejectRefundData" :visible="rejectRefundDialog"
                  @componentsClose="rejectRefundDialog = false;"
                  @componentsDialogComfirm="componentsDialogComfirm({dialogName:'rejectRefundDialog'})"></rejectRefund>
    <!--    申请退货-->
    <saleReturn v-if="saleReturnDialog" :com-data="saleReturnData" :visible="saleReturnDialog"
                  @componentsClose="saleReturnDialog = false;"
                  @componentsDialogComfirm="componentsDialogComfirm({dialogName:'saleReturnDialog'})"></saleReturn>

    <!--    退款处理/拒绝-->
  </div>
</template>

<script>
    import {
        remark,
        mutiRemark
        , apiKuaidi
        , apiMutiRefuse
        , apiMutiPass
        , adminCloseOrder
        , closeOrderGroup
        , apisTrackInfo
    } from '@/api/order'
    import {dicts} from '@/api/system'
    import Pagination from '@/components/Pagination'
    import receiveInfosEditor from './receiveInfosEditor'
    import logisticsEditor from './logisticsEditor'
    import deliver from './deliver'
    import offlinePay from './offlinePay'
    import RefundEditor from './RefundEditor'
    import RejectRefund from './RejectRefund'
    import propertyEditor from './propertyEditor'
    import priceEditor from './priceEditor'
    import OrderStateTag from './OrderStateTag'
    import saleReturn from './saleReturn'

    export default {
        name: "orderList"
        , components: {
            Pagination
            , receiveInfosEditor
            , logisticsEditor
            , deliver
            , offlinePay
            , propertyEditor
            , priceEditor
            , RefundEditor
            , RejectRefund
            , OrderStateTag
            , saleReturn
        }
        , props: {
            list: {
                type: Object
            }
            , groupList: {
                type: Array
            }
            , searchForm: {
                type: Object
            }
            , normalRemarkList: {
                type: Array
            }
        }
        , data() {
            return {
                //去发货
                deliverDialog: false
                , flags: ['icon-gray', 'icon-red', 'icon-org', 'icon-green', 'icon-blue', 'icon-purple',]
                , disabled: false
                , offlinePayDialog: false
                , saleReturnDialog: false
                //修改订单属性
                , orderPropertyDialog: false
                //修改价格
                , priceDialog: false
                //备注
                , remarkDialog: false
                , remarkForm: {
                    id: ''
                    , orderIds: []
                    , sellRemark: ''
                    , sellRemarkLevel: ''
                    , autoSaveOperateTime: false
                    , autoSaveOperator: false
                }
                , nowNormalRemark: ''
                , receiveInfosDialog: false
                , receiveInfos: {}
                , logisticsVis: false
                , detail: {}
                , allChecked: false
                , deliverData: {}
                , offlinePayData: {}
                , saleReturnData: {}
                , propertyData: {}
                , priceData: {}
                , refundDialog: false
                , refundData: {}
                , rejectDialog: false
                , rejectRefundData: {}
                , rejectRefundDialog: false
                , rejectForm: {
                    refuseDescription: ''
                    , orderProductDetailIds: []
                }
                , refundForm: {
                    orderProductDetailIds: []
                    , refundPaymentType: ''
                }
                , refundTypeList: []
                , mutiRefundDialog: false
            }
        }
        , methods: {
            // 导出
            childEduce() {
                this.$emit('emitEduce', this.searchForm)
            },
            //页码切换
            changeList() {
                //向订单列表聚合页传递表单查询对象
                this.$emit('changeOrderList', this.searchForm)
                this.allChecked = false;
            }
            , showBuilding() {
                this.$message('正在开发中');
            }
            //去发货
            , toDeliver(param) {
                this.deliverData = param;
                this.showOrHideDialog('deliverDialog');
            }
            //去改价
            , changePrice(param) {
                this.priceData = param;
                this.showOrHideDialog('priceDialog');
            }
            //去线下付款
            , toOfflinePay(param) {
                this.offlinePayData = param;
                this.showOrHideDialog('offlinePayDialog');
            }
            // 退货申请
            ,toSaleReturn(param) {
                this.saleReturnData = param;
                this.showOrHideDialog('saleReturnDialog');
            }
            //去退款
            , toRefund(param) {
                this.refundData = param;
                this.showOrHideDialog('refundDialog');
            }
            //退款处理/拒绝
            , toRejectRefund(param) {
                this.rejectRefundData = param;
                this.showOrHideDialog('rejectRefundDialog');
            }
            //去备注
            , toRemark(param) {
                this.remarkForm.id = param.id;
                this.remarkForm.sellRemarkLevel = param.sellRemarkLevel || '';
                this.remarkForm.sellRemark = param.sellRemark || '';
                this.showOrHideDialog('remarkDialog');
            }
            , showOrHideDialog(dialogName) {
                this[dialogName] = !this[dialogName];
            }
            , dialogClose() {
                this.remarkDialog = false;
                this.remarkForm = {
                    id: ''
                    , orderIds: []
                    , sellRemark: ''
                    , sellRemarkLevel: ''
                    , autoSaveOperateTime: false
                    , autoSaveOperator: false
                };
                this.nowNormalRemark = '';
                this.refundForm = {
                    orderProductDetailIds: []
                    , refundPaymentType: ''
                }
            }
            , changeOrderProperty(param) {
                this.propertyData = param;
                this.showOrHideDialog('orderPropertyDialog');
            }
            //取消订单
            , cancelOrder(param) {
                let toDo = () =>{
                    this.changeList();
                    this.$message({
                        type: 'success',
                        message: '取消成功!'
                    });
                };
                this.$prompt('请输入取消原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async ({value}) => {
                    let data = {
                        id: param.id
                        , closeRemark: value
                    };
                    //如果是订单组
                    if(param.isGroup){
                        await closeOrderGroup(data).then(res => {
                            if (res.status === 1) {
                                toDo();
                            }
                        });
                    }else{
                        await adminCloseOrder(data).then(res => {
                            if (res.status === 1) {
                                toDo();
                            }
                        });
                    }
                }).catch(() => {
                });
            }
            //确认备注
            , comfirmToRemark() {
                //批量备注，需要组装id
                if (!this.remarkForm.id) {
                    this.remarkForm.orderIds = this.initSelectedIds();
                    mutiRemark(this.remarkForm).then(res => {
                        if (res.status == 1) {
                            toDo()
                        }
                    })
                } else {
                    //单独添加备注
                    remark(this.remarkForm).then(res => {
                        if (res.status == 1) {
                            toDo()
                        }
                    })
                }
                let toDo = () => {
                    this.$message({
                        type: 'success',
                        message: '备注成功!'
                    });
                    this.changeList();
                    this.showOrHideDialog('remarkDialog');
                    this.allChecked = false;
                }
            }
            //批量拒绝退款
            , comfirmToReject() {
                this.rejectForm.orderProductDetailIds = this.initSelectedRefundProductsIds();
                apiMutiRefuse(this.rejectForm).then(res => {
                    if (res.status === 1) {
                        this.showOrHideDialog('rejectDialog')
                        this.changeList();
                        this.$message({
                            type: 'success',
                            message: '批量拒绝退款成功!'
                        });
                    }
                })
            }
            , onCopy() {
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
            //批量设置备注
            , mutiSetRemark() {
                if (this.verifyRecordCheckedState()) {
                    this.showOrHideDialog('remarkDialog');
                    return;
                }
                this.$message({
                    type: 'error',
                    message: '至少选择一条订单'
                })
            }
            //批量退款
            , mutiRefund() {
                if (!this.verifyRecordCheckedState()) {
                    this.$message({
                        type: 'error',
                        message: '至少选择一条订单'
                    })
                    return;
                }
                this.showOrHideDialog('mutiRefundDialog');
            }
            //确认批量退款
            , comfirmToMutiRefund() {
                this.$refs['refundFormRef'].validate((valid) => {
                    if (valid) {
                        this.refundForm.orderProductDetailIds = this.initSelectedRefundProductsIds();
                        apiMutiPass(this.refundForm).then(res => {
                            if (res.status === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '批量退款成功!'
                                });
                                this.changeList();
                            }
                        });
                    }
                });
            }
            //批量拒绝退款
            , mutiReject() {
                if (this.verifyRecordCheckedState()) {
                    this.showOrHideDialog('rejectDialog');
                    return;
                }
                this.$message({
                    type: 'error',
                    message: '至少选择一条订单'
                })
            }
            //验证列表中是否有选中的记录
            , verifyRecordCheckedState() {
                let bool = false;
                for (let i in this.list.rows) {
                    //只要有一条记录被选中，就返回true
                    if (this.list.rows[i].checked) {
                        bool = true;
                    }
                }
                //如果有订单组
                if(this.groupList.length){
                    this.groupList.map(item => item.orders.map(order =>{
                        if (order.checked) {
                            bool = true;
                        }
                    }));
                }
                return bool;
            }
            , norRemarkChange(v) {
                this.remarkForm.sellRemark = v;
            }
            //显示查看物流
            , showLogisticsDialog(item) {
                this.detail.id = item.id;
                this.showOrHideDialog('logisticsVis');
                //查询退货物流
                if(item.type == 2){
                    apisTrackInfo({id: item.id}).then(res => {
                        if (res.status == 1) {
                            this.detail = res.data;
                            this.detail.noEdit = true;
                            this.detail.loaded = true;
                        }
                    });
                    return;
                }
                //获取物流信息
                apiKuaidi({id: item.id}).then(res => {
                    if (res.status == 1) {
                        this.detail = res.data;
                        this.detail.loaded = true;
                    }
                });
            }
            //弹出修改地址
            , editRecive(receiveInfos) {
                let data = {...receiveInfos};
                data.buyReceiveAddress = data.buyReceiveAddress.split(' ');
                this.receiveInfos = data;
                this.showOrHideDialog('receiveInfosDialog');
            }
            //确认修改收货地址
            , receiveConfirm() {
                this.changeList();
            }
            //确认修改收货地址关闭
            , receiveClose() {
                this.receiveInfosDialog = false;
            }
            //全选
            , selectAll() {
                if (this.allChecked) {
                    for (let i in this.list.rows) {
                        this.list.rows[i].checked = this.list.rows[i].id;
                    }
                    if(this.groupList.length){
                        this.groupList.map(item => item.orders.map(order =>{
                            order.checked =  order.orderId;
                        }));
                    }
                } else {
                    for (let i in this.list.rows) {
                        this.list.rows[i].checked = '';
                    }
                    if(this.groupList.length){
                        this.groupList.map(item => item.orders.map(order =>{
                            order.checked = '';
                        }));
                    }
                }
            }
            //检查全选状态
            , checkAllCheckedState() {
                let count = 0;
                let groupLength = 0;
                let listLength = this.list.rows ? this.list.rows.length: 0;
                for (let i in this.list.rows) {
                    //只要有一条记录被选中，就返回true
                    if (this.list.rows[i].checked) {
                        count++;
                    }
                }
                this.groupList.map(item => item.orders.map(order =>{
                    groupLength ++;
                    if(order.checked) count ++;
                }));
                this.allChecked = count === listLength + groupLength;
            }
            //发货/修改物流等弹窗子组件保存成功
            , componentsDialogComfirm(data) {
                this[data.dialogName] = false;
                this.allChecked = false;
                this.changeList();
            }
            //获取选中的订单id，并返回数组
            , initSelectedIds() {
                let arr = [];
                for (let i in this.list.rows) {
                    if (this.list.rows[i].checked) arr.push(this.list.rows[i].checked);
                }
                if(this.groupList.length){
                    this.groupList.map(item => item.orders.map(order =>{
                        if(order.checked) arr.push(order.checked);
                    }));
                }
                return arr;
            }
            //因为订单列表选中按钮选中的是订单id，而批量退款需要的是商品id，所以遍历订单列表取已经是退款中状态的商品id
            ,initSelectedRefundProductsIds(){
                let orderIds = this.initSelectedIds()
                    , lists = this.list.rows
                    ,arr = [];
                for (let i in orderIds) {
                    for (let j in lists) {
                        if (orderIds[i] === lists[j].id) {
                            for (let k in lists[j].orderProducts) {
                                if (lists[j].orderProducts[k].orderState === 7) arr.push(lists[j].orderProducts[k].id);
                            }
                        }
                    }
                }
                return arr;
            }
            //获取退款类型
            , getRefundTypes() {
                dicts('100015').then(res => {
                    if (res.status === 1) {
                        this.refundTypeList = res.data;
                    }
                })
            }
        }
        , mounted() {
            this.getRefundTypes();
        }
    }
</script>

<style scoped lang="scss">
  $borderColor: #EBEEF5;
  .selection {
    margin-right: 10px;
  }

  .orderList {
    .count {
      width: 20%;
      padding: 10px;
      font-size: 14px;
      text-align: center;
    }

    .org {
      color: #E6A23C
    }

    .red {
      color: #F56C6C
    }

    /*.select{width: 300px;}*/
    .goodItem {
      margin-top: 10px;
    }

    .goodItem:first-child {
      margin-top: 0;
    }

    .send {
      p{
        border: 1px solid #E6A23C;
        color: #E6A23C;
        margin: 0;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        position: absolute;
        left: -20px;
        top: -7px;
        font-weight: 600;
      }
      .sendcar {
        position: absolute;
        left: -20px;
        top: -7px;
        color: #ff4949;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .goodsList {
      dd {
        .goodInfo {
          border: none;
        }

        .el-divider--horizontal {
          margin-top: 0;
        }
      }
    }

    .el-dialog {
      .count {
        width: 100%;
        text-align: left;
      }
    }
  }

</style>

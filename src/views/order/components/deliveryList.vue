<template>
    <div class="deiveryList">
      <div class="top">
        <el-button type="primary" size="mini" @click="childEduce()">导出</el-button>
<!--        <el-button type="primary" size="mini" @click="selectAll">全选</el-button>-->
        <el-button type="primary" v-if="state == 2" size="mini" @click="batchDelivery()">批量发货</el-button>
        <el-button type="primary" v-if="state == 3" size="mini" @click="develop">批量打快递单</el-button>
      </div>
      <div class="table">
        <el-table border :data="list.rows" style="width: 100%" height="500" @expand-change="rowClick">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="买家信息" width="160">
            <template slot-scope="scope">
              <p style="color:#1890ff;">{{scope.row.buyAccountNickname}}</p>
              <p>{{scope.row.buyMobile}}</p>
              <p>{{scope.row.createTime}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供货商">
            <template slot-scope="scope">{{ scope.row.supplierName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="件数" width="60">
            <template slot-scope="scope">{{ scope.row.productNum || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="收件人">
            <template slot-scope="scope">{{ scope.row.buyReceiveName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="收件地址">
            <template slot-scope="scope">{{ scope.row.buyReceiveAddress || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="运单号">
            <template slot-scope="scope">{{ scope.row.trackingNO || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="快递公司">
            <template slot-scope="scope">
              <p><el-button size="mini" type="primary" @click="develop">打单</el-button></p>
              <p><el-button size="mini" type="warning" @click="develop">发货单</el-button></p>
              <p><el-button size="mini" v-if="scope.row.orderState == 2" type="danger" @click="toDeliver(scope)">发货</el-button></p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="买家备注">
            <template slot-scope="scope">{{ scope.row.buyRemark || '-'}}</template>
          </el-table-column>
          <el-table-column label="商品图片" width="300">
            <template slot-scope="scope">
              <ul class="proImg" style="display: flex;justify-content: space-between;">
                <li style="display: flex;justify-content: flex-start;" v-for="(item,index) in scope.row.orderProducts" v-if="index<2" :key="index">
                  <el-image :src="item.productMainImageURL" style="width: 50px;height: 50px;"></el-image>
                  <div>
                    <p style="margin:0 10px;">{{item.propertyName}}</p>
                    <p style="margin:5px 10px;">x{{item.productNum}}</p>
                  </div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="" type="expand" width="60">
            <template slot-scope="props">
              <p><span>收货地址：</span>{{props.row.buyReceiveAddress}}</p>
              <p class="bg-bule-order">
                <span>订单编号：</span>{{props.row.orderNO}}
                <i class="el-icon-document-copy" v-clipboard:copy="`${props.row.orderNO}`" v-clipboard:success="onCopy"></i>&nbsp;&nbsp;<span>下单时间：</span>{{props.row.createTime}}
              </p>
              <div class="delivery-table">
                <table style="width: 100%;border-spacing: 0;border:1px solid #ccc">
                  <tr v-for="(item,index) in props.row.orderProducts" :key="index">
                    <td>
                      <div class="goodsitem">
                        <div class="img">
                          <el-image style="height: 80px;width: 80px;" :src="item.productMainImageURL"></el-image>
                          <p v-if="item.orderState != 0"
                             :class="item.orderState == 3 ? 'base-blue' : '' || item.orderState == 2 ? 'base-org' : ''">
                            {{item.orderState | getStateName }}</p>
                        </div>
                        <div class="content">
                          <h3>{{item.productName}}</h3>
                          <p>货号:{{item.productNO}}</p>
                          <p>宝贝属性: {{item.propertyName}}</p>
                        </div>
                        <span>￥{{item.productUnitPrice}} * <b>{{item.productNum}}</b></span>
                      </div>
                    </td>
                    <template v-if="!index">
                      <td :rowspan="props.row.orderProducts.length">
                        <div class="flag">
                          <el-form :model="remarkForm" label-width="100px">
                            <el-form-item label="旗帜：">
                              <el-radio-group v-model="remarkForm.sellRemarkLevel">
                                <el-radio v-for="(item,index) in flags" :label="index + 1" :key="index"><i
                                  class="el-icon-s-flag" :class="[item]"></i></el-radio>
                              </el-radio-group>
                            </el-form-item>
                            <el-form-item label="常用备注：">
                              <el-select v-model="nowNormalRemark" placeholder="请选择备注短语" clearable
                                         @change="norRemarkChange">
                                <el-option
                                  v-for="item in normalRemarkList"
                                  :key="item.id"
                                  :value="item.content">
                                </el-option>
                              </el-select>
                              <el-button type="primary" size="mini" @click="$router.push('/system/useRemark')">设置常用
                              </el-button>
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
                              <!--<div class="countTxt">{{countRemark}}/200</div>-->
                            </el-form-item>
                            <el-form-item label="">
                              <el-checkbox v-model="remarkForm.autoSaveOperator">自动添加备注人</el-checkbox>
                              <el-checkbox v-model="remarkForm.autoSaveOperateTime">自动添加备注时间</el-checkbox>
                            </el-form-item>
                          </el-form>
                          <div style="text-align:right;">
                            <el-button type="primary" @click="comfirmToRemark">保存</el-button>
                            <!-- <el-button type="danger" @click="dialogClose">取消</el-button>-->
                          </div>
                        </div>
                      </td>
                      <td :rowspan="props.row.orderProducts.length">
                        <div style="text-align: center;">
                          <h2>冉贝</h2>
                          <p class="red" style="font-size: 18px;color: #FF0000;">实付：
                            ￥<span>{{props.row.orderMoney}}</span></p>
                          <p>含运费： ￥{{props.row.orderCarriage}}</p>
                        </div>
                      </td>
                    </template>
                  </tr>
                </table>
              </div>
            </template>
          </el-table-column>
              <!--          <el-table-column label="" type="expand" >-->
<!--            <template slot-scope="props">-->
<!--              <p><span>收货地址：</span>{{props.row.buyReceiveAddress}}</p>-->
<!--              <p class="bg-bule-order"><span>订单编号：</span>{{props.row.orderNO}}<i class="el-icon-document-copy"-->
<!--                v-clipboard:copy="`${props.row.orderNO}`" v-clipboard:success="onCopy"></i>&nbsp;&nbsp;<span>下单时间：</span>{{props.row.createTime}}</p>-->
<!--              <div class="delivery-table">-->
<!--                <el-table border :data="props.row.orderProducts" :show-header=false :span-method="objectSpanMethod" style="width: 100%">-->
<!--&lt;!&ndash;                  <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;                    align="center"&ndash;&gt;-->
<!--&lt;!&ndash;                    type="selection"&ndash;&gt;-->
<!--&lt;!&ndash;                    width="55">&ndash;&gt;-->
<!--&lt;!&ndash;                  </el-table-column>&ndash;&gt;-->
<!--                  <el-table-column label="商品" width="500">-->
<!--                    <template slot-scope="scope">-->
<!--                      <div class="goodsitem">-->
<!--                        <div class="img">-->
<!--                          <el-image style="height: 80px;width: 80px;" :src="scope.row.productMainImageURL"></el-image>-->
<!--                          <p v-if="props.row.orderState != 0" :class="props.row.orderState == 3 ? 'base-blue' : '' || props.row.orderState == 2 ? 'base-org' : ''">{{props.row.orderState | getStateName }}</p>-->
<!--                        </div>-->
<!--                        <div class="content">-->
<!--                          <h3>{{scope.row.productName}}</h3>-->
<!--                          <p>货号:{{scope.row.productNO}}</p>-->
<!--                          <p>宝贝属性: {{scope.row.propertyName}}</p>-->
<!--                        </div>-->
<!--                        <span>￥{{scope.row.productUnitPrice}} * <b>{{scope.row.productNum}}</b></span>-->
<!--                      </div>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="" width="600">-->
<!--                    <template slot-scope="scope">-->
<!--                      <div class="flag">-->
<!--                        <el-form-->
<!--                          :model="remarkForm"-->
<!--                          label-width="100px"-->
<!--                        >-->
<!--                          <el-form-item label="旗帜：">-->
<!--                            <el-radio-group v-model="remarkForm.sellRemarkLevel">-->
<!--                              <el-radio v-for="(item,index) in flags" :label="index + 1" :key="index"><i class="el-icon-s-flag" :class="[item]"></i></el-radio>-->
<!--                            </el-radio-group>-->
<!--                          </el-form-item>-->
<!--                          <el-form-item label="常用备注：">-->
<!--                            <el-select v-model="nowNormalRemark" placeholder="请选择备注短语" clearable @change="norRemarkChange">-->
<!--                              <el-option-->
<!--                                v-for="item in normalRemarkList"-->
<!--                                :key="item.id"-->
<!--                                :value="item.content">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                            <el-button type="primary" size="mini" @click="$router.push('/system/useRemark')">设置常用</el-button>-->
<!--                          </el-form-item>-->
<!--                          <el-form-item label="卖家备注：">-->
<!--                            <el-input-->
<!--                              type="textarea"-->
<!--                              maxlength="200"-->
<!--                              rows="2"-->
<!--                              show-word-limit-->
<!--                              placeholder="请输入内容"-->
<!--                              v-model="remarkForm.sellRemark">-->
<!--                            </el-input>-->
<!--&lt;!&ndash;                            <div class="countTxt">{{countRemark}}/200</div>&ndash;&gt;-->
<!--                          </el-form-item>-->
<!--                          <el-form-item label="">-->
<!--                            <el-checkbox v-model="remarkForm.autoSaveOperator">自动添加备注人</el-checkbox>-->
<!--                            <el-checkbox v-model="remarkForm.autoSaveOperateTime">自动添加备注时间</el-checkbox>-->
<!--                          </el-form-item>-->
<!--                        </el-form>-->
<!--                        <div style="text-align:right;">-->
<!--                          <el-button type="primary" @click="comfirmToRemark">保存</el-button>-->
<!--&lt;!&ndash;                          <el-button type="danger" @click="dialogClose">取消</el-button>&ndash;&gt;-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column align="center" label="">-->
<!--                    <template slot-scope="scope">-->
<!--                      <h2>冉贝</h2>-->
<!--                      <p class="red" style="font-size: 18px;color: #FF0000;">实付： ￥<span>{{props.row.orderMoney}}</span></p>-->
<!--                      <p>含运费： ￥{{props.row.orderCarriage}}</p>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                </el-table>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <pagination
          v-if="list && list.total > 0"
          :total="list.total"
          :page.sync="searchForm.pageNo"
          :limit.sync="searchForm.pageSize"
          @pagination="changeList"
        />
      </div>
<!--      发货组件弹窗-->
      <deliver v-if="deliverDialog" :deliverData="deliverData" :visible="deliverDialog"
               @componentsClose="deliverDialog = false;"
               @deliverSuccess="componentsDialogComfirm({dialogName:'deliverDialog'})"></deliver>
      <bitchdeliver v-if="birchDeliverDialog" :visible="birchDeliverDialog" @componentsClose = 'birchDeliverDialog = false;'></bitchdeliver>
    </div>
</template>

<script>
  import {remark} from '@/api/order'
  import deliver from './deliver'
  import bitchdeliver from './bitchDeliver'
  import Pagination from '@/components/Pagination'
  export default {
    name:'deliveryList',
    components:{deliver ,bitchdeliver,Pagination},
    props: {
      list: {
        type: Object
      },
      searchForm: {
        type: Object
      },
      normalRemarkList: {
        type: Array
      },
      params:{
        type: Object
      }
    },
    data(){
      return{
        state:this.params.state,
        index:0,//每一行的索引
        //详情旗帜备注
        remarkForm: {
          id: ''
          , sellRemark: ''
          , sellRemarkLevel: ''
          , autoSaveOperateTime: false
          , autoSaveOperator: false
        },
        nowNormalRemark:'',
        flags: ['icon-gray', 'icon-red', 'icon-org', 'icon-green', 'icon-blue', 'icon-purple',]
        //去发货弹窗
        ,deliverDialog:false
        ,deliverData:{}
        //批量发货弹窗
        ,birchDeliverDialog:false
      }
    },
    methods:{
      //开发中
      develop(){
        this.$message('正在开发中')
      },
      //弹窗的显示隐藏
      showOrHideDialog(dialogName) {
        this[dialogName] = !this[dialogName];
      },
      //去发货
      toDeliver(score){
        this.deliverData = {
          orderId:score.row.id,
          items:score.row.orderProducts,
          buyReceiveAddress:score.row.buyReceiveAddress
        }
        this.showOrHideDialog('deliverDialog')
      },
      //发货弹窗子组件保存成功
      componentsDialogComfirm(data) {
        this[data.dialogName] = false;
        this.changeList();
      },
      //复制
      onCopy() {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      },
      //详情
      detail(){

      },
      //批量发货
      batchDelivery(){
        this.showOrHideDialog('birchDeliverDialog')
      },
      //批量打单
      batchOrders(){

      },
      // 导出
      childEduce() {
        this.$emit('emitEduce',this.searchForm)
      },
      //页码切换
      changeList() {
        //向订单列表聚合页传递表单查询对象
        this.$emit('changeOrderList', this.searchForm)
        this.allChecked = false;
      },
      norRemarkChange(v) {
        this.remarkForm.sellRemark = v;
      },
      //备注保存
      comfirmToRemark(){
        remark(this.remarkForm).then(res => {
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '备注成功!'
            });
            this.changeList();
            this.remarkForm = {
              sellRemark: ''
              , sellRemarkLevel: ''
              , autoSaveOperateTime: false
              , autoSaveOperator: false
            }
          }
        })
      },
      //table表格合并
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1  || columnIndex === 2) {
          return {
            rowspan: this.list.rows[this.index].orderProducts.length,
            colspan: 1
          };
        }
      },
      rowClick(row, expandedRows){
        this.index = row.index
        this.remarkForm = {
          id:row.id,
          sellRemark: row.sellRemark
          , sellRemarkLevel: row.sellRemarkLevel
        }
      }
    },

  }
</script>

<style lang="scss">
  .deiveryList {
    .table{
      .el-table{
        .el-table__body{
          .el-table__row{
            .el-table__expand-icon{
              background: rgba(0,0,0,0.3);
              padding: 18px;
            }
            /*.el-table__expand-icon::before{*/
            /*  content: '详情';*/
            /*  font-size: 20px;*/
            /*  width: 60px;*/
            /*  height: 30px;*/
            /*}*/
          }
        }
      }
    }
    .bg-bule-order {
      background-color: #ecf5ff;
      padding: 10px 20px;
    }

    .goodsitem {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .img {
        p {
          margin: 0;
          text-align: center
        }
      }

      .content {
        margin-left: 20px;

        h3 {
          margin: 0;
          width: 240px;
          color: #409EFF;
          font-weight: normal;
        }
      }

      span {
        margin-left: 20px;

        b {
          color: #FF0000;
          font-weight: normal;
        }
      }
    }
    .goodsList dd .goodInfo {border: none;}
    .el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #fff;
    }
    .delivery-table {
      table{
        tr{
          td{
            padding: 10px;
          }
        }
      }
    }
  }

</style>

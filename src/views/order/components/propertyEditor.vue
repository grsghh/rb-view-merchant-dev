<template>
  <el-dialog :visible.sync="orderPropertyDialog" title="修改订单属性" @close="dialogClose" destroy-on-close :close-on-click-modal="false">
    <el-form
      :model="orderPropertyForm"
    >
      <el-form-item label="商品编号：">
        {{orderProperty.productNO}}
      </el-form-item>
      <el-form-item label="成交时间：">
        {{orderProperty.createTime}}
      </el-form-item>
      <el-form-item>
        <div class="goodInfo nor">
          <el-image
            :src="orderProperty.productMainImageURL">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <h2>{{orderProperty.productName}}</h2>
          <div class="count">
            <p>价格：￥
              <span class="inputMoney input-highlight el-input el-input--medium">
                <input type="text"
                       class="el-input__inner"
                       v-model="orderPropertyForm.productUnitPrice"
                >
              </span>
            </p>
            <p>库存：{{orderProperty.inventory}}</p>
          </div>
        </div>
        <!--            goodInfo-->
      </el-form-item>
      <el-form-item v-for="(item,index) in orderProperty.productSpecificationItems" :key="index"
                    :label="item.specificationName+'：'">
        <div class="goodInfo nor">
          <ul>
            <li v-for="(n,i) in item.properties" @click="selectSku({id:n.propertyId,list:item.properties})"
                :class="{cur:n.checked}">{{n.propertyName}}
            </li>
          </ul>
        </div>
        <!--            goodInfo-->
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="comfirmToSaveSku">确定</el-button>
      <el-button type="danger" @click="dialogClose">取消</el-button>
    </div>
  </el-dialog>
  <!--    修改订单属性弹窗-->
</template>

<script>
    import {
        orderPro,
        productProperties,
        inventories
    } from '@/api/order'
    export default {
        name: "propertyEditor"
        ,props:['visible','propertyData']
        , data() {
            return {
                orderPropertyDialog: this.visible
                , orderPropertyForm: {
                    id: ''
                    , productId: ''
                    , propertyEntrys: ''
                    ,productUnitPrice:''
                }
                , orderProperty: {}
                , inventories: []
            }
        }
        ,methods:{
            //修改属性订单中的选择属性
            selectSku(data) {
                let {productSpecificationItems} = this.orderProperty;
                let propertyEntrys = this.orderPropertyForm.propertyEntrys = '';
                for (let j in data.list) {
                    if (data.list[j].propertyId == data.id) {
                        data.list[j].checked = true;
                    } else {
                        data.list[j].checked = false;
                    }
                }
                //遍历当前需要修改属性的订单二级参数列表，匹配选中的三级属性id
                for (let i in productSpecificationItems) {
                    for (let j in productSpecificationItems[i].properties) {
                        if (productSpecificationItems[i].properties[j].checked) {
                            propertyEntrys += `${productSpecificationItems[i].specificationId}:${productSpecificationItems[i].properties[j].propertyId};`
                        }
                    }
                }
                //拼装的属性键值对
                propertyEntrys = propertyEntrys.substr(0, propertyEntrys.length - 1);
                this.orderPropertyForm.propertyEntrys = propertyEntrys;
                //将匹配到的商品规格对应的价格 图片库存赋值
                for (let i in this.inventories) {
                    if (propertyEntrys == this.inventories[i].specificationPropertyIds) {
                        this.orderProperty.inventory = this.inventories[i].inventory;
                        this.orderPropertyForm.productUnitPrice = this.inventories[i].retailPrice;
                        this.orderProperty.productMainImageURL = this.inventories[i].thumbnailImageURL;
                    }
                }
            }
            //修改订单属性
            ,changeOrderProperty(param) {
                this.orderPropertyForm = {
                    productId: param.productId
                    , propertyEntrys: ''
                };
                //根据商品id获取商品规格库存集合
                inventories({id: param.productId}).then(ret => {
                    if (ret.status == 1) {
                        this.inventories = ret.data;
                        //根据订单商品详情id查询该条商品订单的详情
                        orderPro({id: param.rowId}).then(res => {
                            if (res.status == 1) {
                                this.orderPropertyForm.id = res.data.id;
                                this.orderProperty = res.data;
                                //规格赋值
                                this.orderPropertyForm.propertyEntrys = this.orderProperty.productSpecificationPropertyIds;
                                //遍历规格库存，将当前匹配到的规格键值对的库存与缩略图重新复制
                                for (let i in ret.data) {
                                    if (this.orderProperty.productSpecificationPropertyIds == ret.data[i].specificationPropertyIds) {
                                        this.orderProperty.inventory = ret.data[i].inventory;
                                        this.orderPropertyForm.productUnitPrice = this.inventories[i].retailPrice;
                                        this.orderProperty.productMainImageURL = ret.data[i].thumbnailImageURL;
                                    }
                                }
                            }
                        });
                    }
                })
            }
            //确认修改规格
            , comfirmToSaveSku() {
                productProperties(this.orderPropertyForm).then(res => {
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '修改属性成功!'
                        });
                        this.$emit('componentsDialogComfirm')
                    }
                })
            }
            , dialogClose() {
                this.$emit('componentsClose');
            }
        }
        ,mounted() {
            this.changeOrderProperty(this.propertyData);
        }
    }
</script>

<style scoped>

</style>

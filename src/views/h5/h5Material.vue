<template>
  <div class="contentBox h5-bg h5-material">
    <el-row class="main-block">
      <el-card class="box-card">
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item prop="productName" class="myInput">
              <el-input v-model="searchForm.productName" placeholder="商品名称"></el-input>
            </el-form-item>
<!--            <el-form-item prop="supplierId" class="select">-->
<!--              <el-select v-model="searchForm.supplierId" clearable filterable placeholder="供应商">-->
<!--                <el-option-->
<!--                  v-for="item in supplierList"-->
<!--                  :key="item.id"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item prop="brandId" class="select">
              <el-select v-model="searchForm.brandId" clearable filterable placeholder="品牌">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="productNo" class="myInput myInputSmall">
              <el-input v-model="searchForm.productNo" placeholder="商品货号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="queryContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(n,i) in classifyList" :label="n.label" :name="n.name" :key="i">
          <ul class="shareList" v-if="materialsList.length">
            <li v-for="(item,index) in materialsList" :key="index">
              <h1>{{item.supplierName}}-{{item.brandName}}-{{item.productNo}}</h1>
              <div class="bgw">
                <h2 class="hideOver" @click="toDetail(item.id)">{{item.productName}}</h2>
                <dl>
                  <dt @click="toDetail(item.id)">
                    <img :src="item.mainImageURL">
                  </dt>
                  <dd>
                    <p class="base-delColor">浏览量 {{item.browseNum}}<el-button size="small" type="primary" @click="toShare(item.shortUrl)" class="fr" v-clipboard:copy="copyTxt" v-clipboard:success="onCopy">分享</el-button></p>
                    <p class="base-delColor">{{item.createTime}}</p>
                  </dd>
                </dl>

              </div>
            </li>
          </ul>
          <div ></div>
          <div style="text-align: center;">
            <template v-if="!materialsList.length">暂无素材</template>
            <el-button v-show="hasMore && materialsList.length" @click="loadMore">加载更多</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <input type="text" class="shareUrl">
  </div>
</template>

<script>
    import { materialListWhite} from '@/api/material'
    import { allBrandWhite, dicts} from '@/api/supplier'
    import { supplierWhite} from '@/api/product'

    export default {
        name: "h5Material"
        , data() {
            return {
                brandList: [],
                searchForm: {
                    pageNo: 1
                    , pageSize: 10,
                    productName: "",
                    productNo: "",
                    brandId: "",
                    type: "",
                    supplierId: ""
                },
                supplierList: [],
                activeName:''
                ,classifyList:[
                    {
                        name:''
                        ,label:'全部'
                    },
                    {
                        name:'1'
                        ,label:'朋友圈'
                    },
                    {
                        name:'2'
                        ,label:'社群'
                    },
                    {
                        name:'3'
                        ,label:'详情'
                    },
                    {
                        name:'4'
                        ,label:'其他'
                    },
                ]
                ,materialsList:[]
                ,hasMore:false
                ,copyTxt:''
            }
        }
        , methods: {
            // 获取所有品牌
            allBrand() {
                allBrandWhite().then(res => {
                    if (res.status == 1) {
                        this.brandList = res.data;
                    }
                })
            },
            // 获取所有供应商
            allSupplier() {
                supplierWhite().then(res => {
                    if (res.status == 1) {
                        this.supplierList = res.data;
                    }
                })
            }
            // 获取素材分类
            , getClassifyList() {
                dicts(100012).then(res => {
                    this.classifyList = res.data;
                })
            },
            // 获取列表信息
            getList(reset) {
                //如果是重新加载
                if (reset) {
                    this.materialsList = [];this.searchForm.pageNo = 1;
                }
                materialListWhite(this.searchForm).then(res => {
                    if(res.status == 1){
                        this.materialsList = this.materialsList.concat(res.data.rows);
                        this.hasMore = res.data.total > this.searchForm.pageSize * this.searchForm.pageNo;
                    }
                })
            },
            //tab切换
            handleClick(){
                this.searchForm.type = this.activeName == '0' ? '' :this.activeName;
                this.searchForm.pageNo = 1;
                this.materialsList = [];
                this.getList();
            }
            //分享
            ,toShare(url){
                this.copyTxt = url;
            }
            ,onCopy(){
                this.$message({
                    type: 'success',
                    message: '分享链接复制成功'
                })
            }
            //加载更多
            ,loadMore(){
                this.searchForm.pageNo++;
                this.getList();
            }
            //去详情
            ,toDetail(id){
                this.$router.push(`/h5MaterialDetail?id=${id}`);
            }
            ,changePageTitle(){
                document.title = '冉贝商城-素材中心'
            }
        }
        , created() {
            // this.changePageTitle();
            this.allBrand();
            this.allSupplier();
            this.getList();
        }
    }
</script>

<style lang="scss">
  .hideOver{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  $gray: #E4E7ED;
  .h5-material{min-height: 100%;
    padding: 5px;
    .main-block{margin-bottom: 5px;
      .el-card__body{padding-bottom: 0;}
      .el-form-item{margin-bottom: 5px;}
      .el-input--medium{height: 30px;line-height: 30px;
        .el-input__icon{line-height: 28px;}
      }
    }
    .el-tabs{padding-left: 0;}
    .el-tabs__header{padding-left: 30px;}
    .el-tabs__content{padding: 0;}
    .queryContent{padding: 5px;margin-top: 0;}
    .el-form--inline .el-form-item{margin-right: 2px;}
    .select{width: 30%}
    .myInput{width: 100%;
      .el-form-item__content{width: 93%;}
    }
    .myInputSmall{width: 42%;}
    .el-tabs{border: none;}
    .el-tabs__header{border-right: none;}
    /* 推广列表 */
    .shareList li{padding-bottom: 5px;font-size: 12px;border:1px solid rgba(238,238,238,1);min-height: 100px;margin-bottom: 10px;}
    .shareList li h1{font-weight: normal;font-size: 12px;padding: 10px 10px 5px;}
    .shareList li h2{padding: 10px 0;font-size: 12px;font-weight: normal;}
    .shareList li div{padding: 10px;padding-left:100px;  position: relative;overflow: hidden;}
    .shareList li div dl{margin: 0;}
    .shareList li div dl dd{margin: 0;}
    .shareList li div dl dt{width: 80px;height: 80px;position: absolute;left: 10px;top: 10px;}
    .shareList li div dl img{width: 100%;height: 100%;}
    .shareList li div dl dd h3{font-size: 14px;color: #333;margin-bottom: 5px;}
    .shareList li div dl dd p{line-height: 20px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;margin: 0;font-size: 12px;display: flex;justify-content: space-between;align-items: center;margin-bottom: 2px;}
  }
</style>

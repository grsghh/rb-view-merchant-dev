<template>
  <div class="contentBox publish">
    <el-row class="main-block">
      <el-card class="box-card">
        <el-form ref="productDTORef" :label-width="labelWidth" :model="productDTO" :rules="rules" :inline="true">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基础信息" name="1">
              <el-form-item label="商品分类：" prop="cIds">
                <el-cascader
                  v-model="productDTO.cIds"
                  :options="categorySeconds"
                  :props="cascaderProps"
                  @change="categoryChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="商品品牌：" prop="brandId">
                <el-select class="select" v-model="productDTO.brandId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in brand"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="供应商：" prop="supplierId">
                <el-select class="select" v-model="productDTO.supplierId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in supplier"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="商品名称：" prop="name">
                <el-input class="input-textarea"
                          type="textarea"
                          rows="3"
                          maxlength="100"
                          show-word-limit
                          v-model="productDTO.name" placeholder="" ></el-input>
              </el-form-item>
              <br>
              <el-form-item label="预览图：" prop="mainFileId">
                <el-upload
                  :action="$url.fileUploadUrl"
                  list-type="picture-card"
                  :headers="upLoadHeader"
                  accept="image/*"
                  :limit="1"
                  :file-list="productDTO.mainFileImageURL"
                  :on-remove="mainFileRemove"
                  :on-success="mainFileSuccess"
                  :on-exceed="skuListImgExceed"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <p class="tipMsg">在商品列表中显示的图片，建议选择尺寸300x300、大小2M内的图片。</p>
              </el-form-item>
              <br>
              <el-form-item label="商品分享图：" prop="shareFileId">
                <el-upload
                  :action="$url.fileUploadUrl"
                  list-type="picture-card"
                  :headers="upLoadHeader"
                  accept="image/*"
                  :limit="1"
                  :file-list="productDTO.shareFileImageURL"
                  :on-remove="shareFileRemove"
                  :on-success="shareFileSuccess"
                  :on-exceed="skuListImgExceed"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <p class="tipMsg">在商品分享时显示的图片，请上传尺寸为450*670，大小小于2M以内的图片。</p>
              </el-form-item>
              <br>
              <el-form-item label="商品图片：" prop="productImageIds">
                <div class="product-pics">
                  <ul class="el-upload-list el-upload-list--picture-card dragArea">
                    <draggable v-model="productDTO.productImages"
                               @end="productPicDraged"
                    >
                      <li :tabindex="index" class="el-upload-list__item is-success animated"
                          v-for="(element,index) in productDTO.productImages"
                      >
                        <img :src="element.url" alt="" class="el-upload-list__item-thumbnail ">
                        <label class="el-upload-list__item-status-label">
                          <i class="el-icon-upload-success el-icon-check"></i>
                        </label>
                        <i class="el-icon-close"></i>
                        <span class="el-upload-list__item-actions" @click="editPicIndex = index">
                          <span class="el-upload-list__item-delete editBox">
                              <i class="el-icon-edit-outline"></i>
                              <el-upload
                                class="editUpload"
                                :action="$url.fileUploadUrl"
                                :headers="upLoadHeader"
                                list-type="picture-card"
                                accept="image/*"
                                :on-success="editPicUploaded"
                              >
                                <i class="el-icon-plus"></i>
                              </el-upload>
                          </span>
                          <span class="el-upload-list__item-delete">
                              <i class="el-icon-delete" @click="productImageRemove(index)"></i>
                          </span>
                      </span>
                      </li>
                    </draggable>
                  </ul>
                  <el-upload
                    class="picUpload"
                    :action="$url.fileUploadUrl"
                    list-type="picture-card"
                    :headers="upLoadHeader"
                    accept="image/*"
                    :limit="5"
                    multiple
                    :file-list="productDTO.productImages"
                    :on-remove="productImageRemove"
                    :on-success="productImageSuccess"
                    :on-exceed="productImageExceed"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <p class="tipMsg">上传图片限制：支持*.tbi;*.png;*.bmp;*.jpeg;*.jpg;*.gif格式上传，建议选择尺寸300x300、大小2M内的图片。</p>
                </div>
              </el-form-item>
              <br>
              <el-form-item label="商品货号：" prop="productNo">
                <el-input class="select" v-model="productDTO.productNo" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="商品条码：" prop="productBar">
                <el-input class="select" v-model="productDTO.productBar" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="销量：" prop="initSales">
                <el-input class="select" v-model.number="productDTO.initSales" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="捆绑数量：" prop="bindingNum">
                <el-input class="select" v-model.number="productDTO.bindingNum" placeholder=""></el-input>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="商品价格" name="2">
                <el-form-item label="进货价：" prop="purchasePrice">
                  <el-input class="select" min="0" v-model="productDTO.purchasePrice" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="代理价：" prop="agentPrice">
                  <el-input class="select" min="0" v-model="productDTO.agentPrice" placeholder=""></el-input>
                </el-form-item>
                <br>
                <el-form-item label="零售价：" prop="retailPrice">
                  <el-input class="select" min="0" v-model="productDTO.retailPrice" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="代理分润比例：" prop="agentDivideRate">
                  <el-input class="select" min="0" v-model="productDTO.agentDivideRate" placeholder=""></el-input>
                </el-form-item>
                <br>
                <el-form-item label="市场价：" prop="marketPrice">
                  <el-input class="select" min="0" v-model="productDTO.marketPrice" placeholder=""></el-input>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="规格库存" name="3">
              <el-form-item label=" " prop="inventoryType">
                <el-radio label="1" v-model="productDTO.inventoryType" @change="stockChange">统一库存</el-radio>
              </el-form-item>
              <template>
                <el-form-item label="商品库存：" prop="totalInventory">
                  <el-input class="select" v-model="productDTO.totalInventory" min="0" placeholder=""></el-input>
                </el-form-item>
              </template>
              <br>
              <el-form-item label=" " prop="inventoryType">
                <el-radio label="2" v-model="productDTO.inventoryType" @change="stockChange">规格库存</el-radio>
              </el-form-item>
              <!--              统一库存时，隐藏下列选项-->
              <template v-if="productDTO.inventoryType != '1'">
                <el-form-item label="规格类型：" prop="specificationCategoryId">
                  <el-select class="select" v-model="productDTO.specificationCategoryId" clearable placeholder="请选择"
                             @change="cateChange">
                    <el-option
                      v-for="item in specifications"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <!--              统一库存时，隐藏下列选项-->
              <template v-if="productDTO.inventoryType != '1'">
                <br>
                <!--                二级规格-->
                <template v-for="(n,i) in specificationsSecond">
                  <el-form-item :label="`${n.name}：`" class="proTag skuGroup">
                    <el-checkbox-group v-model="skuChecked">
                      <el-checkbox v-for="(j,k) in n.specificationsThird" :key="k" @change="skuChange(n.id,i)"
                                   :label="j.id">
                        {{j.name}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <br>
                </template>
              </template>
              <!--              统一库存时，隐藏下列选项-->
              <div class="table" v-if="productDTO.inventoryType != '1'">
                <!--                批量设置-->
                <el-form-item :label="`${item}：`" v-for="(item,index) in batchLabel" :key="index">
                  <el-input class="numberInput" v-model="batchForm[index].num" @input="batchInput(index)" min="0" placeholder=""></el-input>
                </el-form-item>
                <el-table :data="productDTO.productSpecificationInventories" border style="width: 100%"
                          v-loading="listLoading" ref="skuListRef">
                  <el-table-column align="center" label="规格">
                    <template slot-scope="scope">{{ scope.row.title || '-'}}</template>
                  </el-table-column>
                  <el-table-column align="center" label="库存">
                    <template slot-scope="scope">
                      <el-input class="select" min="0"
                                v-model="productDTO.productSpecificationInventories[scope.$index].inventory"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="零售价">
                    <template slot-scope="scope">
                      <el-input class="select" min="0"
                                v-model="productDTO.productSpecificationInventories[scope.$index].retailPrice"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="代理价">
                    <template slot-scope="scope">
                      <el-input class="select" min="0"
                                v-model="productDTO.productSpecificationInventories[scope.$index].wholesalePrice"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="进货价">
                    <template slot-scope="scope">
                      <el-input class="select" min="0"
                                v-model="productDTO.productSpecificationInventories[scope.$index].purchasePrice"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="代理分润">
                    <template slot-scope="scope">
                      <el-input class="select" min="0"
                                v-model="productDTO.productSpecificationInventories[scope.$index].agentDivideRate"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="图片" width="400">
                    <template slot-scope="scope">
                      <div @click="nowSkuListImgIndex = scope.$index" style="height: 165px;">
                        <el-upload
                          :action="$url.fileUploadUrl"
                          list-type="picture-card"
                          :headers="upLoadHeader"
                          accept="image/*"
                          :limit="1"
                          :file-list="scope.row.thumbnailImageURL"
                          :on-remove="skuListImgRemove"
                          :on-success="skuListImgSuccess"
                          :before-remove="(file,fileList)=>{handleChange(file, fileList, scope.$index)}"
                          :on-exceed="skuListImgExceed"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        @click="copySkuPic(scope)"
                        v-if="scope.$index"
                      >图片同上
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="skuListDel(scope)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="商品详情" name="4">
              <Tinymce :height="400" v-model="productDTO.content"/>
            </el-collapse-item>
            <el-collapse-item title="快递设置" name="5">
              <el-form-item label=" " prop="isPinkage">
                <el-checkbox v-model="productDTO.isPinkage" true-label="1" false-label="0" @change="isPinkageChange">
                  包邮
                </el-checkbox>
              </el-form-item>
              <template v-if="productDTO.isPinkage != '1'">
                <br>
                <el-form-item label="运费：" prop="carriage">
                  <el-input class="select" v-model="productDTO.carriage" min="0" placeholder=""></el-input>
                </el-form-item>
                <br>
                <el-form-item label="运费模板：" prop="carriageTemplateId">
                  <el-select class="select" v-model="productDTO.carriageTemplateId" clearable placeholder="请选择">
                    <el-option
                      v-for="item in tempCarriage"
                      :key="item.id"
                      :label="item.templateName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="name">
                  <el-button type="primary" @click="refreshTemp">刷新模板</el-button>
                </el-form-item>
              </template>
            </el-collapse-item>
            <el-collapse-item title="商品标签" name="6">
              <el-form-item label=" " prop="tagIds">
                <el-checkbox-group v-model="productDTO.tagIds">
                  <el-checkbox :label="n.id" v-for="(n,i) in tags" :key="i">{{n.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card class="box-card">
        <template v-if="!$route.query.id || productDTO.state != 3">
          <el-button @click="toPublish(1)" :loading="submitting">存入草稿</el-button>
          <el-button @click="toPublish(2)" :loading="submitting">存入仓库</el-button>
        </template>
        <el-button @click="toPublish(3)" :loading="submitting" type="primary">立即上架</el-button>
      </el-card>
    </el-row>
  </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import draggable from 'vuedraggable'
    import {getToken} from '@/utils/auth'
    import { supplier, brand, specifications,tempList, publishProduct, producTag,productDetail,editProduct,categorySecond} from '@/api/product'

    export default {
        name: 'publish',
        components: {Tinymce,draggable},
        data() {
            return {
                tempCarriage:[],//运费模板列表
                specifications: [],//一级规格
                categorySeconds: [],//商品分类
                submitBtns:['存入草稿','存入仓库','立即上架'],
                cascaderProps:{
                    value:'id'
                    ,label:'name'
                },
                batchLabel:['批量设置库存','批量设置零售价','批量设置代理价','批量设置进货价','批量设置代理分润'],
                batchForm:[
                    {num:''},
                    {num:''},
                    {num:''},
                    {num:''},
                    {num:''}
                ],
                specificationsSecond: [],//二级分类
                specificationsThird: [],//三级属性
                supplier: [],
                proList: [],
                brand: [],
                tags: [],
                skuList: [],
                productDTO: {
                    productCategoryId: '',
                    parentProductCategoryId:'',
                    brandId: '',
                    supplierId: '',
                    name: '',
                    mainFileId: '',
                    shareFileId: '',
                    cIds:[],
                    productImageIds: [],
                    productImages:[],
                    productNo: '',
                    productBar: '',
                    initSales: '',
                    bindingNum: 1,
                    purchasePrice: '',
                    agentPrice: '',
                    retailPrice: '',
                    agentDivideRate: '',
                    marketPrice: '',
                    inventoryType: '1',
                    totalInventory: 0,
                    productSpecificationInventories: [],
                    productSpecificationProperties: [],
                    content: '',
                    carriage: '',
                    // carriageTemplateId: '',
                    tagIds: [],
                    isPinkage: '1'
                    ,specificationCategoryId:''
                    ,shareImgChanged:0
                },
                editPicIndex:'',
                activeNames: ['1','2','3','4','5','6']
                , upLoadHeader: {
                    Authorization: getToken()
                }
                , labelWidth: '140px'
                , listLoading: false
                , rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    // supplierId: [
                    //     {required: true, message: '请选择供应商', trigger: 'change'}
                    // ],
                    cIds: [
                        {type:'array',required: true, message: '请选择商品分类', trigger: 'change'}
                    ],
                    mainFileId: [
                        {required: true, message: '请上传预览图', trigger: 'blur'}
                    ],
                    shareFileId: [
                        {required: true, message: '请上传分享图', trigger: 'blur'}
                    ],
                    productImageIds: [
                        {type: 'array', required: true, message: '请至少选择上传一张商品图', trigger: 'blur'}
                    ],
                    productNo: [
                        {required: true, message: '请输入商品货号', trigger: 'blur'}
                    ],
                    bindingNum: [
                        {required: true, message: '请输入捆绑数量', trigger: 'blur'}
                    ],
                    // purchasePrice: [
                    //     {required: true, message: '请输入进货价', trigger: 'blur'}
                    // ],
                    // agentPrice: [
                    //     {required: true, message: '请输入代理价', trigger: 'blur'}
                    // ],
                    // retailPrice: [
                    //     {required: true, message: '请输入零售价', trigger: 'blur'}
                    // ],
                    // agentDivideRate: [
                    //     {required: true, message: '请输入代理分润比例', trigger: 'blur'}
                    // ],
                    // marketPrice: [
                    //     {required: true, message: '请输入市场价', trigger: 'blur'}
                    // ]
                }
                // 选中的三级属性
                , skuChecked: []
                //当前上传的动态规格列表的索引
                , nowSkuListImgIndex: 0
                ,submitting:false
            }
        },
        methods: {
            // 查询所有供应商
            getSupplier() {
                supplier().then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['id'] = res.data[i].id;
                            aa['label'] = res.data[i].name;
                            aa['value'] = res.data[i].id;
                            array.push(aa);
                        }
                        this.supplier = array;
                    }
                })
            },
            // 查询所有分类
            getSpecifications(type = 1, parentId = '') {
                specifications({type, parentId}).then(res => {
                    if (res.status == 1) {
                        switch (type) {
                            case 1://规格分类
                                let array = [];
                                let len = res.data.length;
                                for (let i = 0; i < len; i++) {
                                    let aa = {};
                                    aa['id'] = res.data[i].id;
                                    aa['label'] = res.data[i].name;
                                    aa['value'] = res.data[i].id;
                                    array.push(aa);
                                }
                                this.specifications = array;
                                break;
                            case 2://规格
                                this.getSecondSpec(res);
                                break;
                        }
                    }
                })
            },
            // 查询所有品牌
            getBrand() {
                brand().then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['id'] = res.data[i].id;
                            aa['label'] = res.data[i].name;
                            aa['value'] = res.data[i].id;
                            array.push(aa);
                        }
                        this.brand = array;
                    }
                })
            },
            //查询所有运费模板
            getTempList(){
              tempList().then(res=>{
                if(res.status == 1){
                  this.tempCarriage = res.data
                }
              })
            },
            //刷新运费模板
            refreshTemp(){
                this.getTempList()
            },
            // 修改商品
            handleEditInfo(score) {
                this.$router.push(`/publish?id=${score.row.id}`)
            },
            // 获取商品列表信息
            getDetail(id) {
                productDetail({id}).then(res => {
                    this.productDTO = res.data;
                    if(!this.productDTO.tagIds) this.productDTO.tagIds = [];
                    this.productDTO.shareImgChanged = 0;
                    //将预览图字段转为数组，用来回显预览图
                    this.productDTO.mainFileImageURL = [{url:res.data.mainFileImageURL}];
                    //将分享图字段转为数组，用来回显分享图
                    this.productDTO.shareFileImageURL = [{url:res.data.shareFileImageURL}];
                    this.productDTO.productImageIds = [];
                    //将回显的规格库存明细记录赋值给需要提交的列表
                    this.productDTO.productSpecificationInventories = res.data.productSpecificationInventorys;
                    this.productDTO.inventoryType = res.data.inventoryType.toString();
                    this.productDTO.isPinkage = res.data.isPinkage.toString();
                    //商品分类赋值给级联选择器
                    this.productDTO.cIds = [
                        res.data.parentProductCategoryId.toString(),res.data.productCategoryId.toString()
                    ];
                    //重组商品图片list
                    for(let i in this.productDTO.productImages){
                        this.productDTO.productImageIds.push(res.data.productImages[i].fileId)
                    }
                    //重组规格库存明细list的图片
                    for(let i in this.productDTO.productSpecificationInventories){
                        this.productDTO.productSpecificationInventories[i].thumbnailImageURL = [{url:res.data.productSpecificationInventories[i].thumbnailImageURL}]
                    }
                    this.skuChecked = res.data.productSpecificationPropertyIds;
                    this.cateChange(this.productDTO.specificationCategoryId,1);
                })
            }
            //自定义校验规则
            ,customizeValid(){
                let form = this.productDTO;
                if(!form.supplierId){
                    this.$message.error('请选择供应商');
                    return false;
                }
                if(!form.brandId){
                    this.$message.error('请选择品牌');
                    return false;
                }
                if(!form.purchasePrice){
                    this.$message.error('请输入进货价');
                    return false;
                }
                if(!form.agentPrice){
                    this.$message.error('请输入代理价');
                    return false;
                }
                if(!form.retailPrice){
                    this.$message.error('请输入零售价');
                    return false;
                }
                if(!form.agentDivideRate){
                    this.$message.error('请输入代理分润比例');
                    return false;
                }
                if(!form.marketPrice){
                    this.$message.error('请输入市场价');
                    return false;
                }
                return true;
            }
            //发布/存草稿/存仓库
            , toPublish(state) {
                // state 商品状态：1-已保存 2-待发布 3-已发布
                this.$refs.productDTORef.validate((valid) => {
                    if (valid) {
                        this.submitting = true;
                        this.initProps();
                        let txt = ''
                            ,path = '';
                        switch (state) {
                            case 1:
                                txt = '草稿';
                                path = 'draftProduct';
                                break;
                            case 2:
                                txt = '仓库';
                                path = 'warehouse';
                                break;
                            case 3:
                                //发布商品时，需要校验自定义规则
                                if(!this.customizeValid()){
                                    this.submitting = false;
                                    return;
                                }
                                txt = '在售';
                                path = 'saleProduct';
                                break;
                        }
                        this.productDTO.state = state;
                        //新发布商品
                        if(!this.$route.query.id){
                            publishProduct(this.productDTO).then(res => {
                                if (res.status == 1) {
                                    this.$alert(`发布成功，是否前往${txt}页面查看？`, '提示', {
                                        confirmButtonText: '前往查看',
                                        callback: () => {
                                            this.$router.push(`/productManger/${path}`);
                                        }
                                    });
                                }
                            })
                        }else{//修改商品
                            editProduct(this.productDTO).then(res => {
                                if (res.status == 1) {
                                    this.$alert(`修改成功，是否前往${txt}页面查看？`, '提示', {
                                        confirmButtonText: '前往查看',
                                        callback: () => {
                                            this.$router.push(`/productManger/${path}`);
                                        }
                                    });
                                }
                            })
                        }
                        this.submitting = false;
                    } else {
                        return false;
                    }
                });
            }
            //获取商品标签
            , getTag() {
                producTag().then(res => {
                    if (res.status == 1) {
                        this.tags = res.data;
                    }
                })
            }
            //是否包邮切换
            , isPinkageChange(v) {
                if (v == '1') {
                    this.productDTO.carriageTemplateId = this.productDTO.carriage = ''
                }
            }
            //规格类型切换
            , cateChange(v,firstLoad = 0) {
                if(v){
                    //如果不是查看详情加载时调用，需要清空规格列表
                    if(!firstLoad) {
                        this.skuChecked = this.productDTO.productSpecificationInventories =  [];
                        this.batchForm[0].num = this.batchForm[1].num = this.batchForm[2].num = '';
                    }
                    this.getSpecifications(2, v);
                }
            }
            //异步声明三级属性接口请求
            , async getSecondSpec(res) {
                //遍历二级规格分类
                let arr = res.data;
                if (!arr.length) {
                    this.specificationsSecond = [];
                } else {
                    //遍历二级规格分类
                    for (let i in arr) {
                        await specifications({type: 3, parentId: arr[i].id}).then(ret => {
                            if (ret.status == 1) {
                                arr[i].specificationsThird = ret.data;
                                if (i == arr.length - 1 ) {
                                    this.specificationsSecond = arr;
                                }
                            }
                        })
                    }
                }
            }
            //规格参数改变
            , skuChange() {
                //清空前的规格库存明细列表
                 let oldArr = [];
                 //动态生成的规格列表对象
                 let insertObj = {
                     id: '',
                     thumbnailFileId: '',
                     inventory: this.batchForm[0].num || '',
                     productId: '',
                     retailPrice: this.batchForm[1].num || '',
                     specificationId: '',
                     specificationPropertyId: '',
                     wholesalePrice: this.batchForm[2].num || ''
                     , title: ''
                     , imgList: []
                     ,thumbnailImageURL:[]
                     ,purchasePrice:this.batchForm[3].num || ''
                     ,agentDivideRate:this.productDTO.agentDivideRate || this.batchForm[4].num  || ''
                 };
                 if(this.productDTO.productSpecificationInventories) oldArr = [...this.productDTO.productSpecificationInventories];

                //清空库存组合列表
                this.productDTO.productSpecificationInventories = [];
                if (this.skuChecked.length < 2 && this.specificationsSecond.length > 1) {
                    return;
                }
                //第一个二级规格中的第一个三级属性列表
                const thirdSku = this.specificationsSecond[0].specificationsThird
                    //已选中的skuId列表
                    , skuChecked = [...this.skuChecked];
                //组合后的规格列表
                let skuList = this.productDTO.productSpecificationInventories;
                //遍历所有二级规格
                for (let i in this.specificationsSecond) {
                    i -= 0;
                    //遍历所有三级属性
                    for (const j in thirdSku) {
                        let name = ''
                            , ids = '';
                        //遍历已选中的所有三级属性
                        for (let k in skuChecked) {
                            //如果当前三级属性被选中
                            if (thirdSku[j].id == skuChecked[k]) {
                                //把当前选中的三级属性名赋值
                                name += thirdSku[j].name;
                                //二级规格id+三级属性id
                                ids += `${this.specificationsSecond[i].id}:${thirdSku[j].id}`;
                                //如果还有下一个二级规格，则继续循环下一个二级规格
                                if (i + 1 <= this.specificationsSecond.length - 1) {
                                    //下一个同级的二级规格下的三级规格
                                    const nowSecondSku = this.specificationsSecond[i + 1].specificationsThird;
                                    for (const n in nowSecondSku) {
                                        let obj = {...insertObj};
                                        //遍历已选中的所有三级属性
                                        for (let k in skuChecked) {
                                            //如果当前三级属性被选中
                                            if (nowSecondSku[n].id === skuChecked[k]) {
                                                //把当前选中的三级属性名赋值specificationsThird
                                                obj.title = name + '|' + nowSecondSku[n].name;
                                                obj.specificationPropertyIds = `${ids};${this.specificationsSecond[i + 1].id}:${nowSecondSku[n].id}`;
                                                skuList.push(obj);
                                            }
                                        }
                                    }
                                //    只有一个二级规格
                                }else if(this.specificationsSecond.length < 2){
                                    let obj = {...insertObj};
                                    //把当前选中的三级属性名赋值specificationsThird
                                    obj.title = name;
                                    obj.specificationPropertyIds = `${ids}`;
                                    skuList.push(obj);
                                }
                            }
                        }
                    }
                }
                //如修改前已有列表，则循环比对相同的记录赋值给新的列表
                if(oldArr.length){
                    for(let i in skuList){
                        for(let j in oldArr){
                            if(oldArr[j].specificationPropertyIds === skuList[i].specificationPropertyIds) skuList[i] = oldArr[j];
                        }
                    }
                }
            }
            //库存切换
            , stockChange(v) {
                //如果选中的是统一库存，清空库存表单数据
                if (v === '1') {
                    this.productDTO.productSpecificationInventories = this.specificationsSecond = this.skuChecked = [];
                    this.productDTO.specificationCategoryId = '';
                }
            }
            //删除动态规格表格中的图片
            , skuListImgRemove() {
                this.productDTO.productSpecificationInventories[this.nowSkuListImgIndex].thumbnailFileId = ''
            }
            //动态规格表格中的图片上传成功
            , skuListImgSuccess(res,file,fileList) {
                this.productDTO.productSpecificationInventories[this.nowSkuListImgIndex].thumbnailFileId = res.data;
                this.productDTO.productSpecificationInventories[this.nowSkuListImgIndex].thumbnailImageURL = [{url:file.url}];
            }
            //删除之前获取下标
            ,handleChange(file,fileList,index){
              this.nowSkuListImgIndex = index
            }
            //动态规格表格中的图片上传数量超过
            , skuListImgExceed() {
                this.$message.warning('最多只能上传一张图片，若要替换，请先删除上一张图片')
            }
            //删除动态规格表格中的某条记录
            , skuListDel(scope) {
                //刷新table，
                this.$refs.skuListRef.doLayout();
                this.productDTO.productSpecificationInventories.splice(scope.$index, 1);
                if (!this.productDTO.productSpecificationInventories.length) this.skuChecked = [];
            }
            //预览图片上传成功
            , mainFileSuccess(res) {
                this.productDTO.mainFileId = res.data;
            }
            //删除预览图
            , mainFileRemove() {
                this.productDTO.mainFileId = '';
            }
            //分享图片上传成功
            , shareFileSuccess(res) {
                this.productDTO.shareFileId = res.data;
                //修改商品时，如果修改了分享图
                if(this.$route.query.id) this.productDTO.shareImgChanged = 1;
            }
            //删除分享图
            , shareFileRemove() {
                this.productDTO.shareFileId = '';
            }
            //商品图片上传成功
            , productImageSuccess(res, file, fileList) {
                this.productDTO.productImages = fileList;
                this.productDTO.productImageIds.push(res.data);
            }
            //商品图修改成功
            , editPicUploaded(res, file, fileList) {
                //不能直接把file赋值给表单 会出错
                this.productDTO.productImages[this.editPicIndex].url = file.url;
                this.productDTO.productImages[this.editPicIndex].fileId = '';
                this.productDTO.productImages[this.editPicIndex].response = file.response;
                this.productDTO.productImageIds[this.editPicIndex] = res.data;
            }
            //商品图片拖拽结束
            ,productPicDraged(){
                let pics = this.productDTO.productImages;
                if(pics.length > 1){
                    this.productDTO.productImageIds = [];
                    pics.map(item => {
                        //编辑商品时，pic列表的id取fileId，如果是新发布商品，则取pic列表中的response中的data（此时data是图片id）
                        this.productDTO.productImageIds.push(item.fileId || item.response.data);
                    });
                }
            }
            //删除商品图
            , productImageRemove(index) {
                //删除发布商品时的图片id
                this.productDTO.productImageIds.splice(index, 1);
                //删除商品图片上传成功后的预览图
                this.productDTO.productImages.splice(index, 1);
            }
            //商品图片上传数量超过
            , productImageExceed() {
                this.$message.warning('最多只能上传五张图片');
            }
            //组装后台需要的规格属性数组
            , initProps() {
                let secSku = this.specificationsSecond;
                this.productDTO.productSpecificationProperties = [];
                //遍历所有二级规格
                for (let j in secSku) {
                    let obj = {
                        id: ''
                        , productId: ''
                        , propertyIds: ''
                        , specificationId: ''
                    };
                    //遍历所有二级规格中的三级属性
                    for (let l in secSku[j].specificationsThird) {
                        //遍历所有已选中的三技属性
                        for (let k in this.skuChecked) {
                            //如果当前选中三级属性id=当前二级规格下，三技属性ID，则取ID，parentID
                            if (this.skuChecked[k] == secSku[j].specificationsThird[l].id) {
                                obj.specificationId = secSku[j].specificationsThird[l].parentId;
                                obj.propertyIds += secSku[j].specificationsThird[l].id + ',';
                            }
                        }
                    }
                    if (obj.propertyIds) {
                        obj.propertyIds = obj.propertyIds.substr(0, obj.propertyIds.length - 1);
                        this.productDTO.productSpecificationProperties.push(obj);
                    }
                }
            }
            //商品分类切换
            ,categoryChange(v){
                //一级分类ID
                this.productDTO.parentProductCategoryId = v[0];
                //二级分类ID
                if(v.length > 1){
                  this.productDTO.parentProductCategoryId = v[0]
                  this.productDTO.productCategoryId = v[1];
                }
            }
            //得到两级商品类别树
            ,getCategory(){
                categorySecond().then(res=>{
                    this.categorySeconds = res.data;
                })
            }
            //批量设置
            ,batchInput(index){
                let _this = this;
                switch (index) {
                    //库存
                    case 0:
                        toDo('inventory');
                        break;
                    //零售价
                    case 1:
                        toDo('retailPrice');
                        break;
                    //代理价
                    case 2:
                        toDo('wholesalePrice');
                        break;
                    //进货价
                    case 3:
                        toDo('purchasePrice');
                        break;
                    //代理分润
                    case 4:
                        toDo('agentDivideRate');
                        break;
                }
                function toDo(objName) {
                    if(_this.productDTO.productSpecificationInventories.length){
                        for(let i in _this.productDTO.productSpecificationInventories){
                            _this.productDTO.productSpecificationInventories[i][objName] = _this.batchForm[index].num;
                        }
                    }
                }
            }
            //将规格列表中的上一个参数图片复制给下一个
            ,copySkuPic(scope){
                if(this.productDTO.productSpecificationInventories[scope.$index-1].thumbnailFileId == ''){
                    this.$message({
                      type:'warning',
                      message:'请先给上一个规格上传图片'
                    })
                    return
                }
                this.productDTO.productSpecificationInventories[scope.$index].thumbnailImageURL = this.productDTO.productSpecificationInventories[scope.$index - 1].thumbnailImageURL;
                this.productDTO.productSpecificationInventories[scope.$index].thumbnailFileId = this.productDTO.productSpecificationInventories[scope.$index - 1].thumbnailFileId;
            }
        },
        created() {
            this.getCategory();
            this.getSupplier();
            this.getSpecifications();
            this.getBrand();
            this.getTag();
            this.getTempList();
            if(this.$route.query.id){
                this.getDetail(this.$route.query.id);
            }
        }
    }
</script>

<style lang="scss">
  .publish {
    .el-collapse-item__header{font-size: 18px;font-weight: bold;}
    .numberInput{width: 172px;}
    .product-pics{
      .el-upload-list--picture-card:not(.dragArea){display: none;}
      .dragArea,.picUpload{display: inline-block}
      .editBox{position: relative;
        .editUpload{position: absolute;z-index: 9;opacity: 0;top: 0;left: 0}
      }
    }
  }
</style>

<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm":inline="true">
            <el-form-item label="素材分类：" prop="type">
              <el-select class="select" v-model="searchForm.type" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in classifyList"
                  :key="item.entryKey"
                  :label="item.entryValue"
                  :value="item.entryKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称：" prop="productName">
              <el-input class="myInput" v-model="searchForm.productName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierId">
              <el-select class="select" v-model="searchForm.supplierId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌：" prop="brandId">
              <el-select class="select" v-model="searchForm.brandId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品货号：" prop="productNo">
              <el-input class="myInput" v-model="searchForm.productNo" placeholder="请输入商品货号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <el-button
          type="primary"
          @click="addDialog"
          v-if="$store.state.user.pageBtns.includes('add')"
        >新增
        </el-button>
        <!--        <el-button type="danger" v-if="$store.state.user.pageBtns.includes('del')"><i class="el-icon-delete"></i></el-button>-->
      </div>
      <div class="table">
        <el-table :data="List" border style="width: 100%" v-loading="listLoading" height="470">
          <el-table-column align="center" label="素材分类">
            <template slot-scope="scope">{{ scope.row.typeName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="素材主图" width="150">
            <template slot-scope="scope">
              <el-image v-if="scope.row.mainImageURL != null"
                        style="width: 100px; height: 100px"
                        :src="`${scope.row.mainImageURL}`"
                        :alt="`${scope.row.name}`"
              ></el-image>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" width="400">
            <template slot-scope="scope">{{ scope.row.productName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="货号">
            <template slot-scope="scope">{{ scope.row.productNo || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="供货商" width="200">
            <template slot-scope="scope">{{ scope.row.supplierName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌">
            <template slot-scope="scope">{{ scope.row.brandName || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="浏览次数">
            <template slot-scope="scope">{{ scope.row.browseNum || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleView(scope)"
              >预览</el-button>
              <el-button
                size="small"
                type="warning"
                @click="handleEdit(scope)"
                v-if="$store.state.user.pageBtns.includes('edit')"
              >修改
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
                v-if="$store.state.user.pageBtns.includes('del')"
              >删除
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="dialogShare = true;copyTxt=scope.row.shortUrl"
              >分享
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNo"
        :limit.sync="searchForm.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 新增 修改 查看的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <!-- 选择职员的弹框 -->
        <el-dialog
          width="70%"
          title="商品选择"
          :visible.sync="innerVisible"
          append-to-body>
          <product @handleCurrentChange="handleCurrentChange" :data="data"></product>
        </el-dialog>
        <el-form-item label="商品选择">
          <el-button @click="innerVisible = true">请选择商品</el-button>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="userForm.name" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="素材分类" prop="type">
          <el-select class="select" v-model="userForm.type" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.entryValue"
              :value="item.entryKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材标题" prop="title">
          <el-input v-model="userForm.title" placeholder="请输入素材标题"/>
        </el-form-item>
        <el-form-item label="素材主图" prop="">
          <el-upload
            disabled
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            accept="image/*"
            :limit="1"
            :file-list="logoListPro"
          >
            <i class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
            </div>
          </el-upload>
        </el-form-item>
<!--        <el-form-item label="素材主图">-->
<!--          <el-upload-->
<!--            :disabled="dialogType == '查看'"-->
<!--            :action="$url.fileUploadUrl"-->
<!--            list-type="picture-card"-->
<!--            :headers="upLoadHeader"-->
<!--            :on-success="upIdPic"-->
<!--            accept="image/*"-->
<!--            :limit="1"-->
<!--            :file-list="logoList"-->
<!--          >-->
<!--            <i class="el-icon-plus"></i>-->
<!--            <div slot="file" slot-scope="{file}">-->
<!--              <img-->
<!--                class="el-upload-list__item-thumbnail"-->
<!--                :src="file.url" alt=""-->
<!--              >-->
<!--              <span class="el-upload-list__item-actions">-->
<!--                <span-->
<!--                  v-if="!disabled"-->
<!--                  class="el-upload-list__item-delete"-->
<!--                  @click="handleRemove(file)"-->
<!--                >-->
<!--                  <i class="el-icon-delete"></i>-->
<!--                </span>-->
<!--              </span>-->
<!--            </div>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
        <el-form-item label="素材简介" prop="summary">
          <el-input type="textarea" v-model="userForm.summary" placeholder="" style="width: 100%;"></el-input>
        </el-form-item>
<!--        <el-form-item label="顺序" prop="ordered">-->
<!--          <el-input type="number" v-model="userForm.ordered" placeholder="显示顺序"/>-->
<!--        </el-form-item>-->
        <el-form-item label="详情" prop="content">
          <Tinymce :height="300" v-model="userForm.content" showVideoUploader/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false; userForm = {};">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title=" "
      :visible.sync="dialogPreview"
      custom-class="miniDialog"
      destroy-on-close
    >
      <Preview :miniParam="miniParam" v-if="dialogPreview"></Preview>
    </el-dialog>
    <el-dialog
      title=" "
      :visible.sync="dialogShare"
      destroy-on-close
    >
      <el-input readonly style="width: 500px;" v-model="copyTxt"></el-input>
      <el-button
        size="small"
        type="primary" v-clipboard:copy="copyTxt" v-clipboard:success="onCopy"
      >复制链接
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import {materialList, addMaterial, getMaterial, editMaterial, delMaterial} from '@/api/material'
    import Pagination from '@/components/Pagination'
    import product from '../productManger/saleProduct'
    import {getToken} from '@/utils/auth'
    import { allBrand, dicts} from '@/api/supplier'
    import Preview from '@/components/preview/preview'
    import { supplier} from '@/api/product'

    export default {
        name: 'promotionalMaterial',
        components: {Pagination, product, Tinymce,Preview},
        data() {
            return {
                data: {
                    show: true,
                    num: 1
                },
                classifyList:[],
                supplierList: [],
                innerVisible: false, // 职员选择的内层弹框
                isReadOnly: false,
                List: [],
                dialogVisible: false,
                dialogShare: false,
                brandList: [],
                searchForm: {
                    pageNo: 1
                    , pageSize:20,
                    productName: "",
                    productNo: "",
                    brandId: "",
                    type: "",
                    supplierId: ""
                },
                logoListPro: [],
                logoList: [],
                upLoadHeader: {
                    Authorization: getToken()
                },
                disabled: false,
                listLoading: false,
                total: 0,
                dialogType: '',
                // 添加、修改表单数据
                userForm: {
                    content: "",
                    createTime: "",
                    id: "",
                    mainFileId: "",
                    ordered: 0,
                    productId: "",
                    summary: "",
                    title: "",
                    name: ''
                    ,type:''
                },
                formRule: {
                    title: [{required: true, message: '标题不能为空', trigger: 'change'}],
                    summary: [{required: true, message: '简介不能为空', trigger: 'blur'}],
                    content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
                    type: [{required: true, message: '素材分类不能为空', trigger: 'change'}]
                }
                ,dialogPreview:false
                ,miniParam:{
                    name:'materialDetail'
                    ,param:{id:'',}
                }
                ,copyTxt:''
            }
        },
        methods: {
            // 取消修改
            dialogClose() {
                this.userForm = {
                    content: "",
                    createTime: "",
                    id: "",
                    mainFileId: "",
                    ordered: 0,
                    productId: "",
                    summary: "",
                    title: "",
                    name: ""
                    ,type:''
                }
                this.logoList = []
                this.logoListPro = []
            },
            //显示新增 修改 查看 的隐藏弹窗
            showOrHideDialog() {
                this.dialogVisible = !this.dialogVisible;
            },
            //上传图片成功
            upIdPic(res) {
                this.userForm.mainFileId = res.data;
            },
            //删除图片
            handleRemove(file) {
                this.logoList = [];
            },
            // 新增用户
            addDialog() {
                this.userForm.content = '';
                this.dialogType = '新增';
                this.isReadOnly = false;
                this.disabled = false
                this.showOrHideDialog();
            },
            //查看
            handleView(score) {
                this.dialogPreview = true;
                this.miniParam.param = {
                    id:score.row.id
                    ,allGoods:1
                }
            },
            // 修改用户
            handleEdit(score) {
                this.isReadOnly = false;
                this.disabled = false
                getMaterial(score.row.id).then(res => {
                    this.dialogType = '修改';
                    this.userForm.id = res.data.id;
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
            },
            // 获取列表信息
            getList(num) {
                if (num == 1) {
                    this.searchForm.pageNo = 1;
                }
                this.listLoading = true;
                materialList(this.searchForm).then(res => {
                    this.List = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
            },
            // 确认新增 查看 修改
            confirmUser(score) {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if (this.dialogType == '新增') {
                            addMaterial(this.userForm).then(res => {
                                if (res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            });
                        }
                        if (this.dialogType == '修改') {
                            editMaterial(this.userForm).then(res => {
                                if (res.status == 1) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });
                                    this.getList();
                                    this.showOrHideDialog();
                                }
                            })
                        }
                    }
                })
            },
            //删除角色
            handleDelete(score) {
                this.$confirm('确定要删除该推广素材吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await delMaterial(score.row.id).then(res => {
                            this.getList();
                        })
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            //查看/修改信息时赋值
            setDetailData(res) {
                this.userForm = {
                    content: res.data.content,
                    id: res.data.id,
                    mainFileId: res.data.mainFileId,
                    ordered: res.data.ordered,
                    productId: res.data.productId,
                    summary: res.data.summary,
                    title: res.data.title,
                    name: res.data.productName
                    ,type:res.data.type.toString()
                }
                this.logoListPro = [{url: res.data.mainFileImageURL}]
                this.logoList = [{url: res.data.mainImageURL}]
            },
            handleCurrentChange(data) {
                this.logoListPro = [{url: data.mainImageURL}]
                this.userForm.name = data.name
                this.userForm.productId = data.id
                this.innerVisible = false
            }
            // 获取所有品牌
           ,allBrand() {
                allBrand().then(res => {
                    if(res.status == 1) {
                        this.brandList = res.data;
                    }
                })
            },
            // 获取所有供应商
            allSupplier() {
                supplier().then(res => {
                    if(res.status == 1) {
                        this.supplierList = res.data;
                    }
                })
            }
            // 获取素材分类
            ,getClassifyList() {
                dicts(100012).then(res => {
                    this.classifyList = res.data;
                })
            }
            ,onCopy(){
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
        },
        created() {
            this.getClassifyList();
            this.allSupplier();
            this.allBrand();
            this.getList()
        }
    }
</script>

<style scoped>

</style>

<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm":inline="true">
            <el-form-item label="标题" prop="productName">
              <el-input class="myInput" v-model="searchForm.title" clearable placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="所属用户" prop="moduleId">
              <el-select class="select" v-model="searchForm.moduleId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in classifyList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="productName">
              <el-select class="select" v-model="searchForm.tagId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in allTags"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间：" prop="startDate">
              <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="endDate">
              <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-date-picker>
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
          <el-table-column align="center" label="所属用户" >
            <template slot-scope="scope">
              <span v-if="scope.row.moduleId == 1">代理</span>
              <span v-if="scope.row.moduleId == 2">粉丝</span>
              <span v-if="scope.row.moduleId == 3">经销商小程序</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="scope">{{ scope.row.tagNames || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="标题" width="200">
            <template slot-scope="scope">{{ scope.row.title || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="浏览量">
            <template slot-scope="scope">{{ scope.row.pageView}}</template>
          </el-table-column>
          <el-table-column align="center" label="被赞">
            <template slot-scope="scope">{{ scope.row.support}}</template>
          </el-table-column>
          <el-table-column align="center" label="被斥">
            <template slot-scope="scope">{{ scope.row.dissenter}}</template>
          </el-table-column>
          <el-table-column align="center" label="排序字段">
            <template slot-scope="scope">{{ scope.row.orderNO}}</template>
          </el-table-column>
          <el-table-column align="center" label="发布时间" :width="$settings.dateWidth">
            <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleView(scope)"
              >查看</el-button>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="userForm.title" placeholder=""/>
        </el-form-item>
        <el-form-item label="所属用户" prop="moduleId">
          <el-select class="select" v-model="userForm.moduleId" filterable placeholder="请选择" @change="getTags">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="标签" prop="tagIds" v-if="tagList.length">
            <el-checkbox-group v-model="userForm.tagIds">
              <el-checkbox v-for="item in tagList" :key="item.id" :label="item.id.toString()" name="tagIds">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="排序字段" prop="orderNO">
            <el-input v-model="userForm.orderNO" placeholder=""/>
          </el-form-item>
        <el-form-item label="内容" prop="content">
          <Tinymce :height="300" v-model="userForm.content" showVideoUploader :showWxFace="false"/>
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
    import Pagination from '@/components/Pagination'
    import product from '../productManger/saleProduct'
    import {getToken} from '@/utils/auth'
    import { allBrand, dicts} from '@/api/supplier'
    import Preview from '@/components/preview/preview'
    import { supplier} from '@/api/product'
    import { getAllTags, AllTags, helpTags, getList, getDetailById, addManuals,editManuals, delManuals } from '@/api/notebook'

    export default {
        name: 'promotionalMaterial',
        components: {Pagination, product, Tinymce,Preview},
        data() {
            return {
                data: {
                    show: true,
                    num: 1
                },
                tagList: [],
                allTags:[],
                classifyList:[{id: 1, label: '代理'},{id: 2, label: '粉丝'},{id: 3, label: '经销商小程序'}],
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
                    moduleId: "",
                    tagId: "",
                    title: "",
                    startTime: "",
                    endTime: ""
                },
                // logoListPro: [],
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
                    moduleId: 1,
                    tagIds: [],
                    orderNO: 0
                },
                formRule: {
                    title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                    moduleId: [{required: true, message: '请选择所属用户', trigger: 'change'}],
                    tagIds: [{required: true, message: '请选择标签', trigger: 'change'}]
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
                    moduleId: 1,
                    tagIds: [],
                    orderNO: 0
                }
                this.logoList = []
                // this.logoListPro = []
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
                this.disabled = false;
                this.showOrHideDialog();
            },
            //查看
            handleView(score) {
                // getMaterial(score.row.id).then(res => {
                getDetailById(score.row.id).then(res => {
                    this.dialogType = '查看';
                    this.isReadOnly = true;
                    this.userForm.id = res.data.id;
                    this.setDetailData(res);
                    this.showOrHideDialog();
                })
                // this.dialogPreview = true;
                // this.miniParam.param = {
                //     id:score.row.id
                //     ,allGoods:1
                // }
            },
            // 修改用户
            handleEdit(score) {
                this.isReadOnly = false;
                this.disabled = false;
                getDetailById(score.row.id).then(res => {
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
                getList(this.searchForm).then(res => {
                    this.List = res.data.rows;
                    this.total = res.data.total;
                    setTimeout(() => {
                        this.listLoading = false
                    }, 500)
                })
                // materialList(this.searchForm).then(res => {
                //     this.List = res.data.rows;
                //     this.total = res.data.total;
                //     setTimeout(() => {
                //         this.listLoading = false
                //     }, 500)
                // })
            },
            // 确认新增 查看 修改
            confirmUser(score) {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if (this.dialogType == '新增') {
                            // addMaterial(this.userForm).then(res => {
                            addManuals(this.userForm).then(res => {
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
                            // editMaterial(this.userForm).then(res => {
                            editManuals(this.userForm).then(res => {
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
            //删除
            handleDelete(score) {
                this.$confirm('确定要删除该条帮助手册吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        // await delMaterial(score.row.id).then(res => {
                        await delManuals(score.row.id).then(res => {
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
                    moduleId: res.data.moduleId,
                    orderNO: res.data.orderNO,
                    tagIds: res.data.tagIds,
                    title: res.data.title
                    // content: res.data.content,
                    // id: res.data.id,
                    // mainFileId: res.data.mainFileId,
                    // ordered: res.data.ordered,
                    // productId: res.data.productId,
                    // summary: res.data.summary,
                    // title: res.data.title,
                    // name: res.data.productName
                    // ,type:res.data.type.toString()
                }
                // this.logoListPro = [{url: res.data.mainFileImageURL}]
                this.logoList = [{url: res.data.mainImageURL}]
                this.getTags()
            }
            // ,
            // handleCurrentChange(data) {
            //     this.logoListPro = [{url: data.mainImageURL}]
            //     this.userForm.name = data.name
            //     this.userForm.productId = data.id
            //     this.innerVisible = false
            // }
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

            ,onCopy(){
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
            //获取标签
            ,getTags() {
                helpTags({moduleId:this.userForm.moduleId}).then(res => {
                    if(res.status == 1) {
                        this.tagList = res.data;
                    }
                })
            },
            //获取所有标签
            getTagsAll(){
              AllTags().then(res=>{
                if(res.status === 1){
                  this.allTags = res.data
                }
              })
            }
        },
        created() {
            this.getTagsAll();
            this.getTags();
            this.allSupplier();
            this.allBrand();
            this.getList()
        }
    }
</script>

<style scoped>

</style>

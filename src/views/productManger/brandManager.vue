<template>
  <div class="contentBox">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="编码：" prop="code">
              <el-input class="myInput" v-model="searchForm.code" placeholder="品牌编码"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input class="myInput" v-model="searchForm.name" placeholder="品牌名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getList(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <div class="queryContent">
      <div class="top">
        <!--        v-if="$store.state.user.pageBtns.includes('add')"-->
        <el-button
          v-if="$store.state.user.pageBtns.includes('add')"
          type="primary"
          @click="addDialog"
        >新增
        </el-button>
      </div>
      <div class="table">
        <el-table :data="List" border style="width: 100%" v-loading="listLoading" height="470">
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="品牌编码">
            <template slot-scope="scope">{{ scope.row.code || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="品牌名称">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="LOGO">
            <template slot-scope="scope">
              <el-image v-if="!scope.row.logoImageUrl== ''" :src="scope.row.logoImageUrl" style='width:100px; height:40px;' alt="" />
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
              <!--              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>-->
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
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
              <!--              v-if="$store.state.user.pageBtns.includes('del')"-->
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
        <el-form-item label="品牌编码" prop="code">
          <el-input v-model="userForm.code" placeholder="品牌编码"/>
        </el-form-item>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="userForm.name" placeholder="品牌名称"/>
        </el-form-item>
        <el-form-item label="LOGO：" prop="">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImg"
            accept="image/*"
            :limit="1"
            :file-list="imgList"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { brand, addBrand, getBrand, changeBrand, deleteBrand, getPicImg } from '@/api/brand'
  import { getToken } from '@/utils/auth'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'brandManager',
    components: { Pagination },
    data() {
      return {
        List: [],
        dialogVisible: false,
        searchForm: {
          pageNo: 1
          , pageSize:20
          ,name:''
          ,code:''
        },
        listLoading: false,
        total: 0,
        dialogType: '',
        // 添加、修改表单数据
        userForm: {
          code: "",
          id: "",
          logoFileId: "",
          name: "",
          remark: "",
          logoImageUrl:""
        },
        upLoadHeader:{
          Authorization: getToken()
        },
        disabled:false,
        formRule: {
          name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
          code: [{ required: true, message: '请输入品牌编码', trigger: 'blur' }]
        },
        imgList:[]
      }
    },
    methods: {
      // 关闭弹窗
      dialogClose() {
        this.dialogVisible = false
        this.userForm = {
          code: "",
          id: "",
          logoFileId: "",
          name: "",
          remark: "",
          logoImageUrl:''
        }
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      // 新增用户
      addDialog() {
        this.dialogType = '新增'
        this.isReadOnly = false
        this.showOrHideDialog()
      },
      //查看用户
      handleView(score) {
        this.isReadOnly = true
        getBrand({id:score.row.id}).then(res => {
          this.dialogType = '查看'
          this.setDetailData(res)
          this.showOrHideDialog()
        })
      },
      // 修改用户
      handleEditInfo(score) {
        this.isReadOnly = false
        getBrand({id:score.row.id}).then(res => {
          this.dialogType = '修改'
          // this.setPics(res)
          this.setDetailData(res)
          this.showOrHideDialog()
        })
      },
      // 获取用户列表信息
      getList(num) {
        if (num == 1) {
          this.searchForm.pageNo = 1
        }
        this.listLoading = true
        brand(this.searchForm).then(res => {
          this.List = res.data.rows
          this.total = res.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      //上传成功
      upIdImg(res){
        this.userForm.logoFileId = res.data
      },
      //删除图片
      handleRemove(){
        this.imgList = []
      },
      // //查看/修改详情时回显图片详情
      // getDetailPic(id,data){
      //   getPicImg(id).then(res=>{
      //     if(res.status == 1){
      //       this.imgList.push({
      //         url:res.data
      //       })
      //     }
      //   })
      // }
      //清空回显图片列表
      // ,clearDefPic(){
      //   this.imgList = [];
      // },
      //设置图片回显数据
      // setPics(res){
      //   this.getDetailPic(res.data.logo,'imgList')
      // },
      // 确认新增 查看 修改
      confirmUser(score) {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType == '新增') {
              addBrand(this.userForm).then(res => {
                if (res.status == 1) {
                  this.$message({
                    type: 'success',
                    message: '新增成功！'
                  })
                  this.getList()
                  this.showOrHideDialog()
                }
              })
            }
            if (this.dialogType == '修改') {
              changeBrand(this.userForm).then(res => {
                if (res.status == 1) {
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.getList()
                  this.showOrHideDialog()
                }
              })
            }
          }
        })
      },
      //删除角色
      handleDelete(score) {
        this.$confirm('确定要删除该品牌吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteBrand({id:score.row.id}).then(res => {
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList()
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //查看/修改信息时赋值
      setDetailData(res) {
        if(res.data.logoImageUrl){
          this.imgList = [{
            url:res.data.logoImageUrl
          }]
        }else{
          this.imgList = []
        }
        this.userForm = {
          code: res.data.code,
          id: res.data.id,
          logoFileId: res.data.logoFileId,
          name: res.data.name,
          remark: res.data.remark
        }
      }
    },
    created() {
      this.getList()

    }
  }
</script>

<style>
  .main-block .myInput .el-input__inner {
    width: 100%;
  }

  .selectName {
    width: 200px;
  }
</style>

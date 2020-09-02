<template>
  <div class="contentBox">
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
        <el-table :data="List" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%" v-loading="listLoading" height="620">
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <el-table-column align="center" prop="name" label="分类名称">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="orderNum" label="显示顺序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" prop="icon" label="图标">
            <template slot-scope="scope">
              <el-image v-if="!scope.row.iconImageUrl==''" :src="scope.row.iconImageUrl" style="width:60px;height:60px;" alt=""/>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 60px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注">
            <template slot-scope="scope">{{ scope.row.remark }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="260" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="addleView(scope)"
                v-if="$store.state.user.pageBtns.includes('add')"
              >新增下级</el-button>
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
    <!-- 修改状态的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form v-if="dialogVisible" :model="userForm" label-width="80px" ref="userForm" :rules="formRule">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="userForm.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input type="number" v-model="userForm.orderNum" placeholder="显示顺序"/>
        </el-form-item>
<!--        <el-form-item label="上级分类" prop="selet">-->
<!--          <el-select class="select" @change="change" v-model="userForm.selet" clearable filterable placeholder="全部">-->
<!--            <el-option-->
<!--              v-for="item in sort"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="图标" prop="iconFileId">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdPic"
            accept="image/*"
            :limit="1"
            :file-list="iconList"
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
          <textarea v-model="userForm.remark" placeholder="" name="" id="" cols="30" rows="10" style="width: 100%;"></textarea>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show="dialogType != '查看'">
        <!-- <el-button type="danger" @click="dialogVisibleStatus = false; userStatus = {};"> -->
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible=false;this.userForm={}">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { category, addCategory, getCategory,changeCategory, deleteCategory } from '@/api/brand'
  import Pagination from '@/components/Pagination'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'productSort',
    components: { Pagination },
    data() {
      return {
        List: [],
        dialogVisible: false,
        searchForm: {
          pageNo: 1
          , pageSize:20
        },
        listLoading: false,
        total: 0,
        dialogType: '',
        // 添加、修改表单数据
        userForm: {
          iconFileId: "",
          name: "",
          orderNum: 0,
          parentId:"",
          level: "",
          remark: "",
          iconImageUrl:''
        },
        upLoadHeader:{
          Authorization: getToken()
        },
        disabled:false,
        formRule: {
          name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
        },
        sort:[],
        iconList:[]
      }
    },
    methods: {
      // 取消修改
      dialogClose() {
        this.dialogVisible = false
        this.userForm = {
          iconFileId: "",
          name: "",
          orderNum: '',
          parentId: '',
          level: '',
          remark: "",
          iconFileId:''
        }
        this.iconList = []
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      change(){
        // for(let i in this.sort){
        //   if(this.userForm.selet == this.sort[i].id){
        //     this.userForm.parentLevel = this.sort[i].level
        //     this.userForm.parentId = this.sort[i].id
        //   }else if(this.userForm.selet == ''){
        //     this.userForm.parentLevel = 1
        //     this.userForm.parentId = 0
        //   }
        // }
      },
      // 新增用户
      addDialog() {
        this.dialogType = '新增一级分类'
        this.isReadOnly = false
        this.showOrHideDialog()
        this.userForm.parentId = 0
        this.userForm.level = 1
      },
      //上传图片
      upIdPic(res){
        this.userForm.iconFileId = res.data
      },
      handleRemove(){
        this.iconList = []
        this.userForm.iconFileId = ''
      },
      //新增下级
      addleView(score){
        this.isReadOnly = false
        this.dialogType = '新增下级'
        this.userForm.parentId = score.row.id
        this.userForm.level = score.row.level+1
        this.userForm.id = score.row.id
        this.showOrHideDialog()
        // getCategory({ id: score.row.id }).then(res=>{
        //   if(res.status == 1){        //
        //     this.setDetailData(res)
        //     this.showOrHideDialog()
        //   }
        // })
      },
      //查看
      handleView(score) {
        this.isReadOnly = true
        getCategory({ id: score.row.id }).then(res => {
          this.dialogType = '查看'
          this.setDetailData(res)
          this.showOrHideDialog()
        })
      },
      // 修改
      handleEditInfo(score) {
        this.isReadOnly = false
        getCategory({ id: score.row.id }).then(res => {
          if(res.status == 1){
            this.dialogType = '修改'
            this.setDetailData(res)
            this.showOrHideDialog()
          }
        })
      },
      // 获取列表信息
      getList() {
        this.listLoading = true
        category().then(res => {
          if(res.status == 1){
            this.List = res.data
            // this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      // 确认新增 查看 修改
      confirmUser(score) {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType == '新增一级分类' || this.dialogType == '新增下级') {
              addCategory(this.userForm).then(res => {
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
              changeCategory(this.userForm).then(res => {
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
        this.$confirm('确定要删除该分类吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteCategory({ id: score.row.id }).then(res => {
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
        if(res.data.iconImageUrl){
          this.iconList = [{
            url:res.data.iconImageUrl
          }]
        }else{
          this.iconList = []
        }
        this.userForm.name = res.data.name
        this.userForm.orderNum = res.data.orderNum
        this.userForm.iconFileId = res.data.iconFileId
        this.userForm.id = res.data.id
        if(this.dialogType == '修改'){
          this.userForm.parentId = res.data.parentId
          this.userForm.level = res.data.level
        }else{
          this.userForm.parentId = res.data.id
          this.userForm.level = res.data.level+1
        }
        this.userForm.remark = res.data.remark
        // this.userForm.selet = res.data.parentId == 0 ? '': res.data.parentId
      }
    },
    created() {
      this.getList()
      // allCategory().then(res=>{
      //   if(res.status == 1){
      //     this.sort = res.data
      //   }
      // })
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





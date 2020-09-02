<template>
  <div class="contentBox" id="contentBox">
    <div class="queryContent" style="width: 25%">
      <div class="top">
        <el-button
          type="primary"
          @click="addSort"
        >新增规格分类
        </el-button>
        <el-button
          type="primary"
          @click="addGrid"
        >新增规格
        </el-button>
      </div>
      <div class="table">
        <div class="block">
          <el-tree
            ref="trees"
            :data="dataTrees"
            node-key="id"
            props="defaultProps"
            check-strictly
            @node-click="nodeClick"
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="queryContent" style="width: 72%;">
      <div class="top">
        <el-button
          type="primary"
          @click="addProperty"
        >新增规格属性
        </el-button>
      </div>
      <div class="table">
        <el-table :data="List" border style="width: 100%" v-loading="listLoading" height="770">
          <el-table-column align="center" label="规格属性">
            <template slot-scope="scope">{{ scope.row.name || '-'}}</template>
          </el-table-column>
          <el-table-column align="center" label="显示顺序">
            <template slot-scope="scope">{{ scope.row.orderNum}}</template>
          </el-table-column>
          <el-table-column align="center" label="图标">
            <template slot-scope="scope">
              <el-image v-if="scope.row.logImageURL!=null" :src="scope.row.logImageURL"  style="width: 60px; height: 60px" alt=""/>
              <div v-else slot="error" class="image-slot">
                <i style="font-size: 40px;color: #eee;" class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" :width="$settings.dateWidth" fixed="right">
            <template slot-scope="scope">
<!--              <el-button size="small" type="primary" @click="handleView(scope)">查看</el-button>-->
              <el-button
                size="small"
                type="warning"
                @click="handleEditInfo(scope)"
              >修改
              </el-button>
              <!--              v-if="$store.state.user.pageBtns.includes('edit')"-->
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope)"
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
    <!-- 新增 修改 规格分类的弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose">
      <el-form
        v-if="dialogVisible"
        :disabled="isReadOnly"
        :model="userForm"
        label-width="80px"
        ref="userForm"
        :rules="formRule"
      >
        <el-form-item label="分类名称" v-if="this.dialogType == '新增规格'">
          <el-input v-model="classifyName" disabled placeholder="名称"/>
        </el-form-item>
        <el-form-item label="规格名称" v-if="this.dialogType == '新增规格属性'">
          <el-input v-model="specificationName" disabled placeholder="名称"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum" v-if="this.dialogType != '修改规格'">
          <el-input type="number" v-model="userForm.orderNum" placeholder="显示顺序"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="userForm.type != 3">
          <textarea v-model="userForm.remark" placeholder="" name="" id="" cols="20" rows="10" style="width: 100%;"></textarea>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="userForm.type == 3">
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdPic"
            accept="image/*"
            :limit="1"
            :file-list="logoList"
          >
            <i class="el-icon-plus"></i>
            <!--                <i slot="default" class="el-icon-plus"></i>-->
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
      </el-form>
      <div style="text-align:right;" v-show='dialogType =="查看用户" ? false : true '>
        <el-button type="primary" @click="confirmUser">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false;userForm = {};">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { specificationsTrees, specifications, addSpecifications,getspecifications, changeSpecifications, deleteSpecifications } from '@/api/grid'
  import Pagination from '@/components/Pagination'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'specificationManger',
    components: { Pagination },
    data() {
      return {
        searchForm: {
          pageNo: 1
          , pageSize:20
        },
        specificationName:'',
        classifyName:'',
        List: [],
        dataTrees:[],
        dialogVisible: false,
        listLoading: false,
        total: 0,
        dialogType: '',
        // 添加、修改表单数据
        userForm: {
          name:'',
          orderNum:0,
          remark:'',
          parentId:'',
          type:'',
          logoFileId:'',
          logImageURL:""
        },
        formRule: {
          name: [{ required: true, message: '名称必填', trigger: 'blur' }]
        },
        upLoadHeader: {
          Authorization: getToken()
        },
        disabled: false,
        node:{},
        title:'',
        logoList:[]
      }
    },
    methods: {
      // 关闭弹窗
      dialogClose() {
        this.dialogVisible = false
        this.userForm = {
          name:'',
          orderNum:'',
          remark:'',
          parentId:'',
          type:'',
          logoFileId:'',
          logImageURL:""
        }
      },
      //显示新增 修改 查看 的隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      //获取树结构
      getTrees(){
        specificationsTrees().then(res=>{
          if(res.status == 1){
            this.dataTrees = res.data
          }
        })
      },
      //渲染树结构
      renderContent(h, { node, data, store }){
        return (
          <span class="custom-tree-node">
          <span style="width:200px;display:inline-block;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{data.name}</span>
          <span>
          <el-button type="text" on-click={ () => this.modify (data) }>修改</el-button>
        <el-button type="text" on-click={ () => this.remove(data) }>删除</el-button>
        </span>
        </span>);
      },
      // 新增分类
      addSort() {
        this.dialogType = '新增规格分类'
        this.isReadOnly = false
        this.showOrHideDialog()
        this.userForm.type = 1
        this.userForm.parentId = 0
      },
      //新增规格
      addGrid(){
        if(!this.node.name){
          this.$message({
            type:'warning',
            message:'请先选择规格分类'
          })
          return
        }
        if(this.node.type == 1){
          this.dialogType = '新增规格'
          this.showOrHideDialog()
        }
        this.userForm.parentId = this.node.id
        this.classifyName = this.node.name
        this.isReadOnly = false
        this.userForm.type = 2
      },
      nodeClick(node){
        this.node = node
        if(node.type == 2){
          this.getList(node.id)
        }
      },
      //新增属性
      addProperty(){
        if(!this.node.name){
          this.$message({
            type:'warning',
            message:'请先选择规格'
          })
          return
        }
        if(this.node.type == 2){
          this.dialogType = '新增规格属性'
          this.showOrHideDialog()
        }
        this.userForm.parentId = this.node.id
        this.specificationName = this.node.name
        this.isReadOnly = false
        this.userForm.type = 3
      },
      //上传图片成功
      upIdPic(res){
        this.userForm.logoFileId = res.data;
      },
      //删除图片
      handleRemove(file) {
        this.logoList = [];
      },
      //查看用户
      handleView(score) {
        // this.isReadOnly = true
        // getUser(score.row.id).then(res => {
        //   this.dialogType = '查看'
        //   this.setDetailData(res)
        //   this.showOrHideDialog()
        // })
      },
      // 修改规格
      modify(node){
        this.isReadOnly = false
        if(node.type == 1){
          this.dialogType = '修改规格分类'
        }
        if(node.type == 2){
          this.dialogType = '修改规格'
        }
        getspecifications({id:node.id}).then(res=>{
          if(res.status == 1){
            this.setDetailData(res)
            this.userForm = {
              name:res.data.name,
              orderNum:res.data.orderNum,
              remark:res.data.remark,
              parentId:res.data.parentId,
              type:res.data.type,
              id:res.data.id
            }
          }
        })
        this.showOrHideDialog()
      },
      //删除规格、分类
      remove(data){
        if(data.type == 1){
          this.title = "确定要删除该规格分类吗？"
        }else if(data.type == 2){
          this.title = "确定要删除该规格吗？"
        }
        this.$confirm( `${this.title}` , {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteSpecifications({id:data.id}).then(res => {
              if(res.status == 1){
                this.getTrees()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          })
          .catch(err => {
            console.error(err)
          })

      },
      //修改
      handleEditInfo(score) {
        this.isReadOnly = false
        getspecifications({id:score.row.id}).then(res => {
          if(res.status == 1){
            this.dialogType = '修改规格属性'
            this.setDetailData(res)
            if(res.data.logImageURL) {
              this.logoList = [{
                url: res.data.logImageURL
              }]
            }else{
              this.logoList = []
            }
            this.showOrHideDialog()
          }
        })
      },
      // 获取列表信息
      getList(id) {
        this.listLoading = true
        specifications({type:3,parentId:id}).then(res => {
          this.List = res.data
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      // 确认新增 查看 修改
      confirmUser(score) {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if(this.dialogType == "新增规格属性"){
              this.getadd()
              // addSpecifications(this.userForm).then(res => {
              //   if (res.status == 1) {
              //     this.$message({
              //       type: 'success',
              //       message: '新增成功！'
              //     })
              //     this.getList(this.userForm.parentId)
              //     this.showOrHideDialog()
              //   }
              // })
            }
            if(this.dialogType == "修改规格属性"){
              this.getchange()
              // changeSpecifications(this.userForm).then(res => {
              //   if (res.status == 1) {
              //     this.$message({
              //       type: 'success',
              //       message: '修改成功！'
              //     })
              //     this.getList(this.userForm.parentId)
              //     this.showOrHideDialog()
              //   }
              // })
            }
            if (this.dialogType == '新增规格分类' || this.dialogType == '新增规格') {
              this.getadd()
              // addSpecifications(this.userForm).then(res => {
              //   if (res.status == 1) {
              //     this.$message({
              //       type: 'success',
              //       message: '新增成功！'
              //     })
              //     this.getTrees()
              //     this.showOrHideDialog()
              //   }
              // })
            }
            if (this.dialogType == '修改规格分类' || this.dialogType == '修改规格') {
              this.getchange()
              // changeSpecifications(this.userForm).then(res => {
              //   if (res.status == 1) {
              //     this.$message({
              //       type: 'success',
              //       message: '修改成功！'
              //     })
              //     this.getTrees()
              //     this.showOrHideDialog()
              //   }
              // })
            }
          }
        })
      },
      getadd(){
        addSpecifications(this.userForm).then(res => {
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '新增成功！'
            })
            if(this.dialogType == '新增规格属性'){
              this.getList(this.userForm.parentId)
            }else{
              this.getTrees()
            }
            this.showOrHideDialog()
          }
        })
      },
      getchange(){
        changeSpecifications(this.userForm).then(res => {
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
            if(this.dialogType == '修改规格属性'){
              this.getList(this.userForm.parentId)
            }else{
              this.getTrees()
            }
            this.showOrHideDialog()
          }
        })
      },
      //删除
      handleDelete(score) {
        this.$confirm('确定要删除该属性吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteSpecifications({id:score.row.id}).then(res => {
              if(res.status == 1){
                this.getList(score.row.parentId)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //查看/修改信息时赋值
      setDetailData(res) {
        this.userForm = {
          name:res.data.name,
          orderNum:res.data.orderNum,
          remark:res.data.remark,
          parentId:res.data.parentId,
          type:res.data.type,
          id:res.data.id,
          logoFileId: res.data.logoFileId
        }
      }
    },
    created() {
      // this.getList()
      this.getTrees()
    }
  }
</script>

<style scoped>
  #contentBox {
    display: flex;
    justify-content: space-between;
  }
  .el-tree{
    padding-left: 20px;
  }
  /*#trees>.el-tree-node>.el-tree-node__content>.el-checkbox{*/
  /*  display: none;*/
  /*}*/
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .main-block .myInput .el-input__inner {
    width: 100%;
  }

  .selectName {
    width: 200px;
  }
</style>

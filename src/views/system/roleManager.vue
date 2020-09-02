<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询条件</span>
        </div>
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true">
            <el-form-item label="角色：" prop="name">
              <el-input v-model="searchForm.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getRoles(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
          <!--          <el-button size="small" type="primary" @click="handleAdd()" v-if="$store.state.user.pageBtns.includes('add')">新增</el-button>-->
          <el-button size="small" type="primary" v-if="$store.state.user.pageBtns.includes('add')" @click="handleAdd()">新增</el-button>
          <!--          <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>-->
        </el-row>
        <el-table :data="rolesList" style="width: 100%;"
                  border
                  v-loading="listLoading"
        >
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
          <el-table-column align="center" label="角色" width="220">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleView(scope)">
                查看
              </el-button>
              <el-button type="warning" size="mini" @click="handleEdit(scope)" v-if="$store.state.user.pageBtns.includes('edit')">
                修改
              </el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope)" v-if="$store.state.user.pageBtns.includes('del')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="searchForm.pageNo" :limit.sync="searchForm.pageSize"
                    @pagination="getRoles"/>
      </el-card>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose()">
      <el-form v-if="dialogVisible" :model="roleForm" label-width="80px" ref="roleForm" :rules="formRule">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" :disabled="dialogType ==='查看'"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="roleForm.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色描述"
            :disabled="dialogType ==='查看'"
          />
        </el-form-item>
        <el-form-item label="菜单列表">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="menuList" :props="defaultProps" show-checkbox
                   node-key="id" class="permission-tree" :default-checked-keys="roleForm.permissionIds"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;" v-show="dialogType != '查看'">
        <el-button type="primary" @click="confirmRole">
          确认
        </el-button>
        <el-button type="danger" @click="showOrHideDialog()">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {roles, delRole, tree, getTreeById,editRole,addRole} from '@/api/system'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    name: 'RoleManager',
    components: {Pagination}
    , data() {
      return {
        searchForm: {
          pageNo: 1
          , pageSize:20
          , name: ''
          ,module:2
        }
        //添加/查看/修改角色的表单数据
        , roleForm: {
          id:''
          ,description: ''
          , name: ''
          , permissionIds: []
          ,moduleCode:2
        }
        , dialogVisible: false
        , dialogType: ''
        , defaultProps: {
          label(data) {
            return data.meta.title
          }
        }
        , checkStrictly: false
        , rolesList: []
        , listLoading: false
        , menuList:[]
        , total: 0
        ,formRule: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    }
    , mounted() {
      this.getRoles();
    }
    , methods: {
      //显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
        this.dialogVisible ? this.getTree() : this.menuList = [];
      }
      //弹窗关闭回调
      ,dialogClose(){
        this.dialogVisible = false;
        this.roleForm = {
          id:''
          ,description: ''
          , name: ''
          , permissionIds: []
          ,moduleCode:2
        };
        this.menuList = []
      }
      //查看角色
      ,handleView(score){
        getTreeById({id:score.row.id}).then(res =>{
          if(res.status == 1){
            this.dialogType = '查看';
            this.roleForm.description = res.data.description;
            this.roleForm.name = res.data.name;
            this.roleForm.permissionIds = res.data.permissionIds;
            this.roleForm.id = res.data.id;
            this.showOrHideDialog();
          }
        })
      }
      //修改角色
      ,handleEdit(score){
        getTreeById({id:score.row.id}).then(res =>{
          if(res.status == 1){
            this.dialogType = '修改';
            this.roleForm.description = res.data.description;
            this.roleForm.name = res.data.name;
            this.roleForm.permissionIds = res.data.permissionIds;
            this.roleForm.id = score.row.id;
            this.showOrHideDialog();
          }
        })
      }
      //新增角色
      , handleAdd() {
        this.dialogType = '新增';
        this.showOrHideDialog();
      }
      //删除角色
      , handleDelete(score) {
        this.$confirm('确定要删除该角色吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delRole(score.row.id).then(res => {
              if(res.status == 1){
                this.getRoles();
              }
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
      //获取角色列表
      , getRoles(num) {
        if(num == 1) {
          this.searchForm.pageNo = 1;
        }
        this.listLoading = true
        roles(this.searchForm).then(res => {
          if(res.status == 1){
            this.rolesList = res.data.rows;
            this.total = res.data.total;
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      }
      //提交新增/修改角色
      , confirmRole() {
        this.roleForm.permissionIds = this.$refs.tree.getCheckedKeys();
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            if(this.dialogType === '修改'){
              editRole(this.roleForm).then(res =>{
                if(res.status == 1){
                  this.$message({
                    type: 'success',
                    message: `${this.dialogType}成功!`
                  })
                  this.getRoles();
                  this.showOrHideDialog();
                }
              })
            }else{//新增
              addRole(this.roleForm).then(res =>{
                if(res.status == 1){
                  this.$message({
                    type: 'success',
                    message: `${this.dialogType}成功!`
                  })
                  this.getRoles();
                  this.showOrHideDialog();
                }
              })
            }
          }
        });
      }
      //获取菜单树
      , getTree() {
        tree({module:2}).then(res => {
          this.menuList = res.data;
          //如果是查看角色信息，则禁止选择菜单树
          if(this.dialogType === '查看'){
            //不停的遍历菜单树，将每一级菜单设置为不可点击
            for(let i in this.menuList){ //一级菜单
              this.menuList[i].disabled = true;
              if(this.menuList[i].children){
                for(let j in this.menuList[i].children){ //二级菜单
                  this.menuList[i].children[j].disabled = true;
                  if(this.menuList[i].children[j].children){
                    for(let k in this.menuList[i].children[j].children){//三级按钮
                      this.menuList[i].children[j].children[k].disabled = true;
                    }
                  }
                }
              }
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
          <el-button size="small" type="primary" @click="handleAdd()" v-if="$store.state.user.pageBtns.includes('add')">新增</el-button>
          <!--          <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>-->
        </el-row>
        <el-table :data="platformList" style="width: 100%;"
                  border
                  v-loading="listLoading"
                  height="470"
        >
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55">-->
          <!--          </el-table-column>-->
<!--          <el-table-column align="center" label="平台编码" width="220">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.id }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="平台名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
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
                    @pagination="getPlatform"/>
      </el-card>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose()">
      <el-form v-if="dialogVisible" :model="platForm" label-width="80px" ref="platForm" :rules="formRule" >
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="platForm.name" placeholder="请输入平台名称" :disabled="dialogType ==='查看'"/>
        </el-form-item>
        <el-form-item label="平台状态" prop="state">
          <el-select v-model="platForm.state" :disabled="dialogType ==='查看'" clearable placeholder="全部">
            <el-option
              v-for="item in State"
              :key="item.entryKey"
              :label="item.entryValue"
              :value="item.entryKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台编码" v-show="dialogType == '查看'" prop="id">
          <el-input v-model="platForm.id" placeholder="请输入平台编码" :disabled="dialogType ==='查看'"/>
        </el-form-item>
        <el-form-item label="平台描述" prop="description">
          <el-input v-model="platForm.description" placeholder="请输入平台描述" :disabled="dialogType ==='查看'"/>
        </el-form-item>
        <el-form-item label="更新时间" v-show="dialogType == '查看'" prop="updateTime">
          <div class="block">
            <el-date-picker
              v-model="platForm.updateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="dialogType ==='查看'"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
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
  import {getPlatState, platform, delPlatform, getPlatformById,editPlatform,addPlatforms} from '@/api/system'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'platform',
    components: {Pagination}
    , data() {
      return {
        searchForm: {
          pageNo: 1
          , pageSize:20
          , name: ''
        }
        //添加/查看/修改角色的表单数据
        , platForm: {
          id:''
          ,description: ''
          , name: ''
          ,state:''
          ,updateTime:''
        }
        , dialogVisible: false
        , dialogType: ''
        , defaultProps: {
          label(data) {
            return data.meta.title
          }
        }
        ,platformList:[]
        , listLoading: true
        , total: 0
        ,formRule: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          state:[{ required: true, message: '平台状态必填', trigger: 'blur' }]
        },
        State:[] //平台状态
      }
    }
    , methods: {
      //显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible;
        // this.dialogVisible ? this.getTree() : this.menuList = [];
      }
      //弹窗关闭回调
      ,dialogClose(){
        this.dialogVisible = false;
        this.platForm = {
          id:''
          ,description: ''
          , name: ''
          , state:''
          ,updateTime:''
        }
      }
      //查看平台
      ,handleView(score){
        getPlatformById({id:score.row.id}).then(res =>{
          if(res.status == 1){
            this.dialogType = '查看';
            this.platForm.description = res.data.description;
            this.platForm.state = res.data.state.toString();
            this.platForm.name = res.data.name;
            this.platForm.id = res.data.id;
            this.platForm.updateTime = res.data.updateTime;
            this.showOrHideDialog();
          }
        })
      }
      //修改平台
      ,handleEdit(score){
        getPlatformById({id:score.row.id}).then(res =>{
          if(res.status == 1){
            this.dialogType = '修改';
            this.platForm.description = res.data.description;
            this.platForm.state = res.data.state.toString();
            this.platForm.name = res.data.name;
            this.platForm.id = res.data.id;
            this.platForm.updateTime = res.data.updateTime;
            this.showOrHideDialog();
          }
        })
      }
      //新增平台
      , handleAdd() {
        this.dialogType = '新增';
        this.showOrHideDialog();
      }
      //删除角色
      , handleDelete(score) {
        this.$confirm('确定要删除该平台吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delPlatform(score.row.id).then(res => {
              if(res.status == 1){
                this.getPlatform();
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
      //获取平台列表
      , getPlatform() {
        this.listLoading = true
        platform(this.searchForm).then(res => {
          if(res.status == 1){
            this.platformList = res.data.rows;
            this.total = res.data.total;
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      }
      //提交新增/修改平台
      , confirmRole() {
        this.$refs['platForm'].validate((valid) => {
          if (valid) {
            if(this.dialogType === '修改'){
              editPlatform(this.platForm).then(res =>{
                if(res.status == 1){
                  this.$message({
                    type: 'success',
                    message: `${this.dialogType}成功!`
                  })
                  this.getPlatform();
                  this.showOrHideDialog();
                }
              })
            }else{//新增
              addPlatforms(this.platForm).then(res =>{
                if(res.status == 1){
                  this.$message({
                    type: 'success',
                    message: `${this.dialogType}成功!`
                  })
                  this.getPlatform();
                  this.showOrHideDialog();
                }
              })
            }
          }
        });
      }
    }
    , created() {
      this.getPlatform();
      //获取平台状态
      getPlatState().then(res=>{
        if(res.status == 1){
          this.State = res.data
        }
      })
    }
  }
</script>

<style scoped>

</style>

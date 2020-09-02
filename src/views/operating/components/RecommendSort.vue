<template>
  <div class="queryContent">
    <div class="top">
      <el-button
        v-if="$store.state.user.pageBtns.includes('add')"
        type="primary"
        @click="addSort"
      >新增
      </el-button>
    </div>
    <div class="table">
      <el-table :data="sortList" border style="width: 100%" v-loading="listLoading" height="470">
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column align="center" label="分类">
          <template slot-scope="scope">{{ scope.row.productCategoryName}}</template>
        </el-table-column>
        <el-table-column align="center" label="顺序">
          <template slot-scope="scope">{{ scope.row.orderNum || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="$store.state.user.pageBtns.includes('edit')" size="small" type="primary" @click="handleEdit(scope)">修改</el-button>
            <el-button
              v-if="$store.state.user.pageBtns.includes('del')"
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


    <!-- 新增、修改推荐图 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" @close="dialogClose">
      <el-form v-if="dialogVisible" :model="SortForm" ref="SortForm" :rules="formRules" label-width="80px">
        <el-form-item label="选择分类" prop="productCategoryId">
          <el-select class="select" v-model="SortForm.productCategoryId" clearable placeholder="请选择" filterable>
            <el-option
              v-for="item in sortLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="SortForm.orderNum" placeholder="顺序"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {recommendSort, addrecommendSort, editrecommendSort, delrecommendSort} from '@/api/HomeSettings'
  import {getProductList} from '@/api/fansAnalysis'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'RecommendSort',
    components: { Pagination },
    data() {
      return {
        sortList: [],//列表
        searchForm: {
          pageNo: 1,
          pageSize: 20
        },
        total: 0,
        listLoading: false,
        dialogVisible: false,
        dialogTitle: '',
        SortForm: {
          orderNum: '',
          productCategoryIcon: "",
          productCategoryId: '',
          productCategoryName: ""
        },
        formRules: {
          productCategoryId:[{ required: true, message: '请选择分类', trigger: 'blur' }]
        },
        sortLevel:[]
      }
    },
    methods: {
      //关闭弹窗
      dialogClose() {
        this.SortForm = {
          orderNum: '',
          productCategoryIcon: "",
          productCategoryId: '',
          productCategoryName: ""
        }
      },
      //弹窗显示隐藏
      showOrHide() {
        this.dialogVisible = !this.dialogVisible
      },
      //新增
      addSort() {
        this.showOrHide()
        this.dialogTitle = '新增'
      },
      //修改
      handleEdit(score) {
        this.showOrHide()
        this.dialogTitle = '修改'
        this.SortForm = {
          id: score.row.id,
          orderNum: score.row.orderNum,
          productCategoryIcon: score.row.productCategoryIcon,
          productCategoryId: score.row.productCategoryId,
          productCategoryName: score.row.productCategoryName
        }
      },
      //删除
      handleDelete(score) {
        this.$confirm('确定要删除该分类吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delrecommendSort({id:score.row.id}).then(res => {
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList();
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //轮播列表
      getList() {
        this.listLoading = true
        recommendSort(this.searchForm).then(res=>{
          if(res.status == 1){
            this.sortList = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            },500)
          }
        })
      },
      //所有一级分类
      getSort() {
        getProductList().then(res=>{
          if(res.status ==1){
            this.sortLevel = res.data
          }
        })
      },
      //新增、修改确定
      confirm(){
        for(let i in this.sortLevel){
          if(this.SortForm.productCategoryId == this.sortLevel[i].id){
            this.SortForm.productCategoryName = this.sortLevel[i].name
            this.SortForm.productCategoryIcon = this.sortLevel[i].iconImageUrl
          }
        }
        if (this.dialogTitle == '新增') {
          addrecommendSort(this.SortForm).then(res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.getList()
              this.showOrHide()
            }
          })
        }else if (this.dialogTitle == '修改') {
          editrecommendSort(this.SortForm).then(res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
              this.getList()
              this.showOrHide()
            }
          })
        }
      }
    },
    mounted() {
      this.getList()
      this.getSort()
    }
  }
</script>

<style lang="scss" scoped>
  .top {
    margin-bottom: 20px;
  }

</style>

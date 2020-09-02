<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
          <el-button size="small" type="primary" @click="addCategory">新增</el-button>
        </el-row>
        <el-table
          v-loading="listLoading"
          :data="categoryList"
          style="width: 100%;"
          border
          height="470"
        >
          <el-table-column align="center" label="分类名称">
            <template slot-scope="scope">
              {{ scope.row.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">
              {{ scope.row.ordered }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="handleEdit(scope)">
                修改
              </el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="searchForm.pageNo"
          :limit.sync="searchForm.pageSize"
          @pagination="getCategory"
        />
      </el-card>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType" @close="dialogClose()">
      <el-form :disabled="disabledType" :model="categoryForm" ref="categoryForm" :rules="FormRules" label-width="120px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="ordered">
          <el-input v-model="categoryForm.ordered" placeholder="请输入排序" />
        </el-form-item>
        <!--        <el-form-item label="创建时间" prop="createTime">-->
        <!--          <div class="block">-->
        <!--            <el-date-picker-->
        <!--              :disabled="disabled"-->
        <!--              v-model="categoryForm.createTime"-->
        <!--              type="datetime"-->
        <!--              value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--              placeholder="选择日期时间">-->
        <!--            </el-date-picker>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmCategory">
          确认
        </el-button>
        <el-button type="danger" @click="dialogVisible = false;categoryForm = {};">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { articleList, addArticle, editArticle, delArticle } from '@/api/article'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'articleSort',
    components: { Pagination },
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize:20
        },
        categoryForm: {
          createTime: "",
          id: "",
          name: "",
          ordered: ''
        },
        dialogVisible: false,
        dialogType: '',
        defaultProps: {
          label(data) {
            return data.meta.title
          },
          disabled: true
        },
        categoryList: [], // 新闻分类列表
        listLoading: true,
        total: 0,
        FormRules: {
          name: [{ required: true, trigger: 'blur', message: '分类名称不能为空' }],
        },
        disabledType: false,
        disabled:false
      }
    },
    created() {
      this.getCategory()
    },
    methods: {
      // 显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      // 关闭弹窗时清空
      dialogClose() {
        this.dialogVisible = false
        this.categoryForm = {
          createTime: "",
          id: "",
          name: "",
          ordered: ''
        }
      },
      // 获取新闻分类列表
      getCategory() {
        this.listLoading = true
        articleList(this.searchForm).then(res => {
          if (res.status == 1) {
            this.categoryList = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      // 新增新闻分类
      addCategory() {
        this.dialogType = '新增'
        this.disabledType = false
        this.disabled = false
        this.showOrHideDialog()
      },
      //新增确定按钮
      confirmCategory() {
        if (this.dialogType == '新增') {
          addArticle(this.categoryForm).then(res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: `${this.dialogType}成功！`
              })
              this.getCategory()
              this.showOrHideDialog()
            }
          })
        }else{
          editArticle(this.categoryForm).then(res=>{
            if(res.status == 1){
              this.$message({
                type: 'success',
                message: `${this.dialogType}成功！`
              })
              this.getCategory()
              this.showOrHideDialog()
            }
          })
        }
      },
      //修改新闻分类
      handleEdit(score){
        this.dialogVisible = true
        this.disabled = true
        this.dialogType = "修改"
        this.categoryForm.id = score.row.id
        this.categoryForm.name = score.row.name
        this.categoryForm.ordered = score.row.ordered
        this.categoryForm.createTime = score.row.createTime
      },
      //删除新闻分类
      handleDelete(score){
        this.$confirm('确定要删除该分类吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async ()=>{
          await delArticle({id:score.row.id}).then(res=>{
            if(res.status == 1){
              this.getCategory()
            }
          })
          this.$message({
            type:"success",
            message:"删除成功！"
          })
        }).catch(err=>{
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>

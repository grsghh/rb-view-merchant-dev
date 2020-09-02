<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div class="main-block">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label="分类：" prop="categoryId">
              <el-select v-model="searchForm.categoryId" clearable placeholder="所有分类">
                <el-option
                  v-for="item in newsCate"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：" prop="title">
              <el-input v-model="searchForm.title" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getNews(1)">查询</el-button>
              <el-button size="small" type="warning" @click="$refs.searchForm.resetFields()">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <el-row class="main-block">
      <el-card>
        <el-row class="mb25">
          <el-button type="primary" class="pushNews" @click="pushNew">发布文章</el-button>
        </el-row>
        <el-table
          highlight-current-row
          @current-change="handleCurrentChangeArticle"
          v-loading="listLoading"
          :data="newsList"
          style="width: 100%;"
          border
          height="470"
        >
          <el-table-column align="center" label="标题"  :width="$settings.tableMoneyWidth">
            <template slot-scope="scope">
              {{ scope.row.title || '-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="分类">
            <template slot-scope="scope">
              {{ scope.row.articleCategoryName || '-' }}
            </template>
          </el-table-column>
<!--          <el-table-column align="center" label="发布人">-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.publisherName || '-' }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="修改时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="handleEdit(scope)">
                编辑
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
          @pagination="getNews"
        />
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import {allSort, paragraphList, addParagraph, editParagraph ,delParagraph } from '@/api/article'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'articleList',
    components: { Pagination },
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize:20,
          categoryId: "",
          title: ""
        },
        newsList:[],//新闻列表
        total: 0,
        listLoading: true,
        newsCate:[] //新闻分类
      }
    },
    created() {
      this.getNews()
      this.getSort()
    },
    methods: {
      //点击某一条文章
      handleCurrentChangeArticle(val){
        this.$emit('handleCurrentChangeArticle',val)
      },
      //获取所有文章分类
      getSort(){
        allSort().then(res=>{
          if(res.status == 1){
            this.newsCate = res.data
          }
        })
      },
      // 显示隐藏弹窗
      showOrHideDialog() {
        this.dialogVisible = !this.dialogVisible
      },
      // 获取新闻列表
      getNews(num) {
        if(num == 1) this.searchForm.pageNo = num
        this.listLoading = true
        paragraphList(this.searchForm).then(res => {
          if (res.status == 1) {
            this.newsList = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 500)
          }
        })
      },
      //发布新闻
      pushNew(){
        this.$router.push('/addnews')
      },
      //更新新闻
      handleEdit(score){
        this.$router.push({
          path:'/editNews',
          query:{id:score.row.id}
        })
      },
      //删除新闻
      handleDelete(score){
        this.$confirm('确定要删除该文章吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async ()=>{
          await delParagraph({id:score.row.id}).then(res=>{
            if(res.status == 1){
              this.getNews()
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

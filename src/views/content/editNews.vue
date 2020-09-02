<template>
  <div class="main-content">
    <el-row class="main-block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>修改文章</span>
        </div>
        <el-form :model="newsForm" ref="newsForm" :rules="FormRules" label-width="120px" label-position="left">
          <el-form-item label="标题" prop="title">
            <el-input v-model="newsForm.title" ref="minEarnings" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="文章分类" prop="articleCategoryId">
            <el-select v-model="newsForm.articleCategoryId" clearable placeholder="所有分类">
              <el-option
                v-for="item in newsCate"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="发布时间：" prop="publishTime">-->
<!--            <div class="block">-->
<!--              <el-date-picker-->
<!--                v-model="newsForm.publishTime"-->
<!--                type="datetime"-->
<!--                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                placeholder="选择日期时间">-->
<!--              </el-date-picker>-->
<!--            </div>-->
<!--          </el-form-item>-->
          <el-form-item label="文章内容：" prop="content">
            <Tinymce ref="editor" v-model="newsForm.content" :height="400" />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="primary"  @click="uploadNews">
            发布
          </el-button>
          <el-button type="danger"  @click="reset()">
            取消
          </el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import {allSort, editParagraph,getParagraph } from '@/api/article'
  import Tinymce from '@/components/Tinymce'
  export default {
    name: 'editNews',
    components:{Tinymce},
    data(){
      return{
        ids:this.$route.query.id,
        newsForm:{
          content: "",
          id: "",
          language: "",
          articleCategoryId: '',
          publishTime: "",
          title: ""
        },
        FormRules:{
          title: [{ required: true, trigger: 'blur', message: '标题不能为空' }],
          articleCategoryId: [{ required: true, trigger: 'blur', message: '文章分类不能为空' }],
          content: [{ required: true, trigger: 'blur', message: '文章内容不能为空' }],
        },
        newsCate:[]
      }
    },
    created() {
      this.fetchNews()
      this.getSort()
    },
    methods:{
      //获取所有文章分类
      getSort(){
        allSort().then(res=>{
          if(res.status == 1){
            this.newsCate = res.data
          }
        })
      },
      //获取新闻详情
      fetchNews() {
        getParagraph({id:this.ids}).then(res=>{
          this.newsForm.id = res.data.id
          this.newsForm.title = res.data.title
          this.newsForm.content = res.data.content
          this.newsForm.articleCategoryId = res.data.articleCategoryId.toString()
          this.newsForm.publishTime = res.data.publishTime
        })
      },
      //修改发布
      uploadNews(){
        editParagraph(this.newsForm).then(res=>{
          if(res.status == 1){
            this.$message({
              type: 'success',
              message: `更新成功！`
            })
            window.history.go(-1)
            this.newsForm = {
              content: "",
              id: "",
              articleCategoryId: '',
              publishTime: "",
              title: "",
            }
          }
        })
      },
      reset(){
        window.history.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>

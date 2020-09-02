<template>
  <div class="queryContent">
    <div class="top">
      <el-button
        v-if="$store.state.user.pageBtns.includes('add')"
        type="primary"
        @click="addLoop"
      >新增
      </el-button>
    </div>
    <div class="table">
      <el-table :data="LoopList" border style="width: 100%" v-loading="listLoading" height="470">
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column align="center" label="图片">
          <template slot-scope="scope">
            <el-image v-if="!scope.row.imageUrl==''"
                      style="width: 100px; height: 100px"
                      :src="scope.row.imageUrl"></el-image>
            <div v-else slot="error" class="image-slot">
              <i style="font-size: 60px;color: #eee;" class="el-icon-picture-outline"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">{{ scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="顺序">
          <template slot-scope="scope">{{ scope.row.orderNum || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="关联类型">
          <template slot-scope="scope">
            <span v-if=" scope.row.type == 1">商品</span>
            <span v-else>文章</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="关联商品" :width="$settings.dateWidth">
          <template slot-scope="scope">
            <span v-if=" scope.row.type == 1">{{scope.row.targetName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="关联文章" :width="$settings.dateWidth">
          <template slot-scope="scope">
            <span v-if=" scope.row.type == 2">{{scope.row.targetName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="浏览量">
          <template slot-scope="scope">{{scope.row.browseNum}}</template>
        </el-table-column>
        <el-table-column align="center" label="发布时间">
          <template slot-scope="scope">{{ scope.row.createTime || '-'}}</template>
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
      @pagination="getLoopList"
    />


    <!-- 新增、修改轮播图 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" @close="dialogClose">
      <el-form v-if="dialogVisible" :model="loopForm" ref="loopForm" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="loopForm.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="loopForm.orderNum" placeholder="顺序"/>
        </el-form-item>
        <el-form-item label="图片" prop="imageFileId" required>
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImg"
            :on-remove="remove"
            accept="image/*"
            :limit="1"
            :file-list="LoopImgList"
            :on-exceed="handleExceed"
            >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="关联类型" prop="type">
          <el-radio-group v-model="loopForm.type" @change="proAndArticle">
            <el-radio label="1">商品</el-radio>
            <el-radio label="2">文章</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联商品" prop="targetName" v-if="loopForm.type == 1" required>
          <el-button @click="innerVisible = true">选择商品</el-button>
          <div style="display: flex;justify-content: flex-start;align-items: center;margin-top: 20px;">
            <span>商品主图：</span>
            <el-image style="width: 100px;height: 100px;" :src="proUrl"></el-image>
          </div>
            <p>商品标题：{{loopForm.targetName}}</p>
        </el-form-item>
        <el-form-item label="关联文章" prop="targetName" v-if="loopForm.type == 2" required>
          <el-button @click="articleVisible=true">选择文章</el-button>
          <p>文章标题：{{loopForm.targetName}}</p>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
      </div>
      <!-- 选择商品的弹框 -->
      <el-dialog
        width="70%"
        title="商品选择"
        :visible.sync="innerVisible"
        append-to-body>
        <product @handleCurrentChange="handleCurrentChange" :data="data"></product>
      </el-dialog>
      <!-- 选择文章的弹框 -->
      <el-dialog
        width="70%"
        title="文章选择"
        :visible.sync="articleVisible"
        append-to-body>
        <article-list @handleCurrentChangeArticle="handleCurrentChangeArticle"></article-list>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
  import {loopset, addLoopset,detialLoopset, editLoopset, delLoopset} from '@/api/HomeSettings'
  import Pagination from '@/components/Pagination'
  import {getToken} from '@/utils/auth'
  import product from '@/views/productManger/saleProduct'
  import ArticleList from '@/views/content/articleList'
  export default {
    name: 'LoopManage',
    components: { Pagination, product, ArticleList },
    data() {
      return {
        data:{
          show:true,
          num:1,
            state: 'HomeSettings'
        },
        LoopList: [],//轮播图列表
        searchForm: {
          pageNo: 1,
          pageSize: 20
        },
        total: 0,
        listLoading: false,
        dialogVisible: false,
        dialogTitle: '',
        loopForm: {
          imageFileId: "",
          name: "",
          orderNum: '',
          targetId: "",
          targetName: "",
          type: ''
        },
        formRules: {
          name:[{ required: true, message: '请输入名称', trigger: 'blur' }],
          type:[{ required: true, message: '请选择关联类型', trigger: 'blur' }]
        },
        upLoadHeader:{
          Authorization:getToken()
        },
        LoopImgList:[],//上传图片
        innerVisible:false,//选择商品弹窗
        articleVisible:false,//选择文章弹窗
        proUrl:''
      }
    },
    methods: {
      //关闭弹窗
      dialogClose() {
        this.loopForm = {
          imageFileId: "",
          name: "",
          orderNum: '',
          targetId: "",
          targetName: "",
          type: ''
        }
        this.proUrl = ''
        this.LoopImgList = []
      },
      //弹窗显示隐藏
      showOrHide() {
        this.dialogVisible = !this.dialogVisible
      },
      //新增轮播图
      addLoop() {
        this.showOrHide()
        this.dialogTitle = '新增轮播图'
      },
      //修改轮播
      handleEdit(score) {
        detialLoopset({id:score.row.id}).then(res=>{
          if(res.status == 1){
            this.dialogTitle = '修改轮播图'
            this.showOrHide()
            this.loopForm = {
              id:res.data.id,
              imageFileId: res.data.imageFileId,
              name: res.data.name,
              orderNum: res.data.orderNum,
              targetId: res.data.targetId,
              targetName: res.data.targetName,
              type: res.data.type.toString()
            }
            if(res.data.type == 1){
              this.proUrl = res.data.mainFileUrl
            }
            if(res.data.imageUrl){
              this.LoopImgList = [{
                url:res.data.imageUrl
              }]
            }else{
              this.LoopImgList = []
            }
          }
        })
      },
      //删除轮播
      handleDelete(score) {
        this.$confirm('确定要删除该轮播图吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delLoopset({id:score.row.id}).then(res => {
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getLoopList();
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      //轮播列表
      getLoopList() {
        this.listLoading = true
        loopset(this.searchForm).then(res=>{
          if(res.status == 1){
            this.LoopList = res.data.rows
            this.total = res.data.total
            setTimeout(() => {
              this.listLoading = false
            },500)
          }
        })
      },
      //上传图片成功
      upIdImg(res){
        this.loopForm.imageFileId = res.data
      },
      //删除图片
      remove(){
        this.loopForm.imageFileId = ''
        this.LoopImgList = []
      },
      //超过上传限制
      handleExceed(){
        this.$message.warning('最多只能上传一张图片');
      },
      //类型切换
      proAndArticle(){
        this.loopForm.targetId = ''
        this.loopForm.targetName =''
        this.proUrl = ''
      },
      //选择商品获取标题
      handleCurrentChange(data) {
        this.loopForm.targetId = data.id
        this.loopForm.targetName = data.name
        this.proUrl = data.mainImageURL
        this.innerVisible = false
      },
      //选择文章获取标题
      handleCurrentChangeArticle(data){
        this.loopForm.targetName = data.title
        this.loopForm.targetId = data.id
        this.proUrl = ''
        this.articleVisible = false
      },
      //新增、修改确定
      confirm(){
        if(this.loopForm.imageFileId ==''){
          this.$message.warning('请上传图片')
          return
        }
        if(this.loopForm.targetId == '' || this.loopForm.targetName ==''){
          this.$message.warning('商品名称或者文章标题不能为空')
          return
        }
        if (this.dialogTitle == '新增轮播图') {
          addLoopset(this.loopForm).then(res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.getLoopList()
              this.showOrHide()
            }
          })
        }else if (this.dialogTitle == '修改轮播图') {
          editLoopset(this.loopForm).then(res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
              this.getLoopList()
              this.showOrHide()
            }
          })
        }
      }
    },
    mounted() {
      this.getLoopList()
    }
  }
</script>

<style lang="scss" scoped>
  .top {
    margin-bottom: 20px;
  }

</style>

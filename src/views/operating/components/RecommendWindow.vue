<template>
    <div class="window">
      <el-form :model="windowForm" ref="windowForm" :rules="formRules" label-width="80px">
        <el-form-item label="title图：" prop="titleImageFileId" required>
          <el-upload
            :action="$url.fileUploadUrl"
            list-type="picture-card"
            :headers="upLoadHeader"
            :on-success="upIdImg"
            :on-remove="remove"
            accept="image/*"
            :limit="1"
            :file-list="ImgList"
            :on-exceed="handleExceed"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="关联商品" prop="productIds" required>
          <div class="concatImg" v-for="(item,index) in selectImg" :key="index">
            <span @click="delImg(index)" class="el-icon-circle-close"></span>
            <el-image style="width: 100px;height: 100px;" :src="item.mainFileImageURL"></el-image>
            <i v-if="index == 0" class="el-icon-top" style="color: #fff;"></i>
            <i v-if="index != 0" class="el-icon-top" @click="upMove(index)"></i>
            <i v-if="index != selectImg.length-1" @click="downMove(index)" class="el-icon-bottom"></i>
          </div>
          <p><el-button @click="innerVisible = true">添加商品</el-button></p>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="primary" @click="confirm">保存</el-button>
      </div>
      <!-- 添加选择商品的弹框 -->
      <el-dialog
        width="70%"
        title="商品选择"
        :visible.sync="innerVisible"
        append-to-body>
        <product v-if="innerVisible" @handleCurrentChange="handleCurrentChange" :data="data"></product>
      </el-dialog>
    </div>
</template>

<script>
  import {recommendWindow, setRecommendWindow} from '@/api/HomeSettings'
  import {getToken} from '@/utils/auth'
  import product from '@/views/productManger/saleProduct'
  export default {
    nam:'RecommendWindow',
    components:{product},
    data(){
      return{
        data:{
          show:true,
          num:1,
            state: 'HomeSettings'
        },
        windowForm:{
          titleImageFileId:'',
          productIds:[]
        },
        formRules: {},
        upLoadHeader:{
          Authorization:getToken()
        },
        ImgList:[],
        selectImg:[],//选择的商品主图
        innerVisible:false
      }
    },
    methods:{
      //向上移动
      upMove(index){
        this.moveArr(this.selectImg,index,index - 1)
      },
      //向下移动
      downMove(index){
        this.moveArr(this.selectImg,index,index + 1)
      },
      //移动数组
      moveArr(arr,index1,index2){
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      },
      //上传图片成功
      upIdImg(res){
        this.windowForm.titleImageFileId = res.data
      },
      //删除图片
      remove(){
        this.windowForm.titleImageFileId = ''
        this.ImgList = []
      },
      //超过上传限制
      handleExceed(){
        this.$message.warning('最多只能上传一张图片');
      },
      //选择商品获取商品主图
      handleCurrentChange(data) {
        this.selectImg.push({
          mainFileImageURL:data.mainImageURL,
          id:data.id
        })
        this.innerVisible = false
      },
      //删除
      delImg(index){
        this.selectImg.splice(index,1)
      },
      //得到当前的橱窗推荐
      getMomentWindow(){
        recommendWindow().then(res=>{
          if (res.status == 1) {
            this.windowForm.titleImageFileId = res.data.titleImageFileId
            this.ImgList = [{
              url:res.data.titleImageUrl
            }]
            this.selectImg = res.data.products || []
          }
        })
      },
      //保存
      confirm(){
        this.windowForm.productIds = []
        if(this.windowForm.titleImageFileId == ''){
          this.$message.warning('请上传图片')
          return
        }
        for(let i in this.selectImg){
          this.windowForm.productIds.push(this.selectImg[i].id)
        }
        if(!this.windowForm.productIds.length){
          this.$message.warning('请添加关联商品')
          return
        }
        setRecommendWindow(this.windowForm).then(res=>{
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'保存成功'
            })
            this.getMomentWindow()
          }
        })
      }
    },
    mounted() {
      this.getMomentWindow()
    }
  }
</script>

<style lang="scss" scoped>
  .window{
    .concatImg{
      display: flex;justify-content: flex-start;align-items: center;margin-bottom: 20px;position: relative;
      i{font-size: 30px;color: #1890FF;margin-left: 40px;cursor: pointer;}
      span{
        position: absolute;left: 100px;top:-10px;font-size: 20px;color: #999;z-index: 999;cursor: pointer;
      }
    }

  }

</style>

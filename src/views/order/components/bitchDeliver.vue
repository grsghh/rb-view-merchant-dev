<template>
  <el-dialog class="bitchdeliver" :visible.sync="birchDeliverDialog" title="Excel批量发货" @close="dialogClose" destroy-on-close>
    <p>导入Excel文件 <span @click="download">下载导入模板</span></p>
    <span class="bitchnote"><i class="el-icon-warning-outline"></i>导入文件格式必须为xls,xlsx,大小不超过10MB</span>
    <div class="upload">
      <el-upload
        class="upload-demo"
        :action="$url.uplodFile"
        :headers="upLoadHeader"
        :on-success="success"
        :limit="1"
        :on-exceed="handleExceed">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button class="start" size="small" type="danger" @click="beginDeliver">开始发货</el-button>
    </div>
    <h2>发货结果</h2>
    <div class="table">
      <el-table border :data="demoList">
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">{{scope.row.orderNO || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="快递单号">
          <template slot-scope="scope">{{scope.row.trackingNO || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="物流公司">
          <template slot-scope="scope">{{scope.row.logisticsName || '-'}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.state == 1 ? 'successFont':'base-redColor'">{{scope.row.state == 1 ? "正常":"异常"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="错误信息">
          <template slot-scope="scope">
            <span class="base-redColor">{{scope.row.errorMessage || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卖家备注">
          <template slot-scope="scope">{{scope.row.sellRemark || '-'}}</template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import {beginDeliver} from "@/api/report"
  import { getToken } from '@/utils/auth'
  export default {
    name:'bitchDeliver',
    props:['visible'],
    data(){
      return{
        birchDeliverDialog:this.visible,
        upLoadHeader:{
          Authorization: getToken()
        },
        demoList:[]
      }
    },
    methods:{
      dialogClose(){
        this.$emit('componentsClose')
      },
      //下载模板
      download(){
        const url = this.$url.downUrl + '/rb-order/orders/batch-despatch/download-template'
        const link = document.createElement('a');
        link.href = url;
        link.click();
      },
      //上传成功得到数据
      success(res){
        this.demoList = res.data
      },
      //限制上传文件数量
      handleExceed(){
        this.$message.warning('最多只能上传一个文件');
      },
      beginDeliver(){
        beginDeliver(this.demoList).then(res=>{
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'批量发货成功'
            })
            this.birchDeliverDialog = false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .bitchdeliver{
    p{
      font-size: 18px;font-weight: bold;
      span{font-size: 14px;font-weight: normal;color: #02B74F;margin-left: 15px;cursor: pointer;}
    }
    span.bitchnote{font-size: 14px;color: #02B74F;}
    h2{font-size: 18px;margin-top: 15px;}
    .upload{
      display: flex;justify-content: flex-start;
      margin-top: 15px;
      .upload-demo {
        position: relative;
        .el-upload--text {
          position: absolute;
          left: 220px;
        }

        .el-upload-list {
          width: 200px;
          .el-upload-list__item{
            margin: 0;
          }
        }
      }
      .start{margin-left: 115px;}
    }
    .successFont{color: #1CB100;}
    .base-redColor{color: #FF0000;}
  }
</style>

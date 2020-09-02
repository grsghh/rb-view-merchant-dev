<template>
  <div class="sendMsg">
    <el-form :model="msgForm" ref="msgForm" :rules="FormRules" label-width="120px" label-position="right">
      <div v-if="propsData.receiveShow">
        <el-form-item class="proTag accept" label="接收人" required>
          <el-radio-group v-model="msgForm.type"  size=""  @change="changeSelect">
            <el-radio label="1" >全部代理</el-radio>
            <el-radio label="2" >全部粉丝</el-radio>
          </el-radio-group>
          <span class="defined" @click="defined()">自定义</span>
        </el-form-item>
      </div>
      <div v-if="!propsData.detailId">
        <el-form-item class="select" label="筛选出">
          <span class="person"><b>{{peopleNum}}</b>人</span>
          <span class="details" @click="details()">明细</span>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item class="select" label="接收人">
          <span class="person">{{defindeName}}</span>
        </el-form-item>
      </div>
      <div>
        <el-form-item class="proTag accept" label="短信类型" prop="smsTypeId">
          <el-radio-group v-model="msgForm.smsTypeId" size="" :disabled="disabled">
            <el-radio v-for="(item,index) in msgTypeList" :key="item.entryKey" :label="item.entryKey">{{item.entryValue}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div>
        <el-form-item class="proTag accept" label="模板分类" required>
          <el-radio-group v-model="sortId" size="" :disabled="disabled" @change="tempSort">
            <el-radio v-for="(item,index) in msgSortList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="tempList.length">
        <el-form-item class="proTag accept templ" label="可选模板" required>
          <el-radio-group v-model="msgForm.smsTemplateId" size="" :disabled="disabled" @change="getParamsTemp">
            <el-radio v-for="(item,index) in tempList" :key="item.id" :label="item.id">{{item.showTemplateContent}}</el-radio>
          </el-radio-group>
          <div v-if="dataTemp.length">
            <span>模板参数</span>
            <el-table border :data="dataTemp" :show-header="showHeader" style="width: 20%;">
              <el-table-column align="center" label="订单编号">
                <template slot-scope="scope">
                  {{scope.row.chaineseName}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defaultValue"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div style="text-align:right;margin-right: 40px;" v-if="!propsData.detailId">
      <el-button type="primary" @click="SendMsg">
        发送
      </el-button>
    </div>
    <!-- 自定义接收人 -->
    <define-person v-if="defineData.defineDialog" :define-data="defineData" @defineComfirm = 'defineComfirm'></define-person>

    <!-- 明细查询 -->
    <detail-list v-if="params.detailDialog" :params="params"></detail-list>

  </div>
</template>

<script>
  import {getRouteId} from '@/utils'
  import {agentAndFansNum, publishMsg, msgDetail} from '@/api/station'
  import { defineTemp, TempList , paramsList , MsgSend} from '@/api/msgRecord'
  import DefinePerson from '@/views/station/components/DefinePerson'
  import DetailList from '@/views/station/components/TheDetail'
  import {dicts} from '@/api/system'
  export default {
    name:'SendMessage',
    props:{
      propsData:{
        type:Object
      }
    },
    components:{DetailList,DefinePerson},
    data(){
      return{
          jumpObjList: [],
        msgForm:{
          receiveMemberIdList: [],
          smsTemplateId: "",
          smsTypeId: '',
          templateParamList: [],
          type: '1'
        },
        sortId:'',//模板分类id
        peopleNum:0,
        FormRules:{
          smsTypeId: [{ required: true, trigger: 'blur', message: '短信类型必选' }]
        },
        //自定义接收人
        defineData:{
          defineDialog:false,
        },
        defindeName:[],//详情的接收人
        //明细
        params:{
          detailDialog:false,
          memberIds:this.propsData.receiveIds || [],//接收人Id
          type:""
        },
        msgTypeList:[],//消息类型
        msgSortList:[],//模板分类列表
        tempList:[],//可选模板列表
        disabled:false,
        //模板参数
        dataTemp:[],
        showHeader:false//是否显示表头
      }
    },
    methods:{
      //确定回调
      defineComfirm(data){
        this.defindeIds = data
        this.params.memberIds = data
        this.peopleNum = data.length
        this.msgForm.type = ''
        this.msgForm.receiveMemberIdList = data
      },
      //发布消息
      SendMsg(){
        this.msgForm.templateParamList = []
        for(let i in this.dataTemp){
          this.msgForm.templateParamList.push({
            paramName: this.dataTemp[i].paramName,
            paramvalue: this.dataTemp[i].defaultValue,
            id: this.dataTemp[i].id
          })
        }
        this.$refs['msgForm'].validate((valid) => {
          if(valid){
            MsgSend(this.msgForm).then(res=>{
              if(res.status == 1 ){
                this.$message({
                  type:'success',
                  message:'发送短信成功！'
                })
                this.$router.push('/marketing/MsgRecord?menuId=' + getRouteId('/marketing/MsgRecord') )
              }
            })
          }
        })
      },
      //自定义接收人
      defined(){
        this.defineData.defineDialog = true
      },
      //明细弹窗
      details(){
        this.params.detailDialog = true
        this.params.type = this.msgForm.type
        if(this.propsData.receiveIds.length) this.params.type = ''
      },
      //获取消息类型
      async getMsgType(){
        let arr = []
        await dicts('100016').then(res=>{
          if(res.status === 1){
            for(let i in res.data){
              if(i==0){
                continue
              }
              arr.push(res.data[i])
            }
            this.msgTypeList = arr;
          }
        })
      },
      //获取全部代理和全部粉丝
      getAllPerson(){
        agentAndFansNum().then(res=>{
          if(res.status == 1){
            if(this.msgForm.type == 1){
              this.peopleNum = res.data.agentCount
            }else{
              this.peopleNum = res.data.fansCount
            }
          }
        })
      },
      //查询所有短信模板类别
      getTemplate(){
        defineTemp().then(res=>{
          if(res.status == 1){
            this.msgSortList = res.data
          }
        })
      },
      //可选模板列表
      tempSort(){
        TempList({id:this.sortId}).then(res=>{
          if(res.status == 1){
            this.tempList = res.data
          }
        })
      },
      //获取模板参数
      getParamsTemp(){
        paramsList({id:this.msgForm.smsTemplateId}).then(res=>{
          if(res.status == 1){
            this.dataTemp = res.data
          }
        })
      },
      //切换选择接收人
      changeSelect(){
        this.getAllPerson()
      },
      //详情展示
      // detaileShow(){
      //   msgDetail(this.propsData.detailId).then(res=>{
      //     if(res.status ==1){
      //       this.defindeName = res.data.receiveMemberName
      //       this.msgForm = {
      //         content: res.data.content,
      //         messageType: res.data.messageType.toString(),
      //         subtitle: res.data.subtitle,
      //         summary: res.data.summary,
      //         title: res.data.title
      //       }
      //       if(res.data.imageUrl){
      //         this.imgList = [{
      //           url:res.data.imageUrl
      //         }]
      //       }else{
      //         this.imgList = []
      //       }
      //     }
      //   })
      // }
    },
    mounted() {
      this.getMsgType()
      this.getTemplate()
      if(this.propsData.detailId) {
        this.disabled = true
        this.detaileShow()
      }else if(this.propsData.receiveIds.length) {
        this.params.memberIds = this.propsData.receiveIds
        this.msgForm.receiveMemberIdList = this.propsData.receiveIds
        this.peopleNum = this.propsData.receiveIds.length
        this.params.type = this.msgForm.type = ''
      }else{
        this.getAllPerson()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .accept{padding: 0;}
  .details{margin-left: 20px;color: #1890ff; cursor: pointer;}
  .defined{margin-left: 30px;}
  .select {
    .person {
      b{color: #FF0000;margin-right: 5px;font-size: 16px;}
    }
  }
  .templ{
    .el-radio{
      display:block;
      margin-bottom:20px;
      margin-top:10px;
    }
  }
</style>

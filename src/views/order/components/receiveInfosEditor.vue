<template>
  <div class="logisticsEditor">
    <el-dialog :visible.sync="dialogShow" title="更改收货地址" @close="dialogClose">
      <el-form
        :model="form"
        label-width="100px"
      >
        <el-form-item label="所在地区：">
          <el-select @change="change" @clear="clear(1)" class="select" v-model="form.provinceCode" clearable filterable placeholder="省">
            <el-option
              v-for="item in province"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select @change="changecity" @clear="clear(2)"  class="select" v-model="form.cityCode" clearable filterable placeholder="市">
            <el-option
              v-for="item in city"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select class="select" v-model="form.countyCode" clearable filterable placeholder="县" prop="countyCode">
            <el-option
              v-for="item in county"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input
            placeholder="请输入"
            type="textarea"
            rows="2"
            v-model="form.address">
          </el-input>
        </el-form-item>
        <el-form-item label="收货人姓名：">
          <el-input
            placeholder="请输入"
            v-model="form.buyReceiveName">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input
            placeholder="请输入"
            v-model="form.buyReceiveMobile">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="comfirm">确定</el-button>
        <el-button type="danger" @click="dialogClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {apiReceiveInfos} from '@/api/order'
    import { area } from '@/api/system'
    export default {
        name: "receiveInfosEditor"
        ,props:[
            //弹窗显示/隐藏
            'visible'
            //回显的收货地址对象
            ,'receiveInfos'
        ]
        ,data(){
            return {
                province:[],
                city:[],
                county:[],
                form:{
                    id:this.receiveInfos.id
                    ,address:this.receiveInfos.buyReceiveAddress[3]
                    ,buyReceiveMobile:this.receiveInfos.buyReceiveMobile
                    ,buyReceiveName:this.receiveInfos.buyReceiveName
                    ,
                    cityCode: "",
                    countyCode: "",
                    provinceCode: "",
                }
                ,dialogShow:false
            }
        }
        ,methods:{
            //确认修改地址
            comfirm(){
                apiReceiveInfos(this.form).then(res=>{
                    if(res.status == 1){
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.dialogClose();
                        this.$emit('receiveConfirm');
                    }
                })
            }
            ,dialogClose(){
                this.$emit('receiveClose');
            }
            //获取省市区
            ,getProvince(firstLoad = 0) {
                area({type:1,parentCode:''}).then(res => {
                    if (res.status == 1) {
                        this.province = res.data
                        if(firstLoad){
                            for(let i in res.data){
                                if(res.data[i].name == this.receiveInfos.buyReceiveAddress[0]){
                                    this.form.provinceCode = res.data[i].code;
                                    this.getcity(res.data[i].code,1);
                                }
                            }
                        }
                    }
                })
            },
            //获取市区
            getcity(code,firstLoad = 0){
                if(firstLoad) code = this.form.provinceCode;
                area({type:2,parentCode:code}).then(res => {
                    if(res.status == 1){
                        this.city = res.data
                        if(firstLoad){
                            for(let i in res.data){
                                if(res.data[i].name == this.receiveInfos.buyReceiveAddress[1]){
                                    this.form.cityCode = res.data[i].code;
                                    this.getcountry(res.data[i].code,1);
                                }
                            }
                        }
                    }
                })
            },
            //获取县
            getcountry(code,firstLoad = 0){
                if(firstLoad) code = this.form.cityCode;
                area({type:3,parentCode:code}).then(res=>{
                    if(res.status == 1){
                        this.county = res.data
                        if(firstLoad){
                            for(let i in res.data){
                                if(res.data[i].name == this.receiveInfos.buyReceiveAddress[2]){
                                    this.form.countyCode = res.data[i].code;
                                }
                            }
                        }
                    }
                })
            },
            change(){
                this.getcity(this.form.provinceCode)
                this.form.cityCode = ''
                this.form.countyCode = ''
            },
            changecity(){
                this.getcountry(this.form.cityCode)
                this.form.countyCode = ''
            },
            // 清空省市县触发事件
            clear(data) {
                if(data == 1) {
                    this.city = [];
                    this.county = [];
                } else {
                    this.county = [];
                }
            },
        }
        ,mounted() {
            this.getProvince(1)
            this.dialogShow = this.visible;
        }
    }
</script>

<style scoped>

</style>

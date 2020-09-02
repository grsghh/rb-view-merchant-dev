<template>
  <div
    v-loading="loading"
    class="logisticsEditor"
  >
    <el-form
      label-width="120px"
    >
      <el-form-item label="物流公司：">
        {{detail.logisticsName}}
        <i class="el-icon-document-copy"
           v-clipboard:copy="`${detail.logisticsName},${detail.trackingNO}`"
           v-clipboard:success="onCopy"></i>
        <i class="el-icon-edit" v-if="!detail.noEdit" @click="logisticsDialog = true"></i>
      </el-form-item>
      <el-form-item label="运单号：">
        {{detail.trackingNO}}
        <i class="el-icon-document-copy"
           v-clipboard:copy="detail.trackingNO"
           v-clipboard:success="onCopy"></i>
      </el-form-item>
      <el-form-item label="物流信息：" v-if="detail.kuaidiInfos && detail.kuaidiInfos.length">
        <el-timeline>
          <el-timeline-item
            v-for="(item,index) in detail.kuaidiInfos"
            :key="index"
            :timestamp="item.time"
            :type="!index ? 'primary':''"
          >
            {{item.status}}
          </el-timeline-item>
        </el-timeline>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="logisticsDialog" title="修改物流" destroy-on-close append-to-body>
      <el-form
        :model="logisticsForm"
        label-width="120px"
      >
        <el-form-item label="快递公司：">
          <el-select v-model="logisticsForm.logisticsId" placeholder="请选择">
            <el-option
              v-for="item in company"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：">
          <el-input v-model="logisticsForm.trackingNO" placeholder=""/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="comfirmToChangeLog">确定</el-button>
        <el-button type="danger" @click="logisticsDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {frequentLogistics} from '@/api/system'
    import {
        apiChangeLog
    } from '@/api/order'

    export default {
        name: "logisticsEditor"
        , props: ['detail']
        , data() {
            return {
                logisticsDialog: false
                , logisticsForm: {
                    id: this.detail.id
                    , logisticsId: this.detail.logisticsId || ''
                    , trackingNO: this.detail.trackingNO || ''
                }
                ,company:[]
                ,loading:true
            }
        }
        , methods: {
            onCopy() {
                this.$message({
                    type: 'success',
                    message: '复制成功'
                })
            }
            //确认修改物流
            , comfirmToChangeLog() {
                apiChangeLog(this.logisticsForm).then(res => {
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '修改物流成功！!'
                        });
                        this.$emit('logisticsChanged');
                        this.logisticsDialog = false;
                    }
                })
            }
            //查询快递公司
            ,async getCompany(category = 2) {
                await frequentLogistics({category}).then(res => {
                    if (res.status == 1) {
                        let array = [];
                        let len = res.data.length;
                        for (let i = 0; i < len; i++) {
                            let aa = {};
                            aa['label'] = res.data[i].logisticsName;
                            aa['value'] = res.data[i].logisticsId;
                            array.push(aa);
                        }
                        this.company = array;
                    }
                })
            }
        }
        ,mounted() {
            this.getCompany();
        }
        ,watch:{
            detail:{
                deep:true
                ,immediate:true
                ,handler(newVal,oldVal){
                    this.detail = newVal;
                    //物流信息接口信息完全载入
                    this.loading = this.detail.loaded === false;
                }
            }
        }
    }
</script>

<style scoped>

</style>

<template>
  <div class="contentBox h5MaterialDetail">
        <div class="article">
          <h1>{{detail.title}}</h1>
          <h2 class="base-delColor">{{detail.createTime}}</h2>
          <h3 class="base-delColor">{{detail.subtitle}}</h3>
          <h3 class="base-delColor">{{detail.summary}}</h3>
          <article v-html="detail.content"></article>
        </div>
  </div>
</template>

<script>
    import { apiMsgDetail, apiArticlesDetail } from '@/api/msgCenter'
    import {removeH5FontSize} from '@/utils'
    export default {
        name: "msgDetail"
        , data() {
            return {
                detail: {}
                ,form:{
                    id: '',
                    targetId: ''
                }
            }
        }
        , methods: {
            getParam(){
                this.form.id = this.$route.query.id;
                this.form.targetId = this.$route.query.targetId;
            }
            ,getData(){
                if(this.form.id) {
                    apiMsgDetail(this.form.id).then(res=>{
                        if(res.status == 1){
                            this.detail = res.data;
                        }
                    })
                }
                if(this.form.targetId) {
                    apiArticlesDetail(this.form.targetId).then(res=>{
                        if(res.status == 1){
                            this.detail = res.data;
                        }
                    })
                }

            }

        }
        , created() {
            this.getParam();
        },
        mounted() {
            removeH5FontSize();
            this.getData();
        }
    }
</script>

<style scoped lang="scss">
  .tools{display: flex;justify-content: center;font-size: 12px;margin-top: 10px;color: #999;
    span{display: flex;align-items: center; }
    i{font-size: 30px;margin-right: 5px;}
    /deep/ .down{margin-left: 40px;transform: rotateZ(90deg) rotateX(180deg)}
  }

</style>

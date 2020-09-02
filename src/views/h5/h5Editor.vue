<template>
  <div class="h5Editor">
    <Tinymce :height="300" v-model="form.content"/>
  </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    export default {
        components: { Tinymce},
        name: "h5Editor"
        ,data(){
            return {
                form:{
                    content:''
                }
            }
        }
    }
</script>

<style scoped lang="scss">
  .h5Editor{
    &>>>.mce-btn-group .mce-btn{float: left;}
  }
</style>

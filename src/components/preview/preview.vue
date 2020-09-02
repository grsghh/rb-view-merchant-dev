<template>
    <div class="preview">
      <div class="phone">
        <section>
          <goodDetail :param="miniParam.param" v-if="miniParam.name == 'goodDetail'"></goodDetail>
          <home :param="miniParam.param" v-if="miniParam.name == 'home'"></home>
          <materialDetail :param="miniParam.param" v-if="miniParam.name == 'materialDetail'"></materialDetail>
        </section>
      </div>
    </div>
</template>

<script>
    import goodDetail from '@/components/preview/goodDetail'
    import home from '@/components/preview/home'
    import materialDetail from '@/views/h5/h5MaterialDetail'
    export default {
        /*
        * miniParam.name 需要展示的小程序页面组件名称
        * miniParam.param 小程序组件需要用的参数
        * */
        props:['miniParam'],
        components: {goodDetail,home,materialDetail},
        name: "preview"
        ,mounted() {
        }
    }
</script>

<style lang="scss">
  .preview{position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);
    .phone{background: url("../../assets/imgs/iphone.png") no-repeat;width: 433.5px;height: 890px;background-size: 100% 100%;position: relative;
      &>section{width:375px;height: 667px;overflow-y: auto;left: 50%;transform: translateX(-50%);top: 109px;position: absolute;overflow-x: hidden;}
    }
  }
</style>

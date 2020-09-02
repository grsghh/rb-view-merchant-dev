<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" size="mini" type="primary" @click=" dialogVisible=true">
      添加表情
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body title="点击选择表情">
      <img :src="require(`../../../assets/wxFace/${index}.png`)" :alt="wxFace[index]" v-for="(item,index) in wxFace" :key="index" @click="selectFace({label:item,index})" class="wxFace">
    </el-dialog>
  </div>
</template>

<script>
import wxFace from '@/utils/wxFaceJson'

export default {
  name: 'EditorSlideUploadVideo',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false
        ,wxFace
    }
  },
  methods: {
    selectFace(param) {
      this.$emit('successCBK',`[${param.label}]`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .wxFace{cursor: pointer;}
</style>

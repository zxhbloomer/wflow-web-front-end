<template>
  <div class="mobile-view">
    <div class="mobile-nav">
      <i class="el-icon-arrow-left"></i>
      <span>{{$store.state.design.formName}}</span>
      <span style="float:right; cursor: pointer" @click="submit">提交</span>
    </div>
    <div class="mobile-content">
      <form-render ref="form" :forms="forms" mode="MOBILE" v-model="formData"/>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";
import FormRender from '@/views/common/form/FormRender'

export default {
  name: "FormDesignMobilePreview",
  components: {FormRender},
  data() {
    return {
      formData:{}
    }
  },
  computed: {
    forms() {
      return this.$store.state.design.formItems;
    }
  },
  methods: {
    submit(){
      this.$refs.form.validate(valid => {
        if (valid){
          //Toast.success('校验成功')
        }else {
          Toast.fail('请完善表单')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
body{
  min-width: auto !important;
}
.mobile-view {
  //background: #f7f8fa;
  overflow: hidden;
  //box-shadow: 0 0 10px #dcdbdb;
  .mobile-nav{
    position: fixed;
    top: 0;
    width: calc(100% - 30px);
    z-index: 999;
    padding: 2px 15px;
    color: white;
    background: @theme-primary;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f7f8fa;
    span{
      font-size: 1rem;
      margin-left: 10px;
    }
    i{
      cursor: pointer;
    }
  }
  .mobile-content{
    margin-top: 40px;
    overflow-y: auto;
    /deep/ .el-form-item{
      padding: 0 10px;
      background: white;
    }
  }
}

::-webkit-scrollbar {
  width: 0;
  background-color: white;
}

</style>

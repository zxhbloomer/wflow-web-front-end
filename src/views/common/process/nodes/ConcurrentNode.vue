<template>
  <div  :class="{'node': true, 'node-error-state': showError}">
    <div :class="{'node-body': true, 'error': showError}" @click="$emit('selected')">
      <div class="node-body-left" @click.stop="$emit('leftMove')" v-if="level > 1">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="node-body-main">
        <div class="node-body-main-header">
          <span class="title">
            <i class="el-icon-s-operation"></i>
            <ellipsis class="name" hover-tip :content="config.name ? config.name:('并行任务' + level)"/>
          </span>
          <span class="option">
            <el-tooltip effect="dark" content="复制分支" placement="top">
              <i class="el-icon-copy-document" @click="$emit('copy')"></i>
            </el-tooltip>
            <i class="el-icon-close" @click.stop="$emit('delNode')"></i>
          </span>
        </div>
        <div class="node-body-main-content">
          <span>并行任务（同时进行）</span>
        </div>
      </div>
      <div class="node-body-right" @click.stop="$emit('rightMove')" v-if="level < size">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="node-error" v-if="showError">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button @insertNode="type => $emit('insertNode', type)"></insert-button>
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/views/common/InsertButton.vue'

export default {
  name: "ConcurrentNode",
  components: {InsertButton},
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
    },
    level:{
      type: Number,
      default: 1
    },
    //条件数
    size:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      errorInfo: '',
      showError: false
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(err){
      try {
        this.showError = !this.config.children || !this.$isNotEmpty(this.config.children.id)
        if (this.showError){
          err.push(`并行分支${this.config.name}下面无节点`)
          this.errorInfo = '请添加业务节点'
        }
        return this.showError
      } catch (e) {
        return true;
      }
    },
  }
}
</script>

<style lang="less" scoped>

.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}

.node{
  padding: 30px 55px 0;
  width: 220px;
  .node-body{
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover{
      .node-body-left, .node-body-right{
        i{
          display: block !important;
        }
      }
      .node-body-main {
        .option{
          display: inline-block !important;
        }
      }
      box-shadow: 0px 0px 3px 0px @theme-primary;
    }
    .node-body-left, .node-body-right{
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      i{
        display: none;
      }
      &:hover{
        background-color: #ececec;
      }
    }
    .node-body-left{
      left: 0;
    }
    .node-body-right{
      right: 0;
    }
    .node-body-main {
      position: absolute;
      width: 188px;
      left: 17px;
      display: inline-block;

      .node-body-main-header{
        padding: 10px 0px 5px;
        font-size: xx-small;
        position: relative;
        .title{
          color: #718dff;
          .name{
            display: inline-block;
            height: 14px;
            width: 130px;
            margin-left: 2px;
          }
        }
        .option{
          position: absolute;
          right: 0;
          display: none;
          font-size: medium;
          i{
            color: #888888;
            padding: 0 3px;
          }
        }
      }
      .node-body-main-content {
        padding: 6px;
        color: #656363;
        font-size: 14px;

        i {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }
      }
    }
    .node-error {
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer{
    position: relative;
    .btn{
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }
    /deep/ .el-button{
      height: 32px;
    }
    &::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }
  }
}
</style>

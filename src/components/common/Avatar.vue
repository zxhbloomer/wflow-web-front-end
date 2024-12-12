<template>
  <div :class="{avatar: true, 'show-y': showY}">
    <div class="a-img">
      <template v-if="type === 'user'">
        <el-avatar v-if="src" :size="size" :src="src"/>
        <div v-else :style="{'--bgc': bgc, '--size': size + 'px',}">
          <span>{{ alisa }}</span>
        </div>
      </template>
      <el-avatar v-else-if="type === 'dept'" style="background: #f78f5f" icon="iconfont icon-map-site" :size="size"/>
      <el-avatar v-else icon="el-icon-user-solid" style="background: #576a95" :size="size"/>
      <i class="close el-icon-close" v-if="closeable" @click="$emit('close')"></i>
      <i :class="['status', statusIcon]" v-show="status"></i>
    </div>
    <div class="name" v-if="!showY && showName">{{ name }}</div>
    <ellipsis hoverTip class="name" v-show="showName" :style="{width: (size + 10) + 'px'}" :content="name" v-else/>
  </div>
</template>

<script>
export default {
  name: "Avatar",
  install(Vue){
    Vue.component('avatar', this)
  },
  components: {},
  props: {
    type: {
      type: String,
      default: 'user'
    },
    name: {
      type: String,
      default: '未知'
    },
    size: {
      type: Number,
      default: 40
    },
    src: {
      type: String,
      default: undefined
    },
    bgc: {
      type: String,
      default: '#1989fa'
    },
    square:{
      type: Boolean,
      default: false
    },
    showY: {
      type: Boolean,
      default: false
    },
    showName:{
      type: Boolean,
      default: true
    },
    closeable:{
      type: Boolean,
      default: false
    },
    status:{
      type: String
    }
  },
  computed: {
    alisa() {
      return this.name.length > 2 ? this.name.substring(this.name.length - 2, this.name.length) : this.name
    },
    statusIcon(){
      switch (this.status){
        case 'error': return 'error el-icon-error';
        case 'pending': return 'pending iconfont icon-dengdaizhongbeifen';
        case 'success': return 'success el-icon-success';
        case 'cc': return 'cc el-icon-s-promotion';
        case 'comment': return 'comment iconfont icon-xiaoxi';
        case 'transfer': return 'transfer iconfont icon-zhuanyi';
        case 'cancel': return 'cancel iconfont icon-fanhui-chehui-06';
        case 'recall': return 'recall iconfont icon-quxiao';
        case 'leader': return 'leader el-icon-user-solid';
        default: return null
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.show-y{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column !important;
  .name{
    margin-left: 0 !important;
  }
}
.close{
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  background: black;
}
.avatar {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  .a-img{
    display: flex;
    border-radius: 50%;
    flex-direction: column;
    justify-content: center;
    background: white;
    position: relative;

    & > div {
      display: inline-block;
      text-align: center;
      background: var(--bgc);
      color: white;
      border-radius: 50%;
      width: var(--size);
      height: var(--size);
      line-height: var(--size);
      font-size: 14px;
    }
  }
  /deep/ .el-avatar{
    background: white;
  }

  .name{
    text-align: center;
    color: #19191a;
    font-size: 14px;
    margin-left: 10px;
  }
}

.status{
  position: absolute;
  bottom: -4px;
  right: -8px;
  border-radius: 50%;
  font-size: 15px;
  background: white;
  border: 2px solid white;
}

.error{
  color: @theme-danger;
}

.leader{
  font-size: 12px;
  color: @theme-warning;
}

.pending{
  color: @theme-warning;
}

.success{
  color: @theme-success;
}

.transfer{
  color: white;
  background: #7a939d;
  font-size: 12px;
  padding: 1px;
}

.comment{
  color: @theme-primary;
}

.cc{
  color: white;
  font-size: 12px;
  padding: 1px;
  background: @theme-primary;
}

.cancel{
  color: #838383;
}

.recall{
  color: #f56c6c;
}

</style>

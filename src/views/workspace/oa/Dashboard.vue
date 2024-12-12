<template>
  <div style="padding: 20px;">
    <div class="nav-cards">
      <el-row :gutter="50">
        <el-col :span="8">
          <div class="nav-card" style="background: #f78b5a">
            <img src="../../../assets/image/pending.png" alt="">
            <span>待处理的</span>
            <span>2</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="nav-card" style="background: #02b068">
            <img src="../../../assets/image/submit.png" alt="">
            <span>我发起的</span>
            <span>3</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="nav-card" style="background: #6b7cff">
            <img src="../../../assets/image/cc.png" alt="">
            <span>抄送我的</span>
            <span>4</span>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.nav-cards{

  .nav-card{
    position: relative;
    padding: 25px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    background: @theme-aside-bgc;
    img{
      width: 40px;
      height: 40px;
      background: white;
      padding: 5px;
      border-radius: 10px;
      margin-right: 10px;
    }
    &>span:first-child{
      margin-left: 10px;
      color: #8c8c8c;
    }
    &>span:last-child{
      font-size: 40px;
      font-weight: bold;
      color: white;
      position: absolute;
      right: 20px;
    }
  }
}

</style>

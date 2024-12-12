<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="笔画粗细">
      <el-input-number controls-position="right" :precision="0" :max="5" :min="1" size="small" v-model="value.thickness"  placeholder="笔画粗细"/>
    </el-form-item>
    <el-form-item label="笔迹颜色">
      <el-color-picker v-model="value.color" size="medium"></el-color-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "SignPanelConfig",
  props:{
    value:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>

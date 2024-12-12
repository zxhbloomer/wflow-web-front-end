<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="value.multiple"></el-switch>
    </el-form-item>
   </div>
</template>

<script>
export default {
  name: "UserPickerConfig",
  components: {},
  props:{
    value:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    selected(select){
      this.value.options.length = 0
      select.forEach(val => this.value.options.push(val))
    }
  }
}
</script>

<style scoped>

</style>

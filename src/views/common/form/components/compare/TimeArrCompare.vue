<template>
  <el-date-picker
      v-model="context.compareVal[0]"
      type="datetime" size="small"
      placeholder="选择比较时间点">
  </el-date-picker>
</template>
<script>
export default {
  name: "TimeArrCompare",
  components: {},
  props: {
    context:{
      require: true,
      type: Object
    }
  }
}
</script>

<template>
  <el-date-picker
      v-if="context.compare === 'IN' || context.compare === 'NIN'"
      v-model="context.compareVal"
      type="datetimerange"
      size="small"
      placeholder="选择比较时间区间">
  </el-date-picker>
  <el-date-picker
      v-else size="small"
      v-model="context.compareVal[0]"
      type="datetime"
      placeholder="选择比较时间点">
  </el-date-picker>
</template>
<script>
export default {
  name: "TimeCompare",
  components: {},
  props: {
    context:{
      require: true,
      type: Object
    }
  }
}
</script>

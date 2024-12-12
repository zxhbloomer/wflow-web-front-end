<template>
  <el-input size="small"
            v-model="context.compareVal[0]" placeholder="输入比较值"></el-input>
</template>
<script>
export default {
  name: "StrArrCompare",
  components: {},
  props: {
    context:{
      require: true,
      type: Object
    }
  }
}
</script>

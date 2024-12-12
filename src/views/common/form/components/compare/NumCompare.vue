<template>
  <span v-if="context.compare === 'IN_EQ' || context.compare === 'IN_NEQ'">
    <el-input-number size="small" controls-position="right" v-model="context.compareVal[0]"/>
    <span style="margin: 5px"> ~ </span>
    <el-input-number size="small" controls-position="right" v-model="context.compareVal[1]"/>
  </span>
  <el-select v-else-if="context.compare === 'IN' || context.compare === 'NIN'"
             size="small" multiple default-first-option
             style="width: calc(100% - 410px);"
             allow-create filterable v-model="context.compareVal"
             placeholder="输入可能的值"></el-select>
  <el-input-number v-else size="small" controls-position="right" v-model="context.compareVal[0]"/>
</template>
<script>
export default {
  name: "NumCompare",
  props: {
    context:{
      require: true,
      type: Object
    }
  },
}
</script>

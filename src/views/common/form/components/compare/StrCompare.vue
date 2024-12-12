<template>
  <el-select v-if="context.compare === 'IN' || context.compare === 'NIN'"
             size="small" multiple default-first-option
             style="width: calc(100% - 410px);"
             allow-create filterable v-model="context.compareVal"
             placeholder="输入可能的值"></el-select>
  <el-input v-else size="small" style="width: calc(100% - 410px);"
            v-model="context.compareVal[0]" placeholder="输入比较值"></el-input>
</template>
<script>
export default {
  name: "StrCompare",
  props: {
    context:{
      require: true,
      type: Object
    }
  },
}
</script>

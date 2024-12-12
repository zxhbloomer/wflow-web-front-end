<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="value.multiple"></el-switch>
    </el-form-item>
    <el-form-item label="备选模式">
      <el-switch v-model="value.expansion"></el-switch>
    </el-form-item>
    <el-form-item label="选项" v-if="value.expansion">
      <el-button size="mini" type="primary" icon="el-icon-plus" round @click="$refs.orgPicker.show()">添加</el-button>
      <org-items v-model="value.options"/>
    </el-form-item>
    <org-picker title="请选择部门备选项" multiple type="dept" ref="orgPicker" :selected="value.options" @ok="selected"/>
  </div>
</template>

<script>
import OrgItems from "@/views/common/process/OrgItems";
import OrgPicker from "@/components/common/OrgPicker";
export default {
  name: "DeptPickerConfig",
  components: {OrgItems, OrgPicker},
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

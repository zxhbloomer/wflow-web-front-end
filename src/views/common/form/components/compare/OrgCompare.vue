<template>
  <span>
    <el-button type="primary" size="small" round @click="showPicker">选择人员/部门</el-button>
    <org-items v-model="context.compareVal"/>
    <org-picker ref="orgPicker" :multiple="context.compare === 'IN'"
                title="选择要比较的人员/部门" :selected="context.compareVal" @ok="selected"/>
  </span>

</template>
<script>
import OrgPicker from "@/components/common/OrgPicker.vue";
import OrgItems from "../../../process/OrgItems.vue";

export default {
  name: "OrgCompare",
  components: {OrgItems, OrgPicker},
  props: {
    context:{
      require: true,
      type: Object
    }
  },
  methods:{
    showPicker(){
      this.$refs.orgPicker.show()
    },
    selected(orgs){
      this.context.compareVal = orgs
    }
  }
}
</script>

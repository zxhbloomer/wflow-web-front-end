<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="选择流程">
      <el-cascader size="small" :show-all-levels="false" :props="{emitPath: false}" v-model="value.processCode" :options="options"></el-cascader>
    </el-form-item>
  </div>
</template>

<script>
import {getGroupModels} from "@/api/modelGroup";

export default {
  name: "ProcessIndexConfig",
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
    return {
      options:[]
    }
  },
  created() {
    this.getModels()
  },
  methods: {
    getModels(){
      this.options.length = 0
      getGroupModels().then(res => {
        res.data.forEach(group => {
          this.options.push({
            value: group.id,
            label: group.name,
            children: group.items.map(it => {
              return {
                value: it.formId,
                label: it.formName,
              }
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>

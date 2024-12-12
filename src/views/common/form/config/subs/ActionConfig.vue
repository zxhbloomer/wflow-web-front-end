<template>
  <div class="w-rule-actions">
    <el-button class="w-rule-actions-add" icon="el-icon-plus" type="text" @click="addAction">{{addText}}</el-button>
    <div v-for="(action, i) in value" :key="'action' + i" class="w-rule-action">
      <i class="el-icon-delete icon" @click="value.splice(i, 1)"></i>
      <el-select style="width: 150px; margin-right: 10px" v-model="action.type" size="small" placeholder="选择动作类型" @change="action.targets.length = 0">
        <el-option value="SHOW" label="显示表单字段"></el-option>
        <el-option value="HIDE" label="隐藏表单字段"></el-option>
        <el-option value="ENABLE" label="允许编辑字段"></el-option>
        <el-option value="DISABLE" label="禁止编辑字段"></el-option>
        <el-option value="UPDATE" label="设置字段值"></el-option>
      </el-select>
      <template v-if="action.type !== 'UPDATE'">
        <el-select style="width: calc(100% - 180px);" v-model="action.targets" multiple size="small" placeholder="选择表单字段">
          <el-option :key="item.id" v-for="item in options" :value="item.id" :label="item.title"></el-option>
        </el-select>
      </template>
      <template v-else>
        <el-select style="width: calc(100% - 180px); margin: 5px" @change="action.value = null"
                   v-model="action.targets[0]" size="small" placeholder="选择表单字段">
          <el-option :key="item.id" v-for="item in options" :value="item.id" :label="item.title"></el-option>
        </el-select>
        <form-design-render v-if="action.targets.length > 0" mode="PC" v-model="action.value" :config="formItemMap.get(action.targets[0])"/>
      </template>
    </div>
  </div>
</template>

<script>
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender'
export default {
  name: "ActionConfig",
  components: {FormDesignRender},
  props:{
    value:{
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    addText: String
  },
  data() {
    return {

    }
  },
  computed:{
    formItemMap() {
      return this.$store.state.formItemMap
    },
  },
  methods:{
    addAction(){
      this.value.push({
        targets: [],
        type: null,
        value: null
      })
    },
  }
}
</script>

<style scoped lang="less">
.w-rule-actions{
  position: relative;
  margin: 15px 0;
  padding: 10px;
  border-radius: 5px;
  border: 2px dashed #E8E8E8;
  .w-rule-actions-add{
    position: absolute;
    padding: 5px;
    top: -15px;
    left: calc(50% - 95px);
    background: white;
  }
  .w-rule-action {
    position: relative;
    margin: 7px 0;
    padding: 8px;
    border-radius: 5px;
    background: @theme-aside-bgc;
    .icon {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: -12px;
      padding: 5px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 10px 0 #E8E8E8;
      &:hover{
        color: @theme-danger;
      }
    }
  }
}
</style>

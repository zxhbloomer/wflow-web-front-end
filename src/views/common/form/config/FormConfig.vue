<template>
  <div >
    <el-radio-group style="margin: 20px 0 10px 0" v-model="formConfig.ruleType">
      <el-radio label="SIMPLE">简单模式</el-radio>
      <el-radio label="SCRIPT">高级模式</el-radio>
    </el-radio-group>
    <template v-if="formConfig.ruleType === 'SIMPLE'">
      <div class="w-add-rule" @click="addRule">
        + 添加联动规则
      </div>
      <div>
        <div class="w-form-rule" v-for="(rule, i) in formConfig.rules" :key="'rule_' + i" @click="editRule(i, rule)">
          <div class="w-form-rule-content"></div>
          <i class="el-icon-close icon" @click.stop="removeRule(i)"></i>
          <div>{{'规则 ' + (i + 1)}}</div>
        </div>
      </div>

    </template>
    <el-button v-else size="small" @click="addRule" style="margin-top: 10px;" icon="el-icon-set-up">使用JS控制联动</el-button>
    <w-dialog v-model="ruleDialog" :title="`${isAddRule ? '新增':'编辑'}表单联动规则`" @ok="confirmRule">
      <template v-if="formConfig.ruleType === 'SIMPLE'">
        <el-alert type="success" description="当满足如下条件关系时，执行下方一系列联动动作" close-text="知道了" style="margin-bottom: 10px"/>
        <condition-config class="w-rule-conditions" :form-items="formItems" v-model="selectedRule.condition"/>
        <action-config :options="formItems" v-model="selectedRule.action.with" add-text="添加动作（满足条件时执行）"/>
        <action-config :options="formItems" v-model="selectedRule.action.other" add-text="添加动作（不满足条件时执行）"/>
      </template>
      <template v-else>
        <code-editor v-model="formConfig.ruleJs"/>
      </template>
    </w-dialog>
  </div>
</template>

<script>
import ConditionConfig from "./subs/ConditionConfig.vue";
import CodeEditor from "@/components/common/CodeEditor.vue";
import ActionConfig from "./subs/ActionConfig.vue";

export default {
  name: "FormConfig",
  components: {ActionConfig, CodeEditor, ConditionConfig},
  data() {
    return {
      ruleDialog: false,
      activeName: 'base',
      isAddRule: true,
      selectedRuleIndex: null,
      selectedRule: {condition: {}, action: {}},
      ruleProps: {
        condition: {
          logic: true,
          condition: {
            field: null,
            fieldType: null,
            compare: null,
            fixed: true,
            compareVal: []
          },
          children: []
        },
        action: {
          with: [//满足条件时执行
            {
              targets: [],
              type: null,
              value: null
            }
          ],
          other: [//不满足条件时执行
            {
              targets: [],
              type: null,
              value: null
            }
          ],
        }
      },
    }
  },
  computed:{
    formConfig(){
      return this.$store.state.design.formConfig
    },
    formItemMap: {
      get(){
        return this.$store.state.formItemMap
      },
      set(val) {
        this.$store.state.formItemMap = val
      }
    },
    formItems(){
      const items = []
      this.formItemMap = new Map()
      this.$store.state.design.formItems.forEach(item => {
        this.loadItems(items, item)
      })
      return items
    }
  },
  methods: {
    loadItems(items, item, alisa){
      this.formItemMap.set(item.id, item)
      if (item.name === 'SpanLayout'){
        item.props.items.forEach(it => this.loadItems(items, it))
      }else if (item.name === 'TableList'){
        items.push(item)
        item.props.columns.forEach(it => {
          this.loadItems(items, it, `${item.title}.${it.title}`)
        })
      }else {
        items.push({
          id: item.id,
          name: item.name,
          title: alisa || item.title,
          valueType: item.valueType,
          props: item.props
        })
      }
    },
    addRule(){
      this.isAddRule = true
      this.selectedRule = this.$deepCopy(this.ruleProps)
      this.ruleDialog = true
    },
    editRule(i, rule){
      this.isAddRule = false
      this.ruleDialog = true
      this.selectedRuleIndex = i
      this.selectedRule = this.$deepCopy(rule)
    },
    removeRule(i){
      this.formConfig.rules.splice(i, 1)
    },
    confirmRule(){
      if (this.isAddRule){
        this.formConfig.rules.push(this.selectedRule)
      }else {
        this.formConfig.rules[this.selectedRuleIndex] = this.selectedRule
      }
      this.ruleDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.w-add-rule{
  padding: 5px;
  text-align: center;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: 2px dashed #E8E8E8;
  &:hover {
    color: @theme-primary;
    border-color: @theme-primary;
  }
}

.w-form-rule {
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  position: relative;
  border: 1px solid white;
  &:hover {
    box-shadow: 0 0 10px 0 #E8E8E8;
    transition: box-shadow 0.5s;
    border: 1px dashed @theme-primary;
  }
  .icon {
    position: absolute;
    right: -8px;
    top: -10px;
    padding: 5px;
    border-radius: 50%;
    background: white;
    &:hover{
      color: @theme-danger;
    }
  }
}

.w-rule-conditions{

}

</style>

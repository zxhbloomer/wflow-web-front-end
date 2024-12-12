<template>
  <div>
    <el-tabs v-model="active" v-if="name && formConfig.length > 0">
      <el-tab-pane :label="name" name="properties">
        <component :is="(selectNode.type||'').toLowerCase()" :config="selectNode.props"/>
      </el-tab-pane>
      <el-tab-pane label="表单权限" name="formPerm">
        <form-authority-config/>
      </el-tab-pane>
      <el-tab-pane label="操作权限" name="operatePerm"
                   v-if="selectNode.type === 'APPROVAL' || selectNode.type === 'ROOT'">
        <task-operation-config/>
      </el-tab-pane>
<!--      <el-tab-pane label="监听器" name="listener"
                   v-if="selectNode.type === 'APPROVAL' || selectNode.type === 'ROOT'">
        <task-node-config/>
      </el-tab-pane>-->
    </el-tabs>
    <component :is="(selectNode.type||'').toLowerCase()" v-else :config="selectNode.props"/>
  </div>
</template>

<script>
import Approval from './ApprovalNodeConfig.vue'
import Condition from './ConditionNodeConfig.vue'
import Delay from './DelayNodeConfig.vue'
import Cc from './CcNodeConfig.vue'
import Trigger from './TriggerNodeConfig.vue'
import FormAuthorityConfig from './FormAuthorityConfig.vue'
import TaskOperationConfig from './TaskOperationConfig.vue'
import Root from './RootNodeConfig.vue'
import TaskNodeConfig from "./TaskListenerConfig.vue";

export default {
  name: "NodeConfig",
  components: {
    FormAuthorityConfig,
    TaskOperationConfig,
    TaskNodeConfig,
    Approval,
    Condition,
    Trigger,
    Delay,
    Root,
    Cc
  },
  data() {
    return {
      active: 'properties',
    }
  },
  computed: {
    selectNode() {
      return this.$store.state.selectedNode
    },
    formConfig() {
      return this.$store.state.design.formItems
    },
    name() {
      switch (this.selectNode.type) {
        case 'ROOT':
          return '设置发起人';
        case 'APPROVAL':
          return '设置审批人';
        case 'CC':
          return '设置抄送人';
        default:
          return null;
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>

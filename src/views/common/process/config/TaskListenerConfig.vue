<template>
  <div>
    <el-alert title="当节点状态变化时，您可以在此处配置监听器做一些事情" type="success" :closable="false"/>
    <el-button style="margin-top: 20px" size="mini" @click="addListenerGroup">+ 添加监听组</el-button>
    <div v-for="group in listeners" class="listener-group">
      <div class="listener-group-condition">
        <el-select v-model="group.condition">
          <el-option value="NODE_ENTER" label="当流程进入本节点时"/>
          <el-option v-if="selectedNode.type === 'APPROVAL'" value="NODE_REFUSE" label="当本节点审批拒绝时"/>
          <el-option value="NODE_AGREE" label="当本节点审批通过时"/>
          <el-option value="USER_AGREE" label="当有审批人同意时"/>
        </el-select>
      </div>
      <div class="listener-group-actions"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TaskNodeConfig",
  components: {},
  data() {
    return {
      active: 'properties',
    }
  },
  computed: {
    selectedNode() {
      return this.$store.state.selectedNode
    },
    listeners() {
      this.selectedNode.props.listeners
    }
  },
  methods:{
    addListenerGroup(){
      this.listeners.push({
        condition: '',
        actions: []
      })
    }
  }
}
</script>

<style scoped lang="less">
.listener-group {
  padding: 20px;
  border-radius: 5px;
  border: 1px dashed @theme-desc-color;
}
</style>

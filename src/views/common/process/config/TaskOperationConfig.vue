<template>
  <el-table v-if="selectedNode.props.operationPerm" :header-cell-style="{background:'#f5f6f6'}" :data="operatePerms" border style="width: 100%">
    <el-table-column prop="name" show-overflow-tooltip label="操作项"></el-table-column>
    <el-table-column prop="alisa" show-overflow-tooltip label="自定义别名">
      <template slot-scope="scope">
        <el-input size="small" clearable v-model="selectedNode.props.operationPerm[scope.row.symbol].alisa"/>
      </template>
    </el-table-column>
    <el-table-column prop="show" show-overflow-tooltip label="是否启用">
      <template slot-scope="scope">
        <el-switch :disabled="disable(scope.row.symbol)" v-model="selectedNode.props.operationPerm[scope.row.symbol].show"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  name: "TaskOperationConfig",
  components: {},
  data() {
    return {
      active: 'properties',
    }
  },
  created() {
    this.loadPerms()
  },
  computed: {
    selectedNode() {
      return this.$store.state.selectedNode
    },
    operatePerms() {
      if (this.selectedNode.type === 'ROOT') {
        return [
          {name: '提交', symbol: 'agree'},
          {name: '撤销', symbol: 'cancel'}
        ]
      } else if (this.selectedNode.type === 'APPROVAL') {
        return [
          {name: '同意', symbol: 'agree'},
          {name: '拒绝', symbol: 'refuse'},
          {name: '转交', symbol: 'transfer'},
          {name: '后加签', symbol: 'afterAdd'},
          {name: '退回', symbol: 'recall'},
          {name: '撤销', symbol: 'cancel'}
        ]
      } else {
        return []
      }
    },
  },
  methods:{
    loadPerms(){
      const opPerms = this.selectedNode.props.operationPerm || {}
      this.operatePerms.forEach(perm => {
        if (!opPerms[perm.symbol]){
          this.$set(opPerms, perm.symbol, {alisa: perm.name, show: true})
        }
      })
      this.$set(this.selectedNode.props, 'operationPerm', opPerms)
    },
    disable(symbol){
      if (symbol === 'afterAdd' && this.selectedNode.props.mode === 'NEXT'){
        //顺序会签需要禁用加签
        this.selectedNode.props.operationPerm.afterAdd.show = false
        return true
      }
      return false
    },
  }
}
</script>

<style scoped lang="less">
/deep/ .el-table__row{
  .el-table__cell{
    padding: 5px 0;
  }
  .el-input__inner{
    border: none;
  }
}
</style>

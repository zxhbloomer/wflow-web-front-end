<template>
  <div v-if="!isTask">
    <el-tag type="primary" :size="size" v-if="instance.status === 'RUNNING'">进行中</el-tag>
    <el-tag type="danger" :size="size" v-else-if="instance.result === 'refuse-end'">审批驳回</el-tag>
    <el-tag type="info" :size="size" v-else-if="instance.result === 'cancel-end'">已撤销</el-tag>
    <el-tag type="success" :size="size" v-else>审批通过</el-tag>
  </div>
  <el-tag v-else :type="(taskStatus[instance.taskResult] || {}).type" size="medium">{{(taskStatus[instance.taskResult] || {}).text}}</el-tag>
</template>

<script>
export default {
  name: "ProcessStatus",
  components: {},
  props:{
    instance:{
      type: Object,
      default: () => {
        return {}
      }
    },
    size:{
      type: String,
      default: 'medium'
    },
    isTask: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      taskStatus:{
        agree: {type: 'success', text: '已同意'},
        refuse: {type: 'danger', text: '已拒绝'},
        recall: {type: 'warning', text: '已退回'},
        transfer: {type: 'primary', text: '已转交'}
      },
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

<template>
  <div v-loading="loading">
<!--    <div style="text-align: right" v-show="false">
      <el-select size="small" filterable placeholder="筛选表单" v-model="params.code">
        <el-option :value="form.id" :label="form.formName" v-for="form in formList" :key="form.id"></el-option>
      </el-select>
    </div>-->
    <el-table :data="dataList" :header-cell-style="{background: '#e8e8e8'}" style="width: 100%; margin: 20px 0" @row-click="showProcess">
      <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="owner" show-overflow-tooltip label="发起人" min-width="100px">
        <template slot-scope="scope">
          <avatar :size="35" :name="scope.row.owner.name" :src="scope.row.owner.avatar" v-if="scope.row.owner"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="提交时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" label="当前节点"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskCreateTime" label="任务到达时间" min-width="120px"></el-table-column>
      <el-table-column prop="status" label="审批状态">
        <template slot-scope="scope">
          <el-tag type="primary" size="medium">待处理</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column fixed="right" label="操作" min-width="90">
        <template slot-scope="scope">
          <el-button type="text">立即处理</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <div style="text-align: right">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total="total"
                     :page-size="params.pageSize" :current-page.sync="params.pageNo"></el-pagination>
    </div>
    <el-drawer :size="isMobile ? '100%': '500px'" direction="rtl" title="审批详情" :visible.sync="processVisible">
      <instance-preview v-if="processVisible" :node-id="selectInstance.nodeId" :instance-id="selectInstance.instanceId" @handler-after="handlerAfter"></instance-preview>
    </el-drawer>
  </div>
</template>

<script>
import taskApi from '@/api/processTask'
import InstancePreview from '../approval/ProcessInstancePreview'
export default {
  name: "UnFinished",
  components: {InstancePreview},
  data() {
    return {
      total: 0,
      params:{
        pageSize: 10,
        pageNo: 1,
        code: ''
      },
      loading: false,
      selectInstance: null,
      processVisible: false,
      formList: [],
      dataList: []
    }
  },
  computed:{
    isMobile(){
      return window.screen.width < 450
    },
  },
  mounted() {
    this.getTodoList()
  },
  methods: {
    getTodoList(){
      this.loading = true
      taskApi.getUserTodoList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(e => {
        this.loading = false
      })
    },
    showProcess(row){
      this.processVisible = true
      this.selectInstance = row
    },
    handlerAfter(){
      this.processVisible = false
      this.getTodoList()
    }
  },
  watch:{
    params:{
      deep: true,
      handler(){
        this.getTodoList()
      }
    }
  }
}
</script>

<style scoped>

</style>

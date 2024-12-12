<template>
  <div v-loading="loading">
<!--    <div style="text-align: right">
      <el-select size="small" filterable placeholder="筛选表单" v-model="params.code">
        <el-option :value="form.id" :label="form.formName" v-for="form in formList" :key="form.id"></el-option>
      </el-select>
    </div>-->
    <el-table :data="dataList" :header-cell-style="{background: '#e8e8e8'}" style="width: 100%; margin: 20px 0" @row-click="showProcess">
      <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="owner" show-overflow-tooltip label="发起人" min-width="100px">
        <template slot-scope="scope">
          <avatar :size="35" :name="scope.row.owner.name" :src="scope.row.owner.avatar"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" label="任务节点名"/>
      <el-table-column show-overflow-tooltip prop="taskCreateTime" label="任务开始时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskEndTime" label="处理完成时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="duration" label="处理耗时" min-width="120px">
        <template slot-scope="scope">
          {{getDuration(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理结果">
        <template slot-scope="scope">
          <el-tag :type="getTaskResult({result: scope.row.taskResult}).type">
            {{getTaskResult({result: scope.row.taskResult}).text}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total="total"
                     :page-size="params.pageSize" :current-page.sync="params.pageNo"></el-pagination>
    </div>
    <el-drawer :size="isMobile ? '100%': '500px'" direction="rtl" title="审批详情" :visible.sync="processVisible">
      <instance-preview v-if="processVisible" :instance-id="selectInstance.instanceId" @handler-after="handlerAfter"></instance-preview>
    </el-drawer>

    <w-dialog v-if="!isMobile" :title="`发起 - ${selectInstance.processDefName}`" closeFree width="1000px" v-model="openItemDl" okText="提 交" @cancel="openItemDl = false" @ok="submitForm">
      <initiate-process ref="processForm" :node-id="selectInstance.nodeId" :instance-id="selectInstance.instanceId" :code="selectInstance.formId" v-if="openItemDl" @ok="openItemDl = false"></initiate-process>
    </w-dialog>
  </div>
</template>

<script>
import taskApi from '@/api/processTask'
import moment from "moment";
import InstancePreview from '../approval/ProcessInstancePreview'
import InitiateProcess from "../InitiateProcess";
import {getTaskResult} from "@/utils/ProcessUtil";

export default {
  name: "Finished",
  components: {InstancePreview, InitiateProcess},
  data() {
    return {
      total: 0,
      params:{
        pageSize: 10,
        pageNo: 1,
        finished: null,
        code: ''
      },
      openItemDl: false,
      selectInstance: {},
      loading: false,
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
    this.getIdoList()
  },
  methods: {
    getTaskResult,
    getIdoList(){
      this.loading = true
      taskApi.getIdoList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(e => {
        this.loading = false
      })
    },
    reSubmit(row){
      this.selectInstance = row
      this.openItemDl = true
      if (this.isMobile){
        this.$router.push(`/mbinitiate?code=${row.formId}&instanceId=${row.instanceId}`)
      }
    },
    submitForm() {
      this.$refs.processForm.validate((validForm, validProcess) => {
        if (!this.isMobile){
          if (validForm && validProcess) {
            this.$refs.processForm.submit()
          } else {
            this.$message.warning("请完善表单/流程选项😥")
          }
        }
      })
    },
    showProcess(row){
      this.processVisible = true
      this.selectInstance = row
    },
    getDuration(row){
      let end = this.$isNotEmpty(row.taskEndTime) ? row.taskEndTime : moment().format("YYYY-MM-DD HH:mm:ss")
      return this.$timeCoverStr(row.createTime, end)
    },
    handlerAfter(){
      this.processVisible = false
      this.getIdoList()
    }
  },
  watch:{
    params:{
      deep: true,
      handler(){
        this.getIdoList()
      }
    }
  }
}
</script>

<style scoped>

</style>

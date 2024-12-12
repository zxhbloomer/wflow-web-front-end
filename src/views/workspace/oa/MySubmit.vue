<template>
  <div v-loading="loading">
<!--    <div style="text-align: right">
      <el-select size="small" filterable placeholder="筛选表单" v-model="params.code">
        <el-option :value="form.id" :label="form.formName" v-for="form in formList" :key="form.id"></el-option>
      </el-select>
    </div>-->
    <el-table :data="dataList" :header-cell-style="{background: '#e8e8e8'}" style="width: 100%; margin: 20px 0" @row-click="showProcess">
      <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="staterUser" show-overflow-tooltip label="发起人" min-width="100px">
        <template slot-scope="scope">
          <avatar :size="35" :name="scope.row.staterUser.name" :src="scope.row.staterUser.avatar"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="startTime" label="提交时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="finishTime" label="结束时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" label="当前节点">

      </el-table-column>
      <el-table-column prop="status" label="审批状态">
        <template slot-scope="scope">
          <el-tag :type="getProcTag(scope.row.result)">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="duration" label="已耗时" min-width="120px">
        <template slot-scope="scope">
          {{getDuration(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="90">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="reSubmit(scope.row)">再次提交</el-button>
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
import {getProcTag} from "@/utils/ProcessUtil";

export default {
  name: "MySubmit",
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
    this.getSubmittedList()
  },
  methods: {
    getProcTag,
    getSubmittedList(){
      this.loading = true
      taskApi.getUserSubmittedList(this.params).then(rsp => {
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
      let end = this.$isNotEmpty(row.finishTime) ? row.finishTime : moment().format("YYYY-MM-DD HH:mm:ss")
      return this.$timeCoverStr(row.startTime, end)
    },
    handlerAfter(){
      this.processVisible = false
      this.getSubmittedList()
    }
  },
  watch:{
    params:{
      deep: true,
      handler(){
        this.getSubmittedList()
      }
    }
  }
}
</script>

<style scoped>

</style>

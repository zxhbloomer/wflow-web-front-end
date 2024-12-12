<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      请选择审批单
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <div v-for="(row, i) in _value" :key="row.id" style="padding: 5px 10px" class="selected-process" @click="_showProcess(row.id)">
        <div style="width: 100px; display:flex; align-items: center">
          <span style="margin-right: 10px">{{i + 1}}. </span>
          <avatar :size="30" :name="row.startUser.name" :src="row.startUser.avatar"></avatar>
        </div>
        <ellipsis style="font-size: 0.9rem" :content="`${(row.createTime).substring(5, 16)} 提交的 - ${row.name}`"/>
        <i class="el-icon-close" @click.stop="_value.splice(i, 1)"></i>
      </div>
      <div class="m-add-row" @click="addRow" v-if="!readonly">
        <i class="el-icon-plus"></i>
        <span> {{ placeholder }}</span>
      </div>
      <popup v-model="visible" :style="popupStyle" position="left" lazy-render safe-area-inset-bottom>
        <nav-bar fixed title="请选择" left-text="返回" left-arrow @click-left="visible = false"/>
        <tabs v-model="mTabActive" @change="typeChange">
          <tab title="我发起的" v-loading="loading">
            <m-process-item type="SUBMIT" :datas="dataList" @click="selectProcess"/>
          </tab>
          <tab title="待我处理" v-loading="loading">
            <m-process-item type="UNDO" :datas="dataList" @click="selectProcess"/>
          </tab>
          <tab title="已处理的" v-loading="loading">
            <m-process-item type="DONE" :datas="dataList" @click="selectProcess"/>
          </tab>
          <tab title="抄送我的" v-loading="loading">
            <m-process-item type="SUBMIT" :datas="dataList" @click="selectProcess"/>
          </tab>
        </tabs>
        <pagination v-show="total > params.pageSize" class="pagination" v-model="params.pageNo" :total-items="total" :items-per-page="params.pageSize" />
      </popup>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <w-dialog title="选择审批单" v-model="visible">
        <el-radio-group v-model="type" size="small" @change="typeChange">
          <el-radio-button label="SUBMIT">我发起的</el-radio-button>
          <el-radio-button label="UNDO">待我处理</el-radio-button>
          <el-radio-button label="DONE">已处理的</el-radio-button>
          <el-radio-button label="CC">抄送我的</el-radio-button>
        </el-radio-group>
        <div v-loading="loading">
          <el-table ref="dataTable" :key="key + '_update'" :data="dataList" :header-cell-style="{background: '#e8e8e8'}" style="width: 100%; margin: 20px 0" @row-click="showProcess">
            <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="staterUser" show-overflow-tooltip label="发起人" min-width="100px">
              <template slot-scope="scope">
                <avatar :size="35" v-if="type === 'SUBMIT' || type === 'CC'" :name="(scope.row.staterUser || {}).name" :src="(scope.row.staterUser || {}).avatar"/>
                <avatar :size="35" v-else :name="(scope.row.owner || {}).name" :src="(scope.row.owner || {}).avatar"/>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :prop="type === 'SUBMIT' || type === 'CC' ? 'startTime': 'createTime'" label="提交时间" min-width="120px"></el-table-column>
            <el-table-column v-if="type === 'UNDO'" show-overflow-tooltip prop="taskCreateTime" label="任务到达时间" min-width="120px"></el-table-column>
            <el-table-column v-else-if="type === 'SUBMIT'" show-overflow-tooltip prop="finishTime" label="结束时间" min-width="120px"></el-table-column>
            <template v-else-if="type === 'DONE'">
              <el-table-column show-overflow-tooltip prop="taskEndTime" label="任务完成时间" min-width="120px"></el-table-column>
              <el-table-column prop="status" label="处理结果">
                <template slot-scope="scope">
                  <el-tag :type="taskStatus[scope.row.taskResult].type" size="medium">{{taskStatus[scope.row.taskResult].text}}</el-tag>
                </template>
              </el-table-column>
            </template>
            <el-table-column show-overflow-tooltip prop="taskName" :label="type === 'DONE'?'目标节点':'当前节点'"></el-table-column>
            <el-table-column prop="status" v-if="type !== 'DONE' && type !== 'UNDO'" label="审批状态">
              <template slot-scope="scope">
                <process-status :instance="scope.row"/>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click.stop="selectProcess(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: right">
          <el-pagination hide-on-single-page background layout="prev, pager, next" :total="total"
                         :page-size="params.pageSize" :current-page.sync="params.pageNo"></el-pagination>
        </div>
      </w-dialog>
      <el-button size="small" type="text" @click="visible = true">+ 添加审批单</el-button>
      <div v-for="(row, i) in _value" :key="row.id" class="selected-process" @click="_showProcess(row.id)">
        <div style="width: 100px; display:flex; align-items: center">
          <span style="margin-right: 10px">{{i + 1}}. </span>
          <avatar :size="30" :name="row.startUser.name" :src="row.startUser.avatar"></avatar>
        </div>
        <ellipsis style="font-size: 0.9rem" :content="`${row.createTime} 提交的 - ${row.name}`"/>
        <i class="el-icon-close" @click.stop="_value.splice(i, 1)"></i>
      </div>
    </div>
    <div v-else><div v-for="(row, i) in _value" :key="row.id" style="padding: 5px 10px" class="selected-process" @click="_showProcess(row.id)">
      <div style="width: 100px; display:flex; align-items: center">
        <span style="margin-right: 10px">{{i + 1}}. </span>
        <avatar :size="30" :name="row.startUser.name" :src="row.startUser.avatar"></avatar>
      </div>
      <ellipsis style="font-size: 0.9rem" :content="`${row.createTime} 提交的 - ${row.name}`"/>
    </div>

    </div>
    <el-drawer append-to-body :size="isMobile ? '100%': '500px'" direction="rtl" title="审批详情" :visible.sync="processVisible">
      <instance-preview v-if="processVisible" :instance-id="selectInstance"></instance-preview>
    </el-drawer>
  </div>
</template>

<script>
import taskApi from '@/api/processTask'
import componentMinxins from '../ComponentMinxins'
import ProcessStatus from "@/components/common/ProcessStatus";
import MProcessItem from "./subs/MProcessItem";
import InstancePreview from '@/views/workspace/approval/ProcessInstancePreview'
import {getCcMeList} from "@/api/modelGroup";
import {Popup, NavBar, Pagination, Tab, Tabs, Toast} from 'vant'

export default {
  mixins: [componentMinxins],
  name: "ProcessIndex",
  components: {ProcessStatus, MProcessItem, InstancePreview, Popup, NavBar, Pagination, Tab, Tabs},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请添加审批单'
    },
    processCode:{
      type: String,
    }
  },
  computed:{
    isMobile(){
      return window.screen.width < 450
    },
  },
  data() {
    return {
      mTabActive: 0,
      visible: false,
      type: 'SUBMIT',
      dataList: [],
      total: 0,
      key: 0,
      loading: false,
      refreshing: false,
      finished: true,
      params:{
        pageSize: 10,
        pageNo: 1,
        finished: null,
        code: this.processCode
      },
      processVisible: false,
      selectInstance: null,
      popupStyle: {
        height: '100%',
        width: '100%',
        background: '#f7f7f9'
      },
      taskStatus:{
        agree: {type: 'success', text: '已同意'},
        refuse: {type: 'danger', text: '已拒绝'},
        recall: {type: 'warning', text: '已退回'},
        transfer: {type: 'primary', text: '已转交'}
      },
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    onLoad(){

    },
    getDataList(){
      if (this.isMobile){
        switch (this.mTabActive){
          case 0: this.getSubmittedList(); break;
          case 1: this.getTodoList(); break;
          case 2: this.getIdoList(); break;
          case 3: this.getCcMeList(); break;
        }
      }else {
        this.key ++;
        switch (this.type){
          case 'SUBMIT': this.getSubmittedList(); break;
          case 'UNDO': this.getTodoList(); break;
          case 'DONE': this.getIdoList(); break;
          case 'CC': this.getCcMeList(); break;
        }
      }
    },
    typeChange(){
      this.params.code = this.processCode
      this.params.pageNo = 1
      this.getDataList()
    },
    addRow(){
      this.visible = true
    },
    getTodoList(){
      this.loading = true
      taskApi.getUserTodoList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(err => {
        this.loading = false
        this.$showError(err.response.data.message || err.response.data)
      })
    },
    selectProcess(row){
      if (this.value.findIndex(v => v.id === row.instanceId) > -1){
        if (this.mode === 'MOBILE'){
          Toast('该记录已添加')
        }else {
          this.$message.warning('该记录已添加')
        }
        return
      }
      const startUser = (row.staterUser || row.owner)
      this._value.push({
        id: row.instanceId,
        name: row.processDefName,
        startUser: {
          id: startUser.id,
          avatar: startUser.avatar,
          name: startUser.name
        },
        createTime: (row.createTime || row.startTime).substring(0, 16)
      })
      this.$emit('input', this._value)
      this.visible = false
    },
    getCcMeList(){
      this.loading = true
      getCcMeList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(err => {
        this.loading = false
        this.$showError(err.response.data.message || err.response.data)
      })
    },
    getSubmittedList(){
      this.loading = true
      taskApi.getUserSubmittedList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(err => {
        this.loading = false
        this.$showError(err.response.data.message || err.response.data)
      })
    },
    getIdoList(){
      this.loading = true
      taskApi.getIdoList(this.params).then(rsp => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch(err => {
        this.loading = false
        this.$showError(err.response.data.message || err.response.data)
      })
    },
    _showProcess(id){
      this.processVisible = true
      this.selectInstance = id
    },
    showProcess(row){
      this.processVisible = true
      this.selectInstance = row.instanceId
    },
  },
  watch:{
    params:{
      deep: true,
      handler(){
        this.getDataList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.selected-process{
  width: calc(100% - 20px);
  padding: 0px 10px;
  margin: 5px 0;
  background: #e8e8e8;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  &:hover{
    background: #d3d3d3;
    transition: background 0.5s;;
  }

  /deep/ .el-icon-close{
    position: absolute;
    right: 10px;
    padding: 5px;
    cursor: pointer;
    &:hover{
      color: #e74c3c;
    }
  }
}

.m-add-row{
  color: @theme-primary;
  text-align: center;
  cursor: pointer;
}

</style>

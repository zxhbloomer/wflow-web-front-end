<script>
import ProcessNodeRender from "./ProcessNodeRender";
import {forEachNode} from '@/utils/ProcessUtil'
import processApi from '@/api/process'
import OrgPicker from "@/components/common/OrgPicker";
import {ValueType} from "../common/form/ComponentsConfigExport";
import {checkElementsExistInArray} from "../common/form/components/compare/CompareOptions";
import {deptsInDepts} from "../../api/process";

export default {
  name: "ProcessRender",
  components: {OrgPicker, ProcessNodeRender},
  props: {
    forms: {
      type: Array,
      default: () => {
        return []
      }
    },
    pcMode: {
      type: Boolean,
      default: true
    },
    process: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    deptId: {
      type: String,
      default: null
    },
  },
  computed: {
    loginUser() {
      return this.$store.state.loginUser
    },
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      selectUserNodes: new Set(),
      loading: false,
      selectedNode: {},
      reverse: false,
      userCatch: {},
      oldFormData: {},
      processTasks: [],
      conditionFormItem: new Set()
    }
  },
  mounted() {
    this.oldFormData = this.$deepCopy(this.formData)
    this.loadProcessRender()
  },
  render() {
    const getNode = (tasks, processNodes) => {
      tasks.forEach(task => {
        if (Array.isArray(task.options)) {
          //递归提取维度
          processNodes.push(
              <el-timeline-item icon={task.icon} size="large" class="task">
                <el-radio-group size="mini" v-model={task.active}>
                  {
                    task.options.map(option => {
                      return <el-radio-button label={option.id} key={option.id}>{option.title}</el-radio-button>
                    })
                  }
                </el-radio-group>
              </el-timeline-item>
          )
          getNode(task.branchs[task.active], processNodes)
        } else {
          processNodes.push(
              <el-timeline-item icon={task.icon} size="large" class="task">
                <ProcessNodeRender ref={task.id} task={task} desc={task.desc} onAddUser={this.addUser} onDelUser={this.delUser}/>
              </el-timeline-item>
          )
        }
      })
    }
    const processNodes = []
    getNode(this.processTasks, processNodes)
    return <div>
      <el-timeline reverse={false}>
        {processNodes}
      </el-timeline>
      <OrgPicker
          pcMode={this.pcMode}
          type={this.selectedNode.type || 'user'}
          multiple={this.selectedNode.multiple || false}
          ref="orgPicker"
          selected={this.selectedNode.users || []}
          onOk={this.selected}/>
    </div>
  },
  methods: {
    async loadProcessRender() {
      this.loading = true
      this.processTasks.length = 0
      this.selectUserNodes.clear()
      this.loadProcess(this.process, this.processTasks)
      this.processTasks.push({
        title: '结束',
        name: 'END',
        icon: 'el-icon-success',
        enableEdit: false
      })
      this.loading = false
    },
    loadProcess(processNode, processTasks) {
      forEachNode(processNode, node => {
        switch (node.type) {
          case 'ROOT':
            processTasks.push({
              id: node.id,
              title: node.name,
              name: '发起人',
              icon: 'el-icon-user-solid',
              enableEdit: false,
              users: [this.loginUser]
            });
            break;
          case 'APPROVAL':
            processTasks.push(this.getApprovalNode(node))
            break;
          case 'CC':
            processTasks.push(this.getCcNode(node))
            break;
          case 'CONDITIONS': //条件节点选一项
            this.getConditionNode(node, processTasks)
            this.loadProcess(node.children, processTasks)
            return true
          case 'CONCURRENTS':
            //this.getConcurrentNode(node, processTasks)
            processTasks.push(this.getConcurrentNode(node))
            this.loadProcess(node.children, processTasks)
            return true
        }
      })
    },
    getApprovalNode(node) {
      let result = {
        id: node.id,
        title: node.name,
        name: '审批人',
        icon: 'el-icon-s-check',
        enableEdit: false,
        multiple: false,
        mode: node.props.mode,
        users: [],
        desc: ''
      }
      let loadCatch = true
      switch (node.props.assignedType) {
        case 'ASSIGN_USER':
          result.users = this.$deepCopy(node.props.assignedUser)
          result.desc = '指定审批人'
          break
        case 'ASSIGN_LEADER':
          processApi.getLeaderByDepts((node.props.assignedDept || []).map(d => d.id)).then(res => {
            result.users = res.data
          })
          result.desc = '指定部门的领导'
          break
        case 'SELF':
          result.users = [this.loginUser]
          result.desc = '发起人自己审批'
          break
        case 'SELF_SELECT':
          result.enableEdit = true
          this.selectUserNodes.add(node.id)
          result.multiple = node.props.selfSelect.multiple || false
          result.desc = '自选审批人'
          break
        case 'LEADER_TOP':
          result.desc = '连续多级主管审批'
          const leaderTop = node.props.leaderTop
          processApi.getUserLeaders(
              'TOP' === leaderTop.endCondition ? 0 : leaderTop.endLevel,
              this.deptId, leaderTop.skipEmpty).then(res => {
            result.users = res.data
          })
          break
        case 'LEADER':
          result.desc = node.props.leader.level === 1 ? '直接主管审批' : `第${node.props.leader.level}级主管审批`
          processApi.getUserLeader(
              node.props.leader.level,
              this.deptId,
              node.props.leader.skipEmpty).then(res => {
            result.users = res.data ? [res.data] : []
          })
          break
        case 'ROLE':
          result.desc = `由角色[${(node.props.role || []).map(r => r.name)}]审批`
          processApi.getUsersByRoles((node.props.role || []).map(r => r.id)).then(res => {
            result.users = res.data
          })
          break
        case 'FORM_USER':
          loadCatch = false
          result.desc = `由表单字段内人员审批`
          this.conditionFormItem.add(node.props.formUser)
          result.users = this.formData[node.props.formUser] || []
          break
        case 'FORM_DEPT':
          loadCatch = false
          result.desc = `由表单部门内主管审批`
          this.conditionFormItem.add(node.props.formDept)
          processApi.getLeaderByDepts((this.formData[node.props.formDept] || []).map(d => d.id)).then(res => {
            result.users = res.data
          })
          result.desc = '指定部门的领导'
          break
        case 'REFUSE':
          result.desc = `流程此处将被自动驳回`
          break
      }
      if (this.userCatch[node.id] && this.userCatch[node.id].length > 0) {
        result.users = this.userCatch[node.id]
      }
      if (loadCatch) {
        this.userCatch[node.id] = result.users
      }
      return result
    },
    getCcNode(node) {
      let result = {
        id: node.id,
        title: node.name,
        icon: 'el-icon-s-promotion',
        name: '抄送人',
        enableEdit: node.props.shouldAdd,
        type: 'org',
        multiple: true,
        desc: node.props.shouldAdd ? '可添加抄送人' : '',
        users: this.$deepCopy(node.props.assignedUser)
      }
      if (this.userCatch[node.id] && this.userCatch[node.id].length > 0) {
        result.users = this.userCatch[node.id]
      }
      this.userCatch[node.id] = result.users
      return result
    },
    getConditionNode(node, processTasks) {
      //条件渲染，选一，取条件设置
      let trueNode = null
      for (let i = 0; i < node.branchs.length; i++) {
        const cdNode = node.branchs[i]
        let result = false, successNum = 0
        for (let j = 0; j < cdNode.props.groups.length; j++) {
          //计算单个组条件结果
          result = this.getConditionResultByGroup(cdNode.props.groups[j])
          if (cdNode.props.groupsType === 'OR' && result) {
            //满足条件，那么这个节点就满足，执行该节点流程
            trueNode = cdNode
            break
          } else if (cdNode.props.groupsType === 'AND' && result) {
            successNum++
          }
        }
        if (trueNode) {
          break
        } else if (successNum === cdNode.props.groups.length) {
          //AND条件，全部都要满足
          trueNode = cdNode
          break
        }
      }
      if (trueNode) {
        //继续递归下面的流程
        this.loadProcess(trueNode, processTasks)
      } else {
        //条件均不满足，无法执行任何分支
        console.log(`条件节点 ${node.id} => ${node.name} 均不满足，无法继续`, node)
      }
    },
    getConditionResultByGroup(subCd) {
      let result = false, success = 0
      subCd.conditions.forEach(cd => this.conditionFormItem.add(cd.id))
      for (let i = 0; i < subCd.conditions.length; i++) {
        let cd = subCd.conditions[i] //组内子条件
        switch (cd.valueType) {
          case ValueType.number:
            result = this.numberCompare(cd)
            break
          case ValueType.string:
            result = this.stringCompare(cd)
            break
          case ValueType.date:
            result = this.dateCompare(cd)
            break
          case ValueType.user:
            result = this.userCompare(cd)
            break
          case ValueType.dept:
            result = this.deptCompare(cd)
            break
          case ValueType.array:
            result = this.arrayCompare(cd)
            break
        }
        if (result && subCd.groupType === 'OR') {
          break
        } else if (result && subCd.groupType === 'AND') {
          success++
        }
      }
      if (subCd.groupType === 'AND') {
        result = success === subCd.conditions.length
      }
      return result
    },
    getConcurrentNode(node) {
      let concurrentTasks = {
        id: node.id,
        title: node.name,
        name: '并行分支',
        icon: 'el-icon-s-operation',
        enableEdit: false,
        active: node.branchs[0].id, //激活得分支
        options: [], //分支选项，渲染单选框
        desc: '切换分支可显示对应执行流程',
        branchs: {} //分支数据，不包含分支节点，key=分支子节点id，value = [后续节点]
      }
      node.branchs.forEach(nd => {
        concurrentTasks.options.push({
          id: nd.id,
          title: nd.name,
        })
        this.$set(concurrentTasks.branchs, nd.id, [])
        this.loadProcess(nd.children, concurrentTasks.branchs[nd.id])
      })
      return concurrentTasks
    },
    getConcurrentSubNode(node) {
      return {
        id: node.id,
        title: node.name,
        name: '并行分支',
        icon: 'el-icon-s-operation',
        enableEdit: false
      }
    },
    numberCompare(explain) {
      let val = this.formData[explain.id]
      switch (explain.compare) {
        case '>':
          return val > parseFloat(explain.value[0])
        case '<':
          return val < parseFloat(explain.value[0])
        case '=':
          return val === parseFloat(explain.value[0])
        case '>=':
          return val >= parseFloat(explain.value[0])
        case '<=':
          return val <= parseFloat(explain.value[0])
        case 'B':
          return val > parseFloat(explain.value[0]) && val < parseFloat(explain.value[1])
        case 'AB':
          return val >= parseFloat(explain.value[0]) && val < parseFloat(explain.value[1])
        case 'BA':
          return val > parseFloat(explain.value[0]) && val <= parseFloat(explain.value[1])
        case 'ABA':
          return val >= parseFloat(explain.value[0]) && val <= parseFloat(explain.value[1])
        case 'IN':
          return explain.value.indexOf(String(val)) > -1
        default:
          return false
      }
    },
    stringCompare(explain) {
      let val = this.formData[explain.id]
      switch (explain.compare) {
        case '=':
          return val === explain.value[0]
        case 'IN':
          return explain.value.indexOf(val) > -1
        default:
          return false
      }
    },
    dateCompare(explain) {

    },
    deptCompare(explain){
      const deptIds = (this.formData[explain.id] || []).map(v => v.id)
      const parentIds = (explain.value || []).map(v => v.id)
      if (deptIds.length > 0){
        return 'true' === processApi.deptsInDepts(deptIds, parentIds)
      }
      return false
    },
    userCompare(explain) {
      const userIds = explain.id === 'root' ? [this.loginUser.id]
        : (this.formData[explain.id] || []).map(v => v.id)
      //分离人和部门
      const users = [], depts = []
      explain.value.forEach(u => {
        if (u.type === 'user') {
          users.push(u.id)
        } else {
          depts.push(u.id)
        }
      })
      const userCompare = checkElementsExistInArray(userIds, users)
      if (userCompare) {
        return userCompare
      } else {
        return 'true' === processApi.usersInDepts(userIds, depts)
      }
    },
    arrayCompare(explain) {
      let val = this.formData[explain.id]
      switch (explain.compare) {
        case '=':
          return val === explain.value[0]
        case 'IN':
          return explain.value.indexOf(val) > -1
        default:
          return false
      }
    },
    selected(users) {
      this._value[this.selectedNode.id] = []
      users.forEach(u => {
        if (this.selectedNode.users.findIndex(v => v.id === u.id) === -1) {
          this.$set(u, 'enableEdit', true)
          this.selectedNode.users.push(u)
          this._value[this.selectedNode.id].push(u)
        }
      })
    },
    delUser(nodeId, i) {
      this._value[nodeId].splice(i, 1)
    },
    addUser(node) {
      this.selectedNode = node
      this.$refs.orgPicker.show()
    },
    getApprovalMode(mode) {
      switch (mode) {
        case 'AND':
          return '会签';
        case 'NEXT':
          return '按顺序会签'
        case 'OR':
          return '或签'
        default:
          return '?'
      }
    },
    async formChangeHandler(newVal, oldVal) {
      let isChanged = false
      for (const key of this.conditionFormItem) {
        if (newVal[key] !== oldVal[key]) {
          isChanged = true
          break
        }
      }
      if (isChanged) {
        console.log('执行流程重渲染')
        this.loadProcessRender()
      }
      this.oldFormData = this.$deepCopy(this.formData)
    },
    //执行校验流程步骤设置
    validate(call){
      //遍历自选审批人节点
      let isOk = true
      this.selectUserNodes.forEach(nodeId => {
        if ((this._value[nodeId] || []).length === 0){
          //没设置审批人员
          isOk = false
          this.$refs[nodeId].errorShark()
        }
      })
      if (call){
        call(isOk)
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.formChangeHandler(val, this.oldFormData)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.task {
  height: 50px;
}

/deep/ .el-timeline-item {
  .el-timeline-item__icon {
    color: #babcc1;
    font-size: 16px;
  }

  .el-timeline-item__node {
    padding: 2px;
    background-color: #f3f2f2;
  }

  .el-timeline-item__tail {
    height: 120%;
    left: 6px;
  }

  .el-timeline-item__content {
    position: relative;

    .process-node-render {
      & > div {
        position: absolute;
        display: inline-block;
      }

      & > div:last-child {
        right: 0;
        top: -10px;
      }
    }
  }
}

.add-user {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  i {
    padding: 10px;
    font-size: 1.1rem;
    border-radius: 50%;
    border: 1px dashed #8c8c8c;
    cursor: pointer;

    &:hover {
      color: @theme-primary;
      border: 1px dashed @theme-primary;
    }
  }
}

</style>

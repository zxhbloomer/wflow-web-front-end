<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        placeholder="请设置审批人" header-bgc="#f78f5f" header-icon="el-icon-s-check"/>
</template>

<script>
import Node from './Node'

export default {
  name: "ApprovalNode",
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {Node},
  data() {
    return {
      showError: false,
      errorInfo: '',
    }
  },
  computed:{
    formItems(){
      return this.$store.state.design.formItems
    },
    nodeMap(){
      return this.$store.state.nodeMap
    },
    content(){
      const config = this.config.props
      switch (config.assignedType){
        case "ASSIGN_USER":
          if (config.assignedUser.length > 0){
            let texts = []
            config.assignedUser.forEach(org => texts.push(org.name))
            return String(texts).replaceAll(',', '、')
          }else {
            return '请指定审批人'
          }
        case "SELF":
          return '发起人自己'
        case "SELF_SELECT":
          return config.selfSelect.multiple ? '发起人自选多人':'发起人自选一人'
        case "LEADER_TOP":
          return '多级主管依次审批'
        case "LEADER":
          return config.leader.level > 1 ? '发起人的第 ' + config.leader.level + ' 级主管' : '发起人的直接主管'
        case "FORM_USER":
          if (!config.formUser || config.formUser === ''){
            return '表单内联系人（未选择）'
          }else {
            let text = this.getFormItemById(this.formItems, config.formUser)
            if (text && text.title){
              return `表单（${text.title}）内的人员`
            }else {
              return '该表单项已被移除😥'
            }
          }
        case "ROLE":
          if (config.role.length > 0){
            return `角色 [${String(config.role.map(r => r.name)).replaceAll(',', '、')}] `
          }else {
            return '指定角色（未设置）'
          }
          case 'REFUSE':
            return '系统自动拒绝审批'
        case 'FORM_DEPT':
          if (!config.formDept || config.formDept === ''){
            return '表单内部门的主管（未选择）'
          }else {
            let text = this.getFormItemById(this.formItems, config.formDept)
            if (text && text.title){
              return `表单（${text.title}）内的部门主管`
            }else {
              return '该表单项已被移除😥'
            }
          }
          case 'ASSIGN_LEADER':
            if ((config.assignedDept || []).length > 0){
              let texts = []
              config.assignedDept.forEach(org => texts.push(org.name))
              return String(texts).replaceAll(',', '、')
            }else {
              return '请指定部门'
            }
          default: return '未知设置项😥'
      }
    }
  },
  methods: {
    getFormItemById(items, id){
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === 'SpanLayout'){
          let result = this.getFormItemById(items[i].props.items, id)
          if (result){
            return result
          }
        }else if (items[i].id === id){
          return items[i]
        }
      }
      return null
    },
    //校验数据配置的合法性
    validate(err){
      try {
        const config = this.config.props
        let isError = !this[`validate_${this.config.props.assignedType}`](err)
        //如果是驳回到指定位置节点，判断是不是设置了目标节点
        if (config.refuse.type === 'TO_NODE'
          && (!this.$isNotEmpty(config.refuse.target)
            || !this.nodeMap.has(config.refuse.target))){
          this.errorInfo = '请设置驳回后要跳转的目标节点'
          err.push(`未设置驳回后要跳转的目标节点`)
          isError = true
        }
        return this.showError = isError
      } catch (e) {
        return true;
      }
    },
    validate_ASSIGN_USER(err){
      if(this.config.props.assignedUser.length > 0){
        return true;
      }else {
        this.errorInfo = '请指定审批人员'
        err.push(`${this.config.name} 未指定审批人员`)
        return false
      }
    },
    validate_ASSIGN_LEADER(err){
      if((this.config.props.assignedDept || []).length > 0){
        return true;
      }else {
        this.errorInfo = '请指定要审批的部门'
        err.push(`${this.config.name} 未指定审批部门`)
        return false
      }
    },
    validate_SELF_SELECT(err){
      return true;
    },
    validate_LEADER_TOP(err){
      return true;
    },
    validate_LEADER(err){
      return true;
    },
    validate_ROLE(err){
      if (this.config.props.role.length <= 0){
        this.errorInfo = '请指定负责审批的系统角色'
        err.push(`${this.config.name} 未指定审批角色`)
        return false
      }
      return true;
    },
    validate_SELF(err){
      return true;
    },
    validate_FORM_USER(err){
     if ((this.config.props.formUser || '') === ''){
       this.errorInfo = '请指定表单中的人员组件'
       err.push(`${this.config.name} 审批人为表单中人员，但未指定`)
       return false
     }
      return true;
    },
    validate_FORM_DEPT(err){
      if ((this.config.props.formDept || '') === ''){
        this.errorInfo = '请指定表单中的部门选择组件'
        err.push(`${this.config.name} 审批人为表单中的部门主管，但未指定`)
        return false
      }
      return true;
    },
    validate_REFUSE(err){
      return true;
    },
  }
}
</script>

<style scoped>

</style>

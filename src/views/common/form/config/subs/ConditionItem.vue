<template>
  <div>
    <el-select style="width: 150px; margin: 5px" @change="fieldChange"
               value-key="id" v-model="_value.field" size="small" placeholder="选择表单字段">
      <el-option :key="item.id" v-for="item in _formItems" :value="item.id" :label="item.title"></el-option>
    </el-select>
    <template v-if="_value.field">
      <el-select style="width: 110px; margin: 5px" size="small" v-model="_value.compare" placeholder="选择比较关系">
        <el-option :key="cp.symbol" v-for="cp in condition.options" :value="cp.symbol" :label="cp.name"/>
      </el-select>
      <el-radio-group size="mini" v-model="_value.fixed" @change="_value.compareVal = []">
        <el-radio-button :label="true">固定</el-radio-button>
        <el-radio-button :label="false">动态</el-radio-button>
      </el-radio-group>
      <component style="width: calc(100% - 410px); margin-left: 5px" v-if="_value.fixed" :is="condition.name" :context="_value"/>
      <el-select v-else style="width: 150px; margin: 5px"
                 value-key="id" v-model="_value.compareVal[0]" size="small" placeholder="选择表单字段">
        <el-option :key="item.id" v-for="item in _formItems" :value="item.id" :label="item.title"></el-option>
      </el-select>
    </template>

  </div>
</template>

<script>
import compareOptions from "../../components/compare/CompareOptions";

export default {
  name: "ConditionItem",
  components: {
    StrCompare: () => import('../../components/compare/StrCompare.vue'),
    NumCompare: () => import('../../components/compare/NumCompare.vue'),
    OrgCompare: () => import('../../components/compare/OrgCompare.vue'),
    StrArrCompare: () => import('../../components/compare/StrArrCompare.vue'),
    TimeCompare: () => import('../../components/compare/TimeCompare.vue'),
    TimeArrCompare: () => import('../../components/compare/TimeArrCompare.vue')
  },
  props:{
    formItems:{
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    value:{
      type: Object,
      require: true,
      default: () => {
        return {}
      }
    }
  },
  computed:{
    formItemMap(){
      return this.$store.state.formItemMap
    },
    _formItems(){
      //过滤不支持的组件
      const ft = [
        'FileUpload', 'ImageUpload', 'ProcessIndex',
        'SignPanel', 'TableList', 'WebIframe', 'TimePicker', 'TableList',
        'TimeRangePicker', 'Description', 'VueContainer'
      ]
      const unsuport = []
      return this.formItems.filter(item => {
        if (item.name === 'TableList'){
          //过滤明细表里面的列字段，目前不支持列合计判断
          item.columns.forEach(col => unsuport.push(col.id))
        }
        return !ft.includes(item.name)
      }).filter(item => !unsuport.includes(item.id))
    },
    _value:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val)
      }
    },
    condition(){
      switch (this._value.fieldType){
        case 'AmountInput':
        case 'NumberInput':
        case 'Score':
        case 'CalcFormula':
          return {name: 'numCompare', options: compareOptions.numCompareOptions}
        case 'TextInput':
        case 'TextareaInput':
        case 'SelectInput':
          return {name: 'strCompare', options: compareOptions.strCompareOptions}
        case 'MultipleSelect':
          return {name: 'strArrCompare', options: compareOptions.strArrCompareOptions}
        case 'DateTime':
          return {name: 'timeCompare', options: compareOptions.timeCompareOptions}
        case 'DateTimeRange':
          return {name: 'timeArrCompare', options: compareOptions.timeArrCompareOptions}
        case 'DeptPicker':
        case 'UserPicker':
          return {name: 'orgCompare', options: compareOptions.orgCompareOptions}
        default: return {name: 'div', options: []}
      }
    }
  },
  data() {
    return {
      compareOptions
    }
  },
  methods: {
    fieldChange(){
      this._value.compare = null;
      this._value.compareVal = [];
      this._value.fieldType = this.formItemMap.get(this._value.field).name
    }
  }
}
</script>
<style scoped lang="less">

</style>

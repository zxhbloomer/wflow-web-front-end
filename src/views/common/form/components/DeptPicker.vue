<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <template v-if="expansion">
        <el-checkbox-group disabled v-if="multiple" v-model="_value">
          <el-checkbox class="w-row-text" disabled v-for="(op, index) in options" :key="index" :label="op">{{op.name}}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group disabled v-model="_value" v-else>
          <el-radio class="w-row-text" style="margin: 5px" v-for="(op, index) in options" :key="index" :label="op">{{op.name}}</el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <el-button disabled icon="iconfont icon-map-site" type="primary" size="mini" round> 选择部门</el-button>
        <span class="placeholder"> {{placeholder}}</span>
      </template>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <template v-if="expansion">
        <el-checkbox-group v-if="multiple" v-model="_value">
          <el-checkbox class="w-row-text" v-for="(op, index) in options" :key="index" :label="op">{{op.name}}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group :value="_value[0]" @input="ev => _value = [ev]" v-else>
          <el-radio class="w-row-text" style="margin: 5px" v-for="(op, index) in options" :key="index" :label="op">{{op.name}}</el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <el-button icon="iconfont icon-map-site" type="primary" size="mini" round @click="$refs.orgPicker.show()"> 选择部门</el-button>
        <org-picker type="dept" :multiple="multiple" ref="orgPicker" :selected="_value" @ok="selected"/>
        <span class="placeholder"> {{placeholder}}</span>
        <div style="margin-top: 5px">
          <el-tag size="mini" style="margin: 5px" closable v-for="(dept, i) in _value" @close="delDept(i)">{{dept.name}}</el-tag>
        </div>
      </template>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <template v-if="expansion">
        <checkbox-group v-if="multiple" v-model="_value" direction="horizontal">
          <checkbox style="margin: 5px" :name="op" shape="square" v-for="(op, index) in options" :key="index">{{op.name}}</checkbox>
        </checkbox-group>
        <radio-group v-else :value="_value[0]" @input="ev => _value = [ev]" direction="horizontal">
          <radio style="margin: 5px" v-for="(op, index) in options" :key="index" :name="op">{{op.name}}</radio>
        </radio-group>
      </template>
      <template v-else>
        <field readonly clearable @clear="_value = []" right-icon="arrow" clickable v-model="deptDesc" :placeholder="placeholder" @click="$refs.orgPicker.show()"></field>
        <org-picker :pc-mode="false" type="dept" :multiple="multiple" ref="orgPicker" :selected="_value" @ok="selected"/>
      </template>
    </div>
    <div v-else>
      {{String(_value.map(v => v.name))}}
    </div>
  </div>
</template>

<script>
import { Field, Radio, RadioGroup, Checkbox, CheckboxGroup} from 'vant'
import componentMinxins from '../ComponentMinxins'
import OrgPicker from "@/components/common/OrgPicker";

export default {
  mixins: [componentMinxins],
  name: "DeptPicker",
  components: {OrgPicker, Field, Radio, RadioGroup, Checkbox, CheckboxGroup},
  props: {
    value:{
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择部门'
    },
    multiple:{
      type: Boolean,
      default: false
    },
    expansion: {
      type: Boolean,
      default: false
    },
    options:{
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      showOrgSelect: false
    }
  },
  computed:{
    deptDesc:{
      get(){
        if (this._value && this._value.length > 3){
          return `${String(this._value.slice(0, 3).map(v => v.name))}... 等${this._value.length}个部门`
        }else if (this._value && this._value.length > 0){
          return String(this._value.map(v => v.name))
        }else {
          return null
        }
      },
      set(val){

      }
    }
  },
  methods: {
    selected(values){
      this.showOrgSelect = false
      this._value = values
    },
    delDept(i){
      this._value.splice(i, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.placeholder{
  margin-left: 10px;
  color: #adabab;
  font-size: smaller;
}

/deep/ .el-checkbox-group{
  line-height: 10px;
}
</style>

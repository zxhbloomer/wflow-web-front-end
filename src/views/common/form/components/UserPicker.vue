<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-button disabled icon="el-icon-user" type="primary" size="mini" round>选择人员</el-button>
      <span class="placeholder"> {{placeholder}}</span>
    </div>
    <div v-else-if="mode === 'PC' && !readonly" style="max-width: 350px">
      <el-button icon="el-icon-user" type="primary" size="mini" round @click="$refs.orgPicker.show()">选择人员</el-button>
      <org-picker type="user" :multiple="multiple" ref="orgPicker" :selected="_value" @ok="selected"/>
      <span class="placeholder"> {{placeholder}}</span>
      <div style="margin-top: 5px">
        <el-tag size="mini" style="margin: 5px" closable v-for="(dept, i) in _value" @close="delDept(i)">{{dept.name}}</el-tag>
      </div>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field readonly clearable @clear="_value = []" right-icon="arrow" clickable v-model="deptDesc" :placeholder="placeholder" @click="$refs.orgPicker.show()"></field>
      <org-picker :pc-mode="false" type="user" :multiple="multiple" ref="orgPicker" :selected="_value" @ok="selected"/>
    </div>
    <div v-else class="preview">
      <avatar :size="35" :name="user.name" showY :src="user.avatar" v-for="user in _value"/>
    </div>
  </div>
</template>

<script>
import { Field } from 'vant'
import componentMinxins from '../ComponentMinxins'
import OrgPicker from "@/components/common/OrgPicker";

export default {
  mixins: [componentMinxins],
  name: "DeptPicker",
  components: {Field, OrgPicker},
  props: {
    value:{
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择人员'
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
  computed:{
    deptDesc:{
      get(){
        if (this._value && this._value.length > 1){
          return `${this._value[0].name}${this._value[1].name}..等${this._value.length}人`
        }else if (this._value && this._value.length > 0){
          return this._value[0].name
        }else {
          return null
        }
      },
      set(val){

      }
    }
  },
  data() {
    return {
      showOrgSelect: false
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

<style scoped>
.placeholder{
  margin-left: 10px;
  color: #adabab;
  font-size: smaller;
}
.preview{
  display: flex;
  justify-content: left;
  /deep/ .avatar{
    margin: 0 5px;
  }
}
</style>

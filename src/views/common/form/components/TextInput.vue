<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input size="medium" disabled :placeholder="placeholder"/>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-input size="medium" clearable v-model="_value" :placeholder="placeholder">
        <el-button v-if="enableScan" slot="append" icon="el-icon-full-screen" @click="scanCode"></el-button>
      </el-input>
      <scan-code pcMode v-model="visible" @ok="scanOk"></scan-code>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field v-model="_value" clearable :placeholder="placeholder">
        <template #right-icon v-if="enableScan">
          <i class="el-icon-full-screen" @click="scanCode"></i>
        </template>
      </field>
      <scan-code v-model="visible" @ok="scanOk"></scan-code>
    </div>
    <div v-else>
      {{_value}}
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import { Field, Toast } from 'vant'
import ScanCode from "@/components/common/ScanCode";

export default {
  mixins: [componentMinxins],
  name: "TextInput",
  components: {Field, ScanCode},
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    enableScan:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,

    }
  },
  methods: {
    scanCode(){
      this.visible = true
    },
    scanOk(code){
      this._value = code
      Toast.success('扫码成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>

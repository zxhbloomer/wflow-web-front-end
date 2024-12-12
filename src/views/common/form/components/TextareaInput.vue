<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input size="medium" disabled :placeholder="placeholder" show-word-limit :rows="2" type="textarea"/>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-input size="medium" v-model="_value" clearable :maxlength="255" :placeholder="placeholder" show-word-limit :rows="3" type="textarea">
        <el-button v-if="enableScan" slot="append" icon="el-icon-full-screen" @click="scanCode"></el-button>
      </el-input>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field v-model="_value" rows="2" autosize type="textarea"
             maxlength="2048" :placeholder="placeholder" show-word-limit>
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
import {Field, Toast} from 'vant'
import ScanCode from "@/components/common/ScanCode";
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "TextareaInput",
  components: {Field, ScanCode},
  props:{
    value: {
      type: String,
      default: null
    },
    placeholder:{
      type: String,
      default: '请输入内容'
    },
    enableScan:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {
      visible: false,
      popupStyle: {
        height: '100%',
        width: '100%',
        background: 'black',
        opacity: '0.5'
      }
    }
  },
  methods: {
    scanCode(){
      this.visible = true
    },
    scanOk(code){
      this._value += code + '\n'
      Toast.success('扫码成功')
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select class="max-fill" v-if="!expanding" size="medium" v-model="_value" disabled :placeholder="placeholder"/>
      <el-radio-group v-model="_value" v-else>
        <el-radio class="w-row-text" style="margin: 5px" disabled v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-radio>
      </el-radio-group>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-select class="max-fill" v-if="!expanding" v-model="_value" size="medium" clearable :placeholder="placeholder">
        <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op"></el-option>
      </el-select>
      <el-radio-group v-model="_value" v-else>
        <el-radio class="w-row-text" style="margin: 5px" v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-radio>
      </el-radio-group>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
<!--      <div v-if="!expanding">
        <field right-icon="arrow" readonly clickable :value="_value" :placeholder="placeholder" @click="showPicker = true"/>
        <popup v-model="showPicker" position="bottom">
          <picker :title="placeholder" show-toolbar :columns="options" @confirm="onConfirm" @cancel="showPicker = false"></picker>
        </popup>
      </div>-->
      <radio-group  v-model="_value" direction="horizontal">
        <radio style="margin: 5px" v-for="(op, index) in options" :key="index" :name="op">{{op}}</radio>
      </radio-group>
    </div>
    <div v-else>
      {{_value}}
    </div>
  </div>
</template>

<script>
import { Field, Popup, Picker, Radio, RadioGroup } from 'vant';
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "SelectInput",
  components: {Radio, RadioGroup, Picker, Field, Popup},
  props:{
    value:{
      type: String,
      default: null
    },
    placeholder:{
      type: String,
      default: '请选择选项'
    },
    expanding:{
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
      showPicker: false
    }
  },
  methods: {
    onConfirm(val){
      this.showPicker = false
      this._value = val
    }
  }
}
</script>

<style scoped>

</style>

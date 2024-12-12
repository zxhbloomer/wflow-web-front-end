<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select class="max-fill" v-if="!expanding" size="medium" multiple v-model="_value" disabled :placeholder="placeholder"/>
      <el-checkbox-group v-else v-model="_value">
        <el-checkbox class="w-row-text" disabled v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-select class="max-fill" v-if="!expanding" v-model="_value" multiple size="medium" clearable :placeholder="placeholder">
        <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op"></el-option>
      </el-select>
      <el-checkbox-group v-else v-model="_value">
        <el-checkbox class="w-row-text" style="margin: 5px" v-for="(op, index) in options" :key="index" :label="op">{{op}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
<!--      <div v-if="!expanding">
        <field right-icon="arrow" readonly clickable :value="_value" :placeholder="placeholder" @click="showPicker = true"/>
        <popup v-model="showPicker" position="bottom">
          <picker :title="placeholder" show-toolbar :columns="options" @confirm="onConfirm" @cancel="showPicker = false"></picker>
        </popup>
      </div>-->
      <checkbox-group v-model="_value" direction="horizontal">
        <checkbox style="margin: 5px" :name="op" shape="square" v-for="(op, index) in options" :key="index">{{op}}</checkbox>
      </checkbox-group>
    </div>
    <div v-else>
      {{String(_value)}}
    </div>
  </div>
</template>

<script>

import { Checkbox, CheckboxGroup, Picker, Field, Popup} from 'vant';
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "MultipleSelect",
  components: {Checkbox, CheckboxGroup, Picker, Field, Popup},
  props:{
    placeholder:{
      type: String,
      default: '请选择选项'
    },
    value:{
      type: Array,
      default: () => {
        return []
      }
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
  computed:{

  },
  data() {
    return {
      showPicker: false,
      checks:[]
    }
  },
  methods: {
    onConfirm(){

    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-checkbox-group{
  line-height: 10px;
}
</style>

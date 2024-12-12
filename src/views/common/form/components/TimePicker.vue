<template>
  <div>
    <div v-if="mode === 'DESIGN'" >
      <el-time-picker size="medium" disabled :placeholder="placeholder"></el-time-picker>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-time-picker v-model="_value" :value-format="format" size="medium" :placeholder="placeholder"/>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field readonly right-icon="arrow" clickable name="datetimePicker" :value="_value" :placeholder="placeholder" @click="showPicker = true"/>
      <popup v-model="showPicker" position="bottom">
        <datetime-picker v-model="timeVal" :formatter="formatter" title="选择时间" type="time" @confirm="onConfirm" @cancel="showPicker = false"/>
      </popup>
    </div>
    <div v-else>
      {{_value}}
    </div>
  </div>
</template>

<script>
import { Field, Popup, DatetimePicker } from 'vant'
import componentMinxins from '../ComponentMinxins'
import moment from "moment";
const date = '2022-01-01 '
export default {
  mixins: [componentMinxins],
  name: "TimePicker",
  components: {Field, Popup, DatetimePicker},
  props:{
    value: {
      default: null,
    },
    format:{
      type: String,
      default: 'HH:mm:ss'
    },
    placeholder:{
      type: String,
      default: '请选择时间'
    }
  },
  computed:{
    timeVal:{
      get(){
        return this.value
      },
      set(val){
        this.timeVals = val
      }
    }
  },
  data() {
    return {
      timeVals: '',
      showPicker: false,
    }
  },
  methods: {
    onConfirm(val){
      this.showPicker = false
      this._value = val.length > 5 ? val : val + ':00'
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      } else if (type === 'hour') {
        return `${val}时`;
      } else if (type === 'minute') {
        return `${val}分`;
      }
      return val;
    },
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-time-picker disabled size="medium" is-range range-separator="至"
                      :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-time-picker is-range size="medium" :value-format="format" v-model="timeRange" @change="changeTime"
                      range-separator="至" :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field right-icon="arrow" readonly clickable name="datetimePicker" :value="_value ? _value[0] : ''" :placeholder="placeholder[0]" @click="loadTime(0)"/>
      <field right-icon="arrow" readonly clickable name="datetimePicker" :value="_value ? _value[1] : ''" :placeholder="placeholder[1]" @click="loadTime(1)"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
      <popup v-model="showPicker" position="bottom">
        <datetime-picker v-model="timeVal[valIndex]" :formatter="formatter" title="选择时间" type="time" @confirm="onConfirm" @cancel="showPicker = false"/>
      </popup>
    </div>
    <div v-else>
      {{_value[0]}} ~ {{_value[1]}}
    </div>
  </div>
</template>

<script>
import { Field, Popup, DatetimePicker, Toast } from 'vant'
import componentMinxins from '../ComponentMinxins'
import moment from 'moment';
const date = '2022-01-01 '
export default {
  mixins: [componentMinxins],
  name: "TimeRangePicker",
  components: {Field, Popup, DatetimePicker},
  props:{
    value: {
      type: Array,
      default: () => {
        return null
      }
    },
    format:{
      type: String,
      default: 'HH:mm:ss'
    },
    placeholder:{
      type: Array,
      default: ()=>{
        return ['开始时间', '结束时间']
      }
    },
    showLength:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    vantType(){
      switch (this.format){
        case 'yyyy': return 'year-month';
        case 'yyyy-MM': return 'year-month';
        case 'yyyy-MM-dd': return 'date';
        case 'yyyy-MM-dd HH': return 'datehour';
        case 'yyyy-MM-dd HH:mm': return 'datetime';
        default: return 'datetime';
      }
    },
  },
  data() {
    return {
      showPicker: false,
      valIndex: 0,
      timeRange: null,
      timeVal: []
    }
  },
  mounted() {
    if (Array.isArray(this.value) && this.value.length > 0){
      this.timeRange = [
        this.$isNotEmpty(this.value[0]) ? this.value[0]:'00:00:00',
        this.$isNotEmpty(this.value[1]) ? this.value[0]:'00:00:00'
      ]
    }
  },
  methods: {
    loadTime(index){
      this.showPicker = true;
      this.valIndex = index
      return this.timeVal[index]
    },
    changeTime(val){
      this._value = val
    },
    timeLength(){
      //求时长算法
      if (Array.isArray(this.value) && this.value.length > 0){
        if (this.value[0] === this.value[1]){
          return '0 （时长为0，请确认）'
        }
        let start = moment(date + this.value[0])
        let mend = moment(date + this.value[1])
        let hours = mend.diff(start, 'hours')
        let minutes = mend.diff(start, 'minutes')
        let second = mend.diff(start, 'seconds')
        minutes = minutes % 60
        hours = hours % 24
        second = second % 60
        return `${hours > 0 ? hours + '小时 ': ' '}
                ${minutes > 0 ? minutes + '分钟 ': ' '}
                ${second > 0 ? second + '秒 ': ' '}`
      } else {
        return '先选择时间哦'
      }
    },
    onConfirm(val){
      this.showPicker = false
      if (!this._value){
        this._value = []
      }
      if (this.valIndex === 1 && (!this._value || this._value.length === 0)){
        Toast('请先选择开始时间')
        return
      }
      this._value[this.valIndex] = val + ':00'
      if (!this.$isNotEmpty(this._value[0]) || !this.$isNotEmpty(this._value[1])){
        if (this.$isNotEmpty(this._value[0])){
          this._value[1] = val + ':01'
        }
      }
      if (this._value[0] && this._value[1]){
        if (!moment(date + this._value[0]).isBefore(moment(date + this._value[1]))){
          this._value[this.valIndex] = this.valIndex === 0 ? '00:00:00': this._value[0]
          Toast('开始时间必须小于结束时间')
        }else {
          this.$emit('input', this._value)
        }
      }
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
.length{
  margin-top: 5px;
}
.length:nth-child(2){
  color: #8c8c8c;
}
/deep/ .el-date-editor--datetimerange.el-input__inner{
  width: 100%;
  max-width: 400px;
}
</style>

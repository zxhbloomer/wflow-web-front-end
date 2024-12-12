<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-date-picker size="medium" v-model="_value" disabled :type="type" :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-date-picker v-model="_value" size="medium" clearable :value-format="format" :type="type" :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field right-icon="arrow" readonly clickable name="datetimePicker" :value="_value[0]" :placeholder="placeholder[0]" @click="loadTime(0)"/>
      <field right-icon="arrow" readonly clickable name="datetimePicker" :value="_value[1]" :placeholder="placeholder[1]" @click="loadTime(1)"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength()}}</span>
      </div>
      <popup v-model="showPicker" position="bottom">
        <datetime-picker v-model="timeVal[valIndex]" :formatter="formatter" :title="desc" :type="vantType" @confirm="onConfirm" @cancel="showPicker = false"/>
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

export default {
  mixins: [componentMinxins],
  name: "DateTimeRange",
  components: {Field, Popup, DatetimePicker},
  props:{
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    format:{
      type: String,
      default: 'yyyy-MM-dd HH:mm'
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
    type(){
      switch (this.format){
        case 'yyyy-MM-dd': return 'daterange';
        case 'yyyy-MM-dd HH:mm': return 'datetimerange';
        default: return 'daterange';
      }
    },
    desc(){
      switch (this.format){
        case 'yyyy': return '选择年份';
        case 'yyyy-MM': return '选择年-月';
        case 'yyyy-MM-dd': return '选择年-月-日';
        case 'yyyy-MM-dd HH:mm': return '选择年-月-日 时:分';
        default: return '选择年-月-日 时:分';
      }
    },
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
      timeVal: [new Date(), new Date()]
    }
  },
  methods: {
    loadTime(index){
      this.showPicker = true;
      this.valIndex = index
      if (this.$isNotEmpty(this.value[index])){
        return moment(this.value[index])
      }else {
        return this.timeVal[index] = new Date()
      }
    },
    timeLength(){
      //求时长算法
      if (Array.isArray(this.value) && this.value.length > 0){
        let start = moment(this.value[0]).format(this.format.replaceAll('dd', 'DD'))
        let end = moment(this.value[1]).format(this.format.replaceAll('dd', 'DD'))
        if (start === end || this.value[0] === this.value[1]){
          return '0 （时长为0，请确认）'
        }
        let mstart = moment(start);
        let mend = moment(end)
        let years = mend.diff(start, 'years')
        let months = mend.diff(start, 'months')
        let days = mend.diff(start, 'days')
        let hours = mend.diff(start, 'hours')
        let minutes = mend.diff(start, 'minutes')
        minutes = minutes % 60
        hours = hours % 24
        months = months % 12
        //因为每月天不固定，所以天要特殊动态处理
        if(mstart.date() < mend.date()){
          days = mend.date() - mstart.date()
          if ((minutes > 0 || hours > 0) && months > 0){
            days --;
          }
        }else if(mstart.date() === mend.date()){
          //日且开始时间大于结束时间的话，日要归零
          const s = moment(moment(start).format("HH:mm:ss"))
          const e = moment(moment(end).format("HH:mm:ss"))
          if (e.isBefore(s) || s._i === e._i){
            days = 0
          }
        }
        //处理超过俩月且天超过31
        if (days > 31 && mend.month() - mstart.month() >= 2){
          //将日期推至上月求差
          days = mend.diff(mstart.add(mend.month() - mstart.month() - 1, 'month'), 'days')
        }
        return `${years > 0 ? years + '年 ': ' '}${months > 0 ? months + '个月 ': ' '}
                ${days > 0 ? days + '天 ': ' '}${hours > 0 ? hours + '小时 ': ' '}
                ${minutes > 0 ? minutes + '分钟 ': ' '}`
      } else {
        return '先选择时间哦'
      }
    },
    onConfirm(val){
      this.showPicker = false
      this._value[this.valIndex] = moment(val).format(this.format.replaceAll('dd', 'DD'))
      if (this._value[0] && this._value[1]){
        if (!moment(this._value[0]).isBefore(moment(this._value[1]))){
          this._value[this.valIndex] = undefined
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

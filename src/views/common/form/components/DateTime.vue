<template>
  <div>
    <div v-if="mode === 'DESIGN'" >
      <el-date-picker size="medium" disabled :type="type" :placeholder="placeholder"></el-date-picker>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-date-picker v-model="_value" :value-format="format" size="medium" clearable :type="type" :placeholder="placeholder"></el-date-picker>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field readonly right-icon="arrow" clickable name="datetimePicker" :value="_value" :placeholder="placeholder" @click="showPicker = true"/>
      <popup v-model="showPicker" position="bottom">
        <datetime-picker v-model="timeVal" :formatter="formatter" :title="desc" :type="vantType" :filter="filter" @confirm="onConfirm" @cancel="showPicker = false"/>
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

export default {
  mixins: [componentMinxins],
  name: "DateTime",
  components: {Field, Popup, DatetimePicker},
  props:{
    value: {
      default: null,
    },
    format:{
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    },
    placeholder:{
      type: String,
      default: '请选择日期时间'
    }
  },
  computed:{
    type(){
      switch (this.format){
        case 'yyyy': return 'year';
        case 'yyyy-MM': return 'month';
        case 'yyyy-MM-dd': return 'date';
        case 'yyyy-MM-dd HH:mm': return 'datetime';
        default: return 'datetime';
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
    timeVal:{
      get(){
        if (this.$isNotEmpty(this.value)){
          return moment(this.value)
        }else {
          return new Date()
        }
      },
      set(val){
        this.$emit('input', this.getFormatVal(val))
      }
    }
  },
  data() {
    return {
      showPicker: false,
    }
  },
  methods: {
    onConfirm(val){
      this.showPicker = false
      this._value = val
      this._value = this.getFormatVal(val)
      console.log(this._value)
    },
    getFormatVal(val){
      return moment(val).format(this.format.replaceAll('dd', 'DD'))
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
    filter(type, options) {
      /*if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }*/
      return options;
    }
  }
}
</script>

<style scoped>

</style>

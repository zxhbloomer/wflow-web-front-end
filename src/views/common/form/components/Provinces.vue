<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <i class="el-icon-place"></i>
      <span> {{placeholder}}</span>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-cascader v-model="_valuePc" size="medium" style="width: 100%;" clearable separator="-" :options="treeData" ></el-cascader>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field readonly right-icon="arrow" clickable :value="_value" :placeholder="placeholder" @click="showPicker = true"/>
      <popup v-model="showPicker" position="bottom">
        <v-area title="请选择" :value="areaObj[_valuePc.length > 0 ? _valuePc[0]:null]" :columns-num="level" :area-list="areaList" @cancel="showPicker = false" @confirm="ok"/>
      </popup>
    </div>
    <div v-else>
      {{_value}}
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import { areaList } from '@vant/area-data';
import { Field, Area, Popup } from 'vant'
var VArea = Area
export default {
  mixins: [componentMinxins],
  name: "Provinces",
  components: {Field, VArea, Popup},
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择行政区划'
    },
    level:{
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      treeData: [],
      areaObj: {},
      showPicker: false,
      areaList
    }
  },
  computed:{
    _valuePc: {
      get(){
        if (this.$isNotEmpty(this.value)) {
          return this.value.split('-')
        }
        return []
      },
      set(val){
        this.$emit('input', String(val).replaceAll(',', '-'))
      }
    },
  },
  mounted() {
    if (this.mode === 'PC'){
      this.loadTreeData()
    }else if (this.mode === 'MOBILE'){
      this.loadAreaMap()
    }
  },
  methods: {
    async loadTreeData(){
      const _this = this
      const province_list = Object.assign({}, areaList.province_list)
      const city_list = Object.assign({}, areaList.city_list)
      const county_list = Object.assign({}, areaList.county_list)
      _this.treeData.length = 0
      for (const k in province_list) {
        let province = {
          label: province_list[k],
          value: province_list[k],
          children: []
        }
        if (_this.level >= 2 ){
          for (const k2 in city_list) {
            let v = k2 - k
            if (v > 0 && v < 10000){
              let city = {
                label: city_list[k2],
                value: city_list[k2],
                children: []
              }
              if (_this.level > 2) {
                for (const k3 in county_list) {
                  let v2 = k3 - k2
                  if (v2 > 0 && v2 < 100) {
                    let county = {
                      label: county_list[k3],
                      value: county_list[k3],
                    }
                    delete county_list[k3]
                    city.children.push(county)
                  }
                }
              }else {
                city.children = undefined
              }
              delete city_list[k2]
              province.children.push(city)
            }
          }
        }else {
          province.children = undefined
        }
        delete province_list[k]
        _this.treeData.push(province)
      }
      console.log('加载数据')
      //_this.$set(this, 'treeData', _this.treeData)
    },
    async loadAreaMap(){
      for (const k in areaList.province_list) {this.areaObj[areaList.province_list[k]] = k}
      for (const k in areaList.city_list) {this.areaObj[areaList.city_list[k]] = k}
    },
    ok(val){
      this._value = String(val.map(v => v.name)).replaceAll(',', '-')
      this.showPicker = false
    }
  },
  watch:{
    level(){
      this.loadTreeData()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

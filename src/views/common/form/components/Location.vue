<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <i class="iconfont icon-weizhi"></i>
      <span> {{ placeholder }}</span>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-input :disabled="!enableEdit" size="medium" clearable v-model="_value" :placeholder="placeholder">
        <el-button slot="append" icon="el-icon-map-location" @click="visible = true"></el-button>
      </el-input>
      <w-dialog :title="'点击地图选择位置：' + position.addr" v-model="visible" @ok="selectOk">
        <div class="v-map" v-if="visible">
          <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"/>
          <el-amap class="amap-box" vid="amapDemo" :zoom="zoom" :center="center" :events="events">
            <!-- 标记点 -->
            <el-amap-marker vid="marker" v-if="position.zb.length > 0" :position="position.zb"/>
          </el-amap>
        </div>
      </w-dialog>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly" class="m-v-map">
      <field v-model="_value" :readonly="!enableEdit" clearable :placeholder="placeholder">
        <template #right-icon>
          <i class="el-icon-map-location" @click="selectPosition"></i>
        </template>
      </field>
      <popup v-model="visible" :style="popupStyle" position="left" lazy-render safe-area-inset-bottom>
        <nav-bar :title="$isNotEmpty(position.addr) ? position.addr:'请选择位置'" left-text="返回" right-text="确定" left-arrow @click-left="visible = false" @click-right="selectOk"/>
        <div class="search-box" >
          <el-amap-search-box :search-option="searchOption" :on-search-result="onSearchResult"/>
        </div>
        <el-amap class="amap-box" vid="amapDemo" :zoom="zoom" :center="center" :events="events">
          <!-- 标记点 -->
          <el-amap-marker vid="marker" v-if="position.zb.length > 0" :position="position.zb"/>
        </el-amap>
      </popup>

    </div>
    <div v-else>
      {{_value}}
    </div>
  </div>
</template>

<script>
import { Field, Popup, NavBar } from 'vant'
import componentMinxins from "../ComponentMinxins";

export default {
  name: "Location",
  mixins: [componentMinxins],
  components: {Field, Popup, NavBar},
  props: {
    value: {
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择地理位置'
    },
    enableEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const _this = this
    return {
      visible: false,
      center: [121.59996, 31.197646],
      zoom: 14,
      position:{
        addr: '',
        zb: [117.120098, 36.6512]
      },
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      events: {
        init: () => {},
        click: (e) => {
          let {lng, lat} = e.lnglat;
          this.center = [lng, lat];
          this.position.zb = [lng, lat]
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                _this.position.addr = result.regeocode.formattedAddress;
                console.log('获取到位置', result.regeocode.formattedAddress)
              }
            }
          });
        },
      },
      popupStyle: {
        height: '100%',
        width: '100%',
        background: '#f7f7f9'
      }
    }
  },
  methods: {
    toLocation() {
      if (this.$isNotEmpty(this._value)) {
        var MSearch = new AMap.PlaceSearch(this.searchOption); //构造PlaceSearch类
        AMap.event.addListener(MSearch, "complete", val => {
          if (val.poiList.count > 0) {
            let center = val.poiList.pois[0];
            this.center = [center.location.lng, center.location.lat];
            this.position.zb = [center.location.lng, center.location.lat];
          }
        }); //返回结果
        MSearch.search(this._value); //关键字查询
      }else {
        this.getPosition()
      }
    },
    getPosition() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        position: 'RB',
        panToLocation: true,
        showCircle: true,
        buttonOffset: new AMap.Pixel(10, 20),
        zoomToAccuracy: true,
      });
      geolocation.getCurrentPosition(function (status, result) {
        if (status !== 'error'){
          let lng = result.position.lng;
          let lat = result.position.lat;
          this.position.zb = [lng, lat]
          this.center = [lng, lat]
        }else {
          console.log('定位失败，需要https环境')
        }
      });
    },
    onSearchResult(pois) {
      if (pois.length > 0) {
        let center = pois[0];
        this.position.addr = center.name;
        this.center = [center.lng, center.lat];
        this.position.zb = [center.lng, center.lat];
      }
    },
    selectOk(){
      this._value = this.position.addr
      this.visible = false
    },
    selectPosition(){
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
.v-map {
  width: 100%;
  height: 400px;
  position: relative;

  .search-box {
    position: absolute;
    top: 5px;
    right: 5px;
    min-width: 200px;
    opacity: 0.9;
  }
}
.m-v-map{
  position: relative;
  .search-box {
    text-align: center;
    position: absolute;
    display: flex;
    justify-content: center;
    top: 60px;
    width: 100%;
  }
}
</style>

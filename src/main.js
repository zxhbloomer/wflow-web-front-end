import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from './store'
require('@/utils/Injection')

/*import tinymce from 'tinymce'
Vue.prototype.$tinymce = tinymce*/

import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/display.css';
import "element-ui/lib/theme-chalk/index.css";
import 'vant/lib/index.css';
import 'vant/lib/index.less';

import '@/assets/theme/index.css'
import "@/assets/global.css";
import "@/assets/iconfont/iconfont.css"

import Ellipsis from '@/components/common/Ellipsis'
import WDialog from '@/components/common/WDialog'
import Tip from '@/components/common/Tip'
import Avatar from '@/components/common/Avatar'
import VueAMap from "vue-amap";
Vue.use(VueAMap)
Vue.use(ElementUI);
Vue.use(Ellipsis);
Vue.use(WDialog);
Vue.use(Tip);
Vue.use(Avatar);

Vue.config.productionTip = false

/*高德地图组件初始化*/
VueAMap.initAMapApiLoader({
  key: 'ebb9f6fb9beaec43fddcb22ab7406386',
  uiVersion: '1.0',
  plugin: [
    'AMap.Autocomplete',
    'AMap.ElasticMarker',
    'AMap.PlaceSearch',
    "AMap.MapType",
    "AMap.Geocoder",
    'AMap.Geolocation'
  ],
  v: '1.4.4'
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

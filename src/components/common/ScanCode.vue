<template>
  <w-dialog v-model="_value" closeFree title="扫码录入" width="500px" :showFooter="false" @closed="closeScan" @opened="openScan" v-if="pcMode">
    <div class="scan-video" v-if="_value">
      <video ref="video" style="width: 100%;" id="video" autoplay></video>
    </div>
    <p style="color:#656363; text-align: center">{{tipMsg}}</p>
  </w-dialog>
  <popup v-else v-model="_value" :style="popupStyle" @closed="closeScan" @opened="openScan" position="left" lazy-render closeable safe-area-inset-bottom>
    <div class="scan-cancel" @click="_value = false">取消</div>
    <div class="m-scan-video" v-if="_value">
      <video ref="video" id="video" autoplay></video>
    </div>
    <p style="color:white; text-align: center">{{tipMsg}}</p>
  </popup>
</template>

<script>

import { Popup } from 'vant'
import { BrowserMultiFormatReader } from '@zxing/library';

export default {
  name: "ScanCode",
  components: {Popup},
  props:{
    value: {
      type: Boolean,
      default: false
    },
    pcMode:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tipMsg: '',
      codeReader: null,
      popupStyle: {
        height: '100%',
        width: '100%',
        background: 'black',
        opacity: '0.8',
      }
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
  destroyed(){
   this.closeScan()
  },
  methods: {
    closeScan(){
      if (this.codeReader){
        this.codeReader.reset();
        this.codeReader = null
      }
    },
    async openScan() {
      if (!this.codeReader){
        this.codeReader = new BrowserMultiFormatReader();
      }
      this.codeReader.getVideoInputDevices().then((videoInputDevices) => {
        this.tipMsg = '正在打开摄像头...';
        console.log('videoInputDevices', videoInputDevices);
        // 默认获取第一个摄像头设备id
        let firstDeviceId = videoInputDevices[0].deviceId;
        // 获取第一个摄像头设备的名称
        const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
        if (videoInputDevices.length > 1) {
          // 判断是否后置摄像头
          if (videoInputDeviceslablestr.indexOf('back') > -1) {
            firstDeviceId = videoInputDevices[0].deviceId;
          } else {
            firstDeviceId = videoInputDevices[1].deviceId;
          }
        }
        this.decodeFromInputVideoFunc(firstDeviceId);
      }).catch(err => {
        this.tipMsg = '发生错误: ' + JSON.stringify(err);
      });
    },
    decodeFromInputVideoFunc(firstDeviceId) {
      this.codeReader.reset(); // 重置
      this.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
        this.tipMsg = '请将摄像头对准条形码/二维码...';
        if (result) {
          if (result.text) {
            this.$emit('ok', result.text)
            this._value = false
          }
        }
        if (err && !(err)) {
          this.tipMsg = '识别失败: ' + JSON.stringify(err);;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.scan-cancel{
  position: fixed;
  top: 20px;
  left: 20px;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 1
}
.m-scan-video{
  width: 100%;
  text-align: center;
  margin-top: 40%;
  video {
    width: 80%;
  }
}
</style>

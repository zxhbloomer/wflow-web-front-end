<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <i class="iconfont icon-weizhi"></i>
      <span> {{ placeholder }}</span>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <div v-if="$isNotEmpty(_value)">
        <img :src="_value" @click="showSignPanel" width="40%"/>
        <div >点击签名重签</div>
      </div>
      <el-button size="small" v-else icon="el-icon-edit" @click="showSignPanel">点击签字</el-button>
      <w-dialog title="请使用鼠标签字" width="700px" v-model="visible" @ok="signOk">
        <canvas id="signPanel" width="650px" height="300px"></canvas>
      </w-dialog>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly" class="m-sign">
      <div v-if="$isNotEmpty(_value)">
        <img :src="_value" @click="showSignPanel" width="40%"/>
        <div >点击签名重签</div>
      </div>
      <field v-else readonly @click="showSignPanel" :placeholder="placeholder">
        <template #right-icon>
          <i class="el-icon-edit" ></i>
        </template>
      </field>
      <popup v-model="visible" :style="popupStyle" position="left" lazy-render safe-area-inset-bottom>
        <nav-bar title="请签字" left-text="返回" right-text="确定" left-arrow @click-left="visible = false" @click-right="signOk"/>
        <div class="m-sign-panel">
          <canvas id="signPanel" height="200px"></canvas>
        </div>
      </popup>

    </div>
    <div v-else>
      <img :src="_value" width="40%"/>
    </div>
  </div>
</template>
<script>
import { Field, Popup, NavBar } from 'vant'
import componentMinxins from "../ComponentMinxins";
import {imgZip} from '@/utils/imageUtil'
import SignaturePad from 'signature_pad';

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
      default: '请签字'
    },
    thickness: {
      type: Number,
      default: 2
    },
    color:{
      type: String,
      default: '#000'
    }
  },
  data() {
    return {
      visible: false,
      signImg: '',
      hasSign: false,
      signaturePad: null,
      popupStyle: {
        height: '100%',
        width: '100%',
        background: '#FFFFFF',
      }
    }
  },
  mounted() {
  },
  methods: {
    initSign(){
      this.hasSign = false
      if (this.signaturePad){
        this.signaturePad.clear()
      }else {
        let canvas = document.getElementById('signPanel');
        this.signaturePad = new SignaturePad(canvas, {
          penColor: this.color, minWidth: this.thickness, maxWidth: this.thickness + 2
        });
        this.signaturePad.onEnd = () => {
          this.hasSign = true
          //this._value = this.signaturePad.toDataURL()
        }
        if (this.mode === 'MOBILE'){
          //canvas.height = 300 ;
          canvas.width = document.body.clientWidth;
        }
        //this.resizeCanvas(canvas)
      }
    },
    resizeCanvas(canvas){
      var ratio = Math.max(window.devicePixelRatio, 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      this.signaturePad.clear();
    },
    showSignPanel(){
      this.visible = true
      this.$nextTick(() => {
       this.initSign()
      })
    },
    signOk(){
      this.visible = false
      this._value = this.signaturePad.toDataURL()
      /*imgZip(this.signaturePad.toDataURL("image/jpeg"), this.signaturePad, base64 => {
        this._value = base64
      })*/
      //this._value = canvas.toDataURL("image/jpeg", 0.5)
    },
  }
}
</script>

<style lang="less" scoped>

canvas{
  border: 1px dashed #666666;
}
img{
  cursor: pointer;
  border: 1px solid white;
  &:hover{
    border: 1px dashed @theme-primary;
  }
}
.m-sign-panel {
  margin: 40px 0;
  background: @theme-aside-bgc;
  canvas{
    border: 1px;
  }
}
</style>

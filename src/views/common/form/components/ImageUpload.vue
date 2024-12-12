<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <div class="design">
        <i class="el-icon-plus"></i>
      </div>
      <p>{{ placeholder }} {{ sizeTip }}</p>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-upload :file-list="fileList" :action="uploadUrl" :limit="maxNumber" with-credentials
                 :multiple="maxNumber > 1" :data="uploadParams" :on-success="uploadSuccess"
                 :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                 :on-exceed="overLimit" :on-error="uploadFail"
                 list-type="picture-card" auto-upload :before-upload="beforeUpload">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">{{ placeholder }} {{ sizeTip }}</div>
      </el-upload>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <uploader v-model="fileList" :multiple="maxNumber > 1" :max-count="maxNumber > 0 ? maxNumber : 99" deletable
                :before-delete="handleRemove" :before-read="beforeUpload"
                upload-text="选择图片" :after-read="afterRead" :max-size="maxSize * 1024 * 1024" @oversize="onOversize"/>
      <div style="color:#9b9595;">{{ placeholder }} {{ sizeTip }}</div>
    </div>
    <div v-else class="img-preview">
      <div class="img-preview-pc">
        <el-image :alt="img.name" :src="$getRes(img.url)" v-for="img in _value" :preview-src-list="pcImgList"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Uploader, Toast } from 'vant';
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "ImageUpload",
  components: {Uploader},
  props: {
    value:{
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择图片'
    },
    maxSize: {
      type: Number,
      default: 5
    },
    maxNumber:{
      type: Number,
      default: 10
    },
    enableZip: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    sizeTip() {
      return this.maxSize > 0 ? `| 每张图不超过${this.maxSize}MB` : ''
    },
    pcImgList() {
      return this._value.map(v => this.$getRes(v.url))
    },
    fileList:{
      get(){
        return this._value.map(f => {
          return {
            name: f.name,
            url: this.$getRes(f.url),
            status: 'success'
          }
        })
      },
      set(val){}
    }
  },
  data() {
    return {
      loading: false,
      disabled: false,
      uploadUrl: `${this.BASE_URL}/wflow/res`,
      uploadParams: {isImg: true},
      catchList: [],
      alows: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
    }
  },
  methods: {
    beforeUpload(file){
      this.catchList.length = 0
      if (Array.isArray(file)){
        for (let i = 0; i < file.length; i++) {
          if (!this.validImage(file[i])){
            return false;
          }
        }
        return true;
      }else {
        return this.validImage(file)
      }
    },
    validImage(img){
      if (this.alows.indexOf(img.type) === -1){
        this.$message.warning("存在不支持的图片格式")
      }else if(this.maxSize > 0 && img.size / 1024 / 1024 > this.maxSize){
        this.$message.warning(`单张图片最大不超过 ${this.maxSize}MB`)
      }else {
        this.loading = true
        return true
      }
      return false
    },
    removeFile(fileId){
      this.$axios.delete(`${this.BASE_URL}/wflow/res/${fileId}`).then(rsp => {
        this.$message.success('移除文件成功');
      })
    },
    uploadSuccess(response, file, fileList){
      this.loading = false
      this.catchList.push(response)
      let ft = fileList.filter(f => f.size !== undefined)
      if (this.catchList.length === ft.length){
        this._value.push(...this.catchList)
        this.$emit('input', this._value)
      }
      this.$message.success(response.name + '上传成功')
    },
    uploadFail(err){
      this.loading = false
      this.$message.error('图片上传失败 ' + err)
    },
    afterRead(file){
      if (Array.isArray(file)){
        file.forEach(fl => {
          this.uploadFile(fl)
        })
      }else {
        this.uploadFile(file)
      }
    },
    uploadFile(file){
      //上传文件
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("isImg", true)
      this.$axios.post(this.uploadUrl, formData, {
        'Content-type' : 'multipart/form-data'
      }).then(res => {
        if (res.status === 200){
          this._value.push(res.data)
          this.$emit('input', this._value)
          Toast.success('上传成功')
        }
      }, err => {
        Toast.fail('上传失败')
        console.log(err)
      })
    },
    overLimit(){
      if (this.mode === 'PC'){
        this.$message.warning('最多只能上传' + this.maxNumber + '张图片')
      }else {
        Toast.fail('数量超出限制')
      }
    },
    onOversize(file){
      Toast.fail('图片过大')
    },
    handleRemove(file, fileList) {
      let i = this._value.findIndex(v => v.name === file.name)
      if (i > -1){
        //this.removeFile(this._value[i].id)
        this._value.splice(i, 1)
        this.$emit('input', this._value)
      }
      console.log('删除文件', file)
    },
    handlePictureCardPreview(file) {
      console.log(file)
    },
    handleDownload(file) {
      console.log(file);
    }
  }
}
</script>

<style lang="less" scoped>
.design {
  i {
    padding: 10px;
    font-size: xx-large;
    background: white;
    border: 1px dashed #8c8c8c;
  }
}
/deep/ .el-upload--picture-card{
  width: 80px;
  height: 80px;
  line-height: 87px;
}
/deep/ .el-upload-list__item{
  width: 80px;
  height: 80px;
  transition: none;
  .el-upload-list__item-actions{
    &> span+span{
      margin: 1px;
    }
  }
}
/deep/ .el-upload-list__item-preview{
  display: none !important;
}
.img-preview{
  /deep/ .img-preview-pc {
    .el-image{
      width: 80px;
      height: 80px;
      margin: 5px;
    }
  }
}
</style>

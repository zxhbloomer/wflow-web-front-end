<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
      <ellipsis :row="1" :content="placeholder + sizeTip" hoverTip slot="tip" class="el-upload__tip"/>
    </div>
    <div v-else-if="mode === 'PC' && !readonly" v-loading="loading">
      <el-upload :file-list="fileList" :action="uploadUrl" :limit="maxNumber" with-credentials
                 :multiple="maxNumber > 1" :data="uploadParams" :on-success="uploadSuccess"
                 auto-upload :before-upload="beforeUpload" :on-remove="handleRemove" :on-error="uploadFail"
                 :accept="String(fileTypes)" :on-exceed="overLimit">
        <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
        <ellipsis :row="1" :content="placeholder + sizeTip" hoverTip slot="tip" class="el-upload__tip"/>
      </el-upload>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <uploader v-model="fileList" :accept="String(fileTypes)" :multiple="maxNumber > 1" :max-count="maxNumber > 0 ? maxNumber : 99"
                deletable :before-delete="handleRemove"
                upload-text="选择文件" :after-read="afterRead" :max-size="maxSize * 1024 * 1024" @oversize="onOversize"
                upload-icon="description">
      </uploader>
      <div style="color:#9b9595;">{{ placeholder }} {{ sizeTip }}</div>
    </div>
    <div v-else class="file-preview">
      <div v-if="mode === 'PC'" class="file-preview-pc">
        <div v-for="file in _value" :key="file.id">
          <ellipsis class="file-item" type="primary" @click.native="download(file)" :content="file.name">
            <i slot="pre" class="el-icon-document"></i>
            <el-tag slot="aft" size="mini">{{ getSize(file.size) }}</el-tag>
          </ellipsis>
        </div>
      </div>
      <div v-else>
        <el-row v-for="file in _value" :key="file.id">
          <el-col :span="20">
            <ellipsis style="display: inline-block" class="file-item" type="primary" @click.native="download(file)"
                      :content="file.name">
              <i slot="pre" class="el-icon-document"></i>
            </ellipsis>
          </el-col>
          <el-col :span="4">
            <el-tag size="mini">{{ getSize(file.size) }}</el-tag>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import {Uploader, Toast} from "vant";

export default {
  mixins: [componentMinxins],
  name: "FileUpload",
  components: {Uploader},
  props: {
    placeholder: {
      type: String,
      default: '请选择附件'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    maxSize: {
      type: Number,
      default: 5
    },
    maxNumber: {
      type: Number,
      default: 10
    },
    fileTypes: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    sizeTip() {
      if (this.fileTypes.length > 0) {
        return ` | 只允许上传[${String(this.fileTypes).replaceAll(",", "、")}]格式的文件，且单个附件不超过${this.maxSize}MB`
      }
      return this.maxSize > 0 ? ` | 单个附件不超过${this.maxSize}MB` : ''
    },
    fileList: {
      get() {
        return this._value.map(f => {
          return {
            name: f.name,
            url: this.$getRes(f.url),
            status: 'success',
            file: new File([], f.name, {})
          }
        })
      },
      set(val) {
      }
    }
  },
  data() {
    return {
      loading: false,
      disabled: false,
      uploadUrl: `${this.BASE_URL}/wflow/res`,
      uploadParams: {isImg: false},
    }
  },
  methods: {
    beforeUpload(file) {
      if (Array.isArray(file)){
        for (let i = 0; i < file.length; i++) {
          if (!this.validFile(file[i])){
            return false;
          }
        }
        return true;
      }else {
        return this.validFile(file)
      }
    },
    validFile(file){
      if (this.maxSize > 0 && file.size / 1024 / 1024 > this.maxSize) {
        this.$message.warning(`单个文件最大不超过 ${this.maxSize}MB`)
      } else {
        this.loading = true
        return true
      }
      return false
    },
    getSize(size) {
      if (size > 1048576) {
        return (size / 1048576).toFixed(1) + 'MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(1) + 'KB'
      } else {
        return size + 'B'
      }
    },
    removeFile(fileId) {
      this.$axios.delete(`${this.BASE_URL}/wflow/res/${fileId}`).then(rsp => {
        this.$message.success('移除文件成功');
      })
    },
    uploadSuccess(response, file, fileList) {
      this.loading = false
      console.log(response)
      this._value.push(response)
      this.$emit('input', this._value)
      this.$message.success(response.name + '上传成功')
    },
    uploadFail(err){
      console.log(err)
      this.loading = false
      this.$message.error('文件上传失败 ' + err)
    },
    overLimit() {
      if (this.mode === 'PC') {
        this.$message.warning('最多只能上传' + this.maxNumber + '个附件')
        this.loading = false
      } else {
        Toast.fail('数量超出限制')
      }
    },
    afterRead(file) {
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
      formData.append("isImg", false)
      Toast.loading({message: '上传中...', forbidClick: true});
      this.$axios.post(this.uploadUrl, formData, {
        'Content-type': 'multipart/form-data'
      }).then(res => {
        if (res.status === 200) {
          this._value.push(res.data)
          this.$emit('input', this._value)
          Toast.success('上传成功')
        }
      }, err => {
        Toast.fail('上传失败');
        console.log(err)
      })
    },
    onOversize(file) {
      Toast.fail('文件过大')
    },
    handleRemove(file, fileList) {
      let i = this._value.findIndex(v => v.name === file.name)
      if (i > -1) {
        //this.removeFile(this._value[i].id)
        this._value.splice(i, 1)
        this.$emit('input', this._value)
        console.log('删除文件', file)
      }
    },
    handlePictureCardPreview(file) {

    },
    handleDownload(file) {
      console.log(file);
    },
    download(file) {
      window.open(`${this.$getRes(file.url)}?name=${file.name}`, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload-list__item {
  transition: none;
}

.file-item {
  color: @theme-primary;
  cursor: pointer;
}
</style>

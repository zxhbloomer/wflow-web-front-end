<template>
    <vue-editor v-model="_value" :init="init" :disabled="readonly"></vue-editor>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import vueEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.css'

import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/template'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/autoresize'

export default {
  components: {vueEditor},
  props: {
    value: {
      type: String,
      required:false
    },
    height: {
      type: Number,
      default: 800
    },
    readonly: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'print preview autolink directionality visualblocks visualchars fullscreen image link template code table charmap pagebreak nonbreaking insertdatetime advlist lists imagetools textpattern help autoresize'
    },
    toolbar: {
      type: [String, Array],
      default: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link | \a\
      lignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat |\
      table image charmap emoticons hr pagebreak insertdatetime | \
    styleselect formatselect fontselect fontsizeselect | \
     | bdmap indent2em lineheight formatpainter axupimgs | print preview | fullscreen',
      branding:false
    }
  },
  data() {
    return {
      //初始化配置
      editor: null,
      uploadUrl: `${this.BASE_URL}/wflow/res`,
      init: {
        language_url: '/editor/js/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/editor/skins/lightgray',
        height: this.height,
        inline: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        toolbar_drawer: false,
        toolbar_sticky: true,
        convert_urls: false,
        images_upload_handler: (blobInfo, success) => {
          let formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          formData.append('isImg', true);
          this.$axios.post(this.uploadUrl, formData, {
            'Content-type' : 'multipart/form-data'
          }).then(res => {
            if (res.status === 200){
              this.$message.success('上传成功')
              success(this.$getRes(res.data.url))
            }
          }, err => {
            this.$message.error('上传失败')
            console.log(err)
          })
        },
        setup: (editor) => {
          editor.on('init', (e) => {
            console.log('编辑器初始化完成...', editor)
            this.editor = editor
            editor.dom.doc.ondrop = this.dropElOnEditor
          });
        }
      },
      reloading: false,
    }
  },
  computed:{
    _value:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val)
      }
    }
  },
  mounted() {

  },
  methods: {
    dropElOnEditor(ev){
      tinymce.activeEditor.focus();
      const text = ev.dataTransfer.getData('text')
      ev.dataTransfer.clearData()
      console.log(text, ev)
      const cp = JSON.parse(text)
      //this.setCursor(ev.target, 1)
      if (cp.name && cp.name === 'TableList'){
        this.insertDom(this.createTable(cp))
      }else {
        this.insertText('${' + cp.id + '}')
      }
      ev.preventDefault()
    },
    insertText(text){
      this.editor.execCommand('mceInsertContent', false, text);
    },
    autoFocus(x, y){
      let evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
      document.body.dispatchEvent(evt);
    },
    //移动游标到指定位置，这里需要计算下移动多少
    setCursor(target, offset){
      tinymce.activeEditor.selection.setCursorLocation(target, offset)
      //this.editor.setCursorLocation(target, 2)
    },
    insertDom(dom){
      this.insertText(dom.innerHTML)
    },
    createTable(field){
      //const height = 40;
      const table = document.createElement('table')
      const tbody = document.createElement('tbody')
      const trh = document.createElement('tr')
      const trd = document.createElement('tr')
      table.setAttribute('class', field.id)
      table.setAttribute('style', 'border-collapse: collapse; width: 99.8363%; height: 74px;')
      table.setAttribute('border', '1')
      table.appendChild(tbody)
      trh.setAttribute('style', 'height: 40px;')
      trd.setAttribute('style', 'height: 40px;')
      tbody.appendChild(trh)
      tbody.appendChild(trd)
      //构造表格行
      field.props.columns.forEach(col => {
        const tdh = document.createElement('td')
        const style = `width: ${(100 / field.props.columns.length).toFixed(3)}%; height: 40px;`
        tdh.setAttribute('style', style)
        tdh.innerText = col.title
        trh.appendChild(tdh)
        const tdd = document.createElement('td')
        tdd.setAttribute('style', style)
        tdd.innerText = '${' + col.id + '}'
        trd.appendChild(tdd)
      })
      const tableDom = document.createElement('span')
      tableDom.appendChild(table)
      return tableDom
    },
    reload() {
      this.reloading = true
      this.$nextTick(() => this.reloading = false)
    }
  }
}

</script>
<style scoped>
</style>

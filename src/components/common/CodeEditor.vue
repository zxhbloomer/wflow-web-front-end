<template>
  <div ref="editor" :style="{width: '100%', 'height': height}"></div>
</template>
<script>

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default {
  name: 'CodeEditor',
  components: {},
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          theme: "vs",
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          automaticLayout: true,
          glyphMargin: true,
          showFoldingControls: "always",
          formatOnPaste: true,
          formatOnType: true,
          folding: true
        }
      }
    },
    lang: {
      type: String,
      default: 'javascript'
    },
    height: {
      type: String,
      default: '300px'
    },
    value: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      randomKey: '',
      code: ''
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // 销毁之前把monaco的实例也销毁了，不然会多次注册
    if (this.editor) {
      this.editor.dispose();
    }
  },
  methods: {
    init() {
      this.editor = monaco.editor.create(this.$refs.editor, {
        theme: "vs", // 主题
        value: this.value, // 默认显示的值
        language: this.lang,
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "indentation", // 折叠方式  auto | indentation
        showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: false, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        enableSplitViewResizing: false,
        readOnly: false, //是否只读  取值 true | false
      });
      this.editor.onDidChangeModelContent((event) => {
        this.$emit('input', this.editor.getValue())
      })
      this.loadVal()
    },
    reloadCode(value){
      this.editor.setValue(value || this.value)
      this.loadVal()
    },
    loadVal(){
      if (!this.$isNotEmpty(this.value)){
        this.$emit('input', this.defaultValue)
      }
    }
  },
}
</script>
<style lang="less" scoped>
.code-editor-wrapper {
  height: 100%;
  text-align: left;
  overflow: auto;

  /deep/ .CodeMirror {
    height: 100%;
  }
}
</style>

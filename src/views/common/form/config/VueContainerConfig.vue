<template>
  <div>
    <el-form-item label="编辑器">
      <el-button size="small" @click="visible = true" icon="el-icon-edit">打开代码编辑器</el-button>
    </el-form-item>
    <w-dialog title="编辑组件代码" v-model="visible" @ok="ok">
      <div class="cp-preview">
        预览模式：
        <el-radio-group v-model="mode">
          <el-radio label="DESIGN">设计模式</el-radio>
          <el-radio label="PC">PC模式</el-radio>
          <el-radio label="MOBILE">手机模式</el-radio>
          <el-radio label="XX">只读模式</el-radio>
        </el-radio-group>
        <div class="cp-render">
          <vue-container v-model="testValue" :mode="mode" :template="value.template" :cp-js="value.cpJs" :cp-style="value.cpStyle"/>
        </div>
        <el-button class="preview" size="mini" icon="el-icon-view" @click="doPreview" plain>预览组件</el-button>
      </div>
      <el-alert type="success" :closable="false" title="组件值绑定在变量 _value 上，可以修改它来更新组件值"/>
      <el-tabs v-if="visible">
        <el-tab-pane lazy label="template">
          <code-editor v-model="config.template" lang="html"></code-editor>
        </el-tab-pane>
        <el-tab-pane lazy label="script">
          <code-editor v-model="config.cpJs" lang="javascript"></code-editor>
        </el-tab-pane>
        <el-tab-pane lazy label="style">
          <code-editor v-model="config.cpStyle" lang="css"></code-editor>
        </el-tab-pane>
      </el-tabs>
    </w-dialog>
  </div>
</template>

<script>
import CodeEditor from "@/components/common/CodeEditor";
import VueContainer from "../components/VueContainer";
export default {
  name: "VueContainerConfig",
  components: {CodeEditor, VueContainer},
  props:{
    value:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      mode: 'PC',
      testValue: null,
      config:{
        template: this.value.template || '<template>\n' +
            '  <div>\n' +
            '    <div v-if="mode === \'DESIGN\'">\n' +
            '      <!--组件在设计器中的样子-->\n' +
            '    </div>\n' +
            '    <div v-else-if="mode === \'PC\' && !readonly">\n' +
            '      <!--组件在PC端预览及真实显示的样子-->\n' +
            '    </div>\n' +
            '    <div v-else-if="mode === \'MOBILE\' && !readonly">\n' +
            '      <!--组件在移动端预览及真实显示的样子-->\n' +
            '    </div>\n' +
            '    <div v-else>\n' +
            '      <!--组件在流程实例预览中，只读状态下样子-->  \n' +
            '    </div>\n' +
            '  </div>\n' +
            '</template>',
        cpJs: this.value.cpJs || 'function generate() {\n' +
            '  return {\n' +
            '    name: \'myComponent\',\n' +
            '    data() {\n' +
            '       return {\n' +
            '         \n' +
            '       }\n' +
            '    },\n' +
            '    methods: {\n' +
            '        \n' +
            '    },\n' +
            '  };\n' +
            '}',
        cpStyle: this.value.cpStyle || ''
      }
    }
  },
  methods: {
    doPreview(){
      this.value.template = this.config.template
      this.value.cpJs = this.config.cpJs
      this.value.cpStyle = this.config.cpStyle
    },
    ok(){
      this.doPreview()
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.cp-preview{
  margin-bottom: 20px;
  position: relative;
  .preview{
    position: absolute;
    right: 0;
    top: -5px;
  }

  .cp-render{
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px dashed #d3d2d2;
  }
}
</style>

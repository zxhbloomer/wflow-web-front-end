<template>
  <div class="senior-setup">
    <el-form label-position="top" label-width="80px">
      <el-form-item label="审批签字">
        <el-switch inactive-text="无需签字" active-text="需要签字"
                   v-model="setup.sign"></el-switch>
        <div class="sign-tip">如果此处设置为 <b>需要签字</b>，则所有审批人“同意时” <b>必须签字</b></div>
      </el-form-item>
<!--      <el-form-item label="当相邻节点审批人相同时">
        <el-switch inactive-text="仍要审批" active-text="直接跳过"
                   v-model="setup.sameSkip"></el-switch>
      </el-form-item>-->
      <el-form-item label="打印模板">
        <el-switch inactive-text="系统默认" active-text="自定义" v-model="setup.customPrint"></el-switch>
        <el-button size="mini" style="margin-left: 20px" @click="editPrint"
                   v-if="setup.customPrint" icon="el-icon-document">
          去编辑模板
        </el-button>
        <span style="margin-left: 20px; color: #8c8c8c" v-else>使用系统默认模板打印</span>
      </el-form-item>
    </el-form>
    <w-dialog title="打印模板设计器-自定义表单打印版式" fullscreen closeFree v-model="printVisible" @ok="confirmPrintTp">
      <print-template-design v-if="printVisible" v-model="printContent"/>
    </w-dialog>
  </div>
</template>

<script>
import PrintTemplateDesign from "./print/PrintTemplateDesign";
export default {
  name: "FormProSetting",
  components: {PrintTemplateDesign},
  computed: {
    setup() {
      return this.$store.state.design.settings;
    },
  },
  data(){
    return {
      printVisible: false,
      printContent: ''
    }
  },
  mounted() {
    this.printContent = this.setup.printTemplate
  },
  methods:{
    validate(){
      return []
    },
    editPrint(){
      this.printVisible = true
      this.printContent = this.setup.printTemplate
    },
    confirmPrintTp(){
      this.printVisible = false
      this.$set(this.setup, 'printTemplate', this.printContent)
    }
  }
}
</script>

<style lang="less" scoped>
.senior-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  .sign-tip {
    display: inline-block;
    color: #949495;
    font-size: small;
    margin-left: 20px;
  }
}
/deep/ .el-form-item__label{
  font-weight: bold;
}
</style>

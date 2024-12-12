<template>
  <div>
    <el-form-item label="结果描述">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置计算结果描述"/>
    </el-form-item>
    <el-form-item label="保留小数">
      <el-input-number controls-position="right" :precision="0" :max="3" :min="0" size="small" v-model="value.precision"  placeholder="小数位数"/>
      位
    </el-form-item>
    <el-form-item label="公式配置">
      <el-button size="mini" icon="el-icon-setting" @click="showPanel">设置公式</el-button>
      <div class="calc-preview">
        <span v-for="(item, i) in value.explain" :key="i">
          <div class="calc-tag" v-if="item.symbol">{{item.name}}</div>
          <span v-else>{{item}}</span>
        </span>
      </div>
    </el-form-item>
    <w-dialog title="配置计算公式" :width="value.isPlus ? '760px':'560px'" v-model="visible" @opened="init" @ok="validExplain">
      <div slot="title">
        <span style="margin-right: 30px">计算公式配置</span>
        <el-radio-group v-model="value.isPlus" @change="modeChange">
          <el-radio :label="false">简单模式</el-radio>
          <el-radio :label="true">高级模式</el-radio>
        </el-radio-group>
      </div>
      <el-alert style="margin-bottom: 10px" v-if="showError" type="error" :description="`😢 计算公式/函数设置有误，无法完成计算，${errorInfo}`" :closable="false"/>
      <div class="calc-content" v-if="!value.isPlus">
        <div class="calc-screen">
          <div>
            <span v-for="(item, i) in explainTemp" :key="i">
              <div class="calc-tag" v-if="item.symbol">{{item.name}}</div>
              <span v-else>{{item}}</span>
            </span>
          </div>
          <div class="calc-option">
            <el-button type="text" icon="el-icon-back" :disabled="explainTemp.length === 0" @click="backOne">退格</el-button>
            <el-button type="text" :disabled="explainTemp.length === 0" @click="explainTemp = []">清空</el-button>
          </div>
        </div>
        <el-form class="calc-keys">
          <el-form-item label="表单变量:">
            <div v-if="formVars.length > 0">
              <div @click="appendExplain(item)" class="calc-tag var-tag" v-for="item in formVars" :key="item.symbol">{{item.name}}</div>
            </div>
            <div v-else style="color: #8c8c8c">表单内数值类型的字段才可作为变量参与计算</div>
          </el-form-item>
          <el-form-item label="运算符号:">
            <div>
              <div @click="appendExplain(item)" class="calc-tag" v-for="item in operators" :key="item.symbol">{{item.name}}</div>
            </div>
          </el-form-item>
          <el-form-item label="数字键盘:">
            <div class="key-tags">
              <div @click="appendExplain(item)" class="calc-tag" v-for="item in numberKeys" :key="item">{{item}}</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-alert type="info" description="🎈 使用js构建任意计算规则，取表单字段值（formData.字段ID）" :closable="false"/>
        <div style="margin-top: 10px;">
          <span>表单变量：</span>
          <template v-if="formAndTableVars.length > 0">
            <el-tooltip :content="copyOk? '复制成功√' : '点击复制变量'" placement="top" v-for="item in formAndTableVars" :key="item.symbol">
              <div @click="copyVar(item)" class="calc-tag" >{{item.name}}</div>
            </el-tooltip>
          </template>
          <template v-else style="color: #8c8c8c">表单内数值类型的字段才可作为变量参与计算</template>
        </div>
        <code-editor ref="code" :key="value.jsCode + value.explain" style="margin-top: 20px" v-model="jsCodeTemp" lang="javascript"></code-editor>
      </div>
    </w-dialog>
  </div>
</template>

<script>
const operators = [
  {name: '+', symbol: '+'},
  {name: '-', symbol: '-'},
  {name: '×', symbol: '*'},
  {name: '÷', symbol: '/'},
  {name: '(', symbol: '('},
  {name: ')', symbol: ')'}
]
import CodeEditor from "@/components/common/CodeEditor";
export default {
  name: "CalcFormulaConfig",
  components: {CodeEditor},
  props:{
    value:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed:{
    activeConfig(){
      return this.$store.state.selectFormItem.id
    },
    formVars(){
      const formVars = []
      this.getFormItem(this.$store.state.design.formItems, formVars)
      return formVars
    },
    formAndTableVars(){
      const formVars = []
      this.getFormItem(this.$store.state.design.formItems, formVars, true)
      return formVars
    },
    testVars(){
      return this.formVars.map(v => v.symbol)
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      copyOk: false,
      visible: false,
      showError: false,
      errorInfo: '',
      explain: '',
      explainTemp: [],
      jsCodeTemp: '',
      operators,
      numberKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'],
      defaultJs: '/**\n' +
          ' * @param formData 表单数据对象\n' +
          ' * @returns {number} 计算结果数值\n' +
          ' */\n' +
          'function execute(formData){\n' +
          '  //do something\n' +
          '  return 0\n' +
          '}'
    }
  },
  methods: {
    init(){
      this.explainTemp = [...this.value.explain]
      this.jsCodeTemp = this.value.jsCode
      this.$nextTick(() => {
        if (this.value.isPlus && this.$refs.code) {
          this.$refs.code.reloadCode(this.jsCodeTemp)
        }
      })
    },
    showPanel(){
      this.visible = true
    },
    backOne(){
      this.explainTemp.splice(this.explainTemp.length - 1, 1)
    },
    appendExplain(item){
      this.explainTemp.push(item)
      //this.decodeExplain()
    },
    copyVar(item){
      const content = document.createElement('textarea');
      // 防止手机上弹出软键盘
      content.setAttribute('readonly', 'readonly');
      content.value = item.symbol;
      document.body.appendChild(content);
      content.select();
      document.execCommand('copy');
      document.body.removeChild(content);
      this.copyOk = true
      setTimeout(() => this.copyOk = false, 500)
    },
    modeChange(){
      this.explainTemp = []
      this.errorInfo = ''
      this.showError = false
      if (this.value.isPlus){
        this.jsCodeTemp = this.value.jsCode.trim().length > 0 ? this.value.jsCode : this.defaultJs
        this.$nextTick(() => {
          this.$refs.code.reloadCode(this.jsCodeTemp)
        })
      }else {
        this.jsCodeTemp = ''
        this.explainTemp = [...this.value.explain]
      }
    },
    decodeExplain(){
      this.explain = ''
      this.explainTemp.forEach(item => {
        const v = String(item.symbol || item)
        if(/[0-9.]$/.test(v)){
          this.explain += v
        }else {
          this.explain += v + ' '
        }
      })
    },
    isNumberField(item){
      return item.name === 'AmountInput'
          || item.name === 'NumberInput'
          || item.name === 'CalcFormula'
    },
    getFormItem(items, arr, tb = false){
      items.forEach(item => {
        //过滤掉自身组件，防止用户使用造成死循环计算
        if (item.id !== this.activeConfig){
          if (item.name === 'SpanLayout'){
            this.getFormItem(item.props.items, arr)
          }else if (this.isNumberField(item)){
            arr.push({
              name: item.title,
              symbol: 'formData.' + item.id
            })
          }else if (item.name === 'TableList' && tb){
            item.props.columns.forEach(col => {
              if (this.isNumberField(col)){
                arr.push({
                  name: `${item.title}.${col.title}`,
                  symbol: `formData.${item.id}[?].${col.id}`
                })
              }
            })
          }
        }
      })
    },
    validExplain(){
      this.errorInfo = ''
      const formData = {}
      this.testVars.forEach(key => formData[key.split('.')[1]] = 0)
      let execute = null
      try {
        if (this.value.isPlus){
          const js = this.jsCodeTemp.replace(/formData.field[0-9]+\[[\d+?]+\]/gi, mc => {
            return '{}'
          })
          execute = new Function('formData', `${js} return execute(formData)`)
          execute(formData)
          this.value.jsCode = this.jsCodeTemp
          this.value.explain = []
        }else {
          this.decodeExplain()
          execute = new Function('formData', `return ${this.explain}`)
          execute(formData)
          this.value.explain = this.explainTemp
          this.value.jsCode = ''
        }
        console.log('test result: ', execute(formData))
        this.showError = false
        this.visible = false
      }catch (e) {
        console.log(e)
        this.showError = true
        this.errorInfo = e
      }
    }
  },
  watch:{
    activeConfig(){
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.calc-screen{
  position: relative;
  padding: 7px;
  margin-bottom: 10px;
  background: #f3f3f3;
  border-radius: 5px;
  min-height: 100px;
  /deep/ .calc-option{
    position: absolute;
    bottom: 0;
    right: 10px;
    .el-button--text:last-child{
      color: @theme-danger;
    }
  }
}
.calc-preview{
  .calc-tag{
    padding: 2px;
    height: 20px;
    margin: 0;
    line-height: 20px;
    border: none;
  }

}

.calc-keys{
  &>div{
    margin: 15px 0;
  }
  .el-form-item__content{
    .var-tag{
      width: auto !important;
    }
    .calc-tag{
      width: 25px;
      height: 22px;
      line-height: 22px;
      text-align: center;
    }
    .key-tags{
      width: 150px;
      margin-left: 70px;
    }
  }

}
.calc-tag{
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
  margin: 0 5px;
  display: inline-block;
  border: 1px solid #eaeaea;
  &:hover{
    background: #eaeaea;
  }
}
</style>

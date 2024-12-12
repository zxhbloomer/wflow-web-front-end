<script>
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "VueContainer",
  components: {},
  props: {
    value: {
      type: [Object, String, Array, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    template: {
      type: String,
      default: null
    },
    cpStyle: {
      type: String,
      default: null
    },
    cpJs: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      subCompErr: null,
    }
  },
  computed: {
    className() {
      return `vue-contain-${Math.random().toString(16).slice(2)}`
    },
    scopedStyle() {
      if (this.cpStyle) {
        const scope = `.${this.className}`
        return this.cpStyle.trim().replace(/(^|\})\s*([^{]+)/g, (m, g1, g2) => {
          return g1 ? `${g1} ${scope} ${g2}` : `${scope} ${g2}`
        })
      }
      return ''
    },
    component() {
      const result = this.doVueContainerParser((this.cpJs || '').trim(), {})
      const component = result.value
      if (result.error) {
        result.error = {
          msg: result.error.toString(),
          type: 'js脚本错误',
        }
        return result
      }
      const template = (this.template || '')
          .replace(/^ *< *template *>|<\/ *template *> *$/g, '')
          .trim()
      // 注入template或render，设定template优先级高于render
      if (template) {
        component.template = template
        component.render = undefined
      } else if (!component.render) {
        component.template = '<span>未提供模板或render函数</span>'
      }
      // 注入mixins
      component.mixins = [{
        props: {
          mode: {
            type: String,
            default: 'DESIGN'
          },
          value: {
            type: [Object, String, Array, Number],
            default: null
          },
          required: {
            type: Boolean,
            default: false
          },
          readonly: {
            type: Boolean,
            default: false
          },
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
        beforeUpdate: () => {
          this.subCompErr = null
        },
      }]
      return result
    },
  },
  methods: {
    doVueContainerParser(jsCode, params, globalParams){
      const NOOP = args => args
      const parser = this.scriptParser(jsCode, NOOP, globalParams)
      const parserFunc = parser.value
      parser.value = params
      if (!(parserFunc instanceof Function)) {
        parser.error = new Error('非法的js脚本函数')
      }else {
        try {
          parser.value = parserFunc.call(parserFunc, params)
        } catch (e) {
          parser.error = e
        }
      }
      return parser
    },
    scriptParser(jsCode, value, params) {
      const jsParser = {value, error: null}
      try {
        jsParser.value = new Function('context', `return ${jsCode}`)(params) || value
      } catch (e) {
        jsParser.error = e
      }
      return jsParser
    },
  },
  render() {
    const {error: compileErr, value: component} = this.component
    const error = compileErr || this.subCompErr
    if (error) {
      return <div class="component-error">
        <div>{error.type}</div>
        <div>{error.msg}</div>
      </div>
    } else {
      const props = {...this.$attrs, ...this.$props}
      return <div class={this.className}>
        <style>{this.scopedStyle}</style>
        <component {...props} value={this.value} onInput={e => this._value = e} mode={this.mode}/>
      </div>
    }
  },
  mounted() {
  },
  errorCaptured(err, vm, info) {
    this.subCompErr = {
      msg: err && err.toString && err.toString(),
      type: '自定义组件运行时错误：',
    }
 },
}
</script>
<style lang='less' scoped>
.component-error{
  font-size: small;
  color: red;
}
</style>

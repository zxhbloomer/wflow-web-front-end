<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      {{ placeholder }} 根据公式计算
    </div>
    <div v-else>
      {{ placeholder }} {{ _value }}
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: "CalcFormula",
  components: {},
  props: {
    value: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '计算结果 = '
    },
    explain: {
      type: Array,
      default: () => {
        return []
      }
    },
    jsCode: {
      type: String,
      default: ''
    },
    enableScan: {
      type: Boolean,
      default: false
    },
    isPlus: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    precision: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false,
      execute: null
    }
  },
  computed: {
    explainStr() {
      let explain = ''
      this.execute = null
      this.explain.forEach(item => {
        const v = String(item.symbol || item)
        if (/[0-9.]$/.test(v)) {
          explain += v
        } else {
          explain += v + ' '
        }
      })
      return explain
    }
  },
  methods: {
    doExc() {
      try {
        if (!(this.execute instanceof Function)) {
          if (this.isPlus) {
            const jsExplain = this.jsCode.replace(/\[\?\]/g, m => '[$_index]')
            this.execute = new Function('formData', `let $_index = ${this.index > 0 ? this.index - 1 : 0}; ${jsExplain} return execute(formData)`)
          } else {
            this.execute = new Function('formData', `return ${this.explainStr}`)
          }
        }
        let result = this.execute(this.formData)
        this._value = this.precision > 0 ? (Number.isNaN(result) ? NaN : parseFloat(result.toFixed(this.precision))) : parseInt(result)
        this.showError = false
      } catch (e) {
        this.showError = true
        this.errorInfo = e
        this._value = NaN
        console.log(e)
      }
    },
    getTFSum(list, field) {
      let result = 0
      list.forEach(item => {
        result += (item[field] ? item[field] : 0)
      })
      return result
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler() {
        this.doExc()
      }
    },
    jsCode(){
      this.execute = null
    }
  }
}
</script>

<style lang="less" scoped>

</style>

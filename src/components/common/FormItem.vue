<template>
  <div class="m-form-item">
    <div class="m-form-item_title">
      <span class="title-required" v-if="required || rule.length > 0">* </span>
      <span>{{label}}</span>
    </div>
    <div class="m-form-item_content">
      <slot ref="item"></slot>
    </div>
    <div v-if="showError && rule.length > 0" class="valid-error">
      {{rule[0].message || '请完善'}}
    </div>
  </div>
</template>

<script>
export default {
  name: "FormItem",
  components: {},
  props:{
    label: {
      type: String,
      default: ''
    },
    rule: {
      type: Array,
      default: () => {
        return []
      }
    },
    prop:{
      type: String,
      default: ''
    },
    model:{
      type: Object,
      default: () => {
        return {}
      }
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showError: false
    }
  },
  methods: {
    isError(){
      return this.showError
    },
    validate(call){
      if (this.rule.length > 0 ){
        if (this.rule[0].type === 'array'){
          this.showError = !(Array.isArray(this.model[this.prop]) && this.model[this.prop].length > 0)
        }else {
          this.showError = !this.$isNotEmpty(this.model[this.prop])
        }
      }
      if (!this.showError){

      }
      if (call){
        call(!this.showError)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.m-form-item{
  position: relative;
  padding: 10px 10px 20px 10px;
  background: white;
  //margin-top: 5px;
  margin-bottom: 10px;
  & > div:first-child{
    margin-bottom: 8px;
    font-size: 1.2rem;
    color: #545456;
  }
  & > div:last-child{
    //padding: 0 5px;
  }
  .title-required{
    color: @theme-danger;
  }
  .valid-error{
    color: @theme-danger;
    position: absolute;
    font-size: 0.85rem;
  }
}
</style>

<template>
  <el-tooltip :effect="isDark ? 'dark':'light'" :content="content" placement="top-start">
    <span>
      <slot></slot>
      <i class="el-icon-question" style="cursor: pointer"></i>
    </span>
  </el-tooltip>
</template>

<script>
export default {
  install(Vue) {
    Vue.component('Tip', this)
  },
  name: "Tip",
  components: {},
  props:{
    isDark:{
      type: Boolean,
      default: true
    },
    content:{
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>

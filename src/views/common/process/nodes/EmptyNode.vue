<template>
  <node :show="false" :merge="config.parentType === 'CONCURRENTS'" @insertNode="type => $emit('insertNode', type)"/>
</template>

<script>
import Node from './Node'

export default {
  name: "EmptyNode",
  components: {Node},
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
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

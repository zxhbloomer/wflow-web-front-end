<template>
  <div>
    <tabbar v-model="active">
      <tabbar-item icon="home-o">工作台</tabbar-item>
      <tabbar-item icon="user-o">我的</tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
export default {
  name: "MobileWorkSpace",
  components: {Tabbar, TabbarItem},
  data() {
    return {
      active: ''
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

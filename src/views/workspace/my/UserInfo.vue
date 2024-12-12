<template>
  <div class="user-info">
    <div>
      <el-avatar :size="70" :src="loginUser.avatar"></el-avatar>
      <div style="text-align: center; font-size: 16px">{{loginUser.name}}</div>
    </div>

  </div>
</template>

<script>
export default {
  name: "UserInfo",
  components: {},
  computed:{
    loginUser() {
      return this.$store.state.loginUser
    },
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.user-info{
  display: flex;
  justify-content: center;
}
</style>

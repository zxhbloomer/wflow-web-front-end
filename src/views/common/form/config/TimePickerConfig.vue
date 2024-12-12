<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置时间提示"/>
    </el-form-item>
    <el-form-item label="时间格式">
      <el-select size="small" v-model="value.format">
        <el-option value="HH:mm:ss" label="时分秒"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "TimePickerConfig",
  components: {},
  props: {
    value: {
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

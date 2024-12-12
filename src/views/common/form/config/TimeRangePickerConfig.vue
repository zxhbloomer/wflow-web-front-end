<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder[0]" placeholder="开始时间提示"/>
      <el-input size="small" v-model="value.placeholder[1]" placeholder="结束时间提示"/>
    </el-form-item>
    <el-form-item label="时间格式">
      <el-select size="small" v-model="value.format">
        <el-option value="HH:mm:ss" label="时分秒"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="展示时长">
      <el-switch v-model="value.showLength"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "TimeRangePickerConfig",
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

<template>
  <div>
    <el-input placeholder="请输入URL地址" size="medium" v-model="value.url" >
      <el-select v-model="value.method" style="width: 85px;" slot="prepend" placeholder="方法">
        <el-option label="GET" value="GET"></el-option>
        <el-option label="POST" value="POST"></el-option>
        <el-option label="PUT" value="PUT"></el-option>
        <el-option label="DELETE" value="DELETE"></el-option>
      </el-select>
    </el-input>
    <el-tabs v-model="active">
      <el-tab-pane label="header头" name="header">
        <div v-for="(header, index) in value.headers" :key="header.name + index">
          <el-input size="small" v-model="header.name" placeholder="header名" style="width: 30%;"></el-input>
          <span class="w-space">→</span>
          <el-input size="small" v-model="header.value" placeholder="header值" style="width: 50%;"></el-input>
          <i class="el-icon-delete" @click="value.headers.splice(index, 1)" circle></i>
        </div>

      </el-tab-pane>
      <el-tab-pane v-if="value.method === 'POST' || value.method === 'DELETE'"
                   label="body参数" name="body"></el-tab-pane>
      <el-tab-pane label="前置处理" name="pre">
        <code-editor style="border: 1px solid #E5E7EC" v-model="value.pre" :default-value="preDefault"/>
      </el-tab-pane>
      <el-tab-pane label="后置处理" name="aft">
        <code-editor style="border: 1px solid #E5E7EC" v-model="value.aft" :default-value="aftDefault"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: "HttpReq",
  components: {
    CodeEditor: () => import('./CodeEditor.vue')
  },
  props: {
    value:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      active: 'body',
      preDefault: 'function preHandler(ctx){\n\t//发起请求前做一些处理\n\t\n}',
      aftDefault: 'function aftHandler(rsp){\n\t//获取到结果后做一些处理\n\t\n}',
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
.w-space{
  margin: 0 5px;
  color: @theme-desc-color;
}
</style>

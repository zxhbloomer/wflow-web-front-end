<template>
  <div>
    <popup v-model="showPop" position="left" lazy-render closeable safe-area-inset-bottom>
      <list v-model="loading" error-text="请求失败，点击重新加载" @load="onLoad">
        <cell v-for="item in list" :key="item" :title="item" />
      </list>
    </popup>
  </div>
</template>

<script>
import {Popup, List, Cell } from 'vant';
import {getOrgTree, getUserByName} from '@/api/org'

export default {
  name: "OrgPicker",
  components: {Popup, List, Cell},
  props: {
    title: {
      default: '请选择',
      type: String
    },
    type: {
      default: 'org', //org选择部门/人员  user-选人  dept-选部门 role-选角色
      type: String
    },
    multiple: { //是否多选
      default: false,
      type: Boolean
    },
    selected: {
      default: () => {
        return []
      },
      type: Array
    },
  },
  data() {
    return {
      showPop: false,
      nodes: []
    }
  },
  methods: {
    onLoad(){
      this.getOrgList()
    },
    getOrgList() {
      this.loading = true
      getOrgTree({deptId: this.nowDeptId, type: this.type}).then(rsp => {
        this.loading = false
        this.nodes = rsp.data
        this.selectToLeft()
      }).catch(err => {
        this.loading = false
        this.$err(err, '获取数据失败')
      })
    },
    show(){
      this.showPop = true
    },
    close(){
      this.showPop = false
    },

  }
}
</script>

<style scoped>

</style>

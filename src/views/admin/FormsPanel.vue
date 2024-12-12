<template>
  <div class="from-panel" ref="panel" v-loading="loading">
    <div class="from-title">
      <div>
        <span>📢 长按流程可拖拽排序，拖拽分组名右侧 <i class="el-icon-rank"></i> 可对分组排序</span>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="newProcess(null)" round>新建表单</el-button>
        <el-button icon="el-icon-plus" @click="addGroup" size="mini" round>新建分组</el-button>
      </div>
    </div>
    <draggable :list="groups" group="group" handle=".el-icon-rank" filter=".undrag" @start="groupsSort = true" :options="groupDragOptions" @end="groupSort">
      <div :class="{'form-group':true, 'undrag': (group.id === 0 || group.id === undefined)}"
           v-show="group.id > 1 || group.items.length > 0 " v-for="(group, gidx) in groups" :key="gidx">
        <div class="form-group-title">
          <span>{{group.name}}</span>
          <span>({{group.items.length}})</span>
          <i class="el-icon-rank" title="长按拖动可对分组排序"></i>
          <div v-if="!(group.id === 0 || group.id === undefined)">
            <el-button type="text" icon="el-icon-edit-outline" size="mini" @click="editGroup(group)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" size="mini" @click="delGroup(group)">删除</el-button>
          </div>
        </div>
        <draggable class="group-items" :list="group.items" group="from" @end="groupModelsSort(group)" v-show="!groupsSort" filter=".undrag" :options="formDragOptions">
          <div :class="{'form-group-item':true, 'undrag': item.isStop}" v-for="(item, index) in group.items" :key="index">
            <el-row :gutter="20">
              <el-col :span="6" class="w-h-center">
                <i :class="[item.logo.icon, 'w-h-center']" :style="'background: '+item.logo.background"></i>
                <ellipsis class="item-title" hover-tip :content="item.formName"/>
              </el-col>
              <el-col :span="1" class="w-t-center">
                <el-tag size="mini" type="success">v{{item.version}}</el-tag>
              </el-col>
              <el-col :span="5" class="w-t-center">
                <ellipsis class="w-desc-text" :content="item.remark || '...'"/>
              </el-col>
              <el-col :span="6" class="w-t-center">
                <ellipsis class="w-desc-text" :content="'更新于：' + item.updated"/>
              </el-col>
              <el-col :span="6" class="w-t-right">
                <el-button type="text" v-if="!item.isStop" icon="el-icon-edit-outline" size="mini" @click="editModel(item, group)">编辑</el-button>
                <el-button type="text" :icon="item.isStop ? 'el-icon-check':'el-icon-close'" size="mini" @click="stopModel(item)">
                  {{item.isStop ? '启用' : '停用'}}
                </el-button>
                <el-button type="text" icon="el-icon-delete" size="mini" @click="delModel(item)" v-if="item.isStop">删除</el-button>
                <el-popover placement="left" trigger="click" width="400" style="margin-left: 10px" @show="moveSelect === null" v-else>
                  <el-radio-group v-model="moveSelect" size="mini">
                    <el-radio :label="g.id" border v-for="g in groups" :key="g.id" v-show="g.id > 1"
                              :disabled="g.id === group.id" style="margin: 10px;">{{g.name}}</el-radio>
                  </el-radio-group>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="moveModel(item)">提交</el-button>
                  </div>
                  <el-button slot="reference" type="text" icon="el-icon-s-promotion" size="mini" >移动</el-button>
                </el-popover>
              </el-col>
            </el-row>
          </div>

        </draggable>
        <div style="text-align: center" v-if="group.items === undefined || group.items.length === 0">
          <el-button style="padding-top: 0" type="text" icon="el-icon-plus" @click="newProcess(group.id)">创建新表单</el-button>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import modelGroupApi from '@/api/modelGroup'

export default {
  name: "FormsPanel",
  components: {draggable},
  data() {
    return {
      moveSelect: '',
      visible: false,
      loading: false,
      groupsSort: false,
      groups: [],
      groupDragOptions:{
        animation: 300,
        sort:true,
        scroll: true,
        chosenClass:'choose'
      },
      formDragOptions:{
        animation: 300,
        delay: 200,
        chosenClass:'choose',
        scroll: true,
        sort:true
      }
    }
  },
  mounted() {
    this.getGroupModels()
  },
  methods: {
    getGroupModels() {
      this.loading = true
      modelGroupApi.getGroupModels().then(rsp => {
        this.loading = false
        this.groups = rsp.data
        this.groups.forEach(group => {
          group.items.forEach(item => {
            item.logo = JSON.parse(item.logo)
          })
        })
      }).catch(err => {
        this.loading = false
        this.$err(err, '获取分组异常')
      })
    },
    newProcess(groupId) {
      this.$store.commit("setIsEdit", false);
      window.open(`/#/admin/design${this.$isNotEmpty(groupId) ? ('?groupId=' + groupId) : ''}`, '_blank')
      //this.$router.push("/admin/design?groupId=" + groupId);
    },
    groupSort(group) {
      console.log('分组结束',group)
      this.groupsSort = false
      this.loading = true
      modelGroupApi.modelGroupsSort(this.groups.map(g => g.id)).then(rsp => {
        this.loading = false
        this.$ok(rsp, '分组排序成功')
        this.getGroupModels()
      }).catch(err => {
        this.loading = false
        this.getGroupModels()
        this.$err(err, '分组排序失败')
      })
    },
    groupModelsSort(group){
      //判断是在分组内还是移出了分组
      this.loading = true
      modelGroupApi.modelsSort(group.id, group.items.map(item => item.formId)).then(rsp => {
        this.loading = false
        this.getGroupModels()
        this.$ok(rsp, '排序成功')
      }).catch(err => {
        this.loading = false
        this.$err(err, '排序失败')
      })
    },
    addGroup() {
      this.$prompt('请输入要添加的组名', '新的分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名'
      }).then(({value}) => {
        modelGroupApi.createModelGroup({name: value}).then(rsp => {
          this.$ok(rsp, '添加分组成功')
          this.getGroupModels()
        }).catch(err => this.$err(err, '添加分组失败'))
      })
    },
    delGroup(group) {
      this.$confirm('删除分组并不会删除表单，表单将会被转移到 “其他” 分组，确定要删除分组 ' + group.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        modelGroupApi.deleteModelGroup(group.id).then(rsp => {
          this.loading = false
          this.$ok(rsp, '删除分组成功')
          this.getGroupModels()
        }).catch(err => {
          this.loading = false
          this.$err(err, '删除分组失败')
        })
      })
    },
    editGroup(group) {
      this.$prompt('请输入新的组名', '修改分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名',
        inputValue: group.name
      }).then(({value}) => {
        this.loading = true
        modelGroupApi.updateModelGroupName(group.id, {name: value}).then(rsp => {
          this.loading = false
          this.$ok(rsp, '修改成功')
          this.getGroupModels()
        }).catch(err => {
          this.loading = false
          this.$err(err, '修改失败')
        })
      })
    },
    editModel(item, group) {
      window.open(`/#/admin/design?code=${item.formId}&groupId=${item.groupId}`, '_blank')
    },
    stopModel(item) {
      let tip = item.isStop ? ' 启用后将会进入 “其他” 分组，是否继续？' : ' 停用后将会被转移到 “已停用” 分组，您可以再次启用或者删除它，是否继续?';
      this.$confirm(item.formName + tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        modelGroupApi.enOrDisModel(item.formId, !item.isStop).then(rsp => {
          this.loading = false
          this.getGroupModels()
          this.$ok(rsp, '操作成功')
        }).catch(err => {
          this.loading = false
          this.$err(err, '操作失败')
        })
      })
    },
    delModel(item){
      this.$confirm('您确定要删除表单 ' + item.name + ' 吗，删除后无法恢复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        modelGroupApi.deleteModel(item.formId).then(rsp => {
          this.loading = false
          this.$ok(rsp, '删除成功')
          this.getGroupModels()
        }).catch(err => {
          this.loading = false
          this.$err(err, '删除失败')
        })
      })
    },
    moveModel(item) {
      if (this.moveSelect === null || this.moveSelect === ''){
        this.$message.error('请选择分组')
        return;
      }
      this.loading = true
      modelGroupApi.modelMoveToGroup(item.formId, this.moveSelect).then(rsp => {
        this.loading = false
        this.$ok(rsp, '移动到新分组成功')
        this.getGroupModels()
        this.moveSelect = null
      }).catch(err => {
        this.loading = false
        this.$err(err, '移动位置失败')
      })
    },
  }
}
</script>

<style lang="less" scoped>
body {
  background: #ffffff !important;
}

.undrag {
  background: #ebecee !important;
}

.from-panel {
  min-width: 500px;
  background: #ffffff;

  /deep/ .from-title {
    position: relative;
    margin-bottom: 10px;
    height: 30px;
    &>div:first-child{
      position: absolute;
      left: 0;
      font-size: 13px;
      color: @theme-warning;
    }
    &>div:last-child{
      position: absolute;
      right: 0;
      top: -5px;
      .el-button {
        border-radius: 15px;
      }
    }
  }

  //height: 100vh;
}

.choose {
  cursor: move;
  border: 1px dashed @theme-primary !important;
}

.form-group {
  margin-bottom: 20px;
  padding: 0 0 15px 0;
  border-radius: 10px;
  background: @theme-aside-bgc;
  border: 1px solid @theme-aside-bgc;
  .form-group-title {
    padding: 5px 20px;
    height: 40px;
    line-height: 40px;

    .el-icon-rank {
      margin-left: 10px;
      display: none;
      cursor: move;
    }

    &:hover {
      .el-icon-rank {
        display: inline-block;
      }
    }

    &>span:nth-child(2){
      margin-left: 5px;
      color: #8c8c8c;
      font-size: smaller;
    }

    &>div {
      float: right;
      button {
        color: #8c8c8c;
      }
    }
  }

  .group-items{
    padding: 0 20px;
    min-height: 10px;
  }

  .form-group-item {
    font-size: small;
    padding: 5px 10px;
    margin: 2px 0;
    height: 40px;
    background: white;
    line-height: 40px;
    border: 1px solid white;
    border-radius: 5px;
    i {
      border-radius: 10px;
      padding: 7px;
      height: 20px;
      width: 20px;
      font-size: 20px;
      color: #ffffff;
      margin-right: 10px;
    }
    .item-title{
      color: #303133;
      display: inline-block;
    }
  }
}

@media screen and (max-width: 1000px) {
  .desp {
    display: none !important;
  }
}

@media screen and (max-width: 800px) {
  .from-panel{
    padding: 50px 10px;
  }
}
</style>

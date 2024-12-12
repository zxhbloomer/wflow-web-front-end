<template>
  <div v-loading="loading">
    <div class="fixed-search hidden-xs-only">
      <el-input size="small" clearable placeholder="搜索表单" prefix-icon="el-icon-search" v-model="searchForm"></el-input>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="count" @click="to('unfinished')">
          <div>
            <p>待我处理</p>
            <div>{{taskCount.todo}}</div>
          </div>
          <img src="../../../assets/image/pending.png">
        </div>
      </el-col>
      <el-col  :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="count" @click="to('submit')">
          <div>
            <p>我发起的</p>
            <div>{{taskCount.mySubmited}}</div>
          </div>
          <img src="../../../assets/image/submit.png">
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="count" @click="to('cc')">
          <div>
            <p>抄送我的</p>
            <div>{{taskCount.cc}}</div>
          </div>
          <img src="../../../assets/image/cc.png">
        </div>
      </el-col>
    </el-row>
    <div class="group" v-if="searchForm && searchForm.trim() !== ''">
      <div class="group-title">搜索结果</div>
      <div class="group-container">
        <div class="group-item" v-for="(item, index) in searchResult" :key="index" @click="enterItem(item)">
          <div>
            <i :class="item.logo.icon" :style="'background: '+item.logo.background"></i>
            <ellipsis class="item-name" hover-tip :content="item.formName"/>
          </div>
        </div>
        <el-empty v-if="searchResult.length === 0" :image-size="100" :description="`未搜索到 '${searchForm}' 相关表单`"></el-empty>
      </div>
    </div>
    <div v-else>
      <div class="group" v-if="recentlyUsed && recentlyUsed.length > 0">
        <div class="group-title">
          最近使用
          <el-link style="float:right;" :underline="false" type="text" icon="el-icon-delete" @click="clearUsed">清空</el-link>
        </div>
        <div class="group-container">
          <div class="group-item" v-for="(item, index) in recentlyUsed" :key="index" @click="enterItem(item)">
            <div>
              <i :class="item.logo.icon" :style="'background: '+item.logo.background"></i>
              <ellipsis class="item-name" hover-tip :content="item.formName"/>
            </div>
          </div>
        </div>
      </div>

      <div class="group" v-for="(group, index) in formList.list" :key="index"
           v-show="group.items.length > 0 && group.id > 0">
        <div class="group-title">{{ group.name }}</div>
        <div class="group-container">
          <div class="group-item" v-for="(item, index) in group.items" :key="index" @click="enterItem(item)">
            <div>
              <i :class="item.logo.icon" :style="'background: '+item.logo.background"></i>
              <ellipsis class="item-name" hover-tip :content="item.formName"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <w-dialog v-if="!isMobile" v-loading="submitLoading" :title="`发起 - ${selectForm.formName}`" closeFree width="1000px" v-model="openItemDl" okText="提 交" @cancel="openItemDl = false" @ok="submitForm">
      <initiate-process ref="processForm" :code="selectForm.formId" v-if="openItemDl" @fail="submitLoading = false" @ok="openItemDl = false, submitLoading = false"></initiate-process>
    </w-dialog>
  </div>

</template>

<script>
import {getGroupModelsByUser, getProcessCountData} from '@/api/modelGroup'
import InitiateProcess from "../InitiateProcess";

export default {
  name: "ApprovalGroup",
  components: {InitiateProcess},
  data() {
    return {
      taskCount:{
        todo: 0,
        mySubmited: 0,
        cc: 0
      },
      submitLoading: false,
      recentlyUsed:[],
      //searchResult: [],
      searchForm: '',
      loading: false,
      openItemDl: false,
      selectForm: {},
      formItem: {},
      actives: [],
      formList: {
        list: [],
        inputs: '',
        searchResult: []
      },
      pending: {
        list: []
      },
      popupStyle: {
        height: '100%',
        width: '100%',
        background: '#f7f7f9'
      }
    }
  },
  mounted() {
    this.getGroupModels()
    this.getCountData()
    this.recentlyUsed = JSON.parse(localStorage.getItem(`recentlyUsed:${(this.loginUser || {}).id}`) || '[]')
  },
  computed:{
    isMobile(){
      return window.screen.width < 450
    },
    loginUser(){
      return this.$store.state.loginUser
    },
    searchResult(){
      let result = []
      this.formList.list.forEach(group => {
        group.items.forEach(item => {
          if (item.formName.indexOf(this.searchForm) > -1){
            result.push(item)
          }
        })
      })
      return result
    }
  },
  methods: {
    getGroupModels() {
      this.loading = true
      const idSet = new Set()
      getGroupModelsByUser().then(rsp => {
        this.loading = false
        this.formList.list = rsp.data
        this.formList.list.forEach(group => {
          this.actives.push(group.name)
          group.items.forEach(item => {
            item.logo = JSON.parse(item.logo)
            idSet.add(item.formId)
          })
        })
        this.groups = rsp.data
        this.filterRecentlyUsed(idSet)
      }).catch(err => {
        this.loading = false
        this.$err(err, '获取分组异常')
        this.recentlyUsed.length = 0
      })
    },
    async filterRecentlyUsed(collect){
      this.recentlyUsed = this.recentlyUsed.filter(v => collect.has(v.formId))
    },
    getCountData(){
      getProcessCountData().then(rsp => {
        this.taskCount = rsp.data
      })
    },
    to(path){
      this.$router.push('/workspace/' + path)
    },
    enterItem(item) {
      if (!this.$isNotEmpty(item.processDefId)){
        this.$message.warning("该流程还未发布😥")
        return
      }
      this.selectForm = item
      this.openItemDl = true
      this.recentlyUsed.removeByKey('formId', item.formId)
      this.recentlyUsed.unshift(item)
      if (this.recentlyUsed.length >= 20){
        this.recentlyUsed.splice(1, this.recentlyUsed.length - 1)
      }
      localStorage.setItem(`recentlyUsed:${(this.loginUser || {}).id}`, JSON.stringify(this.recentlyUsed))
      if (this.isMobile){
        this.$router.push('/mbinitiate?code=' + item.formId)
      }
    },
    clearUsed(){
      this.recentlyUsed = []
      localStorage.setItem(`recentlyUsed:${(this.loginUser || {}).id}`, '[]')
    },
    submitForm() {
      this.$refs.processForm.validate((validForm, validProcess) => {
        if (!this.isMobile){
          if (validForm && validProcess) {
            this.$refs.processForm.submit()
          } else {
            this.$message.warning("请完善表单/流程选项😥")
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.group {
  border-radius: 15px;
  padding: 20px 20px;
  margin: 0 15px 15px 15px;
  background: @theme-aside-bgc;
  .group-title {
    font-size: 15px;
    color: #303133;
    margin-bottom: 5px;
  }

  .group-container {

  }

  .group-item {
    display: inline-block;
    cursor: pointer;
    border-radius: 10px;
    text-align: center;
    margin: 5px;
    padding: 10px;
    width: 70px;

    i {
      padding: 8px;
      border-radius: 8px;
      font-size: 20px;
      color: #fff;
      background: #38adff;
      height: 20px;
      width: 20px;
      line-height: 20px;
      &:hover {
        box-shadow: 0 0 15px 0 #9f9999;
        //padding: 10px;
      }
    }
    .item-name {
      font-size: 12px;
      color: #303133;
      max-width: 80px;
      margin-top: 3px;
    }

    &>div{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
.fixed-search{
  position: fixed;
  top: 25px;
  right: 220px;
}
.count{
  cursor: pointer;
  position: relative;
  background: @theme-aside-bgc;
  border-radius: 8px;
  height: 80px;
  margin: 0 15px 20px 15px;
  &>div{
    left: 15px;
    position: absolute;
    div{
      color: #b9b8b8;
      font-size: 17px;
      font-weight: bold;
    }
  }
  p{
    color: #303133;
    font-size: 14px;
  }
  img {
    position: absolute;
    right: 15px;
    top: 20px;
    width: 40px;
    height: 40px;
  }
  &:hover{
    box-shadow: 0 0 10px #eeeeee;
  }
}
</style>

<template>
  <div class="progress">
    <div v-for="item in progress" :key="item.taskId" class="progress-item">
      <div>
        <div class="item-user">
          <div class="item-user-avatar">
            <template v-if="item.user">
              <avatar :show-name="false" :status="getStatus(item)" :name="item.user.name" :src="item.user.avatar"></avatar>
            </template>
            <template v-else>
              <span v-if="item.nodeType === 'APPROVAL'" class="iconfont icon-huiyi multi-user-avatar"></span>
              <span v-else class="el-icon-s-promotion multi-user-avatar"></span>
            </template>
          </div>
          <div class="item-user-desc">
            <div>{{ item.name }}</div>
            <div>{{ getDesc(item) }}</div>
          </div>
        </div>
        <div class="time">
          {{ getShortTime(item.finishTime) }}
        </div>
      </div>
      <div v-if="item.users && item.users.length > 0" class="multi-user">
        <div v-for="subItem in item.users" :key="subItem.taskId" class="">
          <div class="item-user-avatar">
            <avatar showY :size="35" :status="getStatus(subItem)" :name="subItem.user.name" :src="subItem.user.avatar"></avatar>
          </div>
        </div>
      </div>
      <div v-show="item.comment && item.comment.length > 0" class="user-comment">
        <div v-for="cmt in item.comment" :key="cmt.id" style="position: relative">
          <div class="user-comment-user" v-if="item.users">
            <avatar :size="30" :name="cmt.user.name" :src="cmt.user.avatar"></avatar>
            <span>（添加了评论）</span>
          </div>
          <div class="user-comment-time" v-if="item.users">{{getShortTime(cmt.createTime)}}</div>
          <div class="user-comment-content">
            <div class="text-comment">{{cmt.text}}</div>
            <div class="image-comment" v-show="cmt.attachments.length > 0">
              <el-image class="image" :src="img" v-for="(img, i) in filterImages(cmt.attachments)"
                        :key="i" :preview-src-list="filterImages(cmt.attachments)"></el-image>
            </div>
            <div class="file-comment">
              <ellipsis style="display: inline-block" class="file-item" type="primary" @click.native="download(file)"
                        :content="file.name" v-for="file in filterFiles(cmt.attachments)" :key="file.id">
                <i slot="pre" class="el-icon-document"></i>
              </ellipsis>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="progress-item end-process">
      <div class="item-user-avatar node-icon">
        <span :class="[statusIcon, 'multi-user-avatar']"></span>
      </div>
      <div class="item-user-desc" style="font-size: 16px; line-height: 34px;">
        {{status}}
      </div>
    </div>
  </div>
</template>

<script>
import {getTaskResult} from "@/utils/ProcessUtil.js";
export default {
  name: "ProcessProgress",
  components: {},
  props: {
    progress: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    result: {
      required: true
    },
    status:{
      required: true,
      default: '未知'
    }
  },
  computed:{
    statusIcon() {
      switch (this.result){
        case 'RUNNING':
        case 'COMPLETE':
          return 'el-icon-more'
        case 'PASS':
          return 'el-icon-success'
        case 'CANCEL':
          return 'el-icon-circle-close'
        case 'REFUSE':
          return 'el-icon-error'
      }
    },
  },
  data() {
    return {}
  },
  methods: {
    getTaskResult,
    filterImages(attachments){
      return (attachments || []).filter(f => f.isImage).map(f => {
        return this.$getRes(f.url)
      })
    },
    filterFiles(attachments){
      return (attachments || []).filter(f => !f.isImage).map(f => {
        f.url = this.$getRes(f.url)
        return f
      })
    },
    download(file) {
      window.open(`${this.$getRes(file.url)}?name=${file.name}`, '_blank')
    },
    getSize(size) {
      if (size > 1048576) {
        return (size / 1048576).toFixed(1) + 'MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(1) + 'KB'
      } else {
        return size + 'B'
      }
    },
    getShortTime(time) {
      if (time) {
        return time.substring(5, 16)
      }
      return '处理中'
    },
    getStatus(item){
      if (item.finishTime === null){
        return 'pending'
      }else if (item.nodeType === 'CC'){
        return 'cc'
      }else if (item.result === 'agree'){
        return 'success'
      }else if (item.result === 'refuse'){
        return 'error'
      }else if (item.result === 'comment'){
        return 'comment'
      }else if (item.result === 'transfer'){
        return 'transfer'
      }else if (item.result === 'recall'){
        return 'recall'
      }else if (item.nodeType === 'cancel'){
        return 'cancel'
      }else {
        return undefined
      }
    },
    getDesc(item){
      if (item.nodeType === 'ROOT'){
        return item.user.name
      }else if (item.nodeType === 'APPROVAL'){
        if (item.user){
          return `${item.user.name}（${this.getTaskResult(item).text}）`
        }
        let desc = (item.users || []).length + '人（'
        switch (item.approvalMode){
          case 'AND': return desc + '会签）'
          case 'OR': return desc + '或签）'
          case 'NEXT': return desc + '顺序会签）'
        }
      }else if (item.nodeType === 'CC'){
        if (item.user){
          return `抄送 ${item.user.name}`
        }
        return `抄送 ${item.users.length}人`
      }else if (item.result === 'comment') {
        return `${item.user.name}（添加了评论）`
      }
    },
    getAgree(item){
      if (item.result === 'agree'){
        return '已同意'
      }else if (item.result === 'refuse'){
        return '已拒绝'
      }else if (item.result === 'recall'){
        return '已退回'
      }else if (!item.result && item.finishTime){
        return '已取消'
      }else {
        return '处理中'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.progress {
  position: relative;
}

.progress::after {
  content: '';
  position: absolute;
  width: 4px;
  top: 0;
  left: 18px;
  color: #e4e4e4;
  background: #e4e4e4;
  height: 100%;
}

.end-process{
  .node-icon{
    span{
      font-size: 30px;
    }
    .el-icon-success{
      color: @theme-success !important;
      background: white !important;
    }
    .el-icon-error{
      color: @theme-danger !important;
      background: white !important;
    }
    .el-icon-circle-close{
      color: #979797 !important;
      background: white !important;
    }
    .el-icon-more{
      color: #b0b0b0 !important;
      background: #e4e4e4 !important;
    }
  }
}

.progress-item {
  z-index: 1;
  margin-bottom: 30px;
  position: relative;

  .item-user {
    & > div {
      display: inline-block;
    }
  }

  .user-comment{
    margin-left: 60px;
    font-size: 14px;
    position: relative;
    padding-top: 5px;
    .user-comment-user{
      display: flex;
      align-items: center;
    }
    /deep/ .a-img span{
      font-size: 12px;
    }
    .user-comment-time{
      position: absolute;
      right: 8px;
      top: 7px;
      color: #8c8c8c;
      font-size: small;
    }
    .user-comment-content{
      margin: 5px 0;
      background: #eeeeee;
      padding: 5px 20px;
      border-radius: 0 5px 5px 5px;

      /deep/ .image-comment{
        padding: 5px 0;
        .image{
          height: 60px;
          width: 60px;
          padding: 5px;
        }
        img{
          border-radius: 5px;
        }
      }
      .file-comment{
        .file-item {
          color: @theme-primary;
          cursor: pointer;
        }
      }
    }
  }

  .item-user-avatar {
    background: white;
    position: relative;
    padding: 4px 0;

    i {
      border-radius: 50%;
      font-size: 15px;
      color: white;
      border: 2px solid white;
      position: absolute;
      padding: 0px;
      right: -10px;
      top: 25px;
    }

    .el-icon-s-promotion{
      padding: 1px;
      font-size: 12px;
    }
    .el-icon-more {
      color: white;
      font-size: 6px !important;
    }



    .multi-user-avatar{
      display: flex;
      height: 40px;
      width: 40px;
      background: @theme-primary;
      color: white;
      font-size: 28px;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
    }
  }

  .item-user-desc {
    position: absolute;
    left: 60px;
    top: 5px;
    font-size: 14px;

    div:nth-child(1) {
      color: #8c8c8c;
    }

    div:nth-child(2) {
      font-size: 15px;
      color: black;
    }
  }
}

.time {
  font-size: 15px;
  color: #8a8a8a;
  position: absolute;
  right: 0;
  top: 0;
}

.multi-user{
  display: grid;
  margin-left: 50px;
  grid-template-columns: repeat(7, 60px);
  .item-user-avatar{
    i{
      right: 2px;
    }
  }
}
</style>

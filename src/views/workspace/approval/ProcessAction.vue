<template>
  <div>
    <div v-if="activeTasks.length > 1" style="margin-bottom: 10px">
      审批节点：
      <el-select size="small" @change="getEnableRecallNodes" v-model="actionData.taskId" placeholder="选择要处理的节点">
        <el-option :value="task.taskId" :label="task.name" v-for="task in activeTasks" :key="task.taskId"></el-option>
      </el-select>
      <span style="color: #8c8c8c; margin-left: 10px">要处理哪个任务</span>
    </div>
    <div v-if="action === 'recall'" style="margin-bottom: 10px">
      回退节点：
      <el-select size="small" v-model="actionData.targetNode" placeholder="选择要回退到的节点">
        <el-option :value="node.nodeId" :label="node.nodeName" v-for="node in recallNodes" :key="node.nodeId"></el-option>
      </el-select>
      <span v-show="recallNodes.length === 0" style="color: #8c8c8c; margin-left: 10px">暂无可回退节点😅</span>
    </div>
    <div v-if="action === 'transfer' || action === 'beforeAdd' || action === 'afterAdd'" style="margin-bottom: 10px">
      <span v-if="action === 'transfer'">转交给谁：</span>
      <span v-else>给谁加签：</span>
      <el-button style="margin-right: 20px" size="mini" icon="el-icon-user" @click="selectUser">选择人员</el-button>
      <el-tag size="small" type="primary" v-if="actionData.targetUser">{{actionData.targetUser.name}}</el-tag>
    </div>
    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" maxlength="255" show-word-limit
              :placeholder="actionDesc.tip" v-model="actionData.comment.text"></el-input>
    <div class="action-content">
      <div v-if="showSign" style="margin: 10px 0; display: flex; align-items: center;">
        <el-button size="small" @click="showSignPanel" icon="el-icon-edit">点击签名</el-button>
        <img :src="actionData.signature" @click="showSignPanel" width="40%"/>
        <w-dialog title="请使用鼠标签字" width="700px" v-model="signVisible" @ok="signOk">
          <canvas id="signPanel" width="650px" height="300px"></canvas>
        </w-dialog>
      </div>
      <image-upload class="image-upload" v-model="imageList" placeholder="添加图片" :max-size="10" :max-number="10" :mode="isMobile ? 'MOBILE':'PC'"/>
      <file-upload v-model="fileList" placeholder="添加附件" :max-size="100" :max-number="5" :mode="isMobile ? 'MOBILE':'PC'"/>
    </div>
    <org-picker :pc-mode="!isMobile"  title="选择要转交的人员" type="user" ref="orgPicker"
                :selected="actionData.targetUser ? [actionData.targetUser]:[]" @ok="selected"/>
  </div>
</template>

<script>
import {approvalTask, getEnableRecallNodes} from '@/api/processTask'
import SignaturePad from "signature_pad";
import {getModelById} from '@/api/modelGroup'
import OrgPicker from "@/components/common/OrgPicker";
import ImageUpload from "../../common/form/components/ImageUpload";
import FileUpload from "../../common/form/components/FileUpload";

export default {
  name: "ProcessAction",
  components: {OrgPicker, ImageUpload, FileUpload},
  props:{
    action: {
      type: String,
      default: 'agree'
    },
    instance:{
      type: Object,
      required: true
    },
    showSign:{
      type: Boolean,
      default: false
    },
    activeTasks:{
      type: Array,
      default: () => {
        return []
      }
    },
    actionDesc:{
      type: Object,
      default: () => {
        return {}
      }
    },
    formData:{
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      visible: false,
      hasSign: false,
      signVisible: false,
      signaturePad: null,
      imageList:[],
      fileList:[],
      recallNodes:[],
      actionData:{
        taskId: null,
        signature: '',
        targetNode: null,
        targetUser: null,
        comment: {
          text: '',
          attachments: []
        },
      }
    }
  },
  computed:{
    loginUser(){
      return this.$store.state.loginUser
    },
    isMobile(){
      return window.screen.width < 450
    },
    //暂不使用本地取
    _recallNodes(){
      //去重，处理最后一个包含退回节点的后续的节点
      let lastIndex = 0
      this.instance.progress.forEach((p, i) => {
        if (p.result === 'recall'){
          lastIndex = i
        }
      })
      return this.instance.progress
          .filter((node, i) => {
            return node.nodeType === 'APPROVAL' && node.finishTime && i > lastIndex
          }).map(node => {return {name: node.name, nodeId: node.nodeId}})
    }
  },
  mounted() {
    if (this.action === 'recall'){
      this.getEnableRecallNodes()
    }

  },
  methods: {
    show(){
      this.visible = true
    },
    close(){
      this.visible = false
    },
    showSignPanel(){
      this.signVisible = true
      this.$nextTick(() => {
        this.initSign()
      })
    },
    loadFormInfo(id) {
      getModelById(id).then(rsp => {
        let form = rsp.data;
        form.logo = JSON.parse(form.logo)
        this.form = form
      }).catch(err => {
        this.$err(err, '获取流程模型失败')
      })
    },
    selectUser(){
      this.$refs.orgPicker.show()
    },
    selected(users){
      if (users[0].id === this.loginUser.id){
        this.$message.warning('不允许加签本人')
      }else {
        this.actionData.targetUser = users[0]
      }
    },
    initSign(){
      this.hasSign = false
      if (this.signaturePad){
        this.signaturePad.clear()
      }else {
        let canvas = document.getElementById('signPanel');
        this.signaturePad = new SignaturePad(canvas, {
          penColor: this.color, minWidth: this.thickness, maxWidth: this.thickness + 2
        });
        this.signaturePad.onEnd = () => {
          this.hasSign = true
          //this._value = this.signaturePad.toDataURL()
        }
        if (this.mode === 'MOBILE'){
          //canvas.height = 300 ;
          canvas.width = document.body.clientWidth;
        }
        //this.resizeCanvas(canvas)
      }
    },
    getTask(){
      if(this.$isNotEmpty(this.actionData.taskId)){
        return this.actionData.taskId
      }else if (this.activeTasks.length > 0){
        return this.activeTasks[0].taskId
      }else if (this.action === 'cancel'){
        const pg = this.instance.progress || [];
        for (let i = 0; i < pg.length; i++) {
          if (pg[i].users){
            for (let j = 0; j < pg[i].users.length; j++) {
              if (!this.$isNotEmpty(pg[i].users[j].finishTime)){
                return pg[i].users[j].taskId
              }
            }
          }else {
            if (!this.$isNotEmpty(pg[i].finishTime)){
              return pg[i].taskId
            }
          }
        }
      }
      return null
    },
    getEnableRecallNodes(){
      getEnableRecallNodes(this.instance.instanceId, this.getTask()).then(rsp => {
        this.recallNodes = rsp.data
      }).catch(err => {
        this.$err(err, '获取可回退节点失败')
      })
    },
    submitAction(){
      let params = {
        instanceId: this.instance.instanceId,
        taskId: this.getTask(),
        comment: {
          text: this.actionData.comment.text,
          attachments: this.imageList.concat(this.fileList)
        },
        formData: this.formData,
        signature: null,
        action: this.action,
        targetNode: this.actionData.targetNode,
        targetUser: this.actionData.targetUser ? this.actionData.targetUser.id:null,
      }
      if ((this.action === 'beforeAdd' || this.action === 'afterAdd'
          || this.action === 'transfer') && !params.targetUser){
        this.$message.warning('请设置人员')
        return;
      }else if (this.action === 'recall' && !this.$isNotEmpty(this.actionData.targetNode)){
        this.$message.warning('请选择回退到哪个节点')
        return;
      }
      approvalTask(params).then(rsp => {
        this.$emit('success')
        this.$ok(rsp, '处理任务成功')
        this.close()
      }).catch(err => {
        this.$err(err, '处理任务失败')
      })
    },
    signOk(){
      this.signVisible = false
      this.actionData.signature = this.signaturePad.toDataURL()
    },
  }
}
</script>

<style lang="less" scoped>
.action-content{
  margin-top: 20px;
  img{
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 20px;
    &:hover{
      border: 1px dashed @theme-primary;
    }
  }

  /deep/ .image-upload{
    margin-bottom: 20px;
    .el-upload-list__item, .el-upload--picture-card {
      height: 65px;
      width: 65px;
    }
    .el-upload--picture-card{
      line-height: 70px;
    }
  }
}
canvas{
  border: 1px dashed #666666;
}
</style>

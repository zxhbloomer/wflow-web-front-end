<template>
  <el-container style="height: 100%">
    <el-aside width="200px" style="background: #f5f6f6">
      <div class="field-lib">
        <div class="field-lib-title">拖拽字段到右侧👉</div>
<!--        <el-alert type="success" :closable="false" description="📢 请先点击右侧编辑器，让光标移动到要插入的位置，再拖拽或者点击字段进行插入"/>-->
        <div class="field-lib-body">
          <div class="field-group">
            <div>系统字段</div>
            <div class="form-fields">
              <div class="form-field" v-for="field in sysFields" :key="field.id"
                   draggable="true" @dragstart="dragstart(field, $event)">
                <i :class="field.icon"></i>
                {{ field.title }}
              </div>
            </div>
          </div>
          <div class="field-group">
            <div>表单字段</div>
            <div class="form-fields">
              <div class="form-field" v-for="field in formItems" :key="field.id"
                   draggable="true" @dragstart="dragstart(field, $event)">
                <i :class="field.icon"></i>
                {{ field.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-aside>
    <el-main style="padding: 0; height: 100%;" ref="sheet-main">
      <editor ref="wflow-print" v-model="_value"></editor>
    </el-main>
  </el-container>
</template>

<script>
import Editor from "@/components/common/Editor";

export default {
  name: "PrintTemplateDesign",
  components: {Editor},
  props:{
    value: {
      type: String,
      default: '<h3 style="text-align: center;"><span style="color: #777777;">✍ 在此处编辑您的打印模板</span></h3>\n' +
          '<p style="text-align: center;"><span style="color: #7e8c8d;">您可以从👈左侧拖拽系统字段来插入文档中</span></p>\n' +
          '<p style="text-align: center;"><span style="color: #7e8c8d;">类似<span style="color: #ba372a;"> ${xx} </span>的数据将在打印时被替换成实际值</span></p>',
    }
  },
  data() {
    return {
      table: null,
      template: '',
      sheetData: {},
      printPage:{
        type: 'A4',
        width: 500,
        height: 300
      },
     sysFields: [
        {id: 'owner', title: '发起人', icon: 'iconfont icon-iconfonticon3'},
        {id: 'ownerDept', title: '发起人部门', icon: 'iconfont icon-a-11Cfenzuzuzhishu'},
        {id: 'startTime', title: '发起时间', icon: 'el-icon-s-promotion'},
        {id: 'finishTime', title: '完成时间', icon: 'el-icon-s-claim'},
        {id: 'code', title: '流程编号', icon: 'el-icon-tickets'},
      ]
    }
  },
  computed: {
    formItems() {
      let items = []
      this.getItems(items, this.$store.state.design.formItems)
      return items
    },
    _value:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val)
      }
    }
  },
  mounted() {

  },
  methods: {
    dragstart(field, event){
     event.dataTransfer.setData('text', JSON.stringify(field));
    },
    getItems(options, items){
      items.forEach(item => {
        if (item.name === 'SpanLayout'){
          this.getItems(options, item.props.items)
        }else {
          options.push(item)
        }
      })
    },
    initDragEvent() {
      const sheet = this.$refs["wflow-print-sheet"]
      // 拖拽开始
      sheet.ondragover = (ev) => {
        ev.preventDefault();
      };
      // 拖拽结束，提取坐标进行设置单元格内容
      sheet.ondrop = (ev) => {
        console.log("拖拽结束:", ev.dataTransfer.getData('id'), this.table);
        ev.preventDefault();
        let id = ev.dataTransfer.getData('id');
        let text = ev.dataTransfer.getData('text');
        let {ri, ci} = this.table.datas[0].getCellRectByXY(ev.offsetX, ev.offsetY);
        console.log('目标释放单元格：', this.table.datas[0].getCellRectByXY(ev.offsetX, ev.offsetY))
        console.log('合并信息：', this.table.sheet.data.getCell(ri, ci))
        this.table.cellText(ri, ci, '${(' + text + ')' + id + '}').reRender()
        //设置撤销操作
        this.table.sheet.toolbar.undoEl.setState(false);
        console.log('选中单元格', id, ri, ci)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@border-color: #e7e7e7;

.print-col-range{
  position: absolute;
  top: 0;
  left: 500px;
  height: 100%;
  border-right: 2px dashed @theme-primary;
}

.field-lib {
  font-size: 13px;
  background: #f5f6f6;
  border-right: 1px solid @border-color;

  .field-lib-title {
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #f5f6f6;
    border-bottom: 1px solid @border-color;
  }

  .field-lib-body {
    padding: 10px;
    overflow-y: auto;
    .field-group {
      margin-bottom: 20px;

      & > div:first-child {
        margin-bottom: 10px;
      }
    }
  }
}

.form-fields {
  display: flex;
  justify-content: start;
  flex-direction: column;

  .form-field {
    cursor: move;
    background: white;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 8px;
    border: 1px solid white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      border: 1px solid @theme-primary;
      color: @theme-primary;
    }
  }
}
</style>

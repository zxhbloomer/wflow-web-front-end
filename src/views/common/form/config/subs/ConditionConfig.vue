<script>
//设计思路，先定一个条件盒子，再连接
import ConditionItem from "./ConditionItem.vue";

export default {
  name: "ConditionConfig",
  components: {ConditionItem},
  props: {
    formItems:{
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    value: {
      type: Object,
      default: () => {
        return {
          logic: true,
          name: '哈哈哈',
          condition: {},
          children: []
        }
      }
    }
  },
  data() {
    return {
      ruleDialog: false,
    }
  },
  methods: {
    addRule() {
      this.ruleDialog = true
    },
    getGroupDom(group, isRoot, coverPos, parent, i) {
      return (
        <div class={['w-condition-box',
          isRoot ? (group.children.length <= 1 ? 'w-condition-box-root':'w-condition-box-root-line'):'',
          group.children.length > 1 ? 'w-condition-box-npd':'']}>
          <div class={'w-cover-line-' + coverPos}></div>
          <div class="w-condition-box-compare">
            {group.children.length > 1 ? [
              <el-select size="mini" style="width: 60px" v-model={group.logic}>
                <el-option value={true} label="且"></el-option>
                <el-option value={false} label="或"></el-option>
              </el-select>,
              <el-tooltip effect="dark" content="添加并列条件" placement="top">
                <i onClick={() => this.addBrother(group)} class="icon el-icon-plus"></i>
              </el-tooltip>
            ]: ''}
          </div>
          {
            isRoot ? <el-tooltip effect="dark" content="添加并列条件" placement="top">
              <i onClick={() => this.addBrother(group)} class="icon root-add el-icon-plus"></i>
            </el-tooltip>:''
          }
          <div class={['w-condition-box-line', isRoot ? 'w-condition-box-line-none':'']}></div>
          <div class={['w-condition-box-content', group.children.length > 1 ? 'w-condition-box-content-none':'']}>
            {(group.children.length > 1 ? group.children.map((cd, i) => {
              //子条件项
              return this.getGroupDom(cd, false, this.getCoverPos(i, group.children.length), group, i)
            }) : [
              <condition-item v-model={group.condition} form-items={this.formItems}/>, //这里是条件内容设置
              <div class="w-condition-options">
                <el-tooltip effect="dark" content="添加子项条件" placement="top">
                  <i onClick={() => this.addChild(group)} class="el-icon-plus icon"></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除本条件" placement="top">
                  <i onClick={() => this.delChild(parent, i)} class="el-icon-delete icon"></i>
                </el-tooltip>
              </div>
            ])}
          </div>
        </div>
      )
    },
    addBrother(group){
      if (group.children.length === 0){
        group.children.push({
          logic: true,
          condition: group.condition,
          children: []
        })
        group.condition = null
      }
      group.children.push({
        logic: true,
        condition: this.getCdContent(),
        children: []
      })
    },
    delChild(group, i){
      group.children.splice(i, 1)
      if (group.children.length === 1){
        group.condition = group.children[0].condition
        group.children.length = 0
      }
    },
    getCdContent(){
      return {
        field: null,
        fieldType: null,
        compare: null,
        fixed: true,
        compareVal: []
      }
    },
    addChild(group){
      group.children.push(...[{
        logic: true,
        condition: group.condition,
        children: []
      },{
        logic: true,
        condition: this.getCdContent(),
        children: []
      }])
      group.condition = null
    },
    //创建遮挡线
    getCoverPos(i, len){
      if (i === 0){
        return 'top'
      }else if (i === len - 1){
        return 'bottom'
      }else {
        return 'none'
      }
    }
  },
  render(createElement, context) {
    return <div>
      {this.getGroupDom(this.value, true, 'none', this.value.children, null)}
    </div>
  }
}
</script>


<style scoped lang="less">
@condition-line-width: 80px;

.w-condition-box-npd {
  padding: 0 !important;
  .root-add{
    display: none;
  }
}
.w-condition-box-root {
  .w-condition-box-line {
    width: 20px !important;
  }
  .w-condition-box-content{
    width: 100% !important;
  }
}

.w-condition-box-root-line {
  & > .w-condition-box-line {
    width: 30px !important;
  }
  & > .w-condition-box-compare{
    left: 0 !important;
    width: calc(100% - 30px);
  }

}

.w-condition-box {
  padding: 10px 0;
  display: flex;
  align-items: center;
  position: relative;

  .w-condition-box-line {
    position: relative;
    width: @condition-line-width;

    &::before {
      content: '';
      width: 100%;
      display: block;
      position: absolute;
      left: 0;
      border: 1px dashed #E8E8E8;
    }
  }

  .w-condition-box-line-none {
    &::before {
      content: none !important;
    }
  }

  .icon {
    cursor: pointer;
    padding: 2px;
    background: white;
    border-radius: 50%;
    margin-left: 2px;
    box-shadow: 0 0 6px 1px @theme-aside-bgc;
  }

  .w-condition-box-compare {
    display: flex;
    align-items: center;
    position: absolute;
    left: calc(@condition-line-width - 30px);
    z-index: 999;
    width: initial;
  }

  .w-condition-box-content {
    padding: 2px 0;
    width: calc(100% - 30px);
    border-radius: 5px;
    background: @theme-aside-bgc;

    .w-condition-options {
      position: absolute;
      right: 0;
      top: -2px;
      .icon{
        cursor: pointer;
        padding: 5px;
      }
      .el-icon-delete:hover{
        color: @theme-danger;
      }
    }
  }
  .w-condition-box-content-none{
    background: none;
    padding: 0;
    border-left: 2px dashed #E8E8E8;
  }

  .w-cover-line-top, .w-cover-line-bottom {
    position: absolute;
    width: 5px;
    background: white;
    height: 50%;
    left: -2px;
  }

  .w-cover-line-none {
    display: none;
  }

  .w-cover-line-top {
    top: 0;
  }
  .w-cover-line-bottom {
    bottom: -2px;
  }
}
</style>

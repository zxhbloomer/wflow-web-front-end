export const ValueType = {
  string: 'String',
  object: 'Object',
  array: 'Array',
  number: 'Number',
  date: 'Date',
  user: 'User',
  dept: 'Dept',
  dateRange: 'DateRange'
}

export const baseComponents = [
  {
    name: '布局',
    components: [
      {
        title: '分栏布局',
        name: 'SpanLayout',
        icon: 'el-icon-c-scale-to-original',
        value: [],
        valueType: ValueType.array,
        props: {
          items:[],
          number: 2 //分几栏，均等分能被24整除
        }
      }
    ]
  }, {
    name: '基础组件',
    components: [
      {
        title: '单行文本输入',
        name: 'TextInput',
        icon: 'el-icon-edit',
        value: '',
        valueType: ValueType.string,
        props: {
          enableScan: false,
          required: false,
          enablePrint: true
        }
      },
      {
        title: '多行文本输入',
        name: 'TextareaInput',
        icon: 'el-icon-more-outline',
        value: '',
        valueType: ValueType.string,
        props: {
          enableScan: false,
          required: false,
          enablePrint: true
        }
      },
      {
        title: '数字输入框',
        name: 'NumberInput',
        icon: 'el-icon-edit-outline',
        value: '',
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          precision: undefined
        }
      },
      {
        title: '金额输入框',
        name: 'AmountInput',
        icon: 'iconfont icon-zhufangbutiezhanghu',
        value: '',
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          showChinese: true,
          precision: undefined
        }
      },
      {
        title: '单选框',
        name: 'SelectInput',
        icon: 'el-icon-circle-check',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          expanding: false,
          options: ['选项1', '选项2']
        }
      },
      {
        title: '多选框',
        name: 'MultipleSelect',
        icon: 'iconfont icon-duoxuankuang',
        value: [],
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          expanding: false,
          options: ['选项1', '选项2']
        }
      },
      {
        title: '时间选择',
        name: 'TimePicker',
        icon: 'el-icon-time',
        value: '',
        valueType: ValueType.date,
        props: {
          required: false,
          enablePrint: true,
        }
      },
      {
        title: '时间范围选择',
        name: 'TimeRangePicker',
        icon: 'el-icon-alarm-clock',
        value:[],
        valueType: ValueType.dateRange,
        props: {
          required: false,
          enablePrint: true,
          placeholder: ['开始时间', '结束时间'],
          showLength: false
        }
      },
      {
        title: '日期时间点',
        name: 'DateTime',
        icon: 'el-icon-date',
        value: '',
        valueType: ValueType.date,
        props: {
          required: false,
          enablePrint: true,
          format: 'yyyy-MM-dd HH:mm',
        }
      },
      {
        title: '日期时间区间',
        name: 'DateTimeRange',
        icon: 'iconfont icon-kaoqin',
        valueType: ValueType.dateRange,
        props: {
          required: false,
          enablePrint: true,
          placeholder: ['开始时间', '结束时间'],
          format: 'yyyy-MM-dd HH:mm',
          showLength: false
        }
      },
      {
        title: '上传图片',
        name: 'ImageUpload',
        icon: 'el-icon-picture-outline',
        value: [],
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          maxSize: 5, //图片最大大小MB
          maxNumber: 10, //最大上传数量
          enableZip: true //图片压缩后再上传
        }
      },
      {
        title: '上传附件',
        name: 'FileUpload',
        icon: 'el-icon-folder-opened',
        value: [],
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          onlyRead: false, //是否只读，false只能在线预览，true可以下载
          maxSize: 100, //文件最大大小MB
          maxNumber: 10, //最大上传数量
          fileTypes: [] //限制文件上传类型
        }
      },
      {
        title: '人员选择',
        name: 'UserPicker',
        icon: 'el-icon-user',
        value: [],
        valueType: ValueType.user,
        props: {
          required: false,
          enablePrint: true,
          multiple: false,
          expansion: false,
          options: []
        }
      },
      {
        title: '部门选择',
        name: 'DeptPicker',
        icon: 'iconfont icon-map-site',
        value: [],
        valueType: ValueType.dept,
        props: {
          required: false,
          enablePrint: true,
          multiple: false,
          expansion: false,
          options: []
        }
      },{
        title: '评分',
        name: 'Score',
        icon: 'el-icon-star-off',
        value: 0,
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          color: '#f0a732',
          max: 5,
          showScore: true,
          enableHalf: false,
          type: 'star'
        }
      },
      {
        title: '说明文字',
        name: 'Description',
        icon: 'el-icon-warning-outline',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          color: '#818181'
        }
      },
    ]
  }, {
    name: '扩展组件',
    components: [
      {
        title: '明细表',
        name: 'TableList',
        icon: 'el-icon-tickets',
        value: [],
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          showBorder: true,
          rowLayout: true,
          showSummary: false,
          summaryColumns: [],
          maxSize: 0, //最大条数，为0则不限制
          columns:[] //列设置
        }
      },
      {
        title: '地理位置',
        name: 'Location',
        icon: 'el-icon-map-location',
        value: undefined,
        valueType: ValueType.object,
        props: {
          required: false,
          enablePrint: true,
          enableEdit: false
        }
      },
      {
        title: '省市区',
        name: 'Provinces',
        icon: 'el-icon-place',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          level: 3
        }
      },
      {
        title: '签名',
        name: 'SignPanel',
        icon: 'el-icon-edit',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          thickness: 2,
          color: '#000000'
        }
      },
      {
        title: '流程关联',
        name: 'ProcessIndex',
        icon: 'el-icon-link',
        value: [],
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: false,
          processCode: null
        }
      }, {
        title: '计算公式',
        name: 'CalcFormula',
        icon: 'el-icon-mobile',
        value: [],
        valueType: ValueType.number,
        props: {
          precision: 0,
          required: false,
          enablePrint: false,
          isPlus: false,
          jsCode: '',
          explain: []
        }
      },
      {
        title: '网页iframe',
        name: 'WebIframe',
        icon: 'el-icon-tickets',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: false,
          url: '',
          height: 200
        }
      },
      {
        title: 'Vue容器',
        name: 'VueContainer',
        icon: 'el-icon-mobile',
        value: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: false,
          template: null,
          cpStyle: null,
          cpJs: null
        }
      },
    ]
  }
]



export default {
  baseComponents
}


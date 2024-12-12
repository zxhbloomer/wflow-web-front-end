let TextInput = () => import('./components/TextInput.vue')
let NumberInput = () => import('./components/NumberInput.vue')
let AmountInput = () => import('./components/AmountInput.vue')
let TextareaInput = () => import('./components/TextareaInput.vue')
let SelectInput = () => import('./components/SelectInput.vue')
let MultipleSelect = () => import('./components/MultipleSelect.vue')
let DateTime = () => import('./components/DateTime.vue')
let DateTimeRange = () => import('./components/DateTimeRange.vue')
let TimePicker = () => import('./components/TimePicker.vue')
let TimeRangePicker = () => import('./components/TimeRangePicker.vue')
let Description = () => import('./components/Description.vue')
let ImageUpload = () => import('./components/ImageUpload.vue')
let FileUpload = () => import('./components/FileUpload.vue')
let MoneyInput = () => import('./components/MoneyInput.vue')
let DeptPicker = () => import('./components/DeptPicker.vue')
let UserPicker = () => import('./components/UserPicker.vue')
let SignPanel = () => import('./components/SignPanel.vue')
let Score = () => import('./components/Score.vue')

let SpanLayout = () => import('./components/SpanLayout.vue')
let TableList = () => import('./components/TableList.vue')
let Location = () => import('./components/Location.vue')
let Provinces = () => import('./components/Provinces.vue')
let WebIframe = () => import('./components/WebIframe.vue')
let CalcFormula = () => import('./components/CalcFormula.vue')
let ProcessIndex = () => import('./components/ProcessIndex.vue')
let VueContainer = () => import('./components/VueContainer.vue')

export default {
  //基础组件
  TextInput, NumberInput, AmountInput, TextareaInput, SelectInput, MultipleSelect,
  DateTime, DateTimeRange, UserPicker, DeptPicker, TimePicker, TimeRangePicker,
  //高级组件
  Description, FileUpload, ImageUpload, MoneyInput, Location, SignPanel, CalcFormula,
  SpanLayout, TableList, Provinces, Score, WebIframe, VueContainer, ProcessIndex
}

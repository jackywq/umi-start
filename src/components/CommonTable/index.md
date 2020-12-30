# commonTable

## 功能

- 表格类的通用组件，统一封装表格的查询、分页、重置等功能，提升开发效率
- 支持数据、查询条件的回显功能

---

## 适用性

- 支持以下表格数据

```javascript
 {
    code: 0,
    data: {
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
    msg: 'xxxx'
 }

```

---

## 使用方式

```javascript
import { CommonTable } from 'components';

const tableProps = {
  // [必传]接口地址
  url: '/api/agentLevel/list',

  // [必传]表格列
  columns: newColumns,

  // [必传]请求方式
  method: 'POST',

  // 表格id
  rowKey: 'id',

  // [必传]父组件获取commonTable表格引用，进而可以获取其内部的方法，比如searchData、resetData、getValues、getState等
  refCallback: ref => (this.commonTableRef = ref),

  // 是否支持表格复选功能
  isAutoRowSelection: true,

  // 是否固定分页信息到底部
  isFixedPagination: true,

  // 是否支持表格在可视区域滚动
  isVisibleScroll: true,

  // 查询条件
  search: {
    // 1. `[{}, {}]`单纯的数组对象方式主要给一个Row使用  2. `[[{}, {}], [{}, {}]]`这种嵌套的数组对象方式主要是两个Row使用, 目前不支持`[{}, [{}, {}]]`这种格式
    datas: [
      {
        name: 'agentName',
        selectData: AGENT_TYPE,
        type: 'select_group',
        component: Input,
        nodeProps: {
          allowClear: true,
        },
      },
      {
        name: 'businessLineIds',
        type: 'muitple_select',
        data: businessLineData,
        nodeProps: {
          placeholder: '业务线',
          maxTagCount: 1,
          allowClear: true,
        },
      },
      {
        name: 'agentLevels',
        data: dictData.agent_level,
        type: 'muitple_select',
        nodeProps: {
          maxTagCount: 1,
          placeholder: '代理商等级',
          allowClear: true,
        },
      },
      {
        name: 'regional',
        submitValues: ['area', 'province', 'city'],
        data: dictData.placeTree,
        type: 'cascader',
        nodeProps: {
          placeholder: '地区',
          changeOnSelect: true,
          allowClear: true,
        },
      },
      {
        name: 'deptIds',
        data: deptData,
        type: 'muitple_select',
        nodeProps: {
          placeholder: '部门',
          maxTagCount: 1,
          isFuzzySearch: true,
          allowClear: true,
        },
      },
      {
        name: 'channelManagerIds',
        data: channelData,
        type: 'muitple_select',
        nodeProps: {
          placeholder: '渠道经理',
          maxTagCount: 1,
          isFuzzySearch: true,
          allowClear: true,
        },
      },
      {
        name: 'levelUpdateTime',
        selectData: [{ label: '更新时间', value: 'levelUpdateTime' }],
        type: 'select_group',
        valueType: 'moment',
        memoryFormat: value => {
          return this.formatQuarter(value);
        },
        submitFormat: value => {
          return moment.isMoment(value) ? value.format('YYYY-Q') : value;
        },
        component: QuarterPicker,
      },
      {
        name: 'isRating',
        type: 'select',
        data: IS_RATING_TYPE,
        nodeProps: {
          placeholder: '是否参与等级评价',
        },
      },
      {
        name: 'levelStatus',
        type: 'select',
        data: LEVELSTATUS_TYPE,
        nodeProps: {
          placeholder: '等级状态',
        },
      },
      {
        name: 'lastScoreStr',
        type: 'select',
        data: SCORE_TYPE,
        nodeProps: {
          placeholder: '上周期分数',
        },
      },
      {
        name: 'currentScoreStr',
        type: 'select',
        data: SCORE_TYPE,
        nodeProps: {
          placeholder: '本周期分数',
        },
      },
    ],
    buttons: [
      {
        type: 'primary',
        name: '查询',
        onClick: this.commonTableRef.searchData,
      },
      {
        root: can('agentLevel:rate'),
        type: 'primary',
        name: '参与',
        onClick: this.handleJoin,
      },
      {
        root: can('agentLevel:rate'),
        type: 'primary',
        name: '不参与',
        onClick: this.handleDropOut,
      },
      {
        root: can('agentLevel:update'),
        type: 'primary',
        name: '批量编辑',
        onClick: this.handleBatchEdit,
      },
      {
        name: '重置',
        onClick: this.commonTableRef.resetData,
      },
      {
        root: can('agentLevel:export'),
        name: '导出',
        onClick: this.handleExport,
      },
    ],
  },
};

<CommonTable {...tableProps} />;
```

<div style="height: 100px"></div>

# 配置参数

## Table

| 参数 | 说明 | 类型 | 默认值 |
| :-: | :-: | :-: | :-: |
| url | 接口地址 | `string` | - |
| editable | 是否开启可编辑表格功能 | `false` | - |
| columns | 表格列的配置描述，属性同 antd 一致 | `ColumnProps[]` | - |
| method | 接口请求方式 | `string` | - |
| refCallback | 父组件获取 commonTable 表格引用 | `Function(ref)` | '' |
| rowKey | 表格行 key | `string` | id |
| isAutoRowSelection | 是否支持表格复选功能 | `boolean` | false |
| isFixedPagination | 是否固定分页信息到底部 | `boolean` | false |
| isHidePagination | 是否隐藏分页信息 | `boolean` | false |
| isVisibleScroll | 是否支持表格在可视区域滚动 | `boolean` | false |
| isTableTopSlider | 是否支持表格顶部滚动(ps: 一般用在表格内容超出可视区域，设置此属性) | `boolean` | false |
| isAddTableAlert | 是否支持表格复选框选中提示信息 | `boolean` | false |
| isAutoColumns | 是否是动态获取表格列(ps: 是，从接口取 columns) | `boolean` | false |
| tHeadALert | 表头顶部上的提示信息 | `React.ReactNode` | '' |
| search | 表格查询条件 | `object` | {} |
| update | 更新父组件的方法 | `function` | function() {} |
| storeName | 用于存储的标识,适用于多个 tabs 用一个路由，便于区分存储的 key | `string` | '' |
| rowSelectionType | 多选/单选，`checkbox` or `radio` | `string` | 'checkbox' |
| ...rest | 其他属性(继承 antd 表格的属性) | `object` | {} |

---

## columns

|     参数     |               说明                |   类型   | 默认值 |
| :----------: | :-------------------------------: | :------: | :----: |
| interceptNum |   文字截取长度，并给出省略提示    | `number` |   -    |
|   editable   |        针对单个 td 可编辑         | `false`  |   -    |
|  cellProps   |    单个 td 支持自定义校验功能     |   `{}`   |   -    |
|   ...rest    | 其他属性(继承 antd columns 属性)) | `object` |   {}   |

---

## cellProps

|     参数     |              说明              |      类型       | 默认值 |
| :----------: | :----------------------------: | :-------------: | :----: |
|    rules     | 校验规则，详情请参考 antd 官网 |   `object[]`    |   -    |
|    width     |       可编辑单元格的宽度       | `number|string` |  200   |
|   showEdit   |    一直显示编辑单元格的样式    |    `boolean`    |  200   |
| initialValue |           表单初始值           |      `any`      |   -    |

---

## search

| 参数 | 说明 | 类型 | 默认值 |
| :-: | :-: | :-: | :-: |
| datas | <span style="color: red">【注意】</span>1. `[{}, {}]`单纯的数组对象方式主要给一个 Row 使用 2. `[[{}, {}], [{}, {}]]`这种嵌套的数组对象方式主要是两个 Row 换行使用 | `object[]|array[]` | [] |
| cols | 表单项个数，一行展示几个表单(支持浮点数) | `number` | 4 |
| buttons | 按钮集合配置数据 | `object[]` | [] |

---

## datas

| 参数 | 说明 | 类型 | 默认值 |
| :-: | :-: | :-: | :-: |
| name | 表单提交 name | `string` | - |
| span | 单个表单的栅格占位格数 | `number` | - |
| type | 组件类型`input`、`select_group`、`select`、`muitple_select`、`date` `cascader` | `string` | - |
| data | 针对单个框、或组合框右边的数据 | `[{ label: string, value: number }]` | - |
| selectData | 只针对组合框左右的下拉数据 | `[{ label: string, value: number }]` | - |
| formProps | 针对单个表单的属性 | `{}` | - |
| nodeProps | 针对单个框、或组合框右边的组件属性 | `object` | - |
| valueType | 表单项提交格式 | `string` | - |
| component | 自定义组件 | `ReactNode` | - |
| submitValues | 针对特定组件的提交参数有多个`key`, 一一对应赋值，比如`DatePicker`、`Cascader`组件等 | `string[]` | - |
| render | 自定义组件的渲染方法 | `Function` | - |
| submitFormat | 用于表单提交，对特定字段的提交格式进行单独处理 | `Function(value)` | - |
| memoryFormat | 用于数据回显时，对特定字段的回显格式进行单独处理(使用较少) | `Function(value)` | - |

---

### formProps

|    参数     |              说明              |        类型        | 默认值 |
| :---------: | :----------------------------: | :----------------: | :----: |
| initalValue |          初始化表单值          |      `string`      |   -    |
|    rules    | 校验规则，同 form 表单属性一致 |     `Object[]`     |   -    |
|    label    |       `label` 标签的文本       | `string|ReactNode` |   -    |
|  labelSpan  |        `label`标签布局         |      `number`      |   8    |
| wrapperSpan |        `label`标签布局         |      `number`      |   16   |
|   ...rest   | 其他属性(继承 Form.Item 属性)  |      `object`      |   {}   |

---

### nodeProps

|     参数      |                           说明                           |   类型    | 默认值 |
| :-----------: | :------------------------------------------------------: | :-------: | :----: |
| isFuzzySearch | 是否支持模糊搜索，只有在`muitple_select`类型组件才会生效 | `boolean` | false  |
|  placeholder  |                       组件默认文字                       | `string`  |   -    |
|    ...rest    |  其他属性(继承 Input、Select、DatePicker 等组件的属性)   | `object`  |   {}   |

---

## buttons

|  参数   |      说明      |    类型    | 默认值 |
| :-----: | :------------: | :--------: | :----: |
|  name   |    按钮名称    |  `string`  |   -    |
|  type   |  设置按钮类型  |  `string`  |   -    |
|  root   |   按钮的权限   | `boolean`  |   -    |
| onClick | 按钮的点击方法 | `Function` |   -    |

---

<div style="height: 100px"></div>

# CommonTable 提供 API 说明

## getState

- **类型:** `Function`
- 获取 commonTable 组件，state 上一些属性，比如 selectedRowKeys, tableData

## getValues

- **类型:** `Function`
- 获取表单查询条件值

## loadData

- **类型:** `Function`
- 查询当前接口数据，分页信息、查询条件保持不变，一般用于更新表单信息

## searchData

- **类型:** `Function`
- 重置分页信息、查询当前接口数据

## resetData

- **类型:** `Function`
- 重置当前查询条件、分页信息、以及接口数据

## resetSelectedRowKeys

- **类型:** `Function`
- 重置表格复选框勾选状态

## getSearchForm

- **类型:** `Function`
- 提供表单 form 信息，用于按钮外部去校验表单

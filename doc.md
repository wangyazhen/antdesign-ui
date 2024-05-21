# antdesign-ui

用 antd 重写了一个 extjs 项目。

扩展了一些 antd 的组件， 也有一些独立的组件。

封装了一些经常用到的 `hooks` .

## 文档

### BaseSelect

| 参数          | 是否必填 | 说明                                                   |
| ------------- | :------: | ------------------------------------------------------ |
| onChange      |    是    | 修改回调-通常用于 form 注入                            |
| onChangeAfter |    否    | 修改回调-若为对象则回调参数为对象                      |
| selects       |    是    | 渲染数据源-可以是对象-可以是数字                       |
| style         |    否    | 样式                                                   |
| allowClear    |    否    | 是否显示清除按钮， 默认 true                           |
| showArrow     |    否    | 是否显示箭头按钮， 默认 true                           |
| showSearch    |    否    | 是否允许搜索， 默认 true                               |
| placeholder   |    否    | 设置空白时的内容                                       |
| valueIsObj    |    否    | 指定 selects 数组的 item 是否是对象                    |
| displayField  |    否    | 当 valueIsObj 为 true 时，设置下拉框显示对象的哪个字段 |
| valueField    |    否    | 当 valueIsObj 为 true 时，设置下拉框选中时保存的字段   |
| renderOption  |    否    | 设置如何渲染每个下拉框，参数是 antd 的 Select.Option   |
| antd Select   |    否    | 支持 antd select 的属性                                |

```jsx
import React from "react";
import { BaseSelect } from "antdesign-ui";

function TestComponent() {
  return (
    <div>
      <BaseSelect
        style={{ width: 200 }}
        onChangeAfter={(v) => console.log(v)}
        onChange={(v) => console.log(v)}
        selects={["1", "2"]}
      />
    </div>
  );
}

export default TestComponent;
```

### SearchSelect

基于 `BaseSelect` 的扩展，内部集成了默认的请求处理。

| 参数        | 是否必填 | 说明                         |
| ----------- | :------: | ---------------------------- |
| resource    |    是    | 请求的 URL                   |
| focusLoad   |    否    | 获取焦点时发起请求           |
| initialLoad |    否    | 组件加载完请求               |
| initValue   |    否    | 是对象，用与默认初始显示     |
| queryField  |    是    | 输入内容搜索时传给后台的参数 |

```jsx
<SearchSelect
  style={{ width: 200 }}
  initialLoad
  onChangeAfter={(v) => console.log("改变之后-", v)}
  onChange={(v) => console.log("改变-", v)}
  resource={"/api/packageUnits"}
  queryField="code"
  displayField="name"
  valueIsObj
/>
```

### EditableTable

可编辑表格， 双击修改 -- todo

### VirtualTable

| 依赖关系 | 是否必须 |
| -------- | :------: |
| antd     |    否    |

可展示大量数据的高性能表格 --

没有 table 标签的表格

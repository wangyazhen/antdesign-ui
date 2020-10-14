# antdesign-ui

我用 antd 重写了一个 extjs 项目。

封装扩展了一些 antd 的组件，放在这里开源一下。大家可以用用，提点建议。


## 文档


### BaseSelect

参数 | 是否必填 | 说明 
| ------------- |:-------------:| ----- | 
| onChange |  是  | 修改回调-通常用于 form 注入 |
| onChangeAfter |  否  | 修改回调-若为对象则回调参数为对象 |
| selects |  是  | 渲染数据源-可以是对象-可以是数字 |
| style   |  否  | 样式 |
| allowClear   |  否  | 是否显示清除按钮， 默认 true |
| showArrow   |  否  | 是否显示箭头按钮， 默认 true |
| showSearch   |  否  | 是否允许搜索， 默认 true |
| placeholder   |  否  | 设置空白时的内容 |
| valueIsObj   |  否  | 指定 selects 数组的item 是否是对象 |
| displayField   |  否  | 当 valueIsObj 为 true 时，设置下拉框显示对象的哪个字段 |
| valueField   |  否  | 当 valueIsObj 为 true 时，设置下拉框选中时保存的字段 |
| renderOption   |  否  | 设置如何渲染每个下拉框，参数是 antd 的 Select.Option |
| antd Select   |  否  | 支持 antd  select 的属性|


```jsx
import React from 'react'
import { BaseSelect } from 'antdesign-ui'

function TestComponent() {
  return <div>
    <BaseSelect
      style={{width: 200}}
      onChangeAfter={v => console.log(v)}
      onChange={v => console.log(v)}
      selects={["1", "2"]}
    />
  </div>
}

export default TestComponent

```


后续会陆续的出新的组件。
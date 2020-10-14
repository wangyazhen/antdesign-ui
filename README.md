# antdesign-ui

我用 antd 重写了一个 extjs 项目。

封装扩展了一些 antd 的组件，放在这里开源一下。大家可以用用，提点建议。




## 文档


### BaseSelect

| 参数 | 是否必填 | 说明 ｜
| --- | --- | --- ｜
｜ onChange ｜  是  ｜ 修改回调-通常用于 form 注入 ｜
｜ onChangeAfter ｜  否  ｜ 修改回调-若为对象则回调参数为对象 ｜
｜ selects ｜  是  ｜ 渲染数据源-可以是对象-可以是数字 ｜
｜ style   ｜  否  ｜ 样式 ｜



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

### 
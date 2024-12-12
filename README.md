<!--
 * @Author: 王亚振
 * @Date: 2020-10-13 16:05:27
 * @LastEditors: 王亚振
 * @LastEditTime: 2024-06-05 16:58:37
 * @FilePath: /antdesign-ui/README.md
-->

# antdesign-ui

Rewrite an extjs project with antd.

Some antd components have been extended, and there are also independent components that do not depend on antd.

Encapsulates some frequently used `hooks`

[更新日志](https://github.com/wangyazhen/antdesign-ui/blob/master/log.md)
[中文文档](https://github.com/wangyazhen/antdesign-ui/blob/master/doc.md)

## ✨ Features

升级 table 滚动条

VirtualTable :

- column sort
- column sort mutiple
- column resize
- column ellipsis // default is true
- column resize callback
- large data performance

VirtualSelect

- large options

Button

like extjs style button

### hooks

- usePrevious
- useUpdateEffect
- useDebounce
- useScrollbarWidth

use

```
import { useDebounce } from 'antdesign-ui/lib/hooks'
```

## 📦 Install

`npm i antdesign-ui `

`yarn add antdesign-ui `

## 🔨 Usage

```jsx
import { VirtualTable } from "antdesign-ui";

const App = () => (
  <>
    <VirtualTable height={200} dataSource={dataSource} columns={columns} />
  </>
);
```

And import style manually:

```html
import "antdesign-ui/lib/virtual-table/style.css"
```

> **Continuously update new components**

## 更新日志

log.md 文件

### v1.0.9

- **修复滚动 bug**
- 默认内置提供设置按钮 `SettingButton`
- 支持覆盖设置按钮 `drawerSettingElement`

# antdesign-ui

Rewrite an extjs project with antd.

Some antd components have been extended, and there are also independent components that do not depend on antd.

[更新日志](https://github.com/wangyazhen/antdesign-ui/blob/master/log.md)
[中文文档](https://github.com/wangyazhen/antdesign-ui/blob/master/doc.md)

## ✨ Features

VirtualTable :

- column sort
- column resize
- large data performance

VirtualSelect

- large options

Button

like extjs style button

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

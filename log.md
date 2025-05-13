# 版本更新日志

## v1.0.10

- 修复 scroll 显示问题

## v1.0.9

- **修复滚动 bug**
- 默认内置提供设置按钮 `SettingButton`
- 支持覆盖设置按钮 `drawerSettingElement`

## v1.0.8

解决已知问题

## v1.0.7

- 支持表头筛选按钮
- EditableTable 由于 v3v4 兼容原因，暂移除导出

## v1.0.1

- 解决 loading 定位问题
- 提供 `loadingStyle`
- 提供 `getPopupContainer`
- 提供 `emptyText`

这次重构发现 增加的 `TableDrawer` 功能依赖了 antd 的 `Drawer` 组件。
功能越来越丰富 依赖也就多了起来

## v1.0.0

- Virtual-table ellipsis 支持可配置
- Virtual-table 支持调整列宽，并添加 `onResizeChange` 回调。支持保存到服务端
- Virtual-table TableDrawer 支持完全自定义， 设置 `drawerSetting` 为 false。 关闭默认按钮
- 添加常用 hooks

## v0.1.2

添加 rowClassName
添加 selectedKeys 参数传入，设置选中项，通过 onSelectionChange 更改

## v0.1.1

解决 columns 切换 宽度丢失问题

## v0.1.0

支持排序功能

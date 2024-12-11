import ReactList from "../react-list";
import { TextButton } from "../Button";
import React, { useState, useRef, useImperativeHandle } from "react";
import { noop, getValue, DEFAULTWIDTH } from "./util";

const _editBtnStyle = {
  display: "inline-block",
  width: 75,
  textAlign: "center"
};
let _count = 0;

const Body = props => {
  const {
    columns,
    dataSource,
    loading, // loading is element 通常是 antd 的 Spin 组件
    loadingStyle = {}, // 提供设置 loading 样式
    getPopupContainer, // 目前是loading 定位使用
    emptyText = '',
    height,
    width,
    hasSelect,
    onSelectChange = (selectedRowKeys, selectedRow) => { },
    rowClassName = noop,
    onClickRow = noop,
    onDbClick = noop,
    // 允许整行可响应选择
    allowRowSelect = false,
    // 单选模式
    singleMode = false,
    selectedKeys,
    tableWidth,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedAll,
    onCheckedBefore,
    // db edit
    enableDoubleEdit = false,
    onSave = noop,
    onSaveCancel = noop
  } = props;

  const [selected, setSelected] = useState(0);
  const clickRow = row => {
    if (!hasSelect) setSelected(row.id);
    onClickRow(row);
  };

  // start double
  const [doubleId, setDoubleId] = useState(0);
  const onDoubleClickRow = row => {
    if (enableDoubleEdit) setDoubleId(row.id);
    onDbClick(row);
  };
  const isEditing = id => id === doubleId;
  const onCancel = () => {
    setDoubleId(0);
    onSaveCancel();
  };
  // end double

  const listRef = useRef(null);

  useImperativeHandle(props.onRef, () => {
    return {
      handleScroll: (e) => {
        if (listRef && listRef.current && listRef.current.handleScroll) {
          listRef.current.handleScroll(e)
        }
      },
    };
  });

  const handleCheck = (event, itemId) => {
    const doNext = () => {
      let res;
      if (selectedRowKeys.includes(itemId)) {
        res = selectedRowKeys.filter(id => id !== itemId);
      } else {
        res = singleMode ? [itemId] : [...selectedRowKeys, itemId];
      }
      if (res.length === dataSource.length) {
        res = dataSource.map(v => v.id);
      }
      const rows = res.map(id => dataSource.find(v => v.id === id));
      setSelectedRowKeys(res);
      onSelectChange(res, rows);
      setSelectedAll(res.length === dataSource.length);
    };
    if (!onCheckedBefore) {
      doNext();
    } else if (onCheckedBefore(dataSource.find(v => v.id === itemId))) {
      doNext();
    }
  };

  const handleClickRow = (item) => {
    _count += 1;
    setTimeout(() => {
      if (_count === 1) {
        clickRow(item);
        if (hasSelect && allowRowSelect) {
          handleCheck(undefined, item.id);
        }
      } else if (_count === 2) {
        onDoubleClickRow(item);
      }
      _count = 0;
    }, 300);
  }


  const cellClassName = (col, item) => {
    let cls = 'w-v-item w-v-body-cell'
    if (isEditing(item.id)) {
      cls += ' editing-cell '
    }
    // 默认启用
    if (col.ellipsis !== false) {
      cls += ' ellipsis '
    }

    return cls
  }

  // loading 距离左边的百分比
  let percentL = 5;
  try {
    let dom = null;
    if (getPopupContainer && typeof getPopupContainer === 'function') {
      dom = getPopupContainer();
    } else {
      dom = document.getElementById("container");
    }
    percentL = (dom.offsetWidth / tableWidth / 2) * 100;
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="w-v-tbody" style={{ position: 'relative', width: tableWidth }}>
      {dataSource.length ? (
        <ReactList
          dataSource={dataSource}
          height={height}
          ref={listRef}
          customScrollContainer={true}
          minRowHeight={24}
          rowRender={(index, style) => {
            const item = dataSource[index];
            const checked = selectedRowKeys.includes(item.id);
            const _rowClassName = () => {
              const editCls = isEditing(item.id) ? "editing-row" : "";
              const extraCls = typeof rowClassName === 'function' ? rowClassName(item) : rowClassName;
              let clsName = `w-v-row flex ${editCls} ${extraCls || ''}`;
              let selectedClsName = clsName + " selected";
              if (hasSelect) {
                return checked ? selectedClsName : clsName;
              }
              return selected === item.id ? selectedClsName : clsName;
            };

            return (
              <div className={_rowClassName()} onClick={() => handleClickRow(item)} >
                {hasSelect && (
                  <div className="col-item-selection">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={v => handleCheck(v, item.id)}
                    />
                  </div>
                )}
                {columns.map(col => (
                  <div
                    key={col.dataKey}
                    className="col-item"
                    style={{ width: width[col.dataKey] || DEFAULTWIDTH }}
                  >
                    <div className={cellClassName(col, item)}>
                      {col.render
                        ? col.render(item[col.dataKey], item)
                        : getValue(item, col.dataKey, "")}
                    </div>
                  </div>
                ))}
                {enableDoubleEdit && isEditing(item.id) && (
                  <div>
                    <div
                      className="et-editable-table-edit-button"
                      style={{ marginTop: 28 }}
                    >
                      <TextButton
                        text="Save"
                        style={_editBtnStyle}
                        onClick={() => {
                          if (onSave()) onCancel();
                        }}
                      />
                      <TextButton
                        text="Cancel"
                        style={{ marginLeft: 6, ..._editBtnStyle }}
                        onClick={onCancel}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      ) : <div style={{ height }}>{emptyText}</div>}
      {loading &&
        <div
          style={{
            height,
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            background: 'rgba(255,255,255,.6)',
            paddingLeft: `${percentL}%`,
            paddingTop: height / 2 - 50,
            ...loadingStyle
          }}
        >
          {loading}
        </div>
      }
    </div>
  );
};

export default Body;

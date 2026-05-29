import { TextButton } from "../Button";
import React, { useState, useRef, useImperativeHandle } from "react";
import { noop, getValue, DEFAULTWIDTH } from "./util";

const _editBtnStyle = {
  display: "inline-block",
  width: 75,
  textAlign: "center"
};
const ROW_HEIGHT = 24;
const PRELOAD_COUNT = 8;
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
    preventDefaultScroll,
    // db edit
    enableDoubleEdit = false,
    onSave = noop,
    onSaveCancel = noop
  } = props;

  const [selected, setSelected] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const lastContainerScrollTopRef = useRef(0);
  const lastBodyScrollTopRef = useRef(0);
  const restoringScrollRef = useRef(false);
  const clickRow = row => {
    if (!hasSelect) setSelected(row.id);
    onClickRow(row);
  };

  // start double
  const [doubleId, setDoubleId] = useState(0);
  const onDoubleClickRow = (row) => {
    const scrollContainer = bodyRef.current?.parentElement;
    const bodyOffsetTop = bodyRef.current?.offsetTop || 0;
    if (scrollContainer) {
      lastContainerScrollTopRef.current = scrollContainer.scrollTop || 0;
      lastBodyScrollTopRef.current = Math.max(0, lastContainerScrollTopRef.current - bodyOffsetTop);
    }
    if (enableDoubleEdit) setDoubleId(row.id);
    onDbClick(row);
  };
  const isEditing = id => id === doubleId;
  const onCancel = () => {
    setDoubleId(0);
    onSaveCancel();
  };
  // end double

  const bodyRef = useRef(null);

  useImperativeHandle(props.onRef, () => {
    return {
      handleScroll: (e) => {
        if (restoringScrollRef.current) {
          return;
        }
        const containerScrollTop = e?.target?.scrollTop || 0;
        const bodyOffsetTop = bodyRef.current?.offsetTop || 0;
        const nextScrollTop = Math.max(0, containerScrollTop - bodyOffsetTop);
        const rowIndex = doubleId ? dataSource.findIndex(item => item.id === doubleId) : -1;
        const jumpedToTopWhileEditing = doubleId
          && containerScrollTop === 0
          && lastContainerScrollTopRef.current > bodyOffsetTop
          && rowIndex > Math.ceil(height / ROW_HEIGHT);

        if (jumpedToTopWhileEditing && e?.target) {
          restoringScrollRef.current = true;
          e.target.scrollTop = lastContainerScrollTopRef.current;
          setScrollTop(lastBodyScrollTopRef.current);
          requestAnimationFrame(() => {
            restoringScrollRef.current = false;
          });
          return;
        }
        if (containerScrollTop > 0) {
          lastContainerScrollTopRef.current = containerScrollTop;
          lastBodyScrollTopRef.current = nextScrollTop;
        }
        setScrollTop(nextScrollTop);
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

  const handleClickRow = (item, rowElement) => {
    _count += 1;
    setTimeout(() => {
      if (_count === 1) {
        clickRow(item);
        if (hasSelect && allowRowSelect) {
          handleCheck(undefined, item.id);
        }
      } else if (_count === 2) {
        onDoubleClickRow(item, rowElement);
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

  const renderRow = (item, index) => {
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
      <div
        key={item.id || index}
        data-row-key={item.id}
        className={_rowClassName()}
        onClick={(e) => handleClickRow(item, e.currentTarget)}
      >
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
          <div className="et-editable-table-edit-button">
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
        )}
      </div>
    );
  };

  const totalCount = dataSource.length;
  const totalHeight = totalCount * ROW_HEIGHT;
  const safeScrollTop = Math.max(0, Math.min(scrollTop, Math.max(0, totalHeight - height)));
  const visibleCount = Math.ceil(height / ROW_HEIGHT) + PRELOAD_COUNT * 2 + 1;
  const beginIndex = Math.max(0, Math.floor(safeScrollTop / ROW_HEIGHT) - PRELOAD_COUNT);
  const endIndex = Math.min(totalCount - 1, beginIndex + visibleCount - 1);
  const beforeHeight = beginIndex * ROW_HEIGHT;
  const afterHeight = Math.max(0, totalHeight - (endIndex + 1) * ROW_HEIGHT);
  const visibleRows = totalCount ? dataSource.slice(beginIndex, endIndex + 1) : [];

  return (
    <div ref={bodyRef} className="w-v-tbody" style={{ position: 'relative', width: tableWidth }}>
      {dataSource.length ? (
        <div style={{ height }}>
          <div style={{ height: beforeHeight }} />
          {visibleRows.map((item, offsetIndex) => renderRow(item, beginIndex + offsetIndex))}
          <div style={{ height: afterHeight }} />
        </div>
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

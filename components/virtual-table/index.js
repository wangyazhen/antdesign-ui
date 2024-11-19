import React, { useState, useEffect, useCallback, useMemo, useRef, useImperativeHandle, forwardRef } from "react"
import { Resizable } from "react-resizable"
import TableDrawer from "./TableDrawer"
import TableBody from "./body"
import { ASCIMG, ASC, DESCIMG, DESC, DEFAULTWIDTH, sortByLocal, noop } from "./util"
import { sorterDate, sorterNum, moveParamToLast } from "../utils/helper"
import usePrevious from '../hooks/usePrevious'
import useDidMount from '../hooks/useDidMount'


function WVTable(props, ref) {
  const {
    columns: propsColumns,
    dataSource: propsDataSource,
    selectedKeys,
    onSelectChange = (selectedRowKeys, selectedRow) => { },
    onResizeChange = (resizedColumn, resizedColumnMap) => { },
    rowClassName = noop,
    onClickRow = noop,
    onDbClick = noop,
    // 允许整行可响应选择
    allowRowSelect = false,
    // 单选模式
    singleMode = false,
    // 多列排序模式， 禁用本地排序
    mutiSortMode = false,
    onSortChange = noop,
    // end sort
    hasSelect = false,
    // 自定义 table drawer时设 false
    drawerSetting = true, // 默认启用设置按钮
    drawerSettingElement = null, // 默认启用设置按钮元素
    onFilterClick = noop,
    filterIcon = null,
    filterHightIcon = null,
  } = props;

  const tableRef = useRef(null)

  const [columns, setColumns] = useState(propsColumns)
  const [dataSource, setDataSource] = useState(propsDataSource)
  const [sortKey, setSortKey] = useState({})
  const [filterKey, setFilterKey] = useState('')//单列模式
  const [sortOrder, setSortOrder] = useState([])
  const prevDataSource = usePrevious(propsDataSource)

  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [width, setWidth] = useState(_ => columns.reduce((prev, item) => { prev[item.dataKey] = (item.width || 100); return prev }, {}))
  const onResize = (key, { element, size, handle }) => {
    const newWidth = { ...width, [key]: size.width }
    setWidth(newWidth)
    onResizeChange({ [key]: size.width }, newWidth)
  }

  const updateWidth = (columns) => {
    setWidth(columns.reduce((prev, item) => { prev[item.dataKey] = (item.width || 100); return prev }, {}))
  };


  useImperativeHandle(ref, () => ({
    updateColumns: (cols) => {
      setColumns(cols);
      updateWidth(cols);
    },
    updateSelectedRowKeys: (keys) => {
      setSelectedRowKeys(keys);
    },
    onlyUpdateColumns: (cols) => {
      setColumns(cols);
    },
    getColumns: () => {
      return columns;
    },
    updateDataSource: (data) => {
      setDataSource(data);
    },
  }));

  useEffect(() => {
    // async set dataSource on initial
    if (prevDataSource?.length === 0 && propsDataSource.length) {
      setDataSource(propsDataSource)
    } else if (prevDataSource?.length !== 0) {
      // load sort
      if (Object.keys(sortKey).length && !mutiSortMode) {
        const key = Object.keys(sortKey)[0]
        sortDataSource(sortKey[key], key, null, propsDataSource)
      } else {
        setDataSource(propsDataSource)
      }
    }
  }, [propsDataSource])


  useDidMount(() => {
    try {
      if (!mutiSortMode) return false;
      const _sort = columns.reduce((prev, item) => { if (item.sortType) prev[item.dataKey] = (item.sortType); return prev }, {})

      if (Object.keys(_sort).length) {
        setSortKey(_sort)
      }
    } catch (error) {
      console.error(error)
    }
  })

  const [showDrawer, setShowDrawer] = useState(false)

  const onTableColumnsUpdate = useCallback((cols) => {
    setColumns(cols)
  });


  useEffect(() => {
    if (hasSelect) {
      if (typeof selectedKeys !== 'undefined') {
        setSelectedRowKeys(selectedKeys)
        if (!selectedKeys.length) {
          setSelectedAll(false)
        }
      }
    }
  }, [selectedKeys])


  const sortDataSource = (sort, key, sortType, originData) => {
    const item = originData[0];
    const sortArray = [...originData];
    if (!sort) {
      setDataSource(propsDataSource)
      return false;
    }
    try {
      if (sortType) {
        switch (sortType) {
          case "number": sortArray.sort(sorterNum(key, sort)); break;
          case "date": sortArray.sort(sorterDate(key, sort)); break;
        }
      } else if (typeof (item[key]) === 'number') {
        sortArray.sort(sorterNum(key, sort))
      } else if ((/^\-?\d+\.?\d+$/).test(item[key]) || typeof item[key] === "boolean") {
        sortArray.sort(sorterNum(key, sort))
      } else if ((/(\d{4})\-(\d{2})-(\d{2})/).test(item[key])) {
        sortArray.sort(sorterDate(key, sort))
      } else {
        sortArray.sort(sortByLocal(key, sort))
      }
      setDataSource(sortArray)
    } catch (e) {
      setDataSource(originData || dataSource)
      console.log('sort has exception:', e)
    }
  }
  const handleSort = (event, key, col) => {
    const ignoreNodes = ['SPAN', 'SVG', 'PATH'];
    if (ignoreNodes.includes(event.target.nodeName.toUpperCase())) return false;
    const sort = !sortKey[key] ? ASC : sortKey[key] === ASC ? DESC : null;

    let newOrder = [...sortOrder]
    let sortObj = { [key]: sort }
    if (mutiSortMode) {
      if (sort === null) {
        newOrder = newOrder.filter(v => v !== key)
      } else {
        if (!newOrder.includes(key)) {
          newOrder.push(key)
        } else {
          newOrder = moveParamToLast(key, newOrder)
        }
      }
      sortObj = { ...sortKey, [key]: sort }
      setSortOrder(newOrder)
    } else {
      // single
      sortDataSource(sort, key, col.sortType, dataSource)
    }
    setSortKey(sortObj)
    onSortChange(sortObj, key, newOrder);
  }

  const handleAllCheck = (event) => {
    const keys = event.target.checked ? dataSource.map(v => v.id) : []
    const rows = event.target.checked ? dataSource : []
    setSelectedAll(event.target.checked)
    setSelectedRowKeys(keys)
    onSelectChange(keys, rows)
  }


  const colTitleClassName = col => {
    let cls = 'w-v-item w-v-title ellipsis'

    if (sortKey[col.dataKey]) {
      cls += ' w-v-title-sort'
    }

    if (col.filter) {
      cls += ' w-v-title-filter'
    }

    return cls
  }

  const handleFilterClick = (e, key) => {
    onFilterClick(e, key)
    setFilterKey(key)
  }

  const renderTitle = () => {
    return columns.map(col => {
      return (
        <div key={col.dataKey} className="col-item" style={{ width: width[col.dataKey] }}>
          <Resizable width={width[col.dataKey] || DEFAULTWIDTH} height={30} minConstraints={[55, 55]} maxConstraints={[800, 800]} onResize={(e, size) => onResize(col.dataKey, size)}>
            <div
              className={colTitleClassName(col)}
              onClick={e => handleSort(e, col.dataKey, col)}
            >
              {col.title}
              {sortKey[col.dataKey] === 'ASC' ? <img src={ASCIMG} /> : sortKey[col.dataKey] === 'DESC' ? <img src={DESCIMG} /> : null}
              {col.filter && <span className="w-v-filter-icon" onClick={(e) => handleFilterClick(e, col.dataKey)}>
                {filterKey === col.dataKey ? (filterHightIcon || filterIcon) : filterIcon}
              </span>}
            </div>
          </Resizable>
        </div>
      )
    })
  }
  const renderTableTitle = useMemo(() => renderTitle(), [width, sortKey, columns, dataSource])


  const tableWidth = _.values(width).reduce((p, n) => p + n, 0);
  const bodyProps = {
    ...props,
    width,
    columns,
    dataSource,
    tableWidth: drawerSetting ? tableWidth - 10 : tableWidth,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedAll,
    onRef: tableRef,
  };

  const handleScroll = (e) => {
    tableRef?.current?.handleScroll?.(e)
  }

  return (
    <div>
      <div className="w-v-table" style={{ overflow: 'auto' }} onScroll={handleScroll} ref={tableRef}>
        <div className="w-v-thead flex" style={{ width: tableWidth }}>
          {hasSelect && (
            <div className="col-item-selection">
              <input
                type="checkbox"
                checked={selectedAll}
                onChange={handleAllCheck}
              />
            </div>
          )}
          {renderTableTitle}
          {drawerSetting &&
            <div className="col-item-operation" onClick={() => setShowDrawer(true)}>
              {drawerSettingElement}
            </div>
          }
        </div>

        <TableBody {...bodyProps} />

        {columns && columns.length ? (
          <TableDrawer
            visible={showDrawer}
            columns={columns}
            onUpdate={onTableColumnsUpdate}
            onClose={() => setShowDrawer(false)}
          />
        ) : null}
      </div>
    </div>
  );
}

export default forwardRef(WVTable)


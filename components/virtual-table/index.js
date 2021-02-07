import { Resizable } from "react-resizable"
import React, { useState } from "react"
import ReactList from "../react-list"

const noop = () => {}

function WVTable({ columns, height, dataSource, onSelectChange = noop, hasSelect = false }) {

    const [width, setWidth] = useState(_ => columns.reduce((prev, item) => {prev[item.dataKey] = (item.width || 100);return prev}, {}))
    const onResize = (key, {element, size, handle}) => {
        setWidth({...width, [key]: size.width })
    }

    const [selected, setSelected] = useState(0)
    const clickRow = (row) => {
        if (!hasSelect) setSelected(row.id)
    }

    const [selectedAll, setSelectedAll] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])


    const handleAllCheck = (event) => {
        const keys = event.target.checked ? dataSource.map(v => v.id) : []
        setSelectedAll(event.target.checked)
        setSelectedRowKeys(keys)
        onSelectChange(keys)
    }

    const handleCheck = (event, itemId) => {
        let res
        if (selectedRowKeys.includes(itemId)) {
            res = selectedRowKeys.filter(id => id !== itemId)
        } else {
            res = [...selectedRowKeys, itemId]
        }
        if (res.length === dataSource.length) {
            res = dataSource.map(v => v.id)
        }
        setSelectedRowKeys(res)
        onSelectChange(res)
        setSelectedAll(res.length === dataSource.length)
    }

    return <div>
        <div className="w-v-table">
            <div className="w-v-thead flex">
                {hasSelect && <div className="col-item-selection">
                    <input type="checkbox" checked={selectedAll} onChange={handleAllCheck} />
                </div>}
                {columns.map(col => {
                    return (
                        <div key={col.dataKey} className="col-item" style={{width: width[col.dataKey]}}>
                            <Resizable width={width[col.dataKey]} height={30}  onResize={(e, size) => onResize(col.dataKey, size)}>
                                <div className="w-v-item w-v-title">{col.title}</div>
                            </Resizable>
                        </div>
                    )
                })}
            </div>

            <div className="w-v-tbody">
                <ReactList
                    dataSource={data}
                    height={height}
                    minRowHeight={24}
                    rowRender={(index, style) => {
                        const item = dataSource[index]
                        const checked = selectedRowKeys.includes(item.id)
                        const rowClassName = () => {
                            let clsName = "w-v-row flex"
                            let selectedClsName = "w-v-row flex selected"
                            if (hasSelect) {
                                return checked ? selectedClsName : clsName
                            }
                            return selected === item.id ? selectedClsName : clsName
                        }

                        return (
                            <div className={rowClassName()} onClick={_ => clickRow(item)}>
                                {hasSelect && <div className="col-item-selection">
                                    <input type="checkbox" checked={checked} onChange={v => handleCheck(v, item.id)} />
                                </div>}
                                {columns.map(col => (
                                    <div key={col.dataKey} className="col-item" style={{width: width[col.dataKey]}}>
                                        <div className="w-v-item w-v-body-cell">{item[col.dataKey]}</div>
                                    </div>
                                ))}
                            </div>
                        )
                    }}
                />
            </div>

        </div>
    </div>
}

export default WVTable


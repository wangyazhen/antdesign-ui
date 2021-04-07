import React from 'react'
// @ts-ignore
import type { ColumnGroupType } from 'antd'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'

const ResizeableTitle = (props: any) => {
  const { onResize, onResizeStop, onResizeStart, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop= {onResizeStop}
    >
      <th key='wyz' {...restProps} />
    </Resizable>
  )
}


class ResizableTable extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isResizing: false,
      columns: props.columns as ColumnGroupType,
    }
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  }


  // @ts-ignore
  handleResize = (index: number) => (e: any, { size }) => {
    // @ts-ignore
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      }
      return { columns: nextColumns }
    })
  }


  render() {
    // @ts-ignore
    const {columns, ...resetProps} = this.props
    // @ts-ignore
    const columnsNew = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: { width: any }) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }))

    return (
      <Table
        columns={columnsNew}
        components={this.components}
        {...resetProps}
      />
    )
  }
}

export default ResizableTable;

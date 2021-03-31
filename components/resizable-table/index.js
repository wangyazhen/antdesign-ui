import React from 'react'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'

const ResizeableTitle = (props) => {
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
  constructor(props) {
    super(props);
    this.state = {
      isResizing: false,
      columns: props.columns,
    }
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  }


  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      }
      return { columns: nextColumns }
    })
  }

  onResizeStart = (e, data) => {
    this.setState(({isResizing})=> {
      return {isResizing:true}
    })

  }

  onResizeStop = (e, data) => {
    this.setState(({ isResizing }) => {
      return { isResizing: false }
    })
  }

  render() {
    const {columns, ...resetProps} = this.props
    const columnsNew = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
        onResizeStart: this.onResizeStart,
        onResizeStop: this.onResizeStop
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

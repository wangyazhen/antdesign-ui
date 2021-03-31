import React from 'react'
import moment from 'moment'
import {Table, Input, InputNumber, Popconfirm, Form, Button, Checkbox, DatePicker, message, Pagination, Select, Row, Col} from 'antd'

const Option = Select.Option;
const EditableContext = React.createContext()
const defaultLocale = {
  deleteTitle: 'Are you sure delete ?',
  saveBtnText: 'Save',
  cancelBtnText: 'Cancel',
  delBtnText: 'Delete',
}

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.component) {
      return this.props.component
    }
    if (this.props.inputType === 'number') {
      return <InputNumber size="small" />
    } else if (this.props.inputType === 'textarea') {
      return <Input.TextArea rows={3} size="small" />
    } else if (this.props.inputType === 'checkbox') {
      return <Checkbox />
    } else if (this.props.inputType === 'datepicker') {
      return <DatePicker size="small" />
    } else if (this.props.inputType === 'select') {
      return <Select style={{width: '100%'}} size="small">
        {this.props.options.map(v => <Option key={v.id||v.value} value={v.value}>{v.label}</Option>)}
      </Select>
    }
    return <Input size="small" />
  }

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      rules,
      props,
      component,
      record,
      index,
      children,
      ...restProps
    } = this.props
    const valueProp = inputType === 'checkbox' ? {valuePropName: 'checked'} : {}

    let node = this.getInput()
    if (!component) {
      node = React.cloneElement(node, props, null)
    }

    let initialValue = record && record[dataIndex]
    if (inputType === 'datepicker') {
      initialValue =  initialValue ? moment(record[dataIndex]) : null
    }

    return (
      <td {...restProps} className={editing ? "editing-cell-item" : ''}>
        {editing ? (
          <div style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: rules ? rules : [],
              initialValue,
              ...valueProp,
            })(node)}
          </div>
        ) : ( <div className="et-editable-text-line1">{children}</div> )}
      </td>
    );
  }

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.dataSource || [],
      editingKey: '',
      columns: this.parseColumns(props.columns)
    }
  }

  parseColumns = (list) => {
    let columns = list
    const { hiddenDelBtn, handleDelete, delColumnWidth = 50, locale } = this.props
    const { deleteTitle, saveBtnText, cancelBtnText, delBtnText } = {...defaultLocale, ...locale}
    if (list.findIndex(v => v.dataIndex === 'operation') === -1) {
      columns = list.concat([
        {
          title: '_',
          width: delColumnWidth,
          dataIndex: 'operation',
          render: (text, record) => {
            const { editingKey } = this.state
            const editable = this.isEditing(record)
            return editable ? (
              <div className="et-editable-table-edit-button">
                <EditableContext.Consumer>
                  {form => <Button size="small" onClick={() => this.save(form, editingKey)}>{saveBtnText}</Button>}
                </EditableContext.Consumer>
                <Button size="small" style={{ marginLeft: 10 }} onClick={() => this.cancel(record.key)}>{cancelBtnText}</Button>
              </div>
            ) : ( hiddenDelBtn ? null :
              <Popconfirm title={deleteTitle} okText="Yes" onConfirm={() => handleDelete(record.id||record.key)}>
                <a>{delBtnText}</a>
              </Popconfirm>
            )
          },
        },
      ])
    }
    return columns
  }

  componentDidMount() {
    if (this.props.formRef && typeof this.props.formRef === 'function') {
      this.props.formRef(this.props.form)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if ('dataSource' in nextProps) {
      this.setState({
        data: nextProps.dataSource,
        columns: this.parseColumns(nextProps.columns),
      })
    }
  }


  isEditing = record => (record.key||record.id) === this.state.editingKey

  cancel = () => {
    const newData = [...this.state.data]
    const idx = newData.findIndex(v => v.key === 0)
    if (idx !== -1) {
      newData.splice(idx, 1)
      this.setState({
        data: newData,
        editingKey: '',
      })
    } else {
      this.setState({ editingKey: '' })
    }
  }

  handleAdd = () => {
    const { data } = this.state;
    const newData = {
      key: 0,
    };
    if (data.findIndex(v => v.key === 0) === -1) {
      this.setState({
        data: [newData, ...data],
        editingKey: 0,
      })
    }
  }

  save(form, key) {
    // note 这里设计把 error 暴露出去
    form.validateFields((error, row) => {
      if (error) {
        message.error(error)
        console.log(error)
        return;
      }
      const body = _.mapValues(row, v => moment.isMoment(v) ? v.format('YYYY-MM-DD') : v)
      this.props.handleSave(body, key)
      this.setState({ editingKey: '' })
    })
  }

  edit(key) {
    this.setState({ editingKey: key })
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) { return col }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.type || 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          component: col.component,
          options: col.options || [],
          editing: this.isEditing(record),
        }),
      }
    })


    const { createBtnText, hiddenAddBtn, form, hasEditPermission, children } = this.props
    // const Component = children ? React.cloneElement(children) : null

    const rowClassName = (record) => {
      return this.isEditing(record) ? 'et-editable-editing-row' : ''
    }

    return (<>
      {!hiddenAddBtn &&
      <Row gutter={5} style={{marginBottom: 10}}>
        <Col span={4}>
          <Form.Item style={{marginBottom: 0}}>
            <Button disabled={!hasEditPermission} size="small" onClick={this.handleAdd}>{createBtnText || '新建'}</Button>
          </Form.Item>
        </Col>
        <Col span={20}>
          {children}
        </Col>
      </Row>}
      <EditableContext.Provider value={form}>
        <Table
          columns={columns}
          components={components}
          dataSource={this.state.data}
          pagination={false}
          className={'et-editable-table'}
          rowClassName={rowClassName}
          scroll={{y:true}}
          onRow={record => {
            return {
              onDoubleClick: () => {
                this.edit(record.key || record.id)
              },
            }
          }}
        />
      </EditableContext.Provider>
    </>)
  }
}

const EditableFormTable = Form.create()(EditableTable)

EditableTable.defaultProps = {
  hasEditPermission: true,
  cancelConfirm: false,
  hiddenAddBtn: false,
}

// EditableTable.propTypes = {
//   handleSave: PropTypes.func,
//   handleDelete: PropTypes.func,
//   columns:PropTypes.array.isRequired,
//   resource:PropTypes.string.isRequired, // 不能包含querystring
//   hiddenAddBtn:PropTypes.bool,
//   pagination:PropTypes.bool,
//   fixedRight:PropTypes.bool,
//   cancelConfirm:PropTypes.bool,
//   createBtnText:PropTypes.string,
//   scroll:PropTypes.object,
//   rowClassName:PropTypes.func,
//   hasEditPermission:PropTypes.bool,
//   enablePagination:PropTypes.bool,
//   pageSize:PropTypes.number,
// }

export default EditableFormTable

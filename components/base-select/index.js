
import React from 'react'
import { Select } from 'antd'
const Option = Select.Option

export default function BaseSelect({ onChange, ...props }) {

    const handleChange = (value) => {
        const { selects = [], valueIsObj, valueField, onChangeAfter = () => {} } = props
        const cur = selects.find(v => v.id === Number(value))

        onChange(valueField && cur ? cur[valueField] : value)
        onChangeAfter(valueIsObj ? cur : value)
    }

    const defaultProps = {
        allowClear: true,
        showArrow: true,
        showSearch: true,
        placeholder: "",
        notFoundContent: "没找到内容",
        filterOption: (inputValue, option) => option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) > -1,
        onChange: handleChange,
        ...props
    }
    const { selects = [], optKey = 'select', renderOption, displayField, valueField } = props

    return (
        <Select { ...defaultProps }>
            { renderOption ? renderOption(Option) :
                selects.map((set, i) => <Option
                key={`${optKey}_${set.id || i}`}
                title={set[displayField]||set}
                value={valueField?set[valueField]:set.id||set}>{set[displayField]||set}</Option>)
            }
        </Select>
    )
}

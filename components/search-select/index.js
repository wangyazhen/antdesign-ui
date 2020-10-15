/**
 * Created by wyz.
 * updated on
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import words from 'lodash/words'
import isEmpty from 'lodash/isEmpty'
import BaseSelect from '../base-select'
import request from '../request'


class SearchSelect extends Component {
    state = {
        selects: []
    }
    componentDidMount() {
        const { initialLoad, resource, } = this.props
        if (initialLoad) {
            request(resource).then(res => {
                res && res.success && this.setState({ selects: res.jsonData })
            })
        }
    }
    onFocusQuery = () => {
        const { focusLoad, resource, } = this.props
        if (focusLoad) {
            request(resource).then(res => {
                res && res.success && this.setState({ selects: res.jsonData })
            })
        }
    }
    onSearchQuery = (value) => {
        const { queryField, resource } = this.props

        const hasQuestionMark = (url) => words(url, /[?]+/).length > 0;
        const mark = hasQuestionMark(resource) ? '&' : '?';

        request(`${resource}${mark}${queryField}=${value}`).then(res => {
            res && res.success && this.setState({ selects: res.jsonData })
        })
    }

    render() {
        const selects = this.state.selects;
        const { initValue } = this.props
        if (!isEmpty(initValue) && !selects.find(v => (v.id||v)===(initValue.id||initValue))) selects.unshift(initValue);

        const selectProps = Object.assign({}, {
            selects,
            valueIsObj: true,
            filterOption: false,
            onSearch: this.onSearchQuery,
            onFocus: this.onFocusQuery,
            optionLabelProp: "children",
            optKey: 'search_select',
            getPopupContainer: () => {
                // 查询弹出框 左边菜单遮挡
                const forms = document.getElementsByClassName('ocean-export-search-form')
                if (forms.length) return forms[0]
                return document.getElementById('container')
            },
        }, this.props)

        return <BaseSelect {...selectProps} />
    }
}

SearchSelect.propTypes = {
    focusLoad: PropTypes.bool,
    initialLoad: PropTypes.bool,
    initValue: PropTypes.object,
    resource: PropTypes.string.isRequired,
    displayField: PropTypes.string,
    valueField: PropTypes.string,
    queryField: PropTypes.string,
    valueIsObj: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onChangeAfter: PropTypes.func,
}

export default SearchSelect

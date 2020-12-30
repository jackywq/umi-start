import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

// 多选 -- 支持模糊搜索
export default class MultipleSelect extends Component {
  static defaultProps = {
    data: '',
    nodeProps: {
      isFuzzySearch: false,
    },
  };
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.string]),
    name: PropTypes.string.isRequired,
    nodeProps: PropTypes.shape({}),
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.string]).isRequired,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func,
    }).isRequired,
  };
  state = {
    selectData: [],
  };

  componentDidMount() {
    this.setState({ selectData: this.props.data });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({ selectData: nextProps.data });
    }
  }

  filterValue = value => {
    const { data } = this.props;
    const newSelectData = data.filter(item => item.label.indexOf(value) > -1);
    this.setState({
      selectData: newSelectData,
    });
  };

  render() {
    const {
      name,
      form: { setFieldsValue },
      data,
      nodeProps,
      value,
    } = this.props;
    const { isFuzzySearch } = nodeProps || {};
    const { selectData } = this.state;

    let fuzzyObj = {};

    // 模糊搜索
    if (isFuzzySearch) {
      fuzzyObj = {
        onFocus: () => this.setState({ selectData: data }),
        onSearch: value => this.filterValue(value),
        showSearch: true,
        showArrow: false,
        filterOption: false,
      };
    }
    return (
      <Select
        mode="multiple"
        value={value}
        onChange={value => setFieldsValue({ [name]: value })}
        {...fuzzyObj}
        {...nodeProps}
      >
        {(selectData || []).map(item => (
          <Option value={item.value} key={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  }
}

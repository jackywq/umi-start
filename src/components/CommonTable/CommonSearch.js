import React, { Component } from 'react';
import { Row, Col, Form, DatePicker, Input, Select, Button, Cascader } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MultipleSelect from './@components/general/multipleSelect';
import SelectGroup from './@components/general/selectGroup';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const isPureObject = val => {
  return Object.prototype.toString.call(val) === '[object Object]';
};
@Form.create()
export default class CommonSearch extends Component {
  static defaultProps = {
    refCallback: '',
  };
  static propTypes = {
    refCallback: PropTypes.func,
    memoryQuery: PropTypes.shape({}).isRequired,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func,
      getFieldsValue: PropTypes.func,
      resetFields: PropTypes.func,
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    search: PropTypes.shape({
      datas: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
  };

  componentDidMount() {
    const { refCallback } = this.props;

    // 获取子组件的this指向
    if (_.isFunction(refCallback)) {
      refCallback(this);
    }

    this.formatMemoryAndInitData();
  }

  // 1. 对回显的数据进行格式处理 2. 初始化数据
  formatMemoryAndInitData = () => {
    const {
      search: { datas = [] },
      form: { setFieldsValue },
      memoryQuery,
    } = this.props;
    const { pageNum, pageSize, ...rest } = memoryQuery || {};

    if (Object.keys(rest).length) {
      let obj = rest;
      datas.forEach(({ name, valueType, data, type, memoryFormat }) => {
        if (name in rest) {
          if (_.isFunction(memoryFormat)) {
            obj[name] = memoryFormat(rest[name]);
          } else {
            if (/^moment$/i.test(valueType)) {
              obj[name] = moment(rest[name]);
            }
            if (/^cascader$/i.test(type)) {
              // 级联选择，回显的值为string | number, 递归遍历获取其祖先id并整合成array
              if (!Array.isArray(rest[name])) {
                obj[name] = this.traverseCascader(data, rest[name]);
              }
            }
          }
        }
      });
      setFieldsValue(obj);
    }
  };

  traverseCascader = (list, id) => {
    let arr = [];
    recursive(list);
    function recursive(list, parentIds) {
      for (const item of list) {
        if (item.value === id) {
          if (parentIds) {
            arr = [...parentIds, id];
          } else {
            arr.push(id);
          }
          break;
        }

        if (Array.isArray(item.children) && item.children.length) {
          recursive(item.children, parentIds ? [...parentIds, item.value] : [item.value]);
        }
      }
    }
    return arr;
  };

  // 获取表单values
  getValues = () => {
    const {
      form: { getFieldsValue },
      search: { datas = [] },
    } = this.props;

    let values = {};
    _.forEach(getFieldsValue() || {}, (value, key) => {
      if (value || _.isNumber(value)) {
        values[key] = value;
        datas.forEach(({ submitFormat, submitValues, name }) => {
          if (_.isFunction(submitFormat)) {
            values[key] = submitFormat(value);
          }
          if (name === key && _.isArray(submitValues) && _.isArray(value)) {
            submitValues.forEach((si, skey) => {
              values[si] = value[skey];
            });
          }
        });
      }
    });
    return values;
  };

  // 重置表单
  resetValues = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  };

  // 渲染按钮组
  renderButtons = buttons => {
    return (
      <Col>
        <FormItem className={styles.buttons}>
          {(buttons || []).map((item, key) => {
            const { type = 'default', root = true, name, onClick, disabled } = item || {};
            return root ? (
              <Button
                type={type}
                style={{ marginRight: 24 }}
                key={key}
                disabled={!!disabled}
                onClick={_.isFunction(onClick) ? onClick : () => {}}
              >
                {name}
              </Button>
            ) : (
              ''
            );
          })}
        </FormItem>
      </Col>
    );
  };

  // 组合form属性
  composeFormAttr = formProps => {
    const defaultLabelSpan = 8;
    const { label, labelSpan = defaultLabelSpan, wrapperSpan = 24 - defaultLabelSpan } = formProps;
    if (!label) {
      return {};
    }
    return {
      label,
      labelCol: {
        span: labelSpan,
      },
      wrapperCol: {
        span: wrapperSpan,
      },
    };
  };

  // 渲染formItem
  renderFormItem = (item, key) => {
    const {
      form,
      form: { getFieldDecorator },
      memoryQuery,
      search: { cols = 4 } = {},
    } = this.props;

    const autoSpan = _.isNumber(cols) ? parseInt(24 / cols, 10) : 6;

    const {
      name,
      type,
      span = autoSpan,
      selectData = [],
      data = [],
      render,
      formProps = {},
      formProps: { initialValue, rules = [] } = {},
      nodeProps,
    } = item;

    const fieldOptions = {
      initialValue,
      rules,
    };

    let ItemComponent = null;

    if (/^date$/i.test(type)) {
      ItemComponent = (
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
          placeholder="选择日期"
          {...nodeProps}
        />
      );
    }

    if (/^select$/i.test(type)) {
      ItemComponent = (
        <Select {...nodeProps}>
          {data.map(item => (
            <Option value={item.value} key={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      );
    }

    if (/^select_group$/i.test(type)) {
      // 【自定义表单校验】针对返回上一页记录查询条件功能，SelectGroup组件的装饰器name作特殊处理
      const selectItem = selectData.find(({ value }) => {
        if (memoryQuery && value in memoryQuery) {
          return true;
        }
        return false;
      });
      const nameObj = selectItem ? { name: selectItem.value } : {};
      item = { ...item, ...nameObj };
      return (
        <SelectGroup
          {...item}
          {...fieldOptions}
          form={form}
          memoryQuery={memoryQuery}
          key={key}
          index={key}
          span={span}
        />
      );
    }

    if (/^muitple_select$/i.test(type)) {
      ItemComponent = <MultipleSelect {...item} form={form} />;
    }

    if (/^cascader$/i.test(type)) {
      ItemComponent = <Cascader options={data} {...nodeProps} />;
    }

    if (!type || /^input$/i.test(type)) {
      ItemComponent = <Input {...nodeProps} />;
    }

    const labelFormItem = this.composeFormAttr(formProps);

    return (
      <Col key={`${name}-${key}`} span={span}>
        <FormItem {...labelFormItem}>
          {getFieldDecorator(name, fieldOptions)(_.isFunction(render) ? render() : ItemComponent)}
        </FormItem>
      </Col>
    );
  };

  // 渲染row
  renderRowByDatas = search => {
    const { datas = [], buttons } = search || {};

    if (datas.some(p => isPureObject(p))) {
      return (
        <Row type="flex" gutter={24}>
          {datas.map((item, key) => this.renderFormItem(item, key))}
          {this.renderButtons(buttons)}
        </Row>
      );
    }
    if (datas.some(p => p instanceof Array)) {
      return datas.map((item, key) => {
        return (
          <Row type="flex" gutter={24} key={key}>
            {item.map((p, index) => this.renderFormItem(p, index))}
            {key === datas.length - 1 && this.renderButtons(buttons)}
          </Row>
        );
      });
    }
    return '';
  };

  render() {
    const { search } = this.props;

    if (!_.isPlainObject(search) || !Object.keys(search).length) {
      return null;
    }

    return <div className={styles.commonSearch}>{this.renderRowByDatas(search)}</div>;
  }
}

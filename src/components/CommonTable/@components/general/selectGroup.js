import React, { Component } from 'react';
import { Select, Col, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;

// select组合框
export default class SelectGroup extends Component {
  static defaultProps = {
    selectData: [],
    nodeProps: {},
    formProps: {},
    component: '',
    memoryFormat: '',
    memoryQuery: {},
    initialValue: '',
    label: '',
    rules: [],
  };
  static propTypes = {
    selectData: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
      }),
    ),
    nodeProps: PropTypes.shape({}),
    formProps: PropTypes.shape({}),
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    memoryQuery: PropTypes.shape({}),
    memoryFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      getFieldValue: PropTypes.func,
      setFieldsValue: PropTypes.func,
    }).isRequired,
    initialValue: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.shape({})),
  };

  constructor({ selectData, name }) {
    super();
    this.state = {
      decoratorName: name || (selectData.length ? selectData[0].value : ''),
    };
  }

  componentDidMount() {
    const {
      memoryQuery,
      selectData,
      form: { setFieldsValue },
      memoryFormat,
    } = this.props;
    selectData.find(({ value }) => {
      // 获取redux存储的值
      if (value in memoryQuery) {
        this.setState(
          {
            decoratorName: value,
          },
          () => {
            setFieldsValue({
              [value]: _.isFunction(memoryFormat)
                ? memoryFormat(memoryQuery[value])
                : memoryQuery[value],
            });
          },
        );
        return true;
      }
      return false;
    });
  }

  // 组合form属性
  composeFormAttr = formProps => {
    const defaultLabelSpan = 8;
    const { label, labelSpan = defaultLabelSpan, wrapperSpan = 24 - defaultLabelSpan } =
      formProps || {};
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

  render() {
    const {
      nodeProps,
      formProps,
      selectData,
      component: Component = Input,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      span,
      index,
      initialValue,
      rules,
    } = this.props;

    const { decoratorName } = this.state;

    const labelFormItem = this.composeFormAttr(formProps);

    return (
      <Col key={index} span={span}>
        <FormItem {...labelFormItem}>
          <div className={styles.selectGroup}>
            <Select
              style={{ width: '40%' }}
              value={decoratorName}
              onChange={value => {
                const fieldValue = getFieldValue(decoratorName);
                this.setState({ decoratorName: value }, () => {
                  setFieldsValue({ [value]: fieldValue });
                });
              }}
            >
              {selectData.map(({ label, value }) => (
                <Option value={value} key={value}>
                  {label}
                </Option>
              ))}
            </Select>
            {getFieldDecorator(decoratorName, {
              initialValue,
              rules,
            })(
              _.isFunction(Component) ? (
                <Component style={{ width: '60%' }} {...nodeProps} />
              ) : null,
            )}
          </div>
        </FormItem>
      </Col>
    );
  }
}

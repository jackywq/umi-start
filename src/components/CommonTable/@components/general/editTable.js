import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  static defaultProps = {
    editable: false,
    cellProps: {},
  };

  static propTypes = {
    record: PropTypes.shape({}).isRequired,
    handleSave: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    dataIndex: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rowKey: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    refCallback: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    cellProps: PropTypes.shape({
      width: PropTypes.number,
      showEdit: PropTypes.bool,
      rules: PropTypes.arrayOf(),
    }),
    form: PropTypes.shape({
      validateFields: PropTypes.func,
      getFieldDecorator: PropTypes.func,
    }).isRequired,
  };

  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = () => {
    const {
      record,
      handleSave,
      cellProps: { showEdit },
      rowKey,
      dataIndex,
    } = this.props;

    const curFiledsName = `${dataIndex}-${record[rowKey]}`;

    this.props.form.validateFields([curFiledsName], (error, values) => {
      if (!error) {
        handleSave({ ...record, [dataIndex]: values[curFiledsName] });
        !showEdit && this.toggleEdit();
      }
    });
  };

  renderCell = () => {
    const {
      children,
      dataIndex,
      record,
      cellProps: { width, showEdit, rules = [] },
      form: { getFieldDecorator },
      rowKey,
    } = this.props;
    const { editing } = this.state;

    const FormWrapper = (
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(`${dataIndex}-${record[rowKey]}`, {
          rules,
          initialValue: record[dataIndex],
        })(
          <Input
            style={{ width }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />,
        )}
      </Form.Item>
    );

    if (showEdit) {
      return FormWrapper;
    }

    return editing ? (
      FormWrapper
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

EditableRow.propTypes = {
  form: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  refCallback: PropTypes.func.isRequired,
};

export { EditableCell, EditableRow as EditableFormRow };

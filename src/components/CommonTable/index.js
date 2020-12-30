import React, { Component, Fragment } from 'react';
import { Table, Pagination, Form, Alert, Popover } from 'antd';
import request from '@/utils/request';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import RenderPosition from '@/components/RenderPosition';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { EditableFormRow, EditableCell } from './@components/general/editTable';
import TableSlider from './@components/tableSlider/index';
import CommonSearch from './CommonSearch';
import styles from './index.less';

@withRouter
@Form.create()
export default class CommonTable extends Component {
  static defaultProps = {
    refCallback: '',
    rowKey: 'id',
    pageSizeOptions: ['10', '20', '50', '100'],
    isAutoRowSelection: false,
    isVisibleScroll: false,
    isAddTableAlert: false,
    isFixedPagination: false,
    isHidePagination: false,
    isAutoColumns: false,
    isTableTopSlider: false,
    editable: false,
    bordered: false,
    tHeadALert: '',
    storeName: '',
    rowSelectionType: 'checkbox',
    constantParams: {},
    search: {},
    update: () => {},
  };
  static propTypes = {
    storeData: PropTypes.shape({}).isRequired,
    refCallback: PropTypes.func,
    url: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    rowKey: PropTypes.string,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    isFixedPagination: PropTypes.bool,
    isHidePagination: PropTypes.bool,
    bordered: PropTypes.bool,
    isAutoRowSelection: PropTypes.bool,
    isVisibleScroll: PropTypes.bool,
    isAddTableAlert: PropTypes.bool,
    isAutoColumns: PropTypes.bool,
    isTableTopSlider: PropTypes.bool,
    editable: PropTypes.bool,
    search: PropTypes.shape({
      datas: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func,
    }).isRequired,
    tHeadALert: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    storeName: PropTypes.string,
    rowSelectionType: PropTypes.string,
    constantParams: PropTypes.shape({}),
    update: PropTypes.func,
  };

  constructor(props) {
    super();

    this.commonSearchRef = {};

    const {
      location: { pathname },
      storeName,
    } = props;

    this.pathname = storeName ? `${pathname}?${storeName}` : pathname;

    // const storeData = props.storeData[this.pathname];
    const { pageNum: current, pageSize } = {};

    this.state = {
      loading: false, // 表格loading
      tableData: {}, // 表格数据
      pagination: {
        current: current || 1,
        pageSize: pageSize || 10,
        total: 0,
        showSizeChanger: true,
      },
      selectedRowKeys: [],
      selectedRows: [],
      tableComponents: props.editable
        ? { components: { body: { row: EditableFormRow, cell: EditableCell } } }
        : {},
    };
  }

  componentDidMount() {
    const { refCallback } = this.props;
    if (_.isFunction(refCallback)) {
      refCallback(this);
    }

    this.loadData();
  }

  // 初始化加载接口
  loadData = () => {
    let { url, method, constantParams } = this.props;
    const {
      pagination: { current: pageNum, pageSize },
      pagination: currentPagination,
    } = this.state;

    this.storeSearchData();

    const values = this.commonSearchRef.getValues();
    const requestParam = {
      ...constantParams,
      ...values,
      pageNum,
      pageSize,
    };

    if (typeof method === 'string') {
      method = method.toLowerCase();
    }

    try {
      this.setState({ loading: true });
      request[method](url, requestParam)
        .then(res => {
          const { code, data, data: { pageNum, pageSize, total } = {} } = res || {};
          if (parseInt(code, 10) === 0) {
            this.setState({
              tableData: data,
              pagination: {
                ...currentPagination,
                current: pageNum || 1,
                pageSize,
                total,
              },
            });
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({ loading: false });
    }
  };

  // 将查询条件存储到redux
  storeSearchData = () => {
    const { pagination: { current: pageNum, pageSize } = {} } = this.state;
    const query = {
      ...this.commonSearchRef.getValues(),
      pageNum,
      pageSize,
    };

    // 将url作为key, 避免redux数据互串
    // storeSearchAction({ [this.pathname]: query });
  };

  // 重置复选框选中keys
  resetSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  // 重置查询条件，并初始化接口参数
  resetData = () => {
    this.commonSearchRef.resetValues();
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: true,
        },
      },
      this.loadData,
    );
  };

  // 查询按钮 -- 查询条件，初始化接口参数
  searchData = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: true,
        },
      },
      this.loadData,
    );
  };

  // 复选框选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState(
      {
        selectedRowKeys,
        selectedRows,
      },
      this.props.update,
    );
  };

  // 改变页码
  onPageChange = page => {
    let { pagination: currentPagination } = this.state;
    this.setState(
      {
        pagination: {
          ...currentPagination,
          current: page,
        },
      },
      this.loadData,
    );
  };

  // 改变页数
  onPageSizeChange = (page, pageSize) => {
    let { pagination: currentPagination } = this.state;
    this.setState(
      {
        pagination: {
          ...currentPagination,
          pageSize,
        },
      },
      this.loadData,
    );
  };

  // 父组件获取状态
  getState = () => {
    const { tableData, selectedRowKeys, selectedRows } = this.state;
    return {
      tableData,
      selectedRowKeys,
      selectedRows,
    };
  };

  // 父组件获取表单value
  getValues = () => {
    return this.commonSearchRef.getValues();
  };

  // 获取search表单的form信息
  getSearchForm = () => {
    return this.commonSearchRef.props.form;
  };

  // 增加文字省略
  onAddEllipsis = columns => {
    return (columns || []).map(item => {
      if (item.render) {
        return item;
      }
      if (typeof item.interceptNum === 'number') {
        return {
          ...item,
          render: text => (
            <Popover placement="right" content={<div className={styles.popover}> {text} </div>}>
              {text.length > item.interceptNum ? text.substr(0, item.interceptNum) + '...' : text}
            </Popover>
          ),
        };
      }
      return item;
    });
  };

  // 添加可编辑单元格
  onAddEditable = columns => {
    /**
     * 1. [优先级高]props上的editable是否开启整个表格可编辑功能
     * 2. columns上每一项的editable针对单个td是否可编辑
     */
    if (!this.props.editable) {
      return columns;
    }
    return (columns || []).map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        // 【注意】columns自定义的props, 必须放到onCell方法里，才能生效
        onCell: record => ({
          record,
          rowKey: this.props.rowKey,
          form: this.props.form,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          cellProps: col.cellProps,
          handleSave: row => {
            let {
              tableData,
              tableData: { list },
            } = this.state;
            const { rowKey } = this.props;
            const index = list.findIndex(item => row[rowKey] === item[rowKey]);
            const item = list[index];
            list.splice(index, 1, {
              ...item,
              ...row,
            });
            tableData.list = list;
            this.setState({ tableData });
          },
        }),
      };
    });
  };

  composeCallFunc = (funcs, init) => {
    return funcs.reduce((columns, fn) => {
      return fn(columns);
    }, init);
  };

  // 表格复选框提示信息
  renderRowSelectionAlert = () => {
    const { selectedRowKeys } = this.state;
    return (
      <Alert
        message={
          <div>
            已选择 <a className={styles.fontWeight}>{selectedRowKeys.length}</a>项
            <a onClick={() => this.setState({ selectedRowKeys: [] })} style={{ marginLeft: 24 }}>
              清空
            </a>
          </div>
        }
        className={styles.tableAlert}
        type="info"
        showIcon
      />
    );
  };

  render() {
    const {
      columns,
      rowKey,
      pageSizeOptions,
      bordered,
      isFixedPagination, // 是否固定分页到底部
      isHidePagination, // 是否隐藏分页信息
      isAutoColumns, // 是否支持动态获取表格列
      isTableTopSlider, // 是否支持表格顶部滚动
      isAutoRowSelection, // 是否支持表格复选框选择
      isVisibleScroll, // 是否支持表格在可视区域滚动
      isAddTableAlert, // 是否支持表格复选框选中提示信息
      rowSelectionType,
      search,
      // storeData,
      tHeadALert: THeadAlert,
      ...rest
    } = this.props;

    const {
      loading,
      tableData: { list: dataSource = [], columns: dataColumns = [] },
      pagination,
      selectedRowKeys,
      tableComponents,
    } = this.state;

    const rowSelectionProps = isAutoRowSelection
      ? {
          rowSelection: {
            type: rowSelectionType,
            selectedRowKeys,
            onChange: this.onSelectChange,
          },
        }
      : {};

    const paginationProps = {
      ...pagination,
      pageSizeOptions,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      showTotal: total => {
        return (
          <span>
            总共
            <span className={styles.total}>{total}</span>
            条记录
          </span>
        );
      },
    };

    const newColumns = isAutoColumns ? dataColumns : columns.slice(0);

    const tableProps = {
      loading,
      columns: this.composeCallFunc([this.onAddEllipsis, this.onAddEditable], newColumns),
      rowKey,
      dataSource,
      bordered,
      pagination: !isHidePagination && !isFixedPagination && paginationProps,
      ...tableComponents,
      ...rowSelectionProps,
      ...rest,
    };

    const TableContent = extraProps => (
      <Fragment>
        {isAddTableAlert && this.renderRowSelectionAlert()}
        {THeadAlert}
        {isTableTopSlider && <TableSlider />}
        <Table {...tableProps} {...extraProps} className={styles.table} />
      </Fragment>
    );

    return (
      <div className={styles.commonTable} id="commonTable">
        <CommonSearch
          refCallback={ref => (this.commonSearchRef = ref)}
          search={search}
          // memoryQuery={storeData[this.pathname] || {}}
        />
        {isVisibleScroll ? (
          <RenderPosition>
            {h => {
              const scrollX = (columns || []).reduce((acc, cur) => {
                acc += cur.width || 120;
                return acc;
              }, 0);
              const scroll = { x: scrollX, y: h - 30 };
              return (
                <div style={{ height: h }}>
                  <TableContent scroll={scroll} />
                </div>
              );
            }}
          </RenderPosition>
        ) : (
          <TableContent />
        )}
        {!isHidePagination && isFixedPagination && (
          <div style={{ width: '100%' }} className={styles.pageFooter}>
            <Pagination {...paginationProps} />
          </div>
        )}
      </div>
    );
  }
}

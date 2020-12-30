import * as React from 'react';
import { Input } from 'antd';
import { AGENT_TYPE, IS_RATING_TYPE, LEVELSTATUS_TYPE, SCORE_TYPE, columns } from './constant';
import CommonTable from '@/components/CommonTable';

class Home extends React.Component {
  constructor() {
    super();
    this.commonTableRef = {};
  }
  render() {
    const tableProps = {
      url: '/api/agentLevel/list',
      columns,
      method: 'POST',
      rowKey: 'id',
      refCallback: ref => (this.commonTableRef = ref),
      isAutoRowSelection: true,
      scroll: { x: 1050 },
      isFixedPagination: true,
      isVisibleScroll: true,
      search: {
        datas: [
          {
            name: 'agentName',
            selectData: AGENT_TYPE,
            type: 'select_group',
            component: Input,
            nodeProps: {
              allowClear: true,
            },
          },
          {
            name: 'isRating',
            type: 'select',
            data: IS_RATING_TYPE,
            nodeProps: {
              placeholder: '是否参与等级评价',
              allowClear: true,
            },
          },
          {
            name: 'levelStatus',
            type: 'select',
            data: LEVELSTATUS_TYPE,
            nodeProps: {
              placeholder: '等级状态',
              allowClear: true,
            },
          },
          {
            name: 'lastScoreStr',
            type: 'select',
            data: SCORE_TYPE,
            nodeProps: {
              placeholder: '上周期分数',
              allowClear: true,
            },
          },
          {
            name: 'currentScoreStr',
            type: 'select',
            data: SCORE_TYPE,
            nodeProps: {
              placeholder: '本周期分数',
              allowClear: true,
            },
          },
        ],
        buttons: [
          {
            type: 'primary',
            name: '查询',
            onClick: this.commonTableRef.searchData,
          },
          {
            type: 'primary',
            name: '参与',
            onClick: this.handleJoin,
          },
          {
            type: 'primary',
            name: '不参与',
            onClick: this.handleDropOut,
          },
          {
            type: 'primary',
            name: '批量编辑',
            onClick: this.handleBatchEdit,
          },
          {
            name: '重置',
            onClick: this.commonTableRef.resetData,
          },
          {
            name: '导出',
            onClick: this.handleExport,
          },
        ],
      },
    };

    return <CommonTable {...tableProps} />;
  }
}

export default Home;

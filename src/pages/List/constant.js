export const AGENT_TYPE = [
  {
    value: 'agentName',
    label: '代理商名称',
  },
  {
    value: 'identifyCode',
    label: '标识码',
  },
];

export const BUSINESSLINE_TYPE = [
  {
    value: 1,
    label: '零售',
  },
  {
    value: 2,
    label: '电商',
  },
  {
    value: 3,
    label: '酒旅',
  },
  {
    value: 4,
    label: '休娱',
  },
  {
    value: 5,
    label: '餐饮',
  },
];

export const IS_RATING_TYPE = [
  {
    value: 1,
    label: '参与',
  },
  {
    value: 0,
    label: '不参与',
  },
];

export const LEVELSTATUS_TYPE = [
  {
    value: 1,
    label: '升级',
  },
  {
    value: 2,
    label: '降级',
  },
  {
    value: 3,
    label: '保级',
  },
];

export const SCORE_TYPE = [
  {
    value: 'X<60',
    label: 'X<60',
  },
  {
    value: '60<=X<80',
    label: '60<=X<80',
  },
  {
    value: 'X>=80',
    label: 'X>=80',
  },
];

export const columns = [
  {
    title: '代理商名称',
    dataIndex: 'agentName',
    width: 200,
  },
  {
    title: '代理商标识码',
    dataIndex: 'identifyCode',
    width: 150,
  },
  {
    title: '业务线',
    dataIndex: 'businessLineName',
    width: 150,
  },
  {
    title: '等级',
    dataIndex: 'agentLevelName',
    width: 150,
  },
  {
    title: '上周期分数',
    dataIndex: 'lastScore',
    width: 120,
  },
  {
    title: '本周期分数',
    dataIndex: 'currentScore',
    width: 120,
  },
  {
    title: '最近更新时间',
    dataIndex: 'levelUpdateTime',
    width: 200,
  },
  {
    title: '等级状态',
    dataIndex: 'levelStatusName',
    width: 100,
  },
  {
    title: '是否参与评级',
    dataIndex: 'isRatingStr',
    width: 100,
  },
];

export const mockList = [
  {
    agentName: '中世创想',
    identifyCode: 'ZSCX',
    businessLineName: '电商',
    agentLevelName: '核心代理商',
    lastScore: 70,
    currentScore: 80,
    levelUpdateTime: '2020-09-29 14:03:38',
    levelStatusName: '升级',
    isRatingStr: '参与',
    agentId: 1,
  },
  {
    agentName: '中世创想',
    identifyCode: 'ZSCX',
    businessLineName: '电商',
    agentLevelName: '核心代理商',
    lastScore: 70,
    currentScore: 80,
    levelUpdateTime: '2020-09-29 14:03:38',
    levelStatusName: '升级',
    isRatingStr: '参与',
    agentId: 2,
  },
];

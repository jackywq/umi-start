// 存储查询条件
export const storeSearchAction = data => {
  return {
    type: 'STORE_SEARCH_ACTION',
    payload: data,
  };
};

// 清除查询条件
export const clearSearchAction = () => {
  return {
    type: 'CLEAR_SEARCH_ACTION',
    payload: {},
  };
};

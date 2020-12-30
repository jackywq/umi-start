export default (
  state = {
    storeData: {},
  },
  action,
) => {
  switch (action.type) {
    case 'STORE_SEARCH_ACTION':
      return {
        ...state,
        storeData: { ...state.storeData, ...action.payload },
      };
    case 'CLEAR_SEARCH_ACTION':
      return {
        ...state,
        storeData: {},
      };
    default:
      return state;
  }
};

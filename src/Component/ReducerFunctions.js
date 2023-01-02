export const handleReducer = (state, action) => {
  switch (action.type) {
    case "setData":
      return action.payload;
    case "filteredData":
      return action.payload;
    default:
      return state;
  }
};

export const handleStateReducer = (state, action) => {
  switch (action.type) {
    case "logId":
      return { ...state, logId: action.payload };
    case "appId":
      return { ...state, appId: action.payload };
    case "actionType":
      return { ...state, actionType: action.payload };
    case "appType":
      return { ...state, appType: action.payload };
    case "from":
      return { ...state, from: action.payload };
    case "to":
      return { ...state, to: action.payload };
    default:
      return state;
  }
};

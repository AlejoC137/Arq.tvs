const initialState = {
  project: 'all',
  assignee: 'all',
  status: 'all',
  category: 'all',
  priority: 'all',
  searchTerm: '',
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROJECT_FILTER':
      return {
        ...state,
        project: action.payload,
      };
    
    case 'SET_ASSIGNEE_FILTER':
      return {
        ...state,
        assignee: action.payload,
      };
    
    case 'SET_STATUS_FILTER':
      return {
        ...state,
        status: action.payload,
      };
    
    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        category: action.payload,
      };
    
    case 'SET_PRIORITY_FILTER':
      return {
        ...state,
        priority: action.payload,
      };
    
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };
    
    case 'CLEAR_ALL_FILTERS':
      return initialState;
    
    default:
      return state;
  }
};

export default filtersReducer;

import { 
  GET_ALL_FROM_TABLE, 
  CREATE_IN_TABLE, 
  UPDATE_IN_TABLE, 
  DELETE_FROM_TABLE,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from '../actionTypes.js';

const initialState = {
  stages: [],
  loading: false,
  error: null,
};

const stagesReducer = (state = initialState, action) => {
  // Check if action is for stages table
  const isStagesAction = action.path === 'stages';
  
  switch (action.type) {
    // Fetch operations
    case GET_ALL_FROM_TABLE:
      if (isStagesAction) {
        return {
          ...state,
          loading: false,
          stages: action.payload.data || action.payload,
          error: null,
        };
      }
      break;

    // Create operations
    case CREATE_IN_TABLE:
      if (isStagesAction) {
        return {
          ...state,
          loading: false,
          stages: [...state.stages, action.payload.data || action.payload],
          error: null,
        };
      }
      break;

    // Update operations
    case UPDATE_IN_TABLE:
      if (isStagesAction) {
        return {
          ...state,
          loading: false,
          stages: state.stages.map(stage =>
            stage.id === (action.payload.data?.id || action.payload.id)
              ? { ...stage, ...(action.payload.data || action.payload) }
              : stage
          ),
          error: null,
        };
      }
      break;

    // Delete operations
    case DELETE_FROM_TABLE:
      if (isStagesAction) {
        return {
          ...state,
          loading: false,
          stages: state.stages.filter(stage => 
            stage.id !== (action.payload.data?.id || action.payload.id || action.payload)
          ),
          error: null,
        };
      }
      break;

    // Loading and error management
    case SET_LOADING:
      if (action.entity === 'stages') {
        return {
          ...state,
          loading: action.payload,
        };
      }
      break;

    case SET_ERROR:
      if (action.entity === 'stages') {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
      break;

    case CLEAR_ERROR:
      if (action.entity === 'stages') {
        return {
          ...state,
          error: null,
        };
      }
      break;

    default:
      return state;
  }
  
  return state;
};

export default stagesReducer;

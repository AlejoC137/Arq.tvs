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
  entregables: [],
  loading: false,
  error: null,
};

const entregablesReducer = (state = initialState, action) => {
  // Check if action is for entregables table
  const isEntregablesAction = action.path === 'entregables';
  
  switch (action.type) {
    // Fetch operations
    case GET_ALL_FROM_TABLE:
      if (isEntregablesAction) {
        return {
          ...state,
          loading: false,
          entregables: action.payload.data || action.payload,
          error: null,
        };
      }
      break;

    // Create operations
    case CREATE_IN_TABLE:
      if (isEntregablesAction) {
        return {
          ...state,
          loading: false,
          entregables: [...state.entregables, action.payload.data || action.payload],
          error: null,
        };
      }
      break;

    // Update operations
    case UPDATE_IN_TABLE:
      if (isEntregablesAction) {
        return {
          ...state,
          loading: false,
          entregables: state.entregables.map(entregable =>
            entregable.id === (action.payload.data?.id || action.payload.id)
              ? { ...entregable, ...(action.payload.data || action.payload) }
              : entregable
          ),
          error: null,
        };
      }
      break;

    // Delete operations
    case DELETE_FROM_TABLE:
      if (isEntregablesAction) {
        return {
          ...state,
          loading: false,
          entregables: state.entregables.filter(entregable => 
            entregable.id !== (action.payload.data?.id || action.payload.id || action.payload)
          ),
          error: null,
        };
      }
      break;

    // Loading and error management
    case SET_LOADING:
      if (action.entity === 'entregables') {
        return {
          ...state,
          loading: action.payload,
        };
      }
      break;

    case SET_ERROR:
      if (action.entity === 'entregables') {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
      break;

    case CLEAR_ERROR:
      if (action.entity === 'entregables') {
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

export default entregablesReducer;

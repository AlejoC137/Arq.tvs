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
  members: [],
  loading: false,
  error: null,
};

const staffReducer = (state = initialState, action) => {
  // Check if action is for staff table
  const isStaffAction = action.path === 'staff' || action.path === 'members';
  
  switch (action.type) {
    // Fetch operations
    case GET_ALL_FROM_TABLE:
      if (isStaffAction) {
        return {
          ...state,
          loading: false,
          members: action.payload.data || action.payload,
          error: null,
        };
      }
      break;

    // Create operations
    case CREATE_IN_TABLE:
      if (isStaffAction) {
        return {
          ...state,
          loading: false,
          members: [...state.members, action.payload.data || action.payload],
          error: null,
        };
      }
      break;

    // Update operations
    case UPDATE_IN_TABLE:
      if (isStaffAction) {
        return {
          ...state,
          loading: false,
          members: state.members.map(member =>
            member.id === (action.payload.data?.id || action.payload.id)
              ? { ...member, ...(action.payload.data || action.payload) }
              : member
          ),
          error: null,
        };
      }
      break;

    // Delete operations
    case DELETE_FROM_TABLE:
      if (isStaffAction) {
        return {
          ...state,
          loading: false,
          members: state.members.filter(member => 
            member.id !== (action.payload.data?.id || action.payload.id || action.payload)
          ),
          error: null,
        };
      }
      break;

    // Loading and error management
    case SET_LOADING:
      if (action.entity === 'staff' || action.entity === 'members') {
        return {
          ...state,
          loading: action.payload,
        };
      }
      break;

    case SET_ERROR:
      if (action.entity === 'staff' || action.entity === 'members') {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
      break;

    case CLEAR_ERROR:
      if (action.entity === 'staff' || action.entity === 'members') {
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

export default staffReducer;

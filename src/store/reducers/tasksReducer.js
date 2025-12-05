import {
  GET_ALL_FROM_TABLE,
  CREATE_IN_TABLE,
  UPDATE_IN_TABLE,
  DELETE_FROM_TABLE,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  createCrudActionTypes
} from '../actionTypes.js';

const TASKS_ACTIONS = createCrudActionTypes('tasks');

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksReducer = (state = initialState, action) => {
  // Check if action is for tasks table (Legacy)
  const isTasksAction = action.path === 'tasks';

  switch (action.type) {
    // ========================================
    // NEW ACTION HANDLERS
    // ========================================
    case TASKS_ACTIONS.FETCH_TASKS_REQUEST:
    case TASKS_ACTIONS.CREATE_TASKS_REQUEST:
    case TASKS_ACTIONS.UPDATE_TASKS_REQUEST:
    case TASKS_ACTIONS.DELETE_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case TASKS_ACTIONS.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: null
      };

    case TASKS_ACTIONS.CREATE_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: [...state.tasks, action.payload],
        error: null
      };

    case TASKS_ACTIONS.UPDATE_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        error: null
      };

    case TASKS_ACTIONS.DELETE_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        error: null
      };

    case TASKS_ACTIONS.FETCH_TASKS_FAILURE:
    case TASKS_ACTIONS.CREATE_TASKS_FAILURE:
    case TASKS_ACTIONS.UPDATE_TASKS_FAILURE:
    case TASKS_ACTIONS.DELETE_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========================================
    // LEGACY ACTION HANDLERS
    // ========================================

    // Fetch operations
    case GET_ALL_FROM_TABLE:
      if (isTasksAction) {
        return {
          ...state,
          loading: false,
          tasks: action.payload.data || action.payload,
          error: null,
        };
      }
      break;

    // Create operations
    case CREATE_IN_TABLE:
      if (isTasksAction) {
        return {
          ...state,
          loading: false,
          tasks: [...state.tasks, action.payload.data || action.payload],
          error: null,
        };
      }
      break;

    // Update operations
    case UPDATE_IN_TABLE:
      if (isTasksAction) {
        return {
          ...state,
          loading: false,
          tasks: state.tasks.map(task =>
            task.id === (action.payload.data?.id || action.payload.id)
              ? { ...task, ...(action.payload.data || action.payload) }
              : task
          ),
          error: null,
        };
      }
      break;

    // Delete operations
    case DELETE_FROM_TABLE:
      if (isTasksAction) {
        return {
          ...state,
          loading: false,
          tasks: state.tasks.filter(task =>
            task.id !== (action.payload.data?.id || action.payload.id || action.payload)
          ),
          error: null,
        };
      }
      break;

    // Loading and error management
    case SET_LOADING:
      if (action.entity === 'tasks') {
        return {
          ...state,
          loading: action.payload,
        };
      }
      break;

    case SET_ERROR:
      if (action.entity === 'tasks') {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
      break;

    case CLEAR_ERROR:
      if (action.entity === 'tasks') {
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

export default tasksReducer;

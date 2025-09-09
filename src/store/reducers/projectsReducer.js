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
  projects: [],
  loading: false,
  error: null,
};

const projectsReducer = (state = initialState, action) => {
  // Check if action is for projects table
  const isProjectsAction = action.path === 'projects' || action.path === 'Proyectos';
  
  switch (action.type) {
    // Fetch operations
    case GET_ALL_FROM_TABLE:
      if (isProjectsAction) {
        return {
          ...state,
          loading: false,
          projects: action.payload.data || action.payload,
          error: null,
        };
      }
      break;
    
    // Create operations
    case CREATE_IN_TABLE:
      if (isProjectsAction) {
        return {
          ...state,
          loading: false,
          projects: [...state.projects, action.payload.data || action.payload],
          error: null,
        };
      }
      break;
    
    // Update operations
    case UPDATE_IN_TABLE:
      if (isProjectsAction) {
        return {
          ...state,
          loading: false,
          projects: state.projects.map(project =>
            project.id === (action.payload.data?.id || action.payload.id)
              ? { ...project, ...(action.payload.data || action.payload) }
              : project
          ),
          error: null,
        };
      }
      break;
    
    // Delete operations
    case DELETE_FROM_TABLE:
      if (isProjectsAction) {
        return {
          ...state,
          loading: false,
          projects: state.projects.filter(project => 
            project.id !== (action.payload.data?.id || action.payload.id || action.payload)
          ),
          error: null,
        };
      }
      break;
    
    // Loading and error management
    case SET_LOADING:
      if (action.entity === 'projects') {
        return {
          ...state,
          loading: action.payload,
        };
      }
      break;
    
    case SET_ERROR:
      if (action.entity === 'projects') {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
      break;
    
    case CLEAR_ERROR:
      if (action.entity === 'projects') {
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

export default projectsReducer;

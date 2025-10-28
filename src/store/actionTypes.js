// ========================================
// ACCIONES GENERALES
// ========================================
export const GET_ALL_FROM_TABLE = "GET_ALL_FROM_TABLE";
export const CREATE_IN_TABLE = "CREATE_IN_TABLE";
export const UPDATE_IN_TABLE = "UPDATE_IN_TABLE";
export const DELETE_FROM_TABLE = "DELETE_FROM_TABLE";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const UPDATE_ACTIVE_TAB = "UPDATE_ACTIVE_TAB";
export const UPDATE_CURRENT_VIEW = "UPDATE_CURRENT_VIEW";
export const GET_BY_FILTER_VALUE = "GET_BY_FILTER_VALUE";

// ========================================
// TABLAS EN SUPABASE
// ========================================
export const PROJECTS = "projects";
export const TASKS = "tasks";
export const STAFF = "staff";
export const STAGES = "stages";
export const ENTREGABLES = "entregables";


// ========================================
// FACTORY FUNCTION FOR ENTITY ACTION TYPES
// ========================================

export const createCrudActionTypes = (entityName) => {
  const upperEntity = entityName.toUpperCase();
  return {
    // Fetch operations
    [`FETCH_${upperEntity}_REQUEST`]: `FETCH_${upperEntity}_REQUEST`,
    [`FETCH_${upperEntity}_SUCCESS`]: `FETCH_${upperEntity}_SUCCESS`,
    [`FETCH_${upperEntity}_FAILURE`]: `FETCH_${upperEntity}_FAILURE`,
    
    // Create operations
    [`CREATE_${upperEntity}_REQUEST`]: `CREATE_${upperEntity}_REQUEST`,
    [`CREATE_${upperEntity}_SUCCESS`]: `CREATE_${upperEntity}_SUCCESS`,
    [`CREATE_${upperEntity}_FAILURE`]: `CREATE_${upperEntity}_FAILURE`,
    
    // Update operations
    [`UPDATE_${upperEntity}_REQUEST`]: `UPDATE_${upperEntity}_REQUEST`,
    [`UPDATE_${upperEntity}_SUCCESS`]: `UPDATE_${upperEntity}_SUCCESS`,
    [`UPDATE_${upperEntity}_FAILURE`]: `UPDATE_${upperEntity}_FAILURE`,
    
    // Delete operations
    [`DELETE_${upperEntity}_REQUEST`]: `DELETE_${upperEntity}_REQUEST`,
    [`DELETE_${upperEntity}_SUCCESS`]: `DELETE_${upperEntity}_SUCCESS`,
    [`DELETE_${upperEntity}_FAILURE`]: `DELETE_${upperEntity}_FAILURE`,
    
    // State management
    [`SET_${upperEntity}_LOADING`]: `SET_${upperEntity}_LOADING`,
    [`SET_${upperEntity}_ERROR`]: `SET_${upperEntity}_ERROR`,
    [`CLEAR_${upperEntity}_ERROR`]: `CLEAR_${upperEntity}_ERROR`,
    [`RESET_${upperEntity}_STATE`]: `RESET_${upperEntity}_STATE`,
  };
};

// ========================================
// LEGACY EXPORTS FOR COMPATIBILITY
// ========================================
export const TASKS_ACTIONS = 'TASKS_ACTIONS';
export const STAFF_ACTIONS = 'STAFF_ACTIONS';
export const STAGES_ACTIONS = 'STAGES_ACTIONS';
export const ENTREGABLES_ACTIONS = 'ENTREGABLES_ACTIONS';

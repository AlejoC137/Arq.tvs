// ========================================
// UNIFIED ACTIONS EXPORT
// ========================================
// Este archivo centraliza todas las actions del sistema
// Importa y re-exporta todo desde los módulos especializados

import supabase from "../../config/supabaseClient";
import { GET_ALL_FROM_TABLE } from "../actionTypes";

// ========================================
// RE-EXPORT MODULAR ACTIONS
// ========================================

// Projects
export {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchProjectById,
  fetchProjectsWithStats,
  fetchActiveProjects,
  updateProjectStatus,
  assignResponsible,
  archiveProject,
  restoreProject,
  duplicateProject
} from './projectActions.js';

// Tasks
export {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchTaskById,
  updateTaskStatus,
  updateTaskPriority,
  assignTask,
  moveTaskToProject,
  setTaskStage,
  setTaskDueDate,
  fetchTasksByProject,
  fetchTasksByStaff,
  fetchTasksByStatus,
  fetchTasksByPriority,
  fetchOverdueTasks,
  fetchTasksDueThisWeek
} from './taskActions.js';

// Staff
export {
  fetchStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  fetchStaffById
} from './staffActions.js';

// Stages
export {
  fetchStages,
  createStage,
  updateStage,
  deleteStage,
  fetchStageById
} from './stagesActions.js';

// Entregables
export {
  fetchEntregables,
  createEntregable,
  updateEntregable,
  deleteEntregable,
  fetchEntregableById,
  // Aliases para compatibilidad
  createEntregable as createEntregableTemplate,
  updateEntregable as updateEntregableTemplate,
  deleteEntregable as deleteEntregableTemplate
} from './entregablesActions.js';

// Legacy Task exports
export { createTask as addTask } from './taskActions.js';

// ========================================
// GENERIC TABLE OPERATIONS (LEGACY SUPPORT)
// ========================================

/**
 * Generic function to get all data from any table
 * Útil para casos donde no existe un action específico
 */
export function getAllFromTable(tableName) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return dispatch({ 
        type: GET_ALL_FROM_TABLE, 
        payload: data, 
        path: tableName 
      });
    } catch (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      return null;
    }
  };
}

/**
 * Generic function to create in any table
 */
export function createInTable(tableName, data) {
  return async (dispatch) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      dispatch({
        type: 'CREATE_IN_TABLE',
        path: tableName,
        payload: result
      });
      
      return result;
    } catch (error) {
      console.error(`Error creating in ${tableName}:`, error);
      return null;
    }
  };
}

/**
 * Generic function to update in any table
 */
export function updateInTable(tableName, id, updates) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      dispatch({
        type: 'UPDATE_IN_TABLE',
        path: tableName,
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error(`Error updating in ${tableName}:`, error);
      return null;
    }
  };
}

/**
 * Generic function to delete from any table
 */
export function deleteFromTable(tableName, id) {
  return async (dispatch) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      dispatch({
        type: 'DELETE_FROM_TABLE',
        path: tableName,
        payload: id
      });
      
      return id;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return null;
    }
  };
}

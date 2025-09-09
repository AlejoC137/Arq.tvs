// actions.js
import supabase from "../config/supabaseClient";
import {
  GET_ALL_FROM_TABLE,
  CREATE_IN_TABLE,
  UPDATE_IN_TABLE,
  DELETE_FROM_TABLE,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  UPDATE_ACTIVE_TAB,
  UPDATE_CURRENT_VIEW,
  PROJECTS,
  TASKS,
  STAFF,
  STAGES,
  ENTREGABLES
} from "../store/actionTypes";

// ========================================
// FUNCIONES DE ACCIÓN
// ========================================

// Acción para obtener todos los datos de una tabla
export const getAllFromTable = (tableName) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    
    dispatch({
      type: GET_ALL_FROM_TABLE,
      path: tableName,
      payload: data
    });
    
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    dispatch({
      type: 'SET_ERROR',
      entity: tableName,
      payload: error.message
    });
  }
};

// Acción específica para obtener proyectos
export const getProjects = () => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('Proyectos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    dispatch({
      type: GET_ALL_FROM_TABLE,
      path: 'projects',
      payload: data
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    dispatch({
      type: 'SET_ERROR',
      entity: 'projects',
      payload: error.message
    });
  }
};

// Acción para crear un nuevo proyecto
export const createProject = (projectData) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();
    
    if (error) throw error;
    
    dispatch({
      type: 'CREATE_IN_TABLE',
      path: 'projects',
      payload: data[0]
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    dispatch({
      type: 'SET_ERROR',
      entity: 'projects',
      payload: error.message
    });
  }
};

// Acción para actualizar un proyecto
export const updateProject = (projectId, updates) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select();
    
    if (error) throw error;
    
    dispatch({
      type: 'UPDATE_IN_TABLE',
      path: 'projects',
      payload: { id: projectId, ...data[0] }
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    dispatch({
      type: 'SET_ERROR',
      entity: 'projects',
      payload: error.message
    });
  }
};

// Acción para eliminar un proyecto
export const deleteProject = (projectId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    
    dispatch({
      type: 'DELETE_FROM_TABLE',
      path: 'projects',
      payload: projectId
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    dispatch({
      type: 'SET_ERROR',
      entity: 'projects',
      payload: error.message
    });
  }
};

// ========================================
// FUNCIONES DE ACCIÓN ADICIONALES
// ========================================

// Acción para actualizar tab activo
export const updateActiveTab = (tabName) => ({
  type: UPDATE_ACTIVE_TAB,
  payload: tabName
});

// Acción para actualizar vista actual
export const updateCurrentView = (viewName) => ({
  type: UPDATE_CURRENT_VIEW,
  payload: viewName
});

// Acción para configurar loading
export const setLoading = (entity, loading) => ({
  type: SET_LOADING,
  entity,
  payload: loading
});

// Acción para configurar error
export const setError = (entity, error) => ({
  type: SET_ERROR,
  entity,
  payload: error
});

// Acción para limpiar error
export const clearError = (entity) => ({
  type: CLEAR_ERROR,
  entity
});


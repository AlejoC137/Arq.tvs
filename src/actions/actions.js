// ========================================
// LEGACY ACTIONS - REDIRECT TO MODULAR SYSTEM
// ========================================
// Este archivo redirige a las actions modulares.
// Usar en su lugar:
// import { fetchProjects, createProject } from '../store/actions';

import supabase from "../config/supabaseClient";
import {
  GET_ALL_FROM_TABLE,
  UPDATE_ACTIVE_TAB,
  UPDATE_CURRENT_VIEW
} from "../store/actionTypes";

// ========================================
// FUNCIONES DE ACCIÓN
// ========================================

// ========================================
// GENERIC TABLE OPERATIONS
// ========================================

/**
 * @deprecated Use entity-specific actions from store/actions/index.js
 */
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
    return null;
  }
};

// ========================================
// MATERIAL ACTIONS
// ========================================

export const updateMaterial = (id, updates) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('Material')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    dispatch({
      type: 'UPDATE_MATERIAL',
      payload: data
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error updating material:', error);
    return { success: false, error };
  }
};

// ========================================
// UI STATE ACTIONS
// ========================================

export const updateActiveTab = (tabName) => ({
  type: UPDATE_ACTIVE_TAB,
  payload: tabName
});

export const updateCurrentView = (viewName) => ({
  type: UPDATE_CURRENT_VIEW,
  payload: viewName
});


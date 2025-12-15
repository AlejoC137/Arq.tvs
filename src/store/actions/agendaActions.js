// ========================================
// AGENDA ACTIONS
// ========================================
// Operaciones CRUD para la tabla Agenda

import supabase from "../../config/supabaseClient";

// Action types
export const FETCH_AGENDA = 'FETCH_AGENDA';
export const CREATE_AGENDA = 'CREATE_AGENDA';
export const UPDATE_AGENDA = 'UPDATE_AGENDA';
export const DELETE_AGENDA = 'DELETE_AGENDA';

/**
 * Obtiene todos los eventos de agenda
 */
export function fetchAgenda() {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Agenda')
        .select('*')
        .order('fecha', { ascending: true });
      
      if (error) throw error;
      
      dispatch({
        type: FETCH_AGENDA,
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching agenda:', error);
      throw error;
    }
  };
}

/**
 * Obtiene un evento por ID
 */
export function fetchAgendaById(id) {
  return async () => {
    try {
      const { data, error } = await supabase
        .from('Agenda')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching agenda by id:', error);
      throw error;
    }
  };
}

/**
 * Crea un nuevo evento en agenda
 */
export function createAgenda(agendaData) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Agenda')
        .insert([agendaData])
        .select()
        .single();
      
      if (error) throw error;
      
      dispatch({
        type: CREATE_AGENDA,
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error('Error creating agenda:', error);
      throw error;
    }
  };
}

/**
 * Actualiza un evento existente
 */
export function updateAgenda(id, updates) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Agenda')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      dispatch({
        type: UPDATE_AGENDA,
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error('Error updating agenda:', error);
      throw error;
    }
  };
}

/**
 * Elimina un evento
 */
export function deleteAgenda(id) {
  return async (dispatch) => {
    try {
      const { error } = await supabase
        .from('Agenda')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      dispatch({
        type: DELETE_AGENDA,
        payload: id
      });
      
      return id;
    } catch (error) {
      console.error('Error deleting agenda:', error);
      throw error;
    }
  };
}

/**
 * Obtiene eventos por rango de fechas
 */
export function fetchAgendaByDateRange(startDate, endDate) {
  return async () => {
    try {
      const { data, error } = await supabase
        .from('Agenda')
        .select('*')
        .gte('fecha', startDate)
        .lte('fecha', endDate)
        .order('fecha', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching agenda by date range:', error);
      throw error;
    }
  };
}

/**
 * Obtiene eventos del mes actual
 */
export function fetchAgendaCurrentMonth() {
  return async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('Agenda')
        .select('*')
        .gte('fecha', startOfMonth.toISOString().split('T')[0])
        .lte('fecha', endOfMonth.toISOString().split('T')[0])
        .order('fecha', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching current month agenda:', error);
      throw error;
    }
  };
}

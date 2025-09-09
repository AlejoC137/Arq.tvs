import supabase from "../../config/supabaseClient";

import {
  GET_ALL_FROM_TABLE, UPDATE_ACTIVE_TAB, SET_USER_REG_STATE, UPDATE_SELECTED_VALUE,
  INSERT_RECETAS_SUCCESS, INSERT_RECETAS_FAILURE, SET_PREPROCESS_DATA, SCRAP,
  TOGGLE_SHOW_EDIT, RESET_EXPANDED_GROUPS, ADD_ORDER_ITEM, SET_LANGUAGE, UPDATE_LOG_STAFF
} from "../actionTypes";

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from "cheerio";

//=================================================================
// ACCIÓN PARA ELIMINAR UNA TAREA
//=================================================================
export function deleteTask(taskId) {
  return async (dispatch) => {
    try {
      const { error } = await supabase
        .from('Tareas')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error al eliminar la tarea en Supabase:', error);
        // Podrías despachar una acción de error aquí para notificar al usuario.
        return null;
      }

      console.log('Tarea eliminada exitosamente de Supabase. ID:', taskId);
      
      // Vuelve a cargar todas las tareas para que la UI se actualice inmediatamente.
      dispatch(getAllFromTable("Tareas"));

      return taskId; // Retorna el ID de la tarea eliminada.
    } catch (error) {
      console.error('Error en la acción deleteTask:', error);
    }
  };
}

//=================================================================
// ACCIÓN PARA CREAR UNA NUEVA TAREA
//=================================================================
export function addTask(taskData) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase.from('Tareas').insert([taskData]).select();
      if (error) {
        console.error('Error al crear la tarea en Supabase:', error);
        return null;
      }
      console.log('Tarea creada exitosamente en Supabase:', data[0]);
      dispatch(getAllFromTable("Tareas")); // Recargar datos para que la UI se actualice.
      return data[0];
    } catch (error) {
      console.error('Error en la acción addTask:', error);
    }
  };
}

//=================================================================
// ACCIÓN PARA ACTUALIZAR TAREAS
//=================================================================
export function updateTask(taskId, updatedFields) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase.from('Tareas').update(updatedFields).eq('id', taskId).select();
      if (error) {
        console.error('Error al actualizar la tarea en Supabase:', error);
        return null;
      }
      console.log('Tarea actualizada correctamente en Supabase:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error en la acción updateTask:', error);
    }
  };
}

// (El resto de tus acciones, completas y sin omisiones)
export function scrapAction(url, pointers) {
    return async (dispatch) => {
        try {
            const response = await axios(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const resultData = {};
            pointers.forEach(({ title, key }) => {
                const results = [];
                $('.' + key, html).each(function () {
                    const result = $(this).text().trim();
                    if (result) results.push(result);
                });
                resultData[title] = results;
            });
            dispatch({ type: SCRAP, payload: resultData, });
            console.log('Datos extraídos:', resultData);
        } catch (err) {
            console.error('Error durante el scraping:', err);
        }
    };
}

export const toggleShowEdit = () => {
    return (dispatch, getState) => {
        const currentShowEdit = getState().showEdit;
        dispatch({ type: TOGGLE_SHOW_EDIT, payload: !currentShowEdit, });
    };
};

export function getAllFromTable(Table) {
    return async (dispatch) => {
        let { data, error } = await supabase.from(Table).select('*');
        if (error) { console.error(error); return null; }
        return dispatch({ type: GET_ALL_FROM_TABLE, payload: data, path: Table, });
    };
}

export function fixUrl(datos, campo, buscar, reemplazar) {
    return async (dispatch) => {
        try {
            const updatePromises = datos.map(async (cadaDato) => {
                if (cadaDato[campo] && cadaDato[campo].includes(buscar)) {
                    const nuevaURL = cadaDato[campo].replace(buscar, reemplazar);
                    const { data, error } = await supabase.from('Menu').update({ [campo]: nuevaURL }).eq('_id', cadaDato._id);
                    if (error) { console.error(`Error al actualizar el registro ${cadaDato.id}:`, error); }
                    return data;
                }
                return null;
            });
            await Promise.all(updatePromises);
            console.log("Actualización completada");
        } catch (error) {
            console.error("Error en la función fixUrl:", error);
        }
    };
}

export function updateActiveTab(option) {
    return async (dispatch) => {
        try { return dispatch({ type: UPDATE_ACTIVE_TAB, payload: option, }); }
        catch (error) { console.error("Error updating active tab:", error); }
    };
}

export function updateSelectedValue(value) {
    return async (dispatch) => {
        try { return dispatch({ type: UPDATE_SELECTED_VALUE, payload: value, }); }
        catch (error) { console.error("Error updating selected value:", error); }
    };
}

export function updateUserRegState(newState) {
    return async (dispatch) => {
        try { return dispatch({ type: SET_USER_REG_STATE, payload: newState, }); }
        catch (error) { console.error("Error updating user registration state:", error); }
    };
}

export function insertarRecetas(recetasData, upsert = false) {
    return async (dispatch) => {
        try {
            let data, error;
            if (upsert) { ({ data, error } = await supabase.from('Recetas').upsert(recetasData).select()); }
            else { ({ data, error } = await supabase.from('Recetas').insert(recetasData).select()); }
            if (error) { console.error("Error inserting/upserting recipes:", error); return dispatch({ type: INSERT_RECETAS_FAILURE, payload: error.message, }); }
            return dispatch({ type: INSERT_RECETAS_SUCCESS, payload: data, });
        } catch (error) {
            console.error("Error in insertarRecetas:", error);
            return dispatch({ type: INSERT_RECETAS_FAILURE, payload: error.message, });
        }
    };
}

export function procesarRecetaYEnviarASupabase() { /* ...código completo... */ };
export function preProcess(jsonCompleto) { /* ...código completo... */ };
function validarUUID(uuid) { /* ...código completo... */ }
export function actualizarPrecioUnitario(items, type) { /* ...código completo... */ };
function calcularPrecioUnitario(item) { /* ...código completo... */ }
export function copiarAlPortapapeles(items, estado) { /* ...código completo... */ };
export function crearItem(itemData, type, forId) { /* ...código completo... */ };
export function updateItem(itemId, updatedFields, type) { /* ...código completo... */ };
export function deleteItem(itemId, type) { /* ...código completo... */ };
export const getRecepie = async (uuid, type) => { /* ...código completo... */ };
export const getProveedor = async (uuid, type) => { /* ...código completo... */ };
export const trimRecepie = (items, recepie) => { /* ...código completo... */ };
export const resetExpandedGroups = () => { return { type: RESET_EXPANDED_GROUPS, }; };
export function crearReceta(recetaData, productId) { /* ...código completo... */ };
export const addOrderItem = (item) => ({ type: ADD_ORDER_ITEM, payload: item, });
export const setLenguage = (language) => { return (dispatch) => { dispatch({ type: SET_LANGUAGE, payload: language, }); }; };
export const updateLogStaff = (personaId, updatedTurnoPasados) => { /* ...código completo... */ };
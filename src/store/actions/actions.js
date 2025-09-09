import supabase from "../../config/supabaseClient";

import {
  GET_ALL_FROM_TABLE,
  UPDATE_ACTIVE_TAB,
  SET_USER_REG_STATE,
  UPDATE_SELECTED_VALUE,
  INSERT_RECETAS_SUCCESS,
  INSERT_RECETAS_FAILURE,
  SET_PREPROCESS_DATA,
  SCRAP,
  TOGGLE_SHOW_EDIT,
  RESET_EXPANDED_GROUPS,
  ADD_ORDER_ITEM,
  SET_LANGUAGE,
  UPDATE_LOG_STAFF
} from "../actionTypes";

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from "cheerio";

//=================================================================
// ACCIÓN AÑADIDA PARA ACTUALIZAR TAREAS
//=================================================================
export function updateTask(taskId, updatedFields) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Tareas') // Nombre de tu tabla de tareas
        .update(updatedFields)
        .eq('id', taskId) // 'id' debe ser el nombre de tu columna de clave primaria
        .select();

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
//=================================================================


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

      dispatch({
        type: SCRAP,
        payload: resultData,
      });

      console.log('Datos extraídos:', resultData);
    } catch (err) {
      console.error('Error durante el scraping:', err);
    }
  };
}

export const toggleShowEdit = () => {
  return (dispatch, getState) => {
    const currentShowEdit = getState().showEdit;
    dispatch({
      type: TOGGLE_SHOW_EDIT,
      payload: !currentShowEdit,
    });
  };
};

export function getAllFromTable(Table) {
  return async (dispatch) => {
    let { data, error } = await supabase
      .from(Table)
      .select('*');

    if (error) {
      console.error(error);
      return null;
    }

    return dispatch({
      type: GET_ALL_FROM_TABLE,
      payload: data,
      path: Table,
    });
  };
}

export function fixUrl(datos, campo, buscar, reemplazar) {
  return async (dispatch) => {
    try {
      const updatePromises = datos.map(async (cadaDato) => {
        if (cadaDato[campo] && cadaDato[campo].includes(buscar)) {
          const nuevaURL = cadaDato[campo].replace(buscar, reemplazar);
          const { data, error } = await supabase
            .from('Menu')
            .update({ [campo]: nuevaURL })
            .eq('_id', cadaDato._id);

          if (error) {
            console.error(`Error al actualizar el registro ${cadaDato.id}:`, error);
          }
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
    try {
      return dispatch({
        type: UPDATE_ACTIVE_TAB,
        payload: option,
      });
    } catch (error) {
      console.error("Error updating active tab:", error);
    }
  };
}

export function updateSelectedValue(value) {
  return async (dispatch) => {
    try {
      return dispatch({
        type: UPDATE_SELECTED_VALUE,
        payload: value,
      });
    } catch (error) {
      console.error("Error updating selected value:", error);
    }
  };
}

export function updateUserRegState(newState) {
  return async (dispatch) => {
    try {
      return dispatch({
        type: SET_USER_REG_STATE,
        payload: newState,
      });
    } catch (error) {
      console.error("Error updating user registration state:", error);
    }
  };
}

export function insertarRecetas(recetasData, upsert = false) {
  return async (dispatch) => {
    try {
      let data, error;

      if (upsert) {
        ({ data, error } = await supabase
          .from('Recetas')
          .upsert(recetasData)
          .select());
      } else {
        ({ data, error } = await supabase
          .from('Recetas')
          .insert(recetasData)
          .select());
      }

      if (error) {
        console.error("Error inserting/upserting recipes:", error);
        return dispatch({
          type: INSERT_RECETAS_FAILURE,
          payload: error.message,
        });
      }

      return dispatch({
        type: INSERT_RECETAS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error("Error in insertarRecetas:", error);
      return dispatch({
        type: INSERT_RECETAS_FAILURE,
        payload: error.message,
      });
    }
  };
}

export function procesarRecetaYEnviarASupabase() {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const recetasPreProcess = state.preProcess;

      for (let e = 0; e < recetasPreProcess.length; e++) {
        const recetaJson = recetasPreProcess[e];
        if (!recetaJson || typeof recetaJson !== 'object' || !recetaJson.receta) {
          throw new Error('El JSON de receta no tiene la estructura esperada');
        }
        const receta = recetaJson.receta;
        const recetaParaSupabase = {};
        recetaParaSupabase._id = uuidv4();
        const menuItem = state.allMenu.find(item => item['NombreES'] === receta['nombre']);
        recetaParaSupabase.forId = menuItem && validarUUID(menuItem._id) ? menuItem._id : null;
        recetaParaSupabase.legacyName = receta.nombre;
        recetaParaSupabase.rendimiento = {
          porcion: receta.rendimiento_porcion || null,
          cantidad: receta.rendimiento_cantidad || null,
          unidades: receta.rendimiento_unidades || null,
        };
        recetaParaSupabase.emplatado = receta.emplatado || null;
        recetaParaSupabase.autor = receta.escrito || null;
        recetaParaSupabase.revisor = receta.revisado || null;
        recetaParaSupabase.actualizacion = receta.actualizacion || new Date().toISOString();

        if (receta.notas && Array.isArray(receta.notas)) {
          for (let i = 0; i < 10; i++) {
            const notaKey = `nota${i + 1}`;
            recetaParaSupabase[notaKey] = receta.notas[i] || null;
          }
        }

        if (receta.preparacion && Array.isArray(receta.preparacion)) {
          for (let i = 0; i < 20; i++) {
            const procesKey = `proces${i + 1}`;
            recetaParaSupabase[procesKey] = receta.preparacion[i] ? receta.preparacion[i].proceso : null;
          }
        }

        if (receta.ingredientes && Array.isArray(receta.ingredientes)) {
          for (let i = 0; i < 20; i++) {
            const ingrediente = receta.ingredientes[i];
            const itemIdKey = `item${i + 1}_Id`;
            const itemCuantityUnitsKey = `item${i + 1}_Cuantity_Units`;
            const productoInternoIdKey = `producto_interno${i + 1}_Id`;
            const productoInternoCuantityUnitsKey = `producto_interno${i + 1}_Cuantity_Units`;
            
            if (ingrediente) {
              const ingredienteEnItems = state.allItems.find(item => item['Nombre_del_producto'] === ingrediente.nombre);
              const ingredienteEnProduccion = state.allProduccion.find(item => item['Nombre_del_producto'] === ingrediente.nombre);
              if (ingredienteEnItems) {
                recetaParaSupabase[itemIdKey] = validarUUID(ingredienteEnItems._id) ? ingredienteEnItems._id : null;
                recetaParaSupabase[itemCuantityUnitsKey] = { metric: { cuantity: ingrediente.cantidad || null, units: ingrediente.unidades || null }, imperial: { cuantity: null, units: null }, legacyName:ingrediente.nombre };
              } else if (ingredienteEnProduccion) {
                recetaParaSupabase[productoInternoIdKey] = validarUUID(ingredienteEnProduccion._id) ? ingredienteEnProduccion._id : null;
                recetaParaSupabase[productoInternoCuantityUnitsKey] = { metric: { cuantity: ingrediente.cantidad || null, units: ingrediente.unidades || null }, imperial: { cuantity: null, units: null }, legacyName:ingrediente.nombre };
              }
              recetaParaSupabase.legacyName = receta.nombre;
            } else {
              recetaParaSupabase[itemIdKey] = null;
              recetaParaSupabase[itemCuantityUnitsKey] = null;
              recetaParaSupabase[productoInternoIdKey] = null;
              recetaParaSupabase[productoInternoCuantityUnitsKey] = null;
            }
          }
        }
        dispatch(insertarRecetas([recetaParaSupabase]));
      }
    } catch (error) {
      console.error('Error al procesar la receta y enviar a Supabase:', error);
    }
  };
}

export function preProcess(jsonCompleto) {
  return async (dispatch) => {
    try {
      if (!jsonCompleto || !Array.isArray(jsonCompleto)) {
        throw new Error("El JSON proporcionado no tiene la estructura esperada");
      }
      const recetasProcesadas = jsonCompleto
        .filter(elemento => elemento.receta)
        .map(elemento => {
          const receta = elemento.receta;
          const nombreReceta = elemento["NombreES"].replace(/^\.+|\.+$/g, "");
          return {
            receta: {
              ...receta,
              nombre: nombreReceta,
            }
          };
        });
      dispatch({
        type: SET_PREPROCESS_DATA,
        payload: recetasProcesadas,
      });
    } catch (error) {
      console.error('Error al preprocesar las recetas:', error);
    }
  };
}

function validarUUID(uuid) {
  if (typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

export function actualizarPrecioUnitario(items,type) {
  return async (dispatch) => {
    try {
      for (let item of items) {
        const precioUnitario = calcularPrecioUnitario(item);
        if (isNaN(precioUnitario) || precioUnitario === null) {
          console.error(`Error al calcular el precio unitario para el item con _id: ${item._id}`);
          continue;
        }
        console.log(`Actualizando el item con _id: ${item._id}, precioUnitario: ${precioUnitario}`);
        let { data, error } = await supabase
          .from(type)
          .update({ precioUnitario: precioUnitario })
          .eq('_id', item._id)
          .select();
        if (error) {
          console.error(`Error al actualizar el item con _id: ${item._id}`, error);
        } else {
          console.log(`Item actualizado correctamente: ${item._id}`, data);
        }
      }
    } catch (error) {
      console.error('Error en la función actualizarPrecioUnitario:', error);
    }
  };
}

function calcularPrecioUnitario(item) {
  let precioUnitario;
  const ajusteInflacionario = 1.04;
  if (item.COSTO === "NaN" || item.CANTIDAD === "NaN" || item.COOR === "NaN") {
    console.error("No se puede calcular el valor porque uno de los parámetros es NaN:", item);
    return "No se puede calcular el valor porque uno de los parámetros es NaN";
  }
  const costo = parseFloat(item.COSTO);
  const cantidad = parseFloat(item.CANTIDAD);
  const coor = parseFloat(item.COOR);
  precioUnitario = (costo / cantidad) * ajusteInflacionario * ( coor ? coor : 0);
  return parseFloat(precioUnitario.toFixed(2));
}

export function copiarAlPortapapeles(items, estado ) {
  return async () => {
    try {
      const elementosFiltrados = items.filter((item) => item.Estado === estado);
      if (elementosFiltrados.length === 0) {
        alert(`No se encontraron elementos con el estado "${estado}".`);
        return;
      }
      const textoParaCopiar = elementosFiltrados
        .map((item) => `- ${item.Nombre_del_producto}: ${item.CANTIDAD} ${item.UNIDADES}`)
        .join("\n");
      await navigator.clipboard.writeText(textoParaCopiar);
      alert(`Se han copiado ${elementosFiltrados.length} elementos con estado "${estado}" al portapapeles.`);
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      alert("Hubo un error al copiar al portapapeles.");
    }
  };
}

export function crearItem(itemData, type, forId) {
  return async (dispatch) => {
    try {
      let nuevoItem = { _id: uuidv4(), ...itemData };
      if (type === "RecetasProduccion") { 
        nuevoItem = { ...nuevoItem, forId: forId };
      }
      if (type !== 'RecetasProduccion') {
        nuevoItem = { ...nuevoItem, actualizacion: new Date().toISOString().split("T")[0] };
      }
      const { data, error } = await supabase
        .from(type)
        .insert([nuevoItem])
        .select();
      if (error) {
        console.error("Error al crear el ítem:", error);
        throw new Error("No se pudo crear el ítem");
      }
      dispatch({ type: "CREAR_ITEM_SUCCESS", payload: data[0] });
      console.log("Ítem creado correctamente:", data[0]);
      return data[0];
    } catch (error) {
      console.error("Error en la acción crearItem:", error);
      throw error;
    }
  };
}

export function updateItem(itemId, updatedFields, type) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from(type)
        .update(updatedFields)
        .eq('_id', itemId)
        .select();
      if (error) {
        console.error('Error al actualizar el ítem:', error);
        return null;
      }
      console.log('Ítem actualizado correctamente:', data);
      return data;
    } catch (error) {
      console.error('Error en la acción updateItem:', error);
    }
  };
}

export function deleteItem(itemId , type) {
  return async (dispatch) => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq("_id", itemId);
      if (error) {
        console.error("Error al eliminar el ítem:", error);
        throw new Error("No se pudo eliminar el ítem");
      }
      dispatch({ type: "DELETE_ITEM_SUCCESS", payload: itemId });
      console.log(`Ítem con ID ${itemId} eliminado correctamente.`);
    } catch (error) {
      console.error("Error en la acción deleteItem:", error);
      throw error;
    }
  };
}

export const getRecepie = async (uuid, type) => {
  try {
    const { data, error } = await supabase
      .from(type)
      .select("*")
      .eq("_id", uuid)
      .single();
    if (error) {
      console.error("Error al obtener la receta:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error en la acción getRecepie:", error);
    return null;
  }
};

export const getProveedor = async (uuid, type) => {
  try {
    const { data, error } = await supabase
      .from(type)
      .select("*")
      .eq("_id", uuid)
      .single();
    if (error) {
      console.error("Error al obtener el proveedor :", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error en la acción getProveedor:", error);
    return null;
  }
};

export const trimRecepie = (items, recepie) => {
  const buscarPorId = (id) => items.find((item) => item._id === id) || null;
  const clavesFiltradas = Object.keys(recepie).filter(
    (key) =>
      (key.startsWith("item") || key.startsWith("producto_interno")) &&
      (validarUUID(recepie[key]) || (typeof recepie[key] === 'object' && recepie[key] !== null && Object.values(recepie[key]).some(value => value !== "")))
  );
  const resultado = clavesFiltradas.map((key) => {
    const idValor = recepie[key];
    const cuantityKey = key.replace("_Id", "_Cuantity_Units");
    const cuantityValor = recepie[cuantityKey] ? JSON.parse(recepie[cuantityKey]).metric.cuantity : null;
    const unitsValor = recepie[cuantityKey] ? JSON.parse(recepie[cuantityKey]).metric.units : null;
    const resultadoBusqueda = buscarPorId(idValor);
    const precioUnitario1 = resultadoBusqueda.precioUnitario;
    return {
      name: resultadoBusqueda ? resultadoBusqueda.Nombre_del_producto : "",
      key:key,
      item_Id: idValor,
      precioUnitario :precioUnitario1,
      cuantity: cuantityValor || "",
      units: unitsValor || "",
      source: resultadoBusqueda ? (items.some(item => item._id === idValor) ? 'Items' : 'Produccion') : null
    };
  });
  return resultado;
};

export const resetExpandedGroups = () => {
  return {
    type: RESET_EXPANDED_GROUPS,
  };
};

export function crearReceta(recetaData, productId) {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Recetas')
        .insert([recetaData])
        .select();
      if (error) {
        console.error("Error al crear la receta:", error);
        throw new Error("No se pudo crear la receta");
      }
      await dispatch(updateItem(productId, { Receta: data[0]._id }, "Menu"));
      dispatch({ type: INSERT_RECETAS_SUCCESS, payload: data[0] });
      console.log("Receta creada correctamente:", data[0]);
      return data[0];
    } catch (error) {
      console.error("Error en la acción crearReceta:", error);
      throw error;
    }
  };
}

export const addOrderItem = (item) => ({
  type: ADD_ORDER_ITEM,
  payload: item,
});

export const setLenguage = (language) => {
  return (dispatch) => {
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
  };
};

export const updateLogStaff = (personaId, updatedTurnoPasados) => {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Staff')
        .update({ Turnos: updatedTurnoPasados })
        .eq('_id', personaId)
        .select();
      if (error) {
        throw error;
      }
      dispatch({
        type: UPDATE_LOG_STAFF,
        payload: { personaId, updatedTurnoPasados },
      });
      const { showSuccessToast } = await import('../../utils/toast');
      showSuccessToast('💾 Turno actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error updating shift log:', error.message);
      return false;
    }
  };
};
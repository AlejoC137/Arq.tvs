// ARCHIVO: src/constants/espacios.js
// Re-exporta el sistema modular de espacios para compatibilidad
// NOTA: Este archivo mantiene compatibilidad con código existente.
// Para nuevas implementaciones, usa espacios_index.js directamente

import {
  detectarCasa,
  getEspaciosPorCasa,
  getEspaciosPorProyecto as getEspaciosPorProyectoNuevo,
  getTodosLosEspacios,
  validarEspacio,
  getInfoCasa,
  listarCasas,
  ESPACIOS_CASA1,
  ESPACIOS_CASA2,
  ESPACIOS_CASA4
} from './espacios_index';

// Re-exportar todo
export {
  detectarCasa,
  getEspaciosPorCasa,
  getTodosLosEspacios,
  validarEspacio,
  getInfoCasa,
  listarCasas,
  ESPACIOS_CASA1,
  ESPACIOS_CASA2,
  ESPACIOS_CASA4
};

// ====================================
// FUNCIONES ADAPTADORAS PARA COMPATIBILIDAD
// ====================================

/**
 * Función adaptadora para compatibilidad con API anterior
 * Detecta automáticamente la casa y devuelve los espacios
 */
export function getEspaciosPorProyecto(input, includeMuebles = false) {
  return getEspaciosPorProyectoNuevo(input, { includeMuebles });
}

/**
 * DEPRECATED: Usa detectarCasa() en su lugar
 */
export function getCasaNumberFromProject(project) {
  console.warn('getCasaNumberFromProject() está deprecated. Usa detectarCasa() en su lugar.');
  return detectarCasa(project);
}

// Compatibilidad con código existente (DEPRECATED)
export const ESPACIOS_HABITACIONES = getTodosLosEspacios({ includeMuebles: true });

// Export por defecto
export default {
  detectarCasa,
  getEspaciosPorCasa,
  getEspaciosPorProyecto,
  getTodosLosEspacios,
  validarEspacio,
  getInfoCasa,
  listarCasas,
  getCasaNumberFromProject,
  ESPACIOS_CASA1,
  ESPACIOS_CASA2,
  ESPACIOS_CASA4,
  ESPACIOS_HABITACIONES
};

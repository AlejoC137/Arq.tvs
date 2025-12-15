// ARCHIVO: src/constants/espacios_index.js
// Sistema centralizado de gestión de espacios por casa

import ESPACIOS_CASA1 from './espacios_casa1';
import ESPACIOS_CASA2 from './espacios_casa2';
import ESPACIOS_CASA4 from './espacios_casa4';

// Registro centralizado de todas las casas
const CASAS_REGISTRY = {
  1: ESPACIOS_CASA1,
  2: ESPACIOS_CASA2,
  4: ESPACIOS_CASA4,
};

/**
 * Detecta el número de casa desde diferentes fuentes
 * @param {string|Object} input - Puede ser un string (nombre) o un objeto (proyecto/tarea)
 * @returns {number|null} Número de casa detectado
 */
export function detectarCasa(input) {
  let textoParaAnalizar = '';

  // Si es un objeto, extraer el nombre o campos relevantes
  if (typeof input === 'object' && input !== null) {
    textoParaAnalizar = [
      input.name,
      input.nombre,
      input.project_name,
      input.proyecto,
      input.tema,
      input.descripcion
    ]
      .filter(Boolean)
      .join(' ');
  } else if (typeof input === 'string') {
    textoParaAnalizar = input;
  }

  if (!textoParaAnalizar) return null;

  // Normalizar: lowercase y sin espacios
  const textoNormalizado = textoParaAnalizar.toLowerCase().replace(/\s+/g, '');

  // Buscar coincidencias en los identificadores de cada casa
  for (const [casaNum, casaData] of Object.entries(CASAS_REGISTRY)) {
    const identificadores = casaData.metadata.identificadores;

    for (const id of identificadores) {
      const idNormalizado = id.toLowerCase().replace(/\s+/g, '');
      if (textoNormalizado.includes(idNormalizado)) {
        return parseInt(casaNum, 10);
      }
    }
  }

  // Fallback: buscar patrón "casa" seguido de número
  const match = textoNormalizado.match(/casa(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (CASAS_REGISTRY[num]) {
      return num;
    }
  }

  return null;
}

/**
 * Obtiene todos los espacios de una casa específica
 * @param {number} casaNumber - Número de casa
 * @param {Object} options - Opciones: { piso: number, includeMuebles: boolean }
 * @returns {string[]} Array de espacios
 */
export function getEspaciosPorCasa(casaNumber, options = {}) {
  const { piso = null, includeMuebles = false } = options;

  const casa = CASAS_REGISTRY[casaNumber];
  if (!casa) {
    console.warn(`❌ Casa ${casaNumber} no está registrada en el sistema`);
    return [];
  }

  const result = [];

  // Si se especifica piso, solo devolver ese piso
  if (piso !== null) {
    const pisoKey = `piso${piso}`;
    const pisoData = casa[pisoKey];

    if (pisoData) {
      result.push(...pisoData.espacios);
      if (includeMuebles && pisoData.muebles) {
        result.push(...pisoData.muebles);
      }
    } else {
      console.warn(`❌ Piso ${piso} no existe en Casa ${casaNumber}`);
    }
  } else {
    // Devolver todos los pisos
    Object.entries(casa).forEach(([key, value]) => {
      if (key.startsWith('piso')) {
        result.push(...value.espacios);
        if (includeMuebles && value.muebles) {
          result.push(...value.muebles);
        }
      }
    });
  }

  return result;
}

/**
 * Obtiene espacios filtr ados automáticamente detectando la casa
 * @param {string|Object} input - Nombre de proyecto/tarea o objeto completo
 * @param {Object} options - Opciones: { piso: number, includeMuebles: boolean }
 * @returns {string[]} Array de espacios de la casa detectada
 */
export function getEspaciosPorProyecto(input, options = {}) {
  const casaNumber = detectarCasa(input);

  if (casaNumber === null) {
    console.warn('⚠️ No se pudo detectar la casa. Retornando todos los espacios.');
    return getTodosLosEspacios(options);
  }

  return getEspaciosPorCasa(casaNumber, options);
}

/**
 * Obtiene TODOS los espacios de TODAS las casas
 * @param {Object} options - Opciones: { includeMuebles: boolean }
 * @returns {string[]} Array con todos los espacios
 */
export function getTodosLosEspacios(options = {}) {
  const { includeMuebles = false } = options;
  const result = [];

  Object.keys(CASAS_REGISTRY).forEach(casaNum => {
    result.push(...getEspaciosPorCasa(parseInt(casaNum, 10), { includeMuebles }));
  });

  return result;
}

/**
 * Valida si un espacio pertenece a una casa específica
 * @param {string} espacioId - ID del espacio
 * @param {number} casaNumber - Número de casa
 * @returns {boolean} true si el espacio existe en esa casa
 */
export function validarEspacio(espacioId, casaNumber) {
  const espacios = getEspaciosPorCasa(casaNumber, { includeMuebles: true });
  return espacios.includes(espacioId);
}

/**
 * Obtiene información de una casa
 * @param {number} casaNumber - Número de casa
 * @returns {Object|null} Metadata de la casa o null
 */
export function getInfoCasa(casaNumber) {
  const casa = CASAS_REGISTRY[casaNumber];
  return casa ? casa.metadata : null;
}

/**
 * Lista todas las casas disponibles
 * @returns {Array} Array con información de todas las casas
 */
export function listarCasas() {
  return Object.entries(CASAS_REGISTRY).map(([num, casa]) => ({
    numero: parseInt(num, 10),
    ...casa.metadata,
    totalEspacios: getEspaciosPorCasa(parseInt(num, 10), { includeMuebles: true }).length
  }));
}

// Exports para compatibilidad con código existente
export { ESPACIOS_CASA1, ESPACIOS_CASA2, ESPACIOS_CASA4 };

// Export por defecto
export default {
  detectarCasa,
  getEspaciosPorCasa,
  getEspaciosPorProyecto,
  getTodosLosEspacios,
  validarEspacio,
  getInfoCasa,
  listarCasas,
  ESPACIOS_CASA1,
  ESPACIOS_CASA2,
  ESPACIOS_CASA4,
};

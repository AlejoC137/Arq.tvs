// ARCHIVO: src/constants/espacios.js

/**
 * Definición de espacios organizados por casa y piso.
 * Cada casa tiene su propio conjunto de espacios para evitar contaminación cruzada.
 */

// ====================================
// CASA 1 (Original)
// ====================================
export const ESPACIOS_CASA1 = {
  piso1: {
    espacios: [
      'HabitacionPrincipal',
      'Cocina',
      'BalconOficina',
      'Oficina',
      'ClosetHabitacionPrincipal',
      'Piscina',
      'Servicios',
      'BañoOficina',
      'BañoHabitacionPrincipal',
      'Escalera',
      'EstudioPiso1',
      'Sala',
      'Comedor',
      'JardinInterior',
      'Acceso',
      'Deck',
      'BañoServicio',
      'BañoSocial',
      'Jacuzzi',
      'CartPort',
      'Jardin',
    ],
    muebles: [
      'MuebleDespensa',
      'MuebleCocina',
      'MuebleRopas',
      'MuebleRopas-2',
      'ClosetServicio',
      'ClosetServicio-2',
      'MuebleBañoHabitacionPrincipal',
      'MuebleBañoSocial',
      'MuebleHabitacionPrincipal',
      'MuebleClosetHabitacionPrincipal',
      'MuebleClosetHabitacionPrincipal-2',
      'CocinetaOficina',
      'MuebleEstudioPiso1',
      'ClosetOficina',
      'MuebleEstudioPiso1-2',
      'MuebleEstudioPiso1-3',
    ],
  },
  piso2: {
    espacios: [
      'HabitacionAuxiliar1',
      'VestierHabitacionAuxiliar1',
      'EstudioPiso2',
      'HallPiso2',
      'HabitacionPrincipalPiso2',
      'ClosetHabitacionPrincipalPiso2',
      'HabitacionAuxiliar2',
      'TerrazaHabitacionPrincipalPiso2',
      'BañoHabitacionAuxiliar',
      'ClostHabitacionAuxiliar',
      'BañoHabitacionPrincipalPiso2',
      'BañoHabitacionAuxiliar1',
      'MuebleEstudioPiso2',
    ],
    muebles: [
      'MuebleVestierHabitacionAuxiliar1',
      'MuebleBañoHabitacionAuxiliar',
      'MuebleClostHabitacionAuxiliar',
      'MuebleClosetHabitacionPrincipalPiso2',
      'MuebleHabitacionAuxiliar1',
      'MuebleHabitacionAuxiliar2',
      'MuebleBañoHabitacionPrincipalPiso2',
    ],
  },
};

// ====================================
// CASA 2
// ====================================
export const ESPACIOS_CASA2 = {
  piso1: {
    espacios: [
      'DespensaC2',
      'CocinaC2',
      'ComedorC2',
      'BalconJacuzziC2',
      'SalaPrincipalC2',
      'HallPiso1C2',
      'ZonaDeRopasC2',
      'EstudioC2',
      'BañoSocialC2',
      'HabitacionServicioC2',
      'BañoServicioC2',
      'AccesoC2',
      'EscaleraC2',
    ],
    muebles: [],
  },
  piso2: {
    espacios: [
      'HallPiso2C2',
      'BañoHabitacionAuxiliar2C2',
      'VestierHabitacionAuxiliar2C2',
      'HabitacionAuxiliar2C2',
      'BañoHabitacionAuxiliar1C2',
      'HabitacionAuxiliar1C2',
      'BañoHabitacionPrincipalPiso2C2',
      'VestierHabitacionPrincipalPiso2C2',
      'HabitacionPrincipalPiso2C2',
      'BalconHabitacionPrincipalPiso2C2',
      'EscalerasC2',
    ],
    muebles: [],
  },
};

// ====================================
// CASA 4
// ====================================
export const ESPACIOS_CASA4 = {
  piso1: {
    espacios: [
      'CocinaComedor',
      'SalaAuxiliar',
      'SalaPrincipal',
      'BañoServicio',
      'HabitacionServicio',
      'BañoSocialPiso1',
      'Almacen',
      'ZonaDeRopas',
      'BalconJacuzzi',
      'Acceso',
    ],
    muebles: [],
  },
  piso2: {
    espacios: [
      'VestierHabitacionAuxiliar2',
      'BañoHabitacionAuxiliar2',
      'HabitacionAuxiliar2',
      'HallPiso2',
      'VestierHabitacionPrincipalPiso2',
      'BañoHabitacionAuxiliar1',
      'BalconHabitacionPrincipalPiso2',
      'BañoHabitacionPrincipalPiso2',
      'HabitacionPrincipalPiso2',
      'HabitacionAuxiliar1',
      'Escaleras',
    ],
    muebles: [],
  },
};

// ====================================
// UTILIDADES
// ====================================

/**
 * Obtiene todos los espacios de una casa específica
 * @param {number} casaNumber - Número de casa (1, 2, 4, etc.)
 * @param {number} [pisoNumber] - Número de piso opcional (1, 2). Si no se especifica, devuelve todos los pisos
 * @param {boolean} [includeMuebles=false] - Si se deben incluir muebles
 * @returns {string[]} Array con los nombres de los espacios
 */
export function getEspaciosPorCasa(casaNumber, pisoNumber = null, includeMuebles = false) {
  const casaMap = {
    1: ESPACIOS_CASA1,
    2: ESPACIOS_CASA2,
    4: ESPACIOS_CASA4,
  };

  const casa = casaMap[casaNumber];
  if (!casa) {
    console.warn(`Casa ${casaNumber} no encontrada en espacios.js`);
    return [];
  }

  const result = [];

  // Si se especifica un piso, solo devolver ese piso
  if (pisoNumber !== null) {
    const pisoKey = `piso${pisoNumber}`;
    const piso = casa[pisoKey];
    if (piso) {
      result.push(...piso.espacios);
      if (includeMuebles && piso.muebles) {
        result.push(...piso.muebles);
      }
    }
  } else {
    // Devolver todos los pisos
    Object.values(casa).forEach(piso => {
      result.push(...piso.espacios);
      if (includeMuebles && piso.muebles) {
        result.push(...piso.muebles);
      }
    });
  }

  return result;
}

/**
 * Valida si un espacio existe en una casa específica
 * @param {string} espacioId - ID del espacio a validar
 * @param {number} casaNumber - Número de casa
 * @returns {boolean} true si el espacio existe en la casa
 */
export function validarEspacio(espacioId, casaNumber) {
  const espacios = getEspaciosPorCasa(casaNumber, null, true);
  return espacios.includes(espacioId);
}

/**
 * Obtiene todos los espacios del proyecto (todas las casas)
 * @param {boolean} [includeMuebles=false] - Si se deben incluir muebles
 * @returns {string[]} Array con todos los nombres de espacios
 */
export function getTodosLosEspacios(includeMuebles = false) {
  const result = [];
  [1, 2, 4].forEach(casa => {
    result.push(...getEspaciosPorCasa(casa, null, includeMuebles));
  });
  return result;
}

/**
 * Extrae el número de casa de un objeto proyecto
 * @param {Object} project - Objeto proyecto con propiedad 'name'
 * @returns {number|null} Número de casa o null si no se puede determinar
 */
export function getCasaNumberFromProject(project) {
  if (!project || !project.name) return null;
  
  const projectKey = project.name.toLowerCase().replace(/\s+/g, '');
  
  // Detectar "casa2", "casa 2", "Casa2", etc.
  const match = projectKey.match(/casa(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  return null;
}

/**
 * Obtiene los espacios filtrados por proyecto
 * @param {Object} project - Objeto proyecto
 * @param {boolean} [includeMuebles=false] - Si se deben incluir muebles
 * @returns {string[]} Array con los espacios del proyecto
 */
export function getEspaciosPorProyecto(project, includeMuebles = false) {
  const casaNumber = getCasaNumberFromProject(project);
  
  // Si no se puede determinar la casa, devolver todos los espacios
  if (casaNumber === null) {
    return getTodosLosEspacios(includeMuebles);
  }
  
  return getEspaciosPorCasa(casaNumber, null, includeMuebles);
}

// Compatibilidad con código existente (DEPRECATED)
export const ESPACIOS_HABITACIONES = getTodosLosEspacios(true);

// Constantes para el campo Datos de Proyectos

/**
 * Categorías de materiales constantes que se pueden asignar a un proyecto
 */
export const CATEGORIAS_MATERIALES = [
  "Griferias",
  "Zocalos",
  "Pisos",
  "Enchufes",
  "Interruptores",
  "Luminarias",
  "Puertas",
  "Manijas",
  "Cerraduras",
  "Ventanas",
  "Cortinas",
  "Persianas",
  "Pintura",
  "Mesones",
  "Lavaplatos",
  "Sanitarios",
  "Duchas",
  "Espejos",
  "Gabinetes",
  "Closets"
];

/**
 * Etapas del proyecto
 */
export const ETAPAS_PROYECTO = [
  "Planificación",
  "En Diseño",
  "Construcción",
  "Finalización",
  "Completado",
  "Pausado",
  "Cancelado"
];

/**
 * Estructura inicial para el campo Datos
 */
export const DATOS_PROYECTO_INICIAL = {
  tareas: [],
  materialesConstantes: [],
  etapa: "Planificación",
  presentacionesEspacio: []
};

/**
 * Helper para parsear el campo Datos de un proyecto
 * @param {string|object} datos - El campo Datos del proyecto (string JSON o objeto)
 * @returns {object} El objeto parseado o estructura inicial si hay error
 */
export const parseDatosProyecto = (datos) => {
  if (!datos) {
    return { ...DATOS_PROYECTO_INICIAL };
  }
  
  if (typeof datos === 'string') {
    try {
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error al parsear Datos del proyecto:', error);
      return { ...DATOS_PROYECTO_INICIAL };
    }
  }
  
  return datos;
};

/**
 * Helper para stringificar los datos del proyecto
 * @param {object} datos - Objeto con los datos del proyecto
 * @returns {string} String JSON para guardar en Supabase
 */
export const stringifyDatosProyecto = (datos) => {
  try {
    return JSON.stringify(datos);
  } catch (error) {
    console.error('Error al stringificar Datos del proyecto:', error);
    return JSON.stringify(DATOS_PROYECTO_INICIAL);
  }
};

/**
 * Valida la estructura de un objeto de datos de proyecto
 * @param {object} datos - Datos a validar
 * @returns {boolean} true si es válido, false si no
 */
export const validarDatosProyecto = (datos) => {
  if (!datos || typeof datos !== 'object') {
    return false;
  }
  
  const requiredKeys = ['tareas', 'materialesConstantes', 'etapa', 'presentacionesEspacio'];
  
  for (const key of requiredKeys) {
    if (!(key in datos)) {
      return false;
    }
  }
  
  // Validar que tareas es un array
  if (!Array.isArray(datos.tareas)) {
    return false;
  }
  
  // Validar que materialesConstantes es un array
  if (!Array.isArray(datos.materialesConstantes)) {
    return false;
  }
  
  // Validar que presentacionesEspacio es un array
  if (!Array.isArray(datos.presentacionesEspacio)) {
    return false;
  }
  
  // Validar que etapa es un string
  if (typeof datos.etapa !== 'string') {
    return false;
  }
  
  return true;
};

// ========================================
// TABLE NAMES CONFIGURATION
// ========================================

/**
 * Configuration mapping for table names between code and Supabase
 * This handles the difference between English names used in code 
 * and Spanish names used in the actual database tables
 */

export const TABLE_NAMES = {
  // Code entity name -> Actual Supabase table name
  projects: 'Proyectos',
  tasks: 'Tareas', 
  staff: 'Staff',
  stages: 'Stages',
  entregables: 'entregables_template',
};

/**
 * Get the actual table name for Supabase queries
 * @param {string} entityName - The entity name used in code
 * @returns {string} - The actual table name in Supabase
 */
export const getTableName = (entityName) => {
  return TABLE_NAMES[entityName] || entityName;
};

/**
 * Get all configured table names
 * @returns {Object} - Object with all table name mappings
 */
export const getAllTableNames = () => {
  return { ...TABLE_NAMES };
};

/**
 * Check if a table name mapping exists
 * @param {string} entityName - The entity name to check
 * @returns {boolean} - Whether the mapping exists
 */
export const hasTableMapping = (entityName) => {
  return entityName in TABLE_NAMES;
};

// Export individual table names for convenience
export const {
  projects: PROJECTS_TABLE,
  tasks: TASKS_TABLE, 
  staff: STAFF_TABLE,
  stages: STAGES_TABLE,
  entregables: ENTREGABLES_TABLE,
} = TABLE_NAMES;

export default TABLE_NAMES;

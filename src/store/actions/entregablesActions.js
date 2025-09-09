import { createCrudActions, transformers, relationships } from './crudActions.js';
import supabase from '../../config/supabaseClient.js';

// ========================================
// ENTREGABLES-SPECIFIC CONFIGURATIONS
// ========================================

// Add entregables to relationships config
const entregablesRelationships = [
  { table: 'stages', fields: 'id,name' }
];

const entregablesTransformer = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...transformers.addTimestamps(item),
      ...transformers.formatForDisplay(item),
      // Entregables-specific transformations
      stageName: item.stages?.name || 'Sin etapa',
      softwareList: item.software_utilizado ? item.software_utilizado.split(',').map(s => s.trim()) : [],
      hasScale: !!item.escala_tipica,
      displayName: item.entregable_nombre || item.name || `Entregable ${item.id}`,
    }));
  }
  
  return {
    ...transformers.addTimestamps(data),
    ...transformers.formatForDisplay(data),
    stageName: data.stages?.name || 'Sin etapa',
    softwareList: data.software_utilizado ? data.software_utilizado.split(',').map(s => s.trim()) : [],
    hasScale: !!data.escala_tipica,
    displayName: data.entregable_nombre || data.name || `Entregable ${data.id}`,
  };
};

// ========================================
// CREATE ENTREGABLES ACTIONS USING FACTORY
// ========================================

const entregablesActions = createCrudActions('entregables', null, {
  selectFields: '*',
  relationships: entregablesRelationships,
  orderBy: 'entregable_nombre',
  orderDirection: 'asc',
  transformData: entregablesTransformer,
});

// ========================================
// EXPORT ALL ENTREGABLES ACTIONS
// ========================================

// Basic CRUD operations
export const {
  // Fetch operations
  fetchAll: fetchEntregables,
  fetchById: fetchEntregableById,
  
  // Create operations
  create: createEntregable,
  
  // Update operations
  update: updateEntregable,
  
  // Delete operations
  delete: deleteEntregable,
  
  // Bulk operations
  bulkCreate: bulkCreateEntregables,
  bulkUpdate: bulkUpdateEntregables,
  bulkDelete: bulkDeleteEntregables,
  
  // Utility operations
  count: countEntregables,
  search: searchEntregables,
  
  // State management
  setLoading: setEntregablesLoading,
  setError: setEntregablesError,
  clearError: clearEntregablesError,
  resetState: resetEntregablesState,
  
  // Action types reference
  actionTypes: entregablesActionTypes,
} = entregablesActions;

// ========================================
// ENTREGABLES-SPECIFIC ACTIONS
// ========================================

// Get entregables by stage
export const fetchEntregablesByStage = (stageId) => {
  return fetchEntregables({ Stage_id: stageId });
};

// Get entregables by type
export const fetchEntregablesByType = (tipo) => {
  return fetchEntregables({ tipo });
};

// Get entregables by software
export const fetchEntregablesBySoftware = (software) => {
  return fetchEntregables({ software_utilizado: software });
};

// Get entregables by vista type
export const fetchEntregablesByVistaType = (vistaTipo) => {
  return fetchEntregables({ vistaTipo });
};

// Search entregables by name
export const searchEntregablesByName = (searchTerm) => {
  return async (dispatch) => {
    dispatch(entregablesActions.fetchRequest());
    
    try {
      const { data, error } = await supabase
        .from('entregables_template')
        .select(`
          *,
          stages (
            id,
            name
          )
        `)
        .ilike('entregable_nombre', `%${searchTerm}%`)
        .order('entregable_nombre');
      
      if (error) throw error;
      
      dispatch(entregablesActions.fetchSuccess(entregablesTransformer(data || [])));
      return { success: true, data };
    } catch (error) {
      console.error('Error searching entregables by name:', error);
      dispatch(entregablesActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Get entregables with stage statistics
export const fetchEntregablesWithStats = () => {
  return async (dispatch) => {
    dispatch(entregablesActions.fetchRequest());
    
    try {
      const { data, error } = await supabase
        .from('entregables_template')
        .select(`
          *,
          stages (
            id,
            name
          )
        `)
        .order('entregable_nombre');
      
      if (error) throw error;
      
      // Group by stage and add statistics
      const entregablesWithStats = data.map(entregable => ({
        ...entregable,
        softwareCount: entregable.software_utilizado ? 
          entregable.software_utilizado.split(',').length : 0,
        hasCompleteInfo: !!(entregable.tipo && entregable.vistaTipo && entregable.software_utilizado),
      }));
      
      dispatch(entregablesActions.fetchSuccess(entregablesTransformer(entregablesWithStats)));
      return { success: true, data: entregablesWithStats };
    } catch (error) {
      console.error('Error fetching entregables with stats:', error);
      dispatch(entregablesActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Duplicate entregable
export const duplicateEntregable = (entregableId, newData = {}) => {
  return async (dispatch) => {
    try {
      // First, fetch the original entregable
      const originalResult = await dispatch(fetchEntregableById(entregableId));
      if (!originalResult.success) {
        return originalResult;
      }
      
      const original = originalResult.data;
      
      // Create new entregable with modified data
      const duplicatedData = {
        entregable_nombre: `${original.entregable_nombre} (Copia)`,
        tipo: original.tipo,
        vistaTipo: original.vistaTipo,
        escala_tipica: original.escala_tipica,
        software_utilizado: original.software_utilizado,
        Stage_id: original.Stage_id,
        vistaSubTipo: original.vistaSubTipo,
        ...newData, // Allow overriding any fields
      };
      
      return dispatch(createEntregable(duplicatedData));
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

// Update entregable stage
export const updateEntregableStage = (entregableId, stageId) => {
  return updateEntregable(entregableId, { Stage_id: stageId });
};

// Legacy exports for backward compatibility
export const fetchEntregablesRequest = entregablesActions.fetchRequest;
export const fetchEntregablesSuccess = entregablesActions.fetchSuccess;
export const fetchEntregablesFailure = entregablesActions.fetchFailure;
export const addEntregable = entregablesActions.createSuccess;
export const updateEntregableData = updateEntregable;
export const deleteEntregableData = deleteEntregable;

import { createCrudActions, transformers, relationships } from './crudActions.js';
import { STAGES_ACTIONS } from '../actionTypes.js';
import supabase from '../../config/supabaseClient.js';

// ========================================
// STAGES-SPECIFIC CONFIGURATIONS
// ========================================

const stageTransformer = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...transformers.addTimestamps(item),
      ...transformers.formatForDisplay(item),
      // Stage-specific transformations
      tasksCount: item.tasks?.length || 0,
      isActive: item.status !== 'Inactivo',
      orderIndex: item.order_index || 0,
    }));
  }
  
  return {
    ...transformers.addTimestamps(data),
    ...transformers.formatForDisplay(data),
    tasksCount: data.tasks?.length || 0,
    isActive: data.status !== 'Inactivo',
    orderIndex: data.order_index || 0,
  };
};

// ========================================
// CREATE STAGE ACTIONS USING FACTORY
// ========================================

const stageActions = createCrudActions('stages', null, {
  selectFields: '*',
  relationships: relationships.stages,
  orderBy: 'name',
  orderDirection: 'asc',
  transformData: stageTransformer,
});

// ========================================
// EXPORT ALL STAGE ACTIONS
// ========================================

// Basic CRUD operations
export const {
  // Fetch operations
  fetchAll: fetchStages,
  fetchById: fetchStageById,
  
  // Create operations
  create: createStage,
  
  // Update operations
  update: updateStage,
  
  // Delete operations
  delete: deleteStage,
  
  // Bulk operations
  bulkCreate: bulkCreateStages,
  bulkUpdate: bulkUpdateStages,
  bulkDelete: bulkDeleteStages,
  
  // Utility operations
  count: countStages,
  search: searchStages,
  
  // State management
  setLoading: setStagesLoading,
  setError: setStagesError,
  clearError: clearStagesError,
  resetState: resetStagesState,
  
  // Action types reference
  actionTypes: stageActionTypes,
} = stageActions;

// ========================================
// STAGE-SPECIFIC ACTIONS
// ========================================

// Get stages with their tasks
export const fetchStagesWithTasks = () => {
  return async (dispatch) => {
    dispatch(stageActions.fetchRequest());
    
    try {
      const { data, error } = await supabase
        .from('Stages')
        .select(`
          *,
          tasks!inner(
            id,
            task_description,
            status,
            priority,
            staff(name),
            projects(name)
          )
        `)
        .order('order_index');
      
      if (error) throw error;
      
      dispatch(stageActions.fetchSuccess(stageTransformer(data || [])));
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching stages with tasks:', error);
      dispatch(stageActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Update stage order
export const updateStageOrder = (stageId, newOrder) => {
  return updateStage(stageId, { order_index: newOrder });
};

// Reorder stages
export const reorderStages = (stages) => {
  return async (dispatch) => {
    try {
      const updates = stages.map((stage, index) => ({
        id: stage.id,
        data: { order_index: index + 1 }
      }));
      
      const result = await dispatch(stageActions.bulkUpdate(updates));
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

// Get active stages only
export const fetchActiveStages = () => {
  return fetchStages({ status: 'Activo' });
};

// Activate stage
export const activateStage = (stageId) => {
  return updateStage(stageId, { status: 'Activo' });
};

// Deactivate stage
export const deactivateStage = (stageId) => {
  return updateStage(stageId, { status: 'Inactivo' });
};

// Get stage statistics
export const getStageStatistics = (stageId) => {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Tareas')
        .select('id, status, priority, created_at')
        .eq('stage_id', stageId);
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        pending: data.filter(t => t.status === 'Pendiente').length,
        inProgress: data.filter(t => t.status === 'En Progreso').length,
        completed: data.filter(t => t.status === 'Completo').length,
        highPriority: data.filter(t => 
          t.priority === 'Alta' || t.priority === 'Crítica'
        ).length,
        completionRate: data.length > 0 ? 
          Math.round((data.filter(t => t.status === 'Completo').length / data.length) * 100) : 0
      };
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting stage statistics:', error);
      return { success: false, error: error.message };
    }
  };
};

// Move tasks between stages
export const moveTasksBetweenStages = (fromStageId, toStageId, taskIds) => {
  return async (dispatch) => {
    try {
      const updates = taskIds.map(taskId => ({
        id: taskId,
        data: { stage_id: toStageId }
      }));
      
      // This would need the task actions to be available
      // For now, we'll do a direct update
      const { error } = await supabase
        .from('Tareas')
        .update({ stage_id: toStageId })
        .in('id', taskIds);
      
      if (error) throw error;
      
      return { success: true, movedTasks: taskIds };
    } catch (error) {
      console.error('Error moving tasks between stages:', error);
      return { success: false, error: error.message };
    }
  };
};

// Export action types for use in reducers
export { STAGES_ACTIONS } from '../actionTypes.js';

// Legacy exports for backward compatibility
export const fetchStagesRequest = stageActions.fetchRequest;
export const fetchStagesSuccess = stageActions.fetchSuccess;
export const fetchStagesFailure = stageActions.fetchFailure;
export const addStage = stageActions.createSuccess;
export const updateStageData = updateStage;
export const deleteStageData = deleteStage;

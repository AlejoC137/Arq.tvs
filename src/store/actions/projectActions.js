import { createCrudActions, transformers, relationships } from './crudActions.js';
import supabase from '../../config/supabaseClient.js';

// ========================================
// PROJECT-SPECIFIC CONFIGURATIONS
// ========================================

const projectTransformer = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...transformers.addTimestamps(item),
      ...transformers.formatForDisplay(item),
      // Project-specific transformations
      statusColor: getStatusColor(item.status),
      isActive: item.status === 'Activo' || item.status === 'En Progreso',
      responsiblePerson: item.resp || 'Sin asignar',
    }));
  }
  
  return {
    ...transformers.addTimestamps(data),
    ...transformers.formatForDisplay(data),
    statusColor: getStatusColor(data.status),
    isActive: data.status === 'Activo' || data.status === 'En Progreso',
    responsiblePerson: data.resp || 'Sin asignar',
  };
};

const getStatusColor = (status) => {
  const colors = {
    'Activo': 'green',
    'En Progreso': 'blue',
    'Completado': 'gray',
    'Pausado': 'yellow',
    'Cancelado': 'red',
  };
  return colors[status] || 'gray';
};

// ========================================
// CREATE PROJECT ACTIONS USING FACTORY
// ========================================

const projectActions = createCrudActions('projects', null, {
  selectFields: '*',
  relationships: relationships.projects,
  orderBy: 'name',
  orderDirection: 'asc',
  transformData: projectTransformer,
});

// ========================================
// EXPORT ALL PROJECT ACTIONS
// ========================================

// Basic CRUD operations
export const {
  // Fetch operations
  fetchAll: fetchProjects,
  fetchById: fetchProjectById,
  
  // Create operations
  create: createProject,
  
  // Update operations
  update: updateProject,
  
  // Delete operations
  delete: deleteProject,
  
  // Bulk operations
  bulkCreate: bulkCreateProjects,
  bulkUpdate: bulkUpdateProjects,
  bulkDelete: bulkDeleteProjects,
  
  // Utility operations
  count: countProjects,
  search: searchProjects,
  
  // State management
  setLoading: setProjectsLoading,
  setError: setProjectsError,
  clearError: clearProjectsError,
  resetState: resetProjectsState,
  
  // Action types reference
  actionTypes: projectActionTypes,
} = projectActions;

// ========================================
// PROJECT-SPECIFIC ACTIONS
// ========================================

// Get projects with statistics
export const fetchProjectsWithStats = () => {
  return async (dispatch) => {
    dispatch(projectActions.fetchRequest());
    
    try {
      const { data, error } = await supabase
        .from('Proyectos')
        .select(`
          *,
          tasks!inner(
            id,
            status
          )
        `)
        .order('name');
      
      if (error) throw error;
      
      // Calculate statistics for each project
      const projectsWithStats = data.map(project => {
        const tasks = project.tasks || [];
        return {
          ...project,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Completo').length,
          pendingTasks: tasks.filter(t => t.status === 'Pendiente').length,
          inProgressTasks: tasks.filter(t => t.status === 'En Progreso').length,
          completionRate: tasks.length > 0 ? 
            Math.round((tasks.filter(t => t.status === 'Completo').length / tasks.length) * 100) : 0
        };
      });
      
      dispatch(projectActions.fetchSuccess(projectTransformer(projectsWithStats)));
      return { success: true, data: projectsWithStats };
    } catch (error) {
      console.error('Error fetching projects with stats:', error);
      dispatch(projectActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Get active projects only
export const fetchActiveProjects = () => {
  return fetchProjects({ 
    status: 'Activo' 
  });
};

// Update project status
export const updateProjectStatus = (projectId, status) => {
  return updateProject(projectId, { status });
};

// Assign responsible person
export const assignResponsible = (projectId, responsible) => {
  return updateProject(projectId, { resp: responsible });
};

// Archive project (soft delete)
export const archiveProject = (projectId) => {
  return updateProject(projectId, { 
    status: 'Archivado',
    archived_at: new Date().toISOString()
  });
};

// Restore archived project
export const restoreProject = (projectId) => {
  return updateProject(projectId, { 
    status: 'Activo',
    archived_at: null
  });
};

// Duplicate project
export const duplicateProject = (projectId, newData = {}) => {
  return async (dispatch) => {
    try {
      // First, fetch the original project
      const originalResult = await dispatch(fetchProjectById(projectId));
      if (!originalResult.success) {
        return originalResult;
      }
      
      const original = originalResult.data;
      
      // Create new project with modified data
      const duplicatedData = {
        name: `${original.name} (Copia)`,
        status: 'Activo',
        resp: original.resp,
        ...newData, // Allow overriding any fields
      };
      
      return dispatch(createProject(duplicatedData));
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

// Note: action type constants for generic tables live in `actionTypes.js`.
// This file exports its own `projectActionTypes` (from the factory) where needed.

// Legacy exports for backward compatibility
export const fetchProjectsRequest = projectActions.fetchRequest;
export const fetchProjectsSuccess = projectActions.fetchSuccess;
export const fetchProjectsFailure = projectActions.fetchFailure;
export const addProject = projectActions.createSuccess;
export const updateProjectData = updateProject;
export const deleteProjectData = deleteProject;

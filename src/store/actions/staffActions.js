import { createCrudActions, transformers, relationships } from './crudActions.js';
import { STAFF_ACTIONS } from '../actionTypes.js';
import supabase from '../../config/supabaseClient.js';

// ========================================
// STAFF-SPECIFIC CONFIGURATIONS
// ========================================

const staffTransformer = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...transformers.addTimestamps(item),
      ...transformers.formatForDisplay(item),
      ...transformers.addFullName(item),
      // Staff-specific transformations
      initials: getInitials(item.name),
      isActive: item.status !== 'Inactivo',
      tasksCount: item.tasks?.length || 0,
      projectsCount: item.projects?.length || 0,
    }));
  }
  
  return {
    ...transformers.addTimestamps(data),
    ...transformers.formatForDisplay(data),
    ...transformers.addFullName(data),
    initials: getInitials(data.name),
    isActive: data.status !== 'Inactivo',
    tasksCount: data.tasks?.length || 0,
    projectsCount: data.projects?.length || 0,
  };
};

const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// ========================================
// CREATE STAFF ACTIONS USING FACTORY
// ========================================

const staffActions = createCrudActions('staff', null, {
  selectFields: '*',
  relationships: relationships.staff,
  orderBy: 'name',
  orderDirection: 'asc',
  transformData: staffTransformer,
});

// ========================================
// EXPORT ALL STAFF ACTIONS
// ========================================

// Basic CRUD operations
export const {
  // Fetch operations
  fetchAll: fetchStaff,
  fetchById: fetchStaffById,
  
  // Create operations
  create: createStaff,
  
  // Update operations
  update: updateStaff,
  
  // Delete operations
  delete: deleteStaff,
  
  // Bulk operations
  bulkCreate: bulkCreateStaff,
  bulkUpdate: bulkUpdateStaff,
  bulkDelete: bulkDeleteStaff,
  
  // Utility operations
  count: countStaff,
  search: searchStaff,
  
  // State management
  setLoading: setStaffLoading,
  setError: setStaffError,
  clearError: clearStaffError,
  resetState: resetStaffState,
  
  // Action types reference
  actionTypes: staffActionTypes,
} = staffActions;

// ========================================
// STAFF-SPECIFIC ACTIONS
// ========================================

// Get staff with their tasks
export const fetchStaffWithTasks = () => {
  return async (dispatch) => {
    dispatch(staffActions.fetchRequest());
    
    try {
      const { data, error } = await supabase
        .from('Staff')
        .select(`
          *,
          tasks!inner(
            id,
            task_description,
            status,
            priority,
            due_date,
            projects(name)
          )
        `)
        .order('name');
      
      if (error) throw error;
      
      dispatch(staffActions.fetchSuccess(staffTransformer(data || [])));
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching staff with tasks:', error);
      dispatch(staffActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Get active staff only
export const fetchActiveStaff = () => {
  return fetchStaff({ status: 'Activo' });
};

// Activate staff member
export const activateStaffMember = (staffId) => {
  return updateStaff(staffId, { status: 'Activo' });
};

// Deactivate staff member
export const deactivateStaffMember = (staffId) => {
  return updateStaff(staffId, { status: 'Inactivo' });
};

// Update staff role
export const updateStaffRole = (staffId, role) => {
  return updateStaff(staffId, { role });
};

// Update staff contact info
export const updateStaffContact = (staffId, contactInfo) => {
  return updateStaff(staffId, {
    email: contactInfo.email,
    phone: contactInfo.phone,
    address: contactInfo.address,
  });
};

// Get staff workload (tasks by status)
export const getStaffWorkload = (staffId) => {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase
        .from('Tareas')
        .select('id, status, priority, due_date')
        .eq('staff_id', staffId);
      
      if (error) throw error;
      
      const workload = {
        total: data.length,
        pending: data.filter(t => t.status === 'Pendiente').length,
        inProgress: data.filter(t => t.status === 'En Progreso').length,
        completed: data.filter(t => t.status === 'Completo').length,
        overdue: data.filter(t => 
          t.due_date && 
          new Date(t.due_date) < new Date() && 
          t.status !== 'Completo'
        ).length,
        highPriority: data.filter(t => 
          t.priority === 'Alta' || t.priority === 'Crítica'
        ).length,
      };
      
      return { success: true, data: workload };
    } catch (error) {
      console.error('Error getting staff workload:', error);
      return { success: false, error: error.message };
    }
  };
};

// Export action types for use in reducers
export { STAFF_ACTIONS } from '../actionTypes.js';

// Legacy exports for backward compatibility
export const fetchStaffRequest = staffActions.fetchRequest;
export const fetchStaffSuccess = staffActions.fetchSuccess;
export const fetchStaffFailure = staffActions.fetchFailure;
export const addStaff = staffActions.createSuccess;
export const updateStaffData = updateStaff;
export const deleteStaffData = deleteStaff;

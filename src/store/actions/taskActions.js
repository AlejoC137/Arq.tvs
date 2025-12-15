import { createCrudActions, transformers, relationships } from './crudActions.js';
import { TASKS_ACTIONS } from '../actionTypes.js';
import supabase from '../../config/supabaseClient.js';

// ========================================
// TASK-SPECIFIC CONFIGURATIONS
// ========================================

const taskTransformer = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...transformers.addTimestamps(item),
      ...transformers.formatForDisplay(item),
      // Task-specific transformations
      statusColor: getTaskStatusColor(item.status),
      priorityColor: getPriorityColor(item.priority),
      isOverdue: isTaskOverdue(item.due_date),
      projectName: item.projects?.name || 'Sin proyecto',
      assigneeName: item.staff?.name || 'Sin asignar',
      stageName: item.stages?.name || 'Sin etapa',
      taskDescription: item.tema || item.description || '',
    }));
  }

  return {
    ...transformers.addTimestamps(data),
    ...transformers.formatForDisplay(data),
    statusColor: getTaskStatusColor(data.status),
    priorityColor: getPriorityColor(data.priority),
    isOverdue: isTaskOverdue(data.due_date),
    projectName: data.projects?.name || 'Sin proyecto',
    assigneeName: data.staff?.name || 'Sin asignar',
    stageName: data.stages?.name || 'Sin etapa',
    taskDescription: data.tema || data.description || '',
  };
};

const getTaskStatusColor = (status) => {
  const colors = {
    'Pendiente': 'gray',
    'En Progreso': 'blue',
    'En Diseño': 'purple',
    'Aprobación Requerida': 'orange',
    'Bloqueado': 'red',
    'Completo': 'green',
  };
  return colors[status] || 'gray';
};

const getPriorityColor = (priority) => {
  const colors = {
    'Baja': 'green',
    'Media': 'yellow',
    'Alta': 'orange',
    'Crítica': 'red',
  };
  return colors[priority] || 'gray';
};

const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// ========================================
// CREATE TASK ACTIONS USING FACTORY
// ========================================

const taskActions = createCrudActions('tasks', null, {
  selectFields: '*',
  relationships: relationships.tasks,
  orderBy: 'id',
  orderDirection: 'asc',
  transformData: taskTransformer,
});

// ========================================
// EXPORT ALL TASK ACTIONS
// ========================================

// Basic CRUD operations
export const {
  // Fetch operations
  fetchAll: fetchTasks,
  fetchById: fetchTaskById,

  // Create operations
  create: createTask,

  // Update operations
  update: updateTask,

  // Delete operations
  delete: deleteTask,

  // Bulk operations
  bulkCreate: bulkCreateTasks,
  bulkUpdate: bulkUpdateTasks,
  bulkDelete: bulkDeleteTasks,

  // Utility operations
  count: countTasks,
  search: searchTasks,

  // State management
  setLoading: setTasksLoading,
  setError: setTasksError,
  clearError: clearTasksError,
  resetState: resetTasksState,

  // Action types reference
  actionTypes: taskActionTypes,
} = taskActions;

// ========================================
// TASK-SPECIFIC ACTIONS
// ========================================

// Update task status only
export const updateTaskStatus = (taskId, status) => {
  return updateTask(taskId, { status });
};

// Update task priority
export const updateTaskPriority = (taskId, priority) => {
  return updateTask(taskId, { priority });
};

// Assign task to staff member
export const assignTask = (taskId, staffId) => {
  return updateTask(taskId, { staff_id: staffId });
};

// Move task to project
export const moveTaskToProject = (taskId, projectId) => {
  return updateTask(taskId, { project_id: projectId });
};

// Set task stage
export const setTaskStage = (taskId, stageId) => {
  return updateTask(taskId, { stage_id: stageId });
};

// Set task due date
export const setTaskDueDate = (taskId, dueDate) => {
  return updateTask(taskId, { due_date: dueDate });
};

// Get tasks by project
export const fetchTasksByProject = (projectId) => {
  return fetchTasks({ project_id: projectId });
};

// Get tasks by staff member
export const fetchTasksByStaff = (staffId) => {
  return fetchTasks({ staff_id: staffId });
};

// Get tasks by status
export const fetchTasksByStatus = (status) => {
  return fetchTasks({ status });
};

// Get tasks by priority
export const fetchTasksByPriority = (priority) => {
  return fetchTasks({ priority });
};

// Get overdue tasks
export const fetchOverdueTasks = () => {
  return async (dispatch) => {
    dispatch(taskActions.fetchRequest());

    try {
      const { data, error } = await supabase
        .from('Tareas')
        .select(relationships.tasks.length > 0 ?
          `*, ${relationships.tasks.map(rel => `${rel.table}(${rel.fields})`).join(',')}` :
          '*'
        )
        .lt('due_date', new Date().toISOString())
        .neq('status', 'Completo')
        .order('due_date', { ascending: true });

      if (error) throw error;

      dispatch(taskActions.fetchSuccess(taskTransformer(data || [])));
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      dispatch(taskActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Get tasks due this week
export const fetchTasksDueThisWeek = () => {
  return async (dispatch) => {
    dispatch(taskActions.fetchRequest());

    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const { data, error } = await supabase
        .from('Tareas')
        .select(relationships.tasks.length > 0 ?
          `*, ${relationships.tasks.map(rel => `${rel.table}(${rel.fields})`).join(',')}` :
          '*'
        )
        .gte('due_date', today.toISOString())
        .lte('due_date', nextWeek.toISOString())
        .neq('status', 'Completo')
        .order('due_date', { ascending: true });

      if (error) throw error;

      dispatch(taskActions.fetchSuccess(taskTransformer(data || [])));
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching tasks due this week:', error);
      dispatch(taskActions.fetchFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

// Complete task
export const completeTask = (taskId) => {
  return updateTask(taskId, {
    status: 'Completo',
    completed_at: new Date().toISOString()
  });
};

// Reopen task
export const reopenTask = (taskId) => {
  return updateTask(taskId, {
    status: 'Pendiente',
    completed_at: null
  });
};

// Duplicate task
export const duplicateTask = (taskId, newData = {}) => {
  return async (dispatch) => {
    try {
      // First, fetch the original task
      const originalResult = await dispatch(fetchTaskById(taskId));
      if (!originalResult.success) {
        return originalResult;
      }

      const original = originalResult.data;

      // Create new task with modified data
      const duplicatedData = {
        category: original.category,
        tema: `${original.tema} (Copia)`,
        status: 'Pendiente',
        notes: original.notes,
        project_id: original.project_id,
        staff_id: original.staff_id,
        stage_id: original.stage_id,
        priority: original.priority,
        due_date: original.due_date,
        ...newData, // Allow overriding any fields
      };

      return dispatch(createTask(duplicatedData));
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

// Export action types for use in reducers
export { TASKS_ACTIONS } from '../actionTypes.js';

// Legacy exports for backward compatibility
export const fetchTasksRequest = taskActions.fetchRequest;
export const fetchTasksSuccess = taskActions.fetchSuccess;
export const fetchTasksFailure = taskActions.fetchFailure;
export const addTask = taskActions.createSuccess;
export const updateTaskData = updateTask;
export const updateTaskStatusData = updateTaskStatus;
export const deleteTaskData = deleteTask;

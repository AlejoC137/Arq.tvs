// ========================================
// UNIFIED ACTIONS EXPORT
// ========================================

// Export all action types
export * from '../actionTypes.js';

// Export CRUD factory
export { createCrudActions, transformers, relationships } from './crudActions.js';

// ========================================
// ENTITY-SPECIFIC ACTIONS
// ========================================

// Projects
export * from './projectActions.js';

// Tasks
export * from './taskActions.js';

// Staff
export * from './staffActions.js';

// Stages
export * from './stagesActions.js';

// Other entities (if they exist)
export * from './entregablesActions.js';

// ========================================
// CONVENIENCE EXPORTS
// ========================================

// All CRUD actions organized by entity
export const entityActions = {
  projects: {
    fetch: 'fetchProjects',
    create: 'createProject',
    update: 'updateProject',
    delete: 'deleteProject',
    fetchById: 'fetchProjectById',
    fetchWithStats: 'fetchProjectsWithStats',
    fetchActive: 'fetchActiveProjects',
    bulkCreate: 'bulkCreateProjects',
    bulkUpdate: 'bulkUpdateProjects',
    bulkDelete: 'bulkDeleteProjects',
    count: 'countProjects',
    search: 'searchProjects',
  },
  
  tasks: {
    fetch: 'fetchTasks',
    create: 'createTask',
    update: 'updateTask',
    delete: 'deleteTask',
    fetchById: 'fetchTaskById',
    updateStatus: 'updateTaskStatus',
    updatePriority: 'updateTaskPriority',
    assign: 'assignTask',
    moveToProject: 'moveTaskToProject',
    setStage: 'setTaskStage',
    setDueDate: 'setTaskDueDate',
    complete: 'completeTask',
    reopen: 'reopenTask',
    duplicate: 'duplicateTask',
    fetchByProject: 'fetchTasksByProject',
    fetchByStaff: 'fetchTasksByStaff',
    fetchByStatus: 'fetchTasksByStatus',
    fetchByPriority: 'fetchTasksByPriority',
    fetchOverdue: 'fetchOverdueTasks',
    fetchDueThisWeek: 'fetchTasksDueThisWeek',
    bulkCreate: 'bulkCreateTasks',
    bulkUpdate: 'bulkUpdateTasks',
    bulkDelete: 'bulkDeleteTasks',
    count: 'countTasks',
    search: 'searchTasks',
  },
  
  staff: {
    fetch: 'fetchStaff',
    create: 'createStaff',
    update: 'updateStaff',
    delete: 'deleteStaff',
    fetchById: 'fetchStaffById',
    fetchWithTasks: 'fetchStaffWithTasks',
    fetchActive: 'fetchActiveStaff',
    activate: 'activateStaffMember',
    deactivate: 'deactivateStaffMember',
    updateRole: 'updateStaffRole',
    updateContact: 'updateStaffContact',
    getWorkload: 'getStaffWorkload',
    bulkCreate: 'bulkCreateStaff',
    bulkUpdate: 'bulkUpdateStaff',
    bulkDelete: 'bulkDeleteStaff',
    count: 'countStaff',
    search: 'searchStaff',
  },
  
  stages: {
    fetch: 'fetchStages',
    create: 'createStage',
    update: 'updateStage',
    delete: 'deleteStage',
    fetchById: 'fetchStageById',
    fetchWithTasks: 'fetchStagesWithTasks',
    fetchActive: 'fetchActiveStages',
    updateOrder: 'updateStageOrder',
    reorder: 'reorderStages',
    activate: 'activateStage',
    deactivate: 'deactivateStage',
    getStatistics: 'getStageStatistics',
    moveTasksBetween: 'moveTasksBetweenStages',
    bulkCreate: 'bulkCreateStages',
    bulkUpdate: 'bulkUpdateStages',
    bulkDelete: 'bulkDeleteStages',
    count: 'countStages',
    search: 'searchStages',
  },
};

// Common action patterns
export const commonActions = {
  // Generic fetch pattern
  fetchPattern: (entityName) => `fetch${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`,
  
  // Generic create pattern  
  createPattern: (entityName) => `create${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`,
  
  // Generic update pattern
  updatePattern: (entityName) => `update${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`,
  
  // Generic delete pattern
  deletePattern: (entityName) => `delete${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`,
};

// ========================================
// USAGE EXAMPLES AND DOCUMENTATION
// ========================================

/*
// Example usage in components:

import { 
  fetchProjects, 
  createTask, 
  updateTaskStatus,
  fetchStaffWithTasks 
} from '../store/actions';

// Or import all actions for an entity
import * as projectActions from '../store/actions/projectActions';
import * as taskActions from '../store/actions/taskActions';

// Usage in component
const MyComponent = () => {
  const dispatch = useDispatch();
  
  // Fetch data
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);
  
  // Create new task
  const handleCreateTask = async (taskData) => {
    const result = await dispatch(createTask(taskData));
    if (result.success) {
      console.log('Task created successfully');
    }
  };
  
  // Update task status
  const handleUpdateStatus = (taskId, newStatus) => {
    dispatch(updateTaskStatus(taskId, newStatus));
  };
  
  // Bulk operations
  const handleBulkUpdate = (updates) => {
    dispatch(bulkUpdateTasks(updates));
  };
  
  return <div>...</div>;
};

// Usage in Redux-Saga (if using sagas)
function* fetchProjectsSaga() {
  try {
    const projects = yield call(fetchProjects);
    yield put({ type: 'PROJECTS_LOADED', payload: projects });
  } catch (error) {
    yield put({ type: 'PROJECTS_ERROR', payload: error.message });
  }
}

// Usage with async/await
const loadData = async () => {
  const [projectsResult, tasksResult] = await Promise.all([
    dispatch(fetchProjects()),
    dispatch(fetchTasks())
  ]);
  
  if (projectsResult.success && tasksResult.success) {
    console.log('All data loaded successfully');
  }
};
*/

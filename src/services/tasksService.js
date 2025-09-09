import supabase from '../config/supabaseClient.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error?.message || 'An error occurred',
    details: error
  };
};

// Helper function to handle successful responses
const handleSupabaseSuccess = (data, message = 'Operation successful') => {
  return {
    success: true,
    data,
    message
  };
};

export const tasksService = {
  // Get all tasks
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .order('task_description');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Tasks loaded successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get task by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Task found');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create new task
  async create(taskData) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          category: taskData.category,
          task_description: taskData.task_description,
          status: taskData.status,
          notes: taskData.notes || '',
          project_id: taskData.project_id || null,
          staff_id: taskData.staff_id || null,
          stage_id: taskData.stage_id || null
        }])
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Task created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update task
  async update(id, taskData) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          category: taskData.category,
          task_description: taskData.task_description,
          status: taskData.status,
          notes: taskData.notes,
          project_id: taskData.project_id,
          staff_id: taskData.staff_id,
          stage_id: taskData.stage_id
        })
        .eq('id', id)
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Task updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete task
  async delete(id) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null, 'Task deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get tasks by project
  async getByProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .eq('project_id', projectId)
        .order('task_description');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Project tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get tasks by staff member
  async getByStaff(staffId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .eq('staff_id', staffId)
        .order('task_description');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get tasks by stage
  async getByStage(stageId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          )
        `)
        .eq('stage_id', stageId)
        .order('task_description');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get tasks by status
  async getByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name
          ),
          staff (
            id,
            name
          ),
          stages (
            id,
            name
          )
        `)
        .eq('status', status)
        .order('task_description');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, `Tasks with status ${status} loaded`);
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update task status only
  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Task status updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

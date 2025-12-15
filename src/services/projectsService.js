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

export const projectsService = {
  // Get all projects
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Projects loaded successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get project by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Project found');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create new project
  async create(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          status: projectData.status,
          resp: projectData.resp || ''
        }])
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Project created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update project
  async update(id, projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          status: projectData.status,
          resp: projectData.resp
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Project updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete project
  async delete(id) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null, 'Project deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get project with tasks
  async getWithTasks(id) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (
            id,
            tema,
            status,
            category,
            notes,
            staff_id,
            stage_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Project with tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get projects with task counts
  async getWithStats() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (
            id,
            status
          )
        `)
        .order('name');

      if (error) return handleSupabaseError(error);

      // Calculate stats for each project
      const projectsWithStats = data.map(project => ({
        ...project,
        taskCount: project.tasks?.length || 0,
        completedTasks: project.tasks?.filter(task => task.status === 'Completo').length || 0,
        pendingTasks: project.tasks?.filter(task => task.status === 'Pendiente').length || 0,
        inProgressTasks: project.tasks?.filter(task => task.status === 'En Progreso').length || 0
      }));

      return handleSupabaseSuccess(projectsWithStats, 'Projects with stats loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

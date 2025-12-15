import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js';

export const stagesService = {
  // Get all stages
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .order('name');

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stages loaded successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get stage by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage found');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create new stage
  async create(stageData) {
    try {
      const { data, error } = await supabase
        .from('stages')
        .insert([{
          name: stageData.name,
          description: stageData.description,
          objectives: stageData.objectives || '',
          deliverables: stageData.deliverables || '',
          products: stageData.products || '',
          stakeholders: stageData.stakeholders || ''
        }])
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update stage
  async update(id, stageData) {
    try {
      const { data, error } = await supabase
        .from('stages')
        .update({
          name: stageData.name,
          description: stageData.description,
          objectives: stageData.objectives,
          deliverables: stageData.deliverables,
          products: stageData.products,
          stakeholders: stageData.stakeholders
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete stage
  async delete(id) {
    try {
      const { error } = await supabase
        .from('stages')
        .delete()
        .eq('id', id);

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null, 'Stage deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get stage with tasks
  async getWithTasks(id) {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select(`
          *,
          tasks (
            id,
            tema,
            status,
            category,
            project_id,
            staff_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage with tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get stage with entregables
  async getWithEntregables(id) {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select(`
          *,
          entregables_template (
            id,
            entregable_nombre,
            tipo,
            vistaTipo,
            escala_tipica,
            software_utilizado
          )
        `)
        .eq('id', id)
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage with entregables loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get stages with task counts
  async getWithStats() {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select(`
          *,
          tasks (
            id,
            status
          ),
          entregables_template (
            id
          )
        `)
        .order('name');

      if (error) return handleSupabaseError(error);

      // Calculate stats for each stage
      const stagesWithStats = data.map(stage => ({
        ...stage,
        taskCount: stage.tasks?.length || 0,
        completedTasks: stage.tasks?.filter(task => task.status === 'Completo').length || 0,
        pendingTasks: stage.tasks?.filter(task => task.status === 'Pendiente').length || 0,
        inProgressTasks: stage.tasks?.filter(task => task.status === 'En Progreso').length || 0,
        entregableCount: stage.entregables_template?.length || 0
      }));

      return handleSupabaseSuccess(stagesWithStats, 'Stages with stats loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

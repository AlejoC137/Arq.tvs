import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js';

export const staffService = {
  // Get all staff members
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff loaded successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get staff by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff member found');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create new staff member
  async create(staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([{
          name: staffData.name,
          role_description: staffData.role_description,
          Tasks: staffData.Tasks || ''
        }])
        .select()
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff member created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update staff member
  async update(id, staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          name: staffData.name,
          role_description: staffData.role_description,
          Tasks: staffData.Tasks
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff member updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete staff member
  async delete(id) {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null, 'Staff member deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get staff with their tasks
  async getWithTasks(id) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          tasks (
            id,
            task_description,
            status,
            category,
            project_id
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Staff member with tasks loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

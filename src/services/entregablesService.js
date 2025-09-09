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

export const entregablesService = {
  // Get all entregables templates
  async getAll() {
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
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Entregables loaded successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get entregable by ID
  async getById(id) {
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
        .eq('id', id)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Entregable found');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create new entregable template
  async create(entregableData) {
    try {
      const { data, error } = await supabase
        .from('entregables_template')
        .insert([{
          entregable_nombre: entregableData.entregable_nombre,
          tipo: entregableData.tipo,
          vistaTipo: entregableData.vistaTipo,
          escala_tipica: entregableData.escala_tipica,
          software_utilizado: entregableData.software_utilizado,
          Stage_id: entregableData.Stage_id || null,
          vistaSubTipo: entregableData.vistaSubTipo || ''
        }])
        .select(`
          *,
          stages (
            id,
            name
          )
        `)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Entregable created successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update entregable template
  async update(id, entregableData) {
    try {
      const { data, error } = await supabase
        .from('entregables_template')
        .update({
          entregable_nombre: entregableData.entregable_nombre,
          tipo: entregableData.tipo,
          vistaTipo: entregableData.vistaTipo,
          escala_tipica: entregableData.escala_tipica,
          software_utilizado: entregableData.software_utilizado,
          Stage_id: entregableData.Stage_id,
          vistaSubTipo: entregableData.vistaSubTipo
        })
        .eq('id', id)
        .select(`
          *,
          stages (
            id,
            name
          )
        `)
        .single();
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Entregable updated successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete entregable template
  async delete(id) {
    try {
      const { error } = await supabase
        .from('entregables_template')
        .delete()
        .eq('id', id);
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null, 'Entregable deleted successfully');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get entregables by stage
  async getByStage(stageId) {
    try {
      const { data, error } = await supabase
        .from('entregables_template')
        .select('*')
        .eq('Stage_id', stageId)
        .order('entregable_nombre');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, 'Stage entregables loaded');
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get entregables by type
  async getByType(tipo) {
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
        .eq('tipo', tipo)
        .order('entregable_nombre');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, `Entregables of type ${tipo} loaded`);
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get entregables by software
  async getBySoftware(software) {
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
        .eq('software_utilizado', software)
        .order('entregable_nombre');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, `Entregables using ${software} loaded`);
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get entregables by vista type
  async getByVistaType(vistaTipo) {
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
        .eq('vistaTipo', vistaTipo)
        .order('entregable_nombre');
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, `Entregables with view type ${vistaTipo} loaded`);
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Search entregables by name
  async searchByName(searchTerm) {
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
      
      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data, `Search results for "${searchTerm}"`);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

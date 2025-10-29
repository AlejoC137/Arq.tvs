import supabase from "../../config/supabaseClient";

// Action Types
export const UPDATE_MATERIAL = "UPDATE_MATERIAL";

// Action Creators
export const updateMaterial = (id, updates) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('Material')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    dispatch({
      type: UPDATE_MATERIAL,
      payload: data
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error updating material:', error);
    return { success: false, error };
  }
};
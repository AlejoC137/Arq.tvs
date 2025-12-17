import supabase from '../config/supabaseClient';

/**
 * Obtiene la lista de proyectos
 */
export const getProjects = async () => {
    const { data, error } = await supabase
        .from('Proyectos')
        .select('id, name, responsable, status, Datos')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
    return data || [];
};

/**
 * Obtiene detalles de un proyecto específico
 */
export const getProjectById = async (projectId) => {
    const { data, error } = await supabase
        .from('Proyectos')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
    return data;
};

/**
 * Obtiene solo las casas (excluyendo Parcelación)
 */
export const getHouses = async () => {
    const { data, error } = await supabase
        .from('Proyectos')
        .select('id, name, responsable, status, Datos')
        .neq('name', 'Parcelación')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching houses:', error);
        throw error;
    }
    return data || [];
};

/**
 * Obtiene solo la parcelación
 */
export const getParcels = async () => {
    const { data, error } = await supabase
        .from('Proyectos')
        .select('id, name, responsable, status, Datos')
        .eq('name', 'Parcelación')
        .single();

    if (error) {
        console.error('Error fetching parcels:', error);
        return null;
    }
    return data;
};

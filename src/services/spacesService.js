import supabase from '../config/supabaseClient';

/**
 * Obtiene la lista de espacios disponibles (solo tipo='Espacio')
 */
export const getSpaces = async () => {
    const { data, error } = await supabase
        .from('Espacio_Elemento')
        .select('_id, nombre, tipo, apellido')
        .eq('tipo', 'Espacio')
        .order('nombre', { ascending: true });

    if (error) {
        console.error('Error fetching spaces:', error);
        throw error;
    }
    return data || [];
};

/**
 * Obtiene detalles completos de un espacio específico
 */
export const getSpaceDetails = async (espacioId) => {
    const { data, error } = await supabase
        .from('Espacio_Elemento')
        .select('_id, nombre, tipo, piso, proyecto, etapa, componentes, tareas, apellido')
        .eq('_id', espacioId)
        .single();

    if (error) {
        console.error('Error fetching space details:', error);
        throw error;
    }
    return data;
};

/**
 * Actualiza propiedades de un espacio
 */
export const updateSpace = async (espacioId, updates) => {
    const { data, error } = await supabase
        .from('Espacio_Elemento')
        .update(updates)
        .eq('_id', espacioId)
        .select();

    if (error) throw error;
    return data[0];
};

/**
 * Obtiene la lista de staffers/ejecutores
 */
export const getStaffers = async () => {
    try {
        const { data, error } = await supabase
            .from('Staff')
            .select('id, name, role_description, email, telefono, tasks')
            .order('name', { ascending: true });

        if (error) {
            console.error('❌ Error fetching staffers:', error);
            console.error('   Detalles:', {
                message: error.message,
                code: error.code,
                hint: error.hint
            });

            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn('⚠️  Tabla "Staff" no existe en Supabase');
                return [];
            }

            throw error;
        }

        return data || [];
    } catch (err) {
        console.error('❌ Error inesperado al obtener staff:', err);
        return [];
    }
};

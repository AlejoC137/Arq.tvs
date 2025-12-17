import supabase from '../config/supabaseClient';

/**
 * Obtiene la lista de contactos del directorio
 */
export const getContacts = async () => {
    try {
        const { data, error } = await supabase
            .from('Directorio')
            .select('id, Nombre, Contacto, Cargo')
            .order('Nombre', { ascending: true });

        if (error) {
            console.error('❌ Error fetching contacts:', error);
            console.error('   Detalles:', {
                message: error.message,
                code: error.code,
                hint: error.hint
            });

            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn('⚠️  Tabla "Directorio" no existe en Supabase');
                return [];
            }

            throw error;
        }

        return data || [];
    } catch (err) {
        console.error('❌ Error inesperado al obtener contactos:', err);
        return [];
    }
};

/**
 * Obtiene detalles de un contacto específico
 */
export const getContactById = async (contactId) => {
    const { data, error } = await supabase
        .from('Directorio')
        .select('*')
        .eq('id', contactId)
        .single();

    if (error) {
        console.error('Error fetching contact details:', error);
        throw error;
    }
    return data;
};

/**
 * Obtiene cargos únicos del directorio
 */
export const getContactRoles = async () => {
    const { data, error } = await supabase
        .from('Directorio')
        .select('Cargo')
        .not('Cargo', 'is', null);

    if (error) {
        console.error('Error fetching contact roles:', error);
        return [];
    }

    // Extraer cargos únicos
    const uniqueRoles = [...new Set(data.map(c => c.Cargo).filter(Boolean))].sort();
    return uniqueRoles;
};

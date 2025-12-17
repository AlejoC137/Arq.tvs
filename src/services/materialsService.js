import supabase from '../config/supabaseClient';

/**
 * Obtiene la lista de materiales
 */
export const getMaterials = async () => {
    try {
        const { data, error } = await supabase
            .from('Materiales')
            .select('id, Nombre, categoria, tipo, precio_COP, proveedor, stock, notas, unidad')
            .order('Nombre', { ascending: true });

        if (error) {
            console.error('❌ Error fetching materials:', error);
            console.error('   Detalles:', {
                message: error.message,
                code: error.code,
                hint: error.hint
            });

            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn('⚠️  Tabla "Materiales" no existe en Supabase');
                return [];
            }

            throw error;
        }

        return data || [];
    } catch (err) {
        console.error('❌ Error inesperado al obtener materiales:', err);
        return [];
    }
};

/**
 * Obtiene detalles de un material específico
 */
export const getMaterialById = async (materialId) => {
    const { data, error } = await supabase
        .from('Materiales')
        .select('*')
        .eq('id', materialId)
        .single();

    if (error) {
        console.error('Error fetching material details:', error);
        throw error;
    }
    return data;
};

/**
 * Obtiene categorías únicas de materiales
 */
export const getMaterialCategories = async () => {
    const { data, error } = await supabase
        .from('Materiales')
        .select('categoria')
        .not('categoria', 'is', null);

    if (error) {
        console.error('Error fetching material categories:', error);
        return [];
    }

    // Extraer categorías únicas
    const uniqueCategories = [...new Set(data.map(m => m.categoria).filter(Boolean))].sort();
    return uniqueCategories;
};

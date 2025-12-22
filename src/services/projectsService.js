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
        .select('id, name, responsable, status, Datos')
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

/**
 * Actualiza un proyecto existente.
 * Maneja la mezcla (merge) de la columna JSON 'Datos'.
 * @param {number} projectId - ID del proyecto a actualizar
 * @param {object} updates - Objeto con las propiedades a actualizar (name, responsable, status, Datos)
 */
export const updateProject = async (projectId, updates) => {
    // Primero obtenemos el proyecto actual para hacer merge del JSON
    const currentProject = await getProjectById(projectId);
    if (!currentProject) {
        throw new Error('Proyecto no encontrado');
    }

    // Preparar los datos a actualizar
    const updatePayload = {};

    // Campos directos
    if (updates.name !== undefined) {
        updatePayload.name = updates.name;
    }
    if (updates.responsable !== undefined) {
        updatePayload.responsable = updates.responsable;
    }
    if (updates.status !== undefined) {
        updatePayload.status = updates.status;
    }

    // Merge del campo JSON 'Datos'
    if (updates.Datos !== undefined) {
        const currentDatos = typeof currentProject.Datos === 'string'
            ? JSON.parse(currentProject.Datos || '{}')
            : (currentProject.Datos || {});

        // Mezclar los datos existentes con los nuevos
        updatePayload.Datos = {
            ...currentDatos,
            ...updates.Datos,
        };
    }

    const { data, error } = await supabase
        .from('Proyectos')
        .update(updatePayload)
        .eq('id', projectId)
        .select()
        .single();

    if (error) {
        console.error('Error updating project:', error);
        throw error;
    }
    return data;
};

/**
 * Crea un nuevo proyecto
 */
export const createProject = async (projectData) => {
    const { data, error } = await supabase
        .from('Proyectos')
        .insert([{
            name: projectData.name,
            responsable: projectData.responsable || null,
            status: projectData.status && projectData.status !== 'Activo' ? projectData.status : null,
            Datos: projectData.Datos || {}
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating project:', error);
        throw error;
    }
    return data;
};

/**
 * Elimina un proyecto
 */
export const deleteProject = async (projectId) => {
    const { error } = await supabase
        .from('Proyectos')
        .delete()
        .eq('id', projectId);

    if (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
    return true;
};

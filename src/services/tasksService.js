import supabase from '../config/supabaseClient';

/**
 * Obtiene todas las tareas con sus relaciones
 */
export const getTasks = async () => {
    const { data, error } = await supabase
        .from('Tareas')
        .select(`
            *,
            proyecto:Proyectos(id, name),
            espacio:Espacio_Elemento(nombre, tipo)
        `)
        .order('fecha_inicio', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
    return data || [];
};

/**
 * Obtiene una tarea específica por ID
 */
export const getTaskById = async (taskId) => {
    const { data, error } = await supabase
        .from('Tareas')
        .select(`
            *,
            proyecto:Proyectos(id, name),
            espacio:Espacio_Elemento(nombre, tipo)
        `)
        .eq('id', taskId)
        .single();

    if (error) {
        console.error('Error fetching task:', error);
        throw error;
    }
    return data;
};

/**
 * Crea una nueva tarea
 */
export const createTask = async (taskData) => {
    const { data, error } = await supabase
        .from('Tareas')
        .insert([taskData])
        .select(`
            *,
            proyecto:Proyectos(id, name),
            espacio:Espacio_Elemento(nombre, tipo)
        `);

    if (error) {
        console.error('Error creating task:', error);
        throw error;
    }
    return data[0];
};

/**
 * Actualiza una tarea existente
 */
export const updateTask = async (taskId, updates) => {
    const { data, error } = await supabase
        .from('Tareas')
        .update(updates)
        .eq('id', taskId)
        .select(`
            *,
            proyecto:Proyectos(id, name),
            espacio:Espacio_Elemento(nombre, tipo)
        `);

    if (error) {
        console.error('Error updating task:', error);
        throw error;
    }
    return data[0];
};

/**
 * Elimina una tarea
 */
export const deleteTask = async (taskId) => {
    const { error } = await supabase
        .from('Tareas')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

/**
 * Obtiene proyectos disponibles para asignar a tareas
 */
export const getProjects = async () => {
    const { data, error } = await supabase
        .from('Proyectos')
        .select('id, name, status')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
    return data || [];
};

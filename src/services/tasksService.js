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
 * Column names from DATABASE_CONTEXT.md:
 * - project_id, staff_id, stage_id, espacio_uuid
 */
export const createTask = async (taskData) => {
    // Build payload with ACTUAL database column names from DATABASE_CONTEXT.md
    const payload = {
        task_description: taskData.task_description,
        project_id: taskData.proyecto || taskData.project_id || null,
        staff_id: taskData.asignado_a || taskData.staff_id || null,
        stage_id: taskData.etapa || taskData.stage_id || null,
        espacio_uuid: taskData.espacio_uuid || null,
        fecha_inicio: taskData.fecha_inicio,
        fecha_fin_estimada: taskData.fecha_fin_estimada,
        status: taskData.status || 'Pendiente'
    };

    // Remove null/undefined values to avoid sending nulls for optional fields
    Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null) delete payload[key];
    });

    const { data, error } = await supabase
        .from('Tareas')
        .insert([payload])
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

import { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient.js';

// Helper functions
const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error?.message || 'An error occurred',
    details: error
  };
};

const handleSupabaseSuccess = (data, message = 'Operation successful') => {
  return {
    success: true,
    data,
    message
  };
};

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = async (queryFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFunction();
      setLoading(false);
      return handleSupabaseSuccess(result);
    } catch (err) {
      setError(err);
      setLoading(false);
      return handleSupabaseError(err);
    }
  };

  return {
    supabase,
    loading,
    error,
    executeQuery,
    clearError: () => setError(null)
  };
};

// Hook específico para proyectos
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const { loading, error, executeQuery } = useSupabase();

  const fetchProjects = async () => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      setProjects(result.data);
    }
    
    return result;
  };

  const createProject = async (projectData) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchProjects(); // Refrescar la lista
    }
    
    return result;
  };

  const updateProject = async (id, updates) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchProjects(); // Refrescar la lista
    }
    
    return result;
  };

  const deleteProject = async (id) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchProjects(); // Refrescar la lista
    }
    
    return result;
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};

// Hook específico para tareas
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { loading, error, executeQuery } = useSupabase();

  const fetchTasks = async () => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      setTasks(result.data);
    }
    
    return result;
  };

  const createTask = async (taskData) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchTasks(); // Refrescar la lista
    }
    
    return result;
  };

  const updateTask = async (id, updates) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchTasks(); // Refrescar la lista
    }
    
    return result;
  };

  const deleteTask = async (id) => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      await fetchTasks(); // Refrescar la lista
    }
    
    return result;
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};

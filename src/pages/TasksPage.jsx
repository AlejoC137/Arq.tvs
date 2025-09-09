import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckSquare, Plus, AlertCircle } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { CrudForm } from '../components/CrudForm.jsx';
import { Badge } from '../components/ui/Badge.jsx';

import { 
  fetchTasks, 
  createTask, 
  updateTaskData, 
  deleteTaskData 
} from '../store/actions/taskActions.js';
import { fetchProjects } from '../store/actions/projectActions.js';
import { fetchStaff } from '../store/actions/staffActions.js';
import { fetchStages } from '../store/actions/stagesActions.js';

import { TaskStatusOptions, TaskCategories } from '../types/database.js';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const { projects } = useSelector(state => state.projects);
  const { members: staff } = useSelector(state => state.staff);
  const { stages } = useSelector(state => state.stages);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchStaff());
    dispatch(fetchStages());
  }, [dispatch]);

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pendiente': 'secondary',
      'En Diseño': 'info',
      'En Progreso': 'default',
      'Aprobación Requerida': 'warning',
      'Bloqueado': 'destructive',
      'En Discusión': 'warning',
      'Completo': 'success',
    };
    return variants[status] || 'default';
  };

  const taskColumns = [
    {
      key: 'task_description',
      title: 'Descripción de la Tarea',
      className: 'max-w-md',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'category',
      title: 'Categoría',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'status',
      title: 'Estado',
      render: (value) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'projects',
      title: 'Proyecto',
      render: (value, item) => (
        value?.name || 'No asignado'
      )
    },
    {
      key: 'staff',
      title: 'Responsable',
      render: (value, item) => (
        value?.name || 'No asignado'
      )
    },
    {
      key: 'stages',
      title: 'Etapa',
      render: (value, item) => (
        value?.name || 'Sin etapa'
      )
    }
  ];

  const taskFormFields = [
    {
      name: 'task_description',
      label: 'Descripción de la Tarea',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'Describe la tarea a realizar...'
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      placeholder: 'Selecciona una categoría',
      options: TaskCategories.map(category => ({
        value: category,
        label: category
      }))
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      placeholder: 'Selecciona el estado',
      options: TaskStatusOptions.map(status => ({
        value: status,
        label: status
      }))
    },
    {
      name: 'project_id',
      label: 'Proyecto',
      type: 'select',
      placeholder: 'Selecciona un proyecto (opcional)',
      options: projects.map(project => ({
        value: project.id,
        label: project.name
      }))
    },
    {
      name: 'staff_id',
      label: 'Responsable',
      type: 'select',
      placeholder: 'Asignar responsable (opcional)',
      options: staff.map(member => ({
        value: member.id,
        label: member.name
      }))
    },
    {
      name: 'stage_id',
      label: 'Etapa del Proyecto',
      type: 'select',
      placeholder: 'Selecciona una etapa (opcional)',
      options: stages.map(stage => ({
        value: stage.id,
        label: stage.name
      }))
    },
    {
      name: 'notes',
      label: 'Notas Adicionales',
      type: 'textarea',
      rows: 2,
      placeholder: 'Información adicional, dependencias, observaciones...'
    }
  ];

  const handleAdd = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    // Convert the task data to match form field names
    const taskForEdit = {
      ...task,
      project_id: task.project_id || '',
      staff_id: task.staff_id || '',
      stage_id: task.stage_id || ''
    };
    setEditingTask(taskForEdit);
    setShowModal(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar esta tarea?`)) {
      const result = await dispatch(deleteTaskData(task.id));
      if (!result.success) {
        alert('Error al eliminar: ' + result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      // Convert empty strings to null for foreign keys
      const processedData = {
        ...formData,
        project_id: formData.project_id || null,
        staff_id: formData.staff_id || null,
        stage_id: formData.stage_id || null
      };

      let result;
      if (editingTask) {
        result = await dispatch(updateTaskData(editingTask.id, processedData));
      } else {
        result = await dispatch(createTask(processedData));
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingTask(null);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CheckSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
        </div>
        <p className="text-muted-foreground">
          Administra todas las tareas del proyecto y su estado de avance
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      <DataTable
        title="Lista de Tareas"
        description="Todas las tareas del proyecto organizadas por estado y responsable"
        data={tasks}
        columns={taskColumns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar tareas por descripción, categoría..."
        emptyMessage="No hay tareas registradas"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
        size="xl"
      >
        <CrudForm
          fields={taskFormFields}
          initialData={editingTask || { status: 'Pendiente' }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText={editingTask ? 'Actualizar' : 'Crear'}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;

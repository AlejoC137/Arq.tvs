import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Plus, FolderOpen } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { CrudForm } from '../components/CrudForm.jsx';
import { Badge } from '../components/ui/Badge.jsx';

import { 
  fetchProjects, 
  createProject, 
  updateProjectData, 
  deleteProjectData 
} from '../store/actions/projectActions.js';

import { ProjectStatusOptions } from '../types/database.js';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector(state => state.projects);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pendiente': 'secondary',
      'En Progreso': 'default',
      'En Diseño': 'info',
      'Pausado': 'warning',
      'Completo': 'success',
    };
    return variants[status] || 'default';
  };

  const projectColumns = [
    {
      key: 'name',
      title: 'Nombre del Proyecto',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
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
      key: 'resp',
      title: 'Responsable',
      render: (value) => value || 'No asignado'
    }
  ];

  const projectFormFields = [
    {
      name: 'name',
      label: 'Nombre del Proyecto',
      type: 'text',
      required: true,
      placeholder: 'Ej: Casa 1, Portería, etc.'
    },
    {
      name: 'status',
      label: 'Estado del Proyecto',
      type: 'select',
      required: true,
      placeholder: 'Selecciona el estado',
      options: ProjectStatusOptions.map(status => ({
        value: status,
        label: status
      }))
    },
    {
      name: 'resp',
      label: 'Responsable',
      type: 'text',
      placeholder: 'Nombre del responsable del proyecto (opcional)'
    }
  ];

  const handleAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (project) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"?`)) {
      const result = await dispatch(deleteProjectData(project.id));
      if (!result.success) {
        alert('Error al eliminar: ' + result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      let result;
      if (editingProject) {
        result = await dispatch(updateProjectData(editingProject.id, formData));
      } else {
        result = await dispatch(createProject(formData));
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingProject(null);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        </div>
        <p className="text-muted-foreground">
          Administra todos los proyectos arquitectónicos en desarrollo
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      <DataTable
        title="Lista de Proyectos"
        description="Proyectos arquitectónicos en desarrollo y su estado actual"
        data={projects}
        columns={projectColumns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar proyectos..."
        emptyMessage="No hay proyectos registrados"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        size="lg"
      >
        <CrudForm
          fields={projectFormFields}
          initialData={editingProject || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText={editingProject ? 'Actualizar' : 'Crear'}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;

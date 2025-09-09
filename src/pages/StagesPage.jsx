import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Plus, Target } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { CrudForm } from '../components/CrudForm.jsx';

import { 
  fetchStages, 
  createStage, 
  updateStageData, 
  deleteStageData 
} from '../store/actions/stagesActions.js';

const StagesPage = () => {
  const dispatch = useDispatch();
  const { stages, loading, error } = useSelector(state => state.stages);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchStages());
  }, [dispatch]);

  const stageColumns = [
    {
      key: 'name',
      title: 'Nombre de la Etapa',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Descripción',
      className: 'max-w-md',
      render: (value) => (
        <div className="text-sm text-muted-foreground line-clamp-2">
          {value}
        </div>
      )
    },
    {
      key: 'objectives',
      title: 'Objetivos',
      className: 'max-w-sm',
      render: (value) => {
        if (!value) return 'Sin objetivos';
        const objectives = value.split('|').filter(Boolean);
        return (
          <div className="text-sm">
            {objectives.slice(0, 2).map((obj, idx) => (
              <div key={idx} className="truncate">• {obj.trim()}</div>
            ))}
            {objectives.length > 2 && (
              <div className="text-muted-foreground">+{objectives.length - 2} más</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'stakeholders',
      title: 'Involucrados',
      render: (value) => {
        if (!value) return 'No especificado';
        const stakeholders = value.split(',').filter(Boolean);
        return (
          <div className="text-sm">
            {stakeholders.slice(0, 2).map((stakeholder, idx) => (
              <span key={idx} className="inline-block bg-secondary px-2 py-1 rounded text-xs mr-1 mb-1">
                {stakeholder.trim()}
              </span>
            ))}
            {stakeholders.length > 2 && (
              <span className="text-muted-foreground text-xs">+{stakeholders.length - 2}</span>
            )}
          </div>
        );
      }
    }
  ];

  const stageFormFields = [
    {
      name: 'name',
      label: 'Nombre de la Etapa',
      type: 'text',
      required: true,
      placeholder: 'Ej: Anteproyecto, Proyecto Ejecutivo, etc.'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      rows: 4,
      placeholder: 'Descripción detallada de la etapa del proyecto...',
      help: 'Explica qué se hace en esta etapa y su propósito'
    },
    {
      name: 'objectives',
      label: 'Objetivos',
      type: 'textarea',
      rows: 3,
      placeholder: 'Separa cada objetivo con " | " (pipe)',
      help: 'Ej: Objetivo 1 | Objetivo 2 | Objetivo 3'
    },
    {
      name: 'deliverables',
      label: 'Entregables',
      type: 'textarea',
      rows: 3,
      placeholder: 'Lista de entregables de esta etapa...',
      help: 'Separar entregables con " | " si hay múltiples'
    },
    {
      name: 'products',
      label: 'Productos',
      type: 'textarea',
      rows: 3,
      placeholder: 'Productos específicos que se generan...',
      help: 'Documentos, planos, renders, modelos, etc.'
    },
    {
      name: 'stakeholders',
      label: 'Involucrados / Stakeholders',
      type: 'textarea',
      rows: 2,
      placeholder: 'Arquitecto, Cliente, Ingenieros...',
      help: 'Separar con comas los diferentes involucrados'
    }
  ];

  const handleAdd = () => {
    setEditingStage(null);
    setShowModal(true);
  };

  const handleEdit = (stage) => {
    setEditingStage(stage);
    setShowModal(true);
  };

  const handleDelete = async (stage) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la etapa "${stage.name}"?`)) {
      const result = await dispatch(deleteStageData(stage.id));
      if (!result.success) {
        alert('Error al eliminar: ' + result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      let result;
      if (editingStage) {
        result = await dispatch(updateStageData(editingStage.id, formData));
      } else {
        result = await dispatch(createStage(formData));
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingStage(null);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingStage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestión de Etapas del Proyecto</h1>
        </div>
        <p className="text-muted-foreground">
          Administra las diferentes etapas del desarrollo arquitectónico
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      <DataTable
        title="Etapas del Proyecto"
        description="Fases del desarrollo arquitectónico desde la idea hasta la construcción"
        data={stages}
        columns={stageColumns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar etapas..."
        emptyMessage="No hay etapas registradas"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingStage ? 'Editar Etapa' : 'Crear Nueva Etapa'}
        size="xl"
      >
        <CrudForm
          fields={stageFormFields}
          initialData={editingStage || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText={editingStage ? 'Actualizar' : 'Crear'}
        />
      </Modal>
    </div>
  );
};

export default StagesPage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Plus, Layers } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { CrudForm } from '../components/CrudForm.jsx';
import { Badge } from '../components/ui/Badge.jsx';

import { 
  fetchEntregables, 
  createEntregable, 
  updateEntregableData, 
  deleteEntregableData 
} from '../store/actions/entregablesActions.js';
import { fetchStages } from '../store/actions/stagesActions.js';

import { EntregableTypes, ViewTypes, SoftwareOptions } from '../types/database.js';

const EntregablesPage = () => {
  const dispatch = useDispatch();
  const { entregables, loading, error } = useSelector(state => state.entregables);
  const { stages } = useSelector(state => state.stages);
  
  const [showModal, setShowModal] = useState(false);
  const [editingEntregable, setEditingEntregable] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEntregables());
    dispatch(fetchStages());
  }, [dispatch]);

  const getTypeBadgeVariant = (tipo) => {
    const variants = {
      '2D': 'default',
      '3D': 'secondary',
      '2D/3D': 'info'
    };
    return variants[tipo] || 'default';
  };

  const entregablesColumns = [
    {
      key: 'entregable_nombre',
      title: 'Nombre del Entregable',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'tipo',
      title: 'Tipo',
      render: (value) => (
        <Badge variant={getTypeBadgeVariant(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'vistaTipo',
      title: 'Vista/Tipo',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'escala_tipica',
      title: 'Escala',
      render: (value) => value || 'N/A'
    },
    {
      key: 'software_utilizado',
      title: 'Software',
      render: (value) => (
        <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'stages',
      title: 'Etapa',
      render: (value, item) => (
        value?.name || 'Sin etapa asignada'
      )
    }
  ];

  const entregablesFormFields = [
    {
      name: 'entregable_nombre',
      label: 'Nombre del Entregable',
      type: 'text',
      required: true,
      placeholder: 'Ej: Planta Arquitectónica General, Render Interior, etc.'
    },
    {
      name: 'tipo',
      label: 'Tipo de Entregable',
      type: 'select',
      required: true,
      placeholder: 'Selecciona el tipo',
      options: EntregableTypes.map(tipo => ({
        value: tipo,
        label: tipo
      }))
    },
    {
      name: 'vistaTipo',
      label: 'Tipo de Vista',
      type: 'select',
      required: true,
      placeholder: 'Selecciona el tipo de vista',
      options: ViewTypes.map(viewType => ({
        value: viewType,
        label: viewType
      }))
    },
    {
      name: 'vistaSubTipo',
      label: 'Subtipo de Vista',
      type: 'text',
      placeholder: 'Información adicional sobre la vista (opcional)'
    },
    {
      name: 'escala_tipica',
      label: 'Escala Típica',
      type: 'text',
      placeholder: 'Ej: 1:50, 1:100, Sin escala, N/A',
      help: 'Escala comúnmente utilizada para este tipo de entregable'
    },
    {
      name: 'software_utilizado',
      label: 'Software Utilizado',
      type: 'select',
      required: true,
      placeholder: 'Selecciona el software',
      options: SoftwareOptions.map(software => ({
        value: software,
        label: software
      }))
    },
    {
      name: 'Stage_id',
      label: 'Etapa del Proyecto',
      type: 'select',
      placeholder: 'Asociar con una etapa (opcional)',
      options: stages.map(stage => ({
        value: stage.id,
        label: stage.name
      })),
      help: 'Etapa en la que se produce este entregable'
    }
  ];

  const handleAdd = () => {
    setEditingEntregable(null);
    setShowModal(true);
  };

  const handleEdit = (entregable) => {
    // Convert the entregable data to match form field names
    const entregableForEdit = {
      ...entregable,
      Stage_id: entregable.Stage_id || ''
    };
    setEditingEntregable(entregableForEdit);
    setShowModal(true);
  };

  const handleDelete = async (entregable) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${entregable.entregable_nombre}"?`)) {
      const result = await dispatch(deleteEntregableData(entregable.id));
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
        Stage_id: formData.Stage_id || null
      };

      let result;
      if (editingEntregable) {
        result = await dispatch(updateEntregableData(editingEntregable.id, processedData));
      } else {
        result = await dispatch(createEntregable(processedData));
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingEntregable(null);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingEntregable(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestión de Entregables</h1>
        </div>
        <p className="text-muted-foreground">
          Administra las plantillas de entregables para cada etapa del proyecto
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      <DataTable
        title="Plantillas de Entregables"
        description="Catálogo de entregables estándar organizados por tipo y software"
        data={entregables}
        columns={entregablesColumns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar entregables..."
        emptyMessage="No hay entregables registrados"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingEntregable ? 'Editar Entregable' : 'Crear Nuevo Entregable'}
        size="xl"
      >
        <CrudForm
          fields={entregablesFormFields}
          initialData={editingEntregable || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText={editingEntregable ? 'Actualizar' : 'Crear'}
        />
      </Modal>
    </div>
  );
};

export default EntregablesPage;

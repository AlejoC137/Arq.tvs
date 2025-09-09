import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, UserPlus, Briefcase } from 'lucide-react';

import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { CrudForm } from '../components/CrudForm.jsx';
import { Badge } from '../components/ui/Badge.jsx';

import { 
  fetchStaff, 
  createStaff, 
  updateStaffData, 
  deleteStaffData 
} from '../store/actions/staffActions.js';

const StaffPage = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector(state => state.staff);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const staffColumns = [
    {
      key: 'name',
      title: 'Nombre',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {value ? value.charAt(0).toUpperCase() : 'N'}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'role_description',
      title: 'Rol / Descripción',
      className: 'max-w-md'
    },
    {
      key: 'Tasks',
      title: 'Tareas Asignadas',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Con tareas' : 'Sin tareas'}
        </Badge>
      )
    }
  ];

  const staffFormFields = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      required: true,
      placeholder: 'Ej: Juan Pérez'
    },
    {
      name: 'role_description',
      label: 'Rol y Descripción',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'Describe el rol y responsabilidades del miembro del equipo',
      help: 'Incluye especialidades, áreas de responsabilidad, etc.'
    },
    {
      name: 'Tasks',
      label: 'Notas sobre Tareas',
      type: 'textarea',
      rows: 2,
      placeholder: 'Información adicional sobre tareas o responsabilidades específicas (opcional)',
    }
  ];

  const handleAdd = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const handleDelete = async (staffMember) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${staffMember.name}?`)) {
      const result = await dispatch(deleteStaffData(staffMember.id));
      if (!result.success) {
        alert('Error al eliminar: ' + result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      let result;
      if (editingStaff) {
        result = await dispatch(updateStaffData(editingStaff.id, formData));
      } else {
        result = await dispatch(createStaff(formData));
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingStaff(null);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingStaff(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestión de Personal</h1>
        </div>
        <p className="text-muted-foreground">
          Administra los miembros del equipo arquitectónico y sus roles
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      <DataTable
        title="Equipo de Trabajo"
        description="Miembros del equipo arquitectónico y sus especialidades"
        data={members}
        columns={staffColumns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar por nombre o rol..."
        emptyMessage="No hay miembros del equipo registrados"
      />

      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title={editingStaff ? 'Editar Miembro del Equipo' : 'Agregar Nuevo Miembro'}
        size="lg"
      >
        <CrudForm
          fields={staffFormFields}
          initialData={editingStaff || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText={editingStaff ? 'Actualizar' : 'Crear'}
        />
      </Modal>
    </div>
  );
};

export default StaffPage;

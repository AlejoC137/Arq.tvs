// ARCHIVO: src/components/PlanosView.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { 
  getAllFromTable, 
  createEntregableTemplate, 
  updateEntregableTemplate, 
  deleteEntregableTemplate 
} from '../store/actions/actions';

// Componentes de UI e Iconos
import { Button } from './ui/Button';
import CrudForm from './CrudForm';
import {Modal} from './ui/Modal';
import { Plus, Trash2, Edit } from 'lucide-react';

const TABLE_NAME = 'Entregables_template';

// Opciones para los campos 'select' en el formulario
const TIPO_OPTIONS = ['2D', '3D', '2D/3D', 'Documento'];
const VISTA_TIPO_OPTIONS = ['Planta', 'Alzado', 'Sección', 'Diagrama', 'Detalle', 'Isométrico', 'Perspectiva', 'Modelo 3D'];
const SOFTWARE_OPTIONS = ['Revit/AutoCAD', 'Adobe Suite', 'SketchUp', 'Rhino', 'Office Suite'];

const PlanosView = () => {
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el modal y la edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Cargar datos usando la acción de Redux
  const fetchData = async () => {
    setLoading(true);
    const actionResult = await dispatch(getAllFromTable(TABLE_NAME));
    if (actionResult && actionResult.payload) {
      setItems(actionResult.payload);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Manejadores de eventos CRUD
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      dispatch(deleteEntregableTemplate(itemId)).then(() => {
        fetchData();
      });
    }
  };

  const handleSubmit = (formData) => {
    const action = editingItem 
      ? updateEntregableTemplate(editingItem.id, formData)
      : createEntregableTemplate(formData);

    dispatch(action).then(() => {
      fetchData();
      setIsModalOpen(false);
    });
  };

  // Definición de columnas para la tabla (incluyendo los nuevos campos)
  const columns = useMemo(() => [
    { Header: 'Nombre del Entregable', accessor: 'entregable_nombre' },
    { Header: 'Tipo', accessor: 'tipo' },
    { Header: 'Tipo de Vista', accessor: 'vistaTipo' },
    { Header: 'Escala Típica', accessor: 'escala_tipica' },
    { Header: 'Software', accessor: 'software_utilizado' },
    {
      Header: 'Acciones',
      accessor: 'actions',
    },
  ], []);

  // Campos para el formulario CrudForm (actualizado con las nuevas propiedades)
  const formFields = [
    { name: 'entregable_nombre', label: 'Nombre del Entregable', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: TIPO_OPTIONS },
    { name: 'vistaTipo', label: 'Tipo de Vista', type: 'select', options: VISTA_TIPO_OPTIONS },
    { name: 'vistaSubTipo', label: 'Sub-tipo de Vista', type: 'text' },
    { name: 'escala_tipica', label: 'Escala Típica', type: 'text', placeholder: 'Ej: 1:50, 1:100' },
    { name: 'software_utilizado', label: 'Software Utilizado', type: 'select', options: SOFTWARE_OPTIONS },
  ];

  if (loading) return <p className="text-center mt-8">Cargando plantillas...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Plantillas de Planos</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={16} />
          Crear Nueva Plantilla
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.Header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.entregable_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.vistaTipo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.escala_tipica}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.software_utilizado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full" title="Editar">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full" title="Eliminar">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}
        </h2>
        <CrudForm
          initialData={editingItem}
          fields={formFields}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default PlanosView;
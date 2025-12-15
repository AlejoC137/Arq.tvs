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
import { Modal } from './ui/Modal';
import { Plus, Trash2, Edit } from 'lucide-react';
import ViewToggle from './common/ViewToggle';

const TABLE_NAME = 'Entregables_template';

// Opciones para los campos 'select' en el formulario
const CATEGORIA_OPTIONS = ['2D', '3D', '2D/3D', 'Documento'];
const VISTA_TIPO_OPTIONS = ['Planta', 'Alzado', 'Sección', 'Diagrama', 'Detalle', 'Isométrico', 'Perspectiva', 'Modelo 3D'];
const SOFTWARE_OPTIONS = ['Revit', "AutoCAD", 'Adobe Suite', 'SketchUp', 'Rhino', 'Office Suite'];

const PlanosView = () => {
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
      dispatch(deleteEntregableTemplate(itemId)).then(fetchData);
    }
  };

  const handleSubmit = (formData) => {
    const sanitizedData = { ...formData };
    // Convierte campos vacíos a null antes de enviar a Supabase
    for (const key in sanitizedData) {
      if (sanitizedData[key] === '') {
        sanitizedData[key] = null;
      }
    }

    const action = editingItem
      ? updateEntregableTemplate(editingItem.id, sanitizedData)
      : createEntregableTemplate(sanitizedData);

    dispatch(action).then(() => {
      fetchData();
      setIsModalOpen(false);
    });
  };

  // --- ✅ COLUMNAS ALINEADAS CON LA BASE DE DATOS ---
  const columns = useMemo(() => [
    { Header: 'Nombre del Entregable', accessor: 'entregable_nombre' },
    { Header: 'Categoría', accessor: 'Categoria' }, // Corresponde a la columna 'Categoria'
    { Header: 'Tipo de Vista', accessor: 'vistaTipo' },
    { Header: 'Escala Típica', accessor: 'escala_tipica' },
    { Header: 'Software', accessor: 'software_utilizado' },
    { Header: 'Acciones', accessor: 'actions' },
  ], []);

  // --- ✅ FORMULARIO ALINEADO CON LA BASE DE DATOS ---
  const formFields = [
    { name: 'entregable_nombre', label: 'Nombre del Entregable', type: 'text', required: true },
    { name: 'Categoria', label: 'Categoría', type: 'select', options: CATEGORIA_OPTIONS }, // Corresponde a la columna 'Categoria'
    { name: 'vistaTipo', label: 'Tipo de Vista', type: 'select', options: VISTA_TIPO_OPTIONS },
    { name: 'vistaSubTipo', label: 'Sub-tipo de Vista', type: 'text' },
    { name: 'escala_tipica', label: 'Escala Típica', type: 'text', placeholder: 'Ej: 1:50, 1:100' },
    { name: 'software_utilizado', label: 'Software Utilizado', type: 'select', options: SOFTWARE_OPTIONS },
  ];

  if (loading) return <p className="text-center mt-8">Cargando plantillas...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Plantillas</h1>
          <p className="text-gray-600">Configuración de entregables y planos</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva Plantilla</span>
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2" title={item.entregable_nombre}>
                  {item.entregable_nombre}
                </h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${item.Categoria === '2D' ? 'bg-blue-100 text-blue-800' :
                    item.Categoria === '3D' ? 'bg-purple-100 text-purple-800' :
                      item.Categoria === 'documento' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                  }`}>
                  {item.Categoria || 'N/A'}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
                <p className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-medium text-gray-500">Vista:</span>
                  <span>{item.vistaTipo}</span>
                </p>
                <p className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-medium text-gray-500">Escala:</span>
                  <span>{item.escala_tipica}</span>
                </p>
                <p className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-medium text-gray-500">Software:</span>
                  <span>{item.software_utilizado}</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                  <td className="px-6 py-4 whitespace-nowrap">{item.Categoria}</td>
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
      )}

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
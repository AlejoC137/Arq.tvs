import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Users, Search, Phone, Mail, MapPin, Building, Plus,
  Edit, Trash2, Eye, X, Save, FileDown, RefreshCcw, User
} from 'lucide-react';

import ViewToggle from './common/ViewToggle';
import { getAllFromTable, createInTable, updateInTable, deleteFromTable } from '../store/actions/actions';

const DirectorioSupabase = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedContacto, setSelectedContacto] = useState(null);

  // Estados para el formulario (Nombre, Contacto, Cargo)
  const [formData, setFormData] = useState({
    Nombre: '',
    Contacto: '',
    Cargo: ''
  });

  // Cargar directorio desde Supabase
  // Tabla: "Directorio" con columnas: id (uuid), Nombre (text), Contacto (text), Cargo (text)
  const fetchContactos = useCallback(async () => {
    try {
      setLoading(true);
      const action = await dispatch(getAllFromTable('Directorio'));
      const data = action?.payload || [];

      // Ordenar alfabéticamente por Nombre
      const sorted = [...data].sort((a, b) =>
        (a.Nombre || '').localeCompare(b.Nombre || '')
      );

      setContactos(sorted);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchContactos();
  }, [fetchContactos]);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      Nombre: '',
      Contacto: '',
      Cargo: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contacto) => {
    setModalMode('edit');
    setSelectedContacto(contacto);
    setFormData({
      Nombre: contacto.Nombre || '',
      Contacto: contacto.Contacto || '',
      Cargo: contacto.Cargo || ''
    });
    setIsModalOpen(true);
  };

  const handleView = (contacto) => {
    setModalMode('view');
    setSelectedContacto(contacto);
    setIsModalOpen(true);
  };

  const handleDelete = async (contacto) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${contacto.Nombre}?`)) {
      try {
        setLoading(true);
        await dispatch(deleteFromTable('Directorio', contacto.id));
        await fetchContactos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el contacto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.Nombre || !formData.Contacto) {
      alert('Por favor completa los campos obligatorios (Nombre y Contacto)');
      return;
    }

    try {
      setLoading(true);

      const dataToSave = {
        Nombre: formData.Nombre.trim(),
        Contacto: formData.Contacto.trim(),
        Cargo: formData.Cargo.trim()
      };

      if (modalMode === 'create') {
        await dispatch(createInTable('Directorio', dataToSave));
      } else {
        await dispatch(updateInTable('Directorio', selectedContacto.id, dataToSave));
      }

      await fetchContactos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Directorio de Contactos', 20, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 20, 28);
    doc.text(`Total contactos: ${contactos.length}`, 20, 33);

    // Tabla
    const tableData = contactos.map(c => [
      c.Nombre || '',
      c.Contacto || '',
      c.Cargo || ''
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Nombre', 'Contacto', 'Cargo']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 70 },
        2: { cellWidth: 60 }
      }
    });

    doc.save(`directorio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportContactPDF = (contacto) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(contacto.Nombre || 'Sin nombre', 20, yPosition);
    yPosition += 10;

    // Información
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    const info = [
      [`Contacto: ${contacto.Contacto || 'N/A'}`],
      [`Cargo: ${contacto.Cargo || 'N/A'}`]
    ];

    doc.autoTable({
      startY: yPosition,
      body: info,
      theme: 'plain',
      styles: { fontSize: 12 }
    });

    const fileName = (contacto.Nombre || 'contacto')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);

    doc.save(`contacto-${fileName}.pdf`);
  };

  const filteredContactos = contactos.filter(contacto =>
    (contacto.Nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contacto.Cargo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contacto.Contacto || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && contactos.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando directorio desde Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Directorio
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestión de contactos y colaboradores - Supabase
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
              <button
                onClick={fetchContactos}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Recargar"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Recargar
              </button>
              <button
                onClick={handleExportAllPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Exportar Todo a PDF"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, contacto o cargo..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contador */}
          <div className="mt-3 text-sm text-gray-500">
            {filteredContactos.length} contacto{filteredContactos.length !== 1 ? 's' : ''}
            {searchTerm && ` encontrado${filteredContactos.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Lista de Contactos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-auto p-6">
          {filteredContactos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron contactos' : 'No hay contactos'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Agrega tu primer contacto para comenzar'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Primer Contacto
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContactos.map(contacto => (
                <div
                  key={contacto.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all bg-white relative group"
                >
                  {/* Acciones flotantes */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(contacto)}
                      className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(contacto)}
                      className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportContactPDF(contacto)}
                      className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
                      title="PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contacto)}
                      className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {(contacto.Nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {contacto.Nombre || 'Sin nombre'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {contacto.Cargo || 'Sin cargo'}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                    {contacto.Contacto}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContactos.map((contacto) => (
                    <tr key={contacto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs mr-3">
                            {(contacto.Nombre || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{contacto.Nombre || 'Sin nombre'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{contacto.Cargo || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={contacto.Contacto}>{contacto.Contacto || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(contacto)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(contacto)}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleExportContactPDF(contacto)}
                            className="text-purple-600 hover:text-purple-900"
                            title="PDF"
                          >
                            <FileDown size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(contacto)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
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
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'view' && 'Ver Contacto'}
                {modalMode === 'create' && 'Nuevo Contacto'}
                {modalMode === 'edit' && 'Editar Contacto'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto p-6">
              {modalMode === 'view' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-3xl">
                      {(selectedContacto?.Nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedContacto?.Nombre}</h3>
                      <p className="text-lg text-gray-600">{selectedContacto?.Cargo}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Contacto</p>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">
                      {selectedContacto?.Contacto}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.Nombre}
                        onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={formData.Cargo}
                        onChange={(e) => setFormData({ ...formData, Cargo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Arquitecto"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contacto *
                      </label>
                      <textarea
                        rows={8}
                        value={formData.Contacto}
                        onChange={(e) => setFormData({ ...formData, Contacto: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Teléfono, email, notas, etc."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex items-center justify-end gap-3">
              {modalMode === 'view' ? (
                <>
                  <button
                    onClick={() => handleExportContactPDF(selectedContacto)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <FileDown className="w-4 h-4" />
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => handleEdit(selectedContacto)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para mostrar información
const InfoRow = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
      {value ? (
        isLink ? (
          <a href={isLink} className="text-blue-600 hover:underline break-words">
            {value}
          </a>
        ) : (
          <p className="text-gray-900 break-words">{value}</p>
        )
      ) : (
        <p className="text-gray-400">No especificado</p>
      )}
    </div>
  </div>
);

export default DirectorioSupabase;

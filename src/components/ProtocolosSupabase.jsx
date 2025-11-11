import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import {
  FileText, Search, Folder, Plus, Edit, Trash2, Eye, X,
  Save, FileDown, RefreshCcw, User
} from 'lucide-react';

import { getAllFromTable, createInTable, updateInTable, deleteFromTable } from '../store/actions/actions';

const ProtocolosSupabase = () => {
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedProtocolo, setSelectedProtocolo] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    Nombre: '',
    Contenido: '',
    Editor: ''
  });

  // Cargar protocolos desde Supabase
  const fetchProtocolos = useCallback(async () => {
    try {
      setLoading(true);
      const action = await dispatch(getAllFromTable('Protocolos'));
      const data = action?.payload || [];
      
      // Ordenar por fecha de actualización (más recientes primero)
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.FechaUpdate || 0);
        const dateB = new Date(b.FechaUpdate || 0);
        return dateB - dateA;
      });
      
      setProtocolos(sorted);
    } catch (error) {
      console.error('Error al cargar protocolos:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProtocolos();
  }, [fetchProtocolos]);

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      Nombre: '',
      Contenido: '',
      Editor: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (protocolo) => {
    setModalMode('edit');
    setSelectedProtocolo(protocolo);
    setFormData({
      Nombre: protocolo.Nombre || '',
      Contenido: protocolo.Contenido || '',
      Editor: protocolo.Editor || ''
    });
    setIsModalOpen(true);
  };

  const handleView = (protocolo) => {
    setModalMode('view');
    setSelectedProtocolo(protocolo);
    setIsModalOpen(true);
  };

  const handleDelete = async (protocolo) => {
    if (window.confirm(`¿Estás seguro de eliminar el protocolo "${protocolo.Nombre}"?`)) {
      try {
        setLoading(true);
        await dispatch(deleteFromTable('Protocolos', protocolo.id));
        await fetchProtocolos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el protocolo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.Nombre || !formData.Contenido) {
      alert('Por favor completa los campos obligatorios (Nombre y Contenido)');
      return;
    }

    try {
      setLoading(true);
      
      const dataToSave = {
        Nombre: formData.Nombre.trim(),
        Contenido: formData.Contenido.trim(),
        Editor: formData.Editor.trim() || 'Sistema',
        FechaUpdate: new Date().toISOString()
      };

      if (modalMode === 'create') {
        await dispatch(createInTable('Protocolos', dataToSave));
      } else {
        await dispatch(updateInTable('Protocolos', selectedProtocolo.id, dataToSave));
      }

      await fetchProtocolos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el protocolo');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = (protocolo) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(protocolo.Nombre, margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    
    if (protocolo.Editor) {
      doc.text(`Editado por: ${protocolo.Editor}`, margin, yPosition);
      yPosition += 6;
    }
    
    if (protocolo.FechaUpdate) {
      const fecha = new Date(protocolo.FechaUpdate).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Actualizado: ${fecha}`, margin, yPosition);
      yPosition += 6;
    }
    
    yPosition += 4;

    // Línea divisoria
    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Contenido
    doc.setTextColor(0);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(protocolo.Contenido || '', maxWidth);
    
    lines.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    // Nombre del archivo
    const fileName = protocolo.Nombre
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);
    
    doc.save(`protocolo-${fileName}.pdf`);
  };

  const filteredProtocolos = protocolos.filter(protocolo =>
    (protocolo.Nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (protocolo.Editor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (protocolo.Contenido || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && protocolos.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando protocolos desde Supabase...</p>
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
                <FileText className="w-8 h-8 text-blue-600" />
                Protocolos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestión de documentos y procedimientos - Supabase
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProtocolos}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Recargar"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Recargar
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Protocolo
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
              placeholder="Buscar protocolos por nombre, editor o contenido..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contador */}
          <div className="mt-3 text-sm text-gray-500">
            {filteredProtocolos.length} protocolo{filteredProtocolos.length !== 1 ? 's' : ''} 
            {searchTerm && ` encontrado${filteredProtocolos.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Lista de Protocolos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-auto p-6">
          {filteredProtocolos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron protocolos' : 'No hay protocolos'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Crea tu primer protocolo para comenzar'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Crear Primer Protocolo
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProtocolos.map(protocolo => (
                <div
                  key={protocolo.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {protocolo.Nombre}
                      </h3>
                      
                      {/* Preview del contenido */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {protocolo.Contenido?.substring(0, 200)}
                        {protocolo.Contenido?.length > 200 && '...'}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {protocolo.Editor && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{protocolo.Editor}</span>
                          </div>
                        )}
                        {protocolo.FechaUpdate && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>
                              {new Date(protocolo.FechaUpdate).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleView(protocolo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver protocolo"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(protocolo)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleExportPDF(protocolo)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Exportar PDF"
                      >
                        <FileDown className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(protocolo)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'view' && 'Ver Protocolo'}
                {modalMode === 'create' && 'Nuevo Protocolo'}
                {modalMode === 'edit' && 'Editar Protocolo'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-auto p-6">
              {modalMode === 'view' ? (
                <div>
                  {/* Metadata */}
                  {selectedProtocolo && (
                    <div className="mb-6 pb-4 border-b">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {selectedProtocolo.Editor && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span><strong>Editor:</strong> {selectedProtocolo.Editor}</span>
                          </div>
                        )}
                        {selectedProtocolo.FechaUpdate && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>
                              <strong>Actualizado:</strong>{' '}
                              {new Date(selectedProtocolo.FechaUpdate).toLocaleString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Contenido en Markdown */}
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedProtocolo?.Contenido || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Protocolo *
                    </label>
                    <input
                      type="text"
                      value={formData.Nombre}
                      onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Proceso de revisión de proyectos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Editor / Autor
                    </label>
                    <input
                      type="text"
                      value={formData.Editor}
                      onChange={(e) => setFormData({ ...formData, Editor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu nombre (opcional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido (Markdown) *
                    </label>
                    <textarea
                      value={formData.Contenido}
                      onChange={(e) => setFormData({ ...formData, Contenido: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={15}
                      placeholder="# Título del Protocolo&#10;&#10;## Sección&#10;&#10;Escribe el contenido en formato Markdown..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Usa Markdown: # Título, ## Subtítulo, **negrita**, *cursiva*, - listas, etc.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="p-6 border-t flex items-center justify-end gap-3">
              {modalMode === 'view' ? (
                <>
                  <button
                    onClick={() => handleExportPDF(selectedProtocolo)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <FileDown className="w-4 h-4" />
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => handleEdit(selectedProtocolo)}
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

export default ProtocolosSupabase;

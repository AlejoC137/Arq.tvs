import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import {
  FileText, Download, Search, Folder, Plus, Edit, Trash2, Eye, X,
  Save, Upload, FileDown, ChevronRight, ChevronLeft
} from 'lucide-react';

const ProtocolosCRUD = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedProtocolo, setSelectedProtocolo] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'INTERNO ARQ',
    descripcion: '',
    contenido: '',
    fechaActualizacion: new Date().toISOString().split('T')[0]
  });

  // Datos iniciales con contenido en Markdown
  const protocolosIniciales = [
    {
      id: 1,
      nombre: 'Proceso de revisión con Ronald',
      categoria: 'INTERNO ARQ',
      descripcion: 'Protocolo interno para procesos de revisión arquitectónica',
      fechaActualizacion: '06/11/2025',
      contenido: `# Proceso de revisión con Ronald

## Objetivo
Establecer un protocolo claro y eficiente para el proceso de revisión de proyectos arquitectónicos.

## Procedimiento

### 1. Preparación de Documentos
- Reunir todos los planos actualizados
- Incluir memoria descriptiva
- Preparar renders o visualizaciones 3D (si aplica)

### 2. Durante la Revisión
- Presentar cambios principales (máximo 15 minutos)
- Discutir puntos críticos
- Tomar notas de observaciones

## Checklist
- [ ] Planos actualizados
- [ ] Nomenclatura correcta
- [ ] Memoria descriptiva completa`
    },
    {
      id: 2,
      nombre: 'Protocolo de Nomenclatura',
      categoria: 'INTERNO ARQ',
      descripcion: 'Nomenclatura estándar para títulos y presentaciones',
      fechaActualizacion: '05/11/2025',
      contenido: `# Protocolo de Nomenclatura

## Formato General
\`PROYECTO-ETAPA-TIPO-VERSIÓN\`

## Ejemplos
- \`VILLA-DISEÑO-PLANTA-V01.dwg\`
- \`TORRE-OBRA-FACHADA-V02.pdf\`

## Etapas
1. **DISEÑO** - Fase de diseño inicial
2. **OBRA** - Documentos de construcción
3. **ASBUILT** - Planos finales construidos`
    }
  ];

  useEffect(() => {
    // Simular carga desde localStorage o API
    const stored = localStorage.getItem('protocolos');
    if (stored) {
      setProtocolos(JSON.parse(stored));
    } else {
      setProtocolos(protocolosIniciales);
      localStorage.setItem('protocolos', JSON.stringify(protocolosIniciales));
    }
    setLoading(false);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('protocolos', JSON.stringify(data));
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      nombre: '',
      categoria: 'INTERNO ARQ',
      descripcion: '',
      contenido: '',
      fechaActualizacion: new Date().toLocaleDateString('es-CO')
    });
    setIsModalOpen(true);
  };

  const handleEdit = (protocolo) => {
    setModalMode('edit');
    setSelectedProtocolo(protocolo);
    setFormData({
      nombre: protocolo.nombre,
      categoria: protocolo.categoria,
      descripcion: protocolo.descripcion,
      contenido: protocolo.contenido,
      fechaActualizacion: protocolo.fechaActualizacion
    });
    setIsModalOpen(true);
  };

  const handleView = (protocolo) => {
    setModalMode('view');
    setSelectedProtocolo(protocolo);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este protocolo?')) {
      const updated = protocolos.filter(p => p.id !== id);
      setProtocolos(updated);
      saveToLocalStorage(updated);
    }
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.contenido) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    let updated;
    if (modalMode === 'create') {
      const newProtocolo = {
        ...formData,
        id: Date.now(),
        fechaActualizacion: new Date().toLocaleDateString('es-CO')
      };
      updated = [...protocolos, newProtocolo];
    } else {
      updated = protocolos.map(p =>
        p.id === selectedProtocolo.id
          ? { ...p, ...formData, fechaActualizacion: new Date().toLocaleDateString('es-CO') }
          : p
      );
    }

    setProtocolos(updated);
    saveToLocalStorage(updated);
    setIsModalOpen(false);
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
    doc.text(protocolo.nombre, margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Categoría: ${protocolo.categoria}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Actualizado: ${protocolo.fechaActualizacion}`, margin, yPosition);
    yPosition += 10;

    // Línea divisoria
    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Contenido
    doc.setTextColor(0);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(protocolo.contenido, maxWidth);
    
    lines.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    doc.save(`${protocolo.nombre}.pdf`);
  };

  const filteredProtocolos = protocolos.filter(protocolo =>
    protocolo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProtocolos = filteredProtocolos.reduce((acc, protocolo) => {
    if (!acc[protocolo.categoria]) {
      acc[protocolo.categoria] = [];
    }
    acc[protocolo.categoria].push(protocolo);
    return acc;
  }, {});

  const categorias = Object.keys(groupedProtocolos).sort();

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando protocolos...</p>
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
                Gestión completa de documentos y procedimientos
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Protocolo
            </button>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar protocolos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Lista de Protocolos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-auto p-6">
          {filteredProtocolos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron protocolos
              </h3>
              <button
                onClick={handleCreate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Protocolo
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {categorias.map(categoria => (
                <div key={categoria}>
                  <div className="flex items-center gap-2 mb-4">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">{categoria}</h2>
                    <span className="text-sm text-gray-500">
                      ({groupedProtocolos[categoria].length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {groupedProtocolos[categoria].map(protocolo => (
                      <div
                        key={protocolo.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {protocolo.nombre}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {protocolo.descripcion}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                {protocolo.categoria}
                              </span>
                              <span>•</span>
                              <span>Actualizado: {protocolo.fechaActualizacion}</span>
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
                              onClick={() => handleDelete(protocolo.id)}
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
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedProtocolo.contenido}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Protocolo *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Proceso de revisión"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INTERNO ARQ">INTERNO ARQ</option>
                      <option value="INTERNO OBRA">INTERNO OBRA</option>
                      <option value="PROVEEDORES">PROVEEDORES</option>
                      <option value="CLIENTES">CLIENTES</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción Breve
                    </label>
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descripción corta del protocolo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido (Markdown) *
                    </label>
                    <textarea
                      value={formData.contenido}
                      onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={15}
                      placeholder="# Título&#10;&#10;## Sección&#10;&#10;- Punto 1&#10;- Punto 2"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Usa Markdown para formatear el texto. Ejemplo: # Título, ## Subtítulo, - Lista, **negrita**
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
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
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

export default ProtocolosCRUD;

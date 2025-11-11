import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Folder, ExternalLink } from 'lucide-react';

const Protocolos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lista de protocolos disponibles en la carpeta assets/Protocolos
  // Estos archivos se cargarán dinámicamente
  const protocolosData = [
    {
      id: 1,
      nombre: 'Proceso de revisión con Ronald',
      categoria: 'INTERNO ARQ',
      archivo: 'INTERNO ARQ - Proceso de revisión con Ronald.docx',
      descripcion: 'Protocolo interno para procesos de revisión arquitectónica',
      fechaActualizacion: '06/11/2025'
    },
    {
      id: 2,
      nombre: 'Protocolo de Nomenclatura',
      categoria: 'INTERNO ARQ',
      archivo: 'INTERNO ARQ - Protocolo de Nomenclatura de titulos y presentaciones.docx',
      descripcion: 'Nomenclatura estándar para títulos y presentaciones',
      fechaActualizacion: '05/11/2025'
    },
    {
      id: 3,
      nombre: 'Requerimientos de etapa de obra',
      categoria: 'INTERNO OBRA',
      archivo: 'INTERNO OBRA - Requerimientos de etapa de obra.docx',
      descripcion: 'Requerimientos y especificaciones para la etapa de obra',
      fechaActualizacion: '10/11/2025'
    },
    {
      id: 4,
      nombre: 'Instrucción sobre pagos a proveedores',
      categoria: 'PROVEEDORES',
      archivo: 'PROVEEDORES - Instrucción sobre pagos a proveedores persona natural.docx',
      descripcion: 'Instrucciones para pagos a proveedores persona natural',
      fechaActualizacion: '06/11/2025'
    },
    {
      id: 5,
      nombre: 'Solicitud de información para orden de compra',
      categoria: 'PROVEEDORES',
      archivo: 'PROVEEDORES - Solicitud de información y condiciones para orden de compra.docx',
      descripcion: 'Formato de solicitud de información para órdenes de compra',
      fechaActualizacion: '06/11/2025'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setProtocolos(protocolosData);
      setLoading(false);
    }, 300);
  }, []);

  const handleDownload = (archivo) => {
    // Crear enlace de descarga
    const filePath = `/src/assets/Protocolos/${archivo}`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = archivo;
    link.click();
  };

  const filteredProtocolos = protocolos.filter(protocolo =>
    protocolo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocolo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar por categoría
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
                Documentos y procedimientos estandarizados del estudio
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProtocolos.length} protocolo{filteredProtocolos.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar protocolos por nombre, categoría o descripción..."
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
              <p className="text-gray-500">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay protocolos disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {categorias.map(categoria => (
                <div key={categoria}>
                  {/* Título de Categoría */}
                  <div className="flex items-center gap-2 mb-4">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">{categoria}</h2>
                    <span className="text-sm text-gray-500">
                      ({groupedProtocolos[categoria].length})
                    </span>
                  </div>

                  {/* Lista de documentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedProtocolos[categoria].map(protocolo => (
                      <div
                        key={protocolo.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
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
                          <button
                            onClick={() => handleDownload(protocolo.archivo)}
                            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Descargar protocolo"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Información sobre los archivos</p>
              <p className="text-blue-700">
                Los protocolos están en formato DOCX. Para editarlos, descárgalos y ábrelos con Microsoft Word o compatible.
                Considera convertirlos a Markdown (.md) para visualización directa en la aplicación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protocolos;

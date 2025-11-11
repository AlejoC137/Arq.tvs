import React, { useState, useEffect } from 'react';
import { Users, Download, Search, Phone, Mail, MapPin, Building, ExternalLink } from 'lucide-react';

const Directorio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos hardcodeados del directorio
  // Puedes reemplazar esto con datos de un archivo JSON o TXT
  const directorioDatos = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      cargo: 'Arquitecto Principal',
      empresa: 'Estudio ARQ.TVS',
      email: 'juan.perez@arq.tvs',
      telefono: '+57 300 123 4567',
      area: 'Diseño',
      ubicacion: 'Bogotá, Colombia'
    },
    {
      id: 2,
      nombre: 'María González',
      cargo: 'Coordinadora de Proyectos',
      empresa: 'Estudio ARQ.TVS',
      email: 'maria.gonzalez@arq.tvs',
      telefono: '+57 301 234 5678',
      area: 'Gestión',
      ubicacion: 'Bogotá, Colombia'
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      cargo: 'Ingeniero Estructural',
      empresa: 'Estructuras CR',
      email: 'carlos@estructurascr.com',
      telefono: '+57 302 345 6789',
      area: 'Consultoría Externa',
      ubicacion: 'Medellín, Colombia'
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      cargo: 'Proveedor de Materiales',
      empresa: 'Materiales Prime',
      email: 'ana.martinez@materialesprime.com',
      telefono: '+57 303 456 7890',
      area: 'Proveedores',
      ubicacion: 'Cali, Colombia'
    },
    {
      id: 5,
      nombre: 'Roberto Silva',
      cargo: 'Contratista General',
      empresa: 'Construcciones Silva',
      email: 'roberto@construccionessilva.com',
      telefono: '+57 304 567 8901',
      area: 'Construcción',
      ubicacion: 'Bogotá, Colombia'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setContactos(directorioDatos);
      setLoading(false);
    }, 300);
  }, []);

  const handleDownload = () => {
    // Descargar archivo del directorio (si existe un .docx)
    const filePath = '/src/assets/Directorio/directorio.docx';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'directorio.docx';
    link.click();
  };

  const filteredContactos = contactos.filter(contacto =>
    contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar por área
  const groupedContactos = filteredContactos.reduce((acc, contacto) => {
    if (!acc[contacto.area]) {
      acc[contacto.area] = [];
    }
    acc[contacto.area].push(contacto);
    return acc;
  }, {});

  const areas = Object.keys(groupedContactos).sort();

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando directorio...</p>
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
                Contactos del equipo, proveedores y colaboradores
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {filteredContactos.length} contacto{filteredContactos.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Descargar directorio completo"
              >
                <Download className="w-4 h-4" />
                Descargar
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
              placeholder="Buscar por nombre, cargo, empresa o área..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Lista de Contactos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-auto p-6">
          {filteredContactos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron contactos
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay contactos disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {areas.map(area => (
                <div key={area}>
                  {/* Título de Área */}
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-600">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">{area}</h2>
                    <span className="text-sm text-gray-500">
                      ({groupedContactos[area].length})
                    </span>
                  </div>

                  {/* Lista de contactos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedContactos[area].map(contacto => (
                      <div
                        key={contacto.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all bg-white"
                      >
                        {/* Avatar y nombre */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {contacto.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {contacto.nombre}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {contacto.cargo}
                            </p>
                          </div>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{contacto.empresa}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`mailto:${contacto.email}`}
                              className="text-blue-600 hover:underline truncate"
                            >
                              {contacto.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`tel:${contacto.telefono}`}
                              className="hover:text-blue-600 truncate"
                            >
                              {contacto.telefono}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{contacto.ubicacion}</span>
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

        {/* Footer info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Gestión del Directorio</p>
              <p className="text-blue-700">
                Los contactos están actualmente hardcodeados en el componente. Para gestionar el directorio de forma dinámica,
                considera usar un archivo JSON o conectarlo a la base de datos Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directorio;

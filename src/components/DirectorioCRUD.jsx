import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Users, Download, Search, Phone, Mail, MapPin, Building, Plus,
  Edit, Trash2, Eye, X, Save, FileDown
} from 'lucide-react';

const DirectorioCRUD = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedContacto, setSelectedContacto] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    empresa: '',
    email: '',
    telefono: '',
    area: 'Diseño',
    ubicacion: ''
  });

  // Datos iniciales
  const contactosIniciales = [
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
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('directorio');
    if (stored) {
      setContactos(JSON.parse(stored));
    } else {
      setContactos(contactosIniciales);
      localStorage.setItem('directorio', JSON.stringify(contactosIniciales));
    }
    setLoading(false);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('directorio', JSON.stringify(data));
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      nombre: '',
      cargo: '',
      empresa: '',
      email: '',
      telefono: '',
      area: 'Diseño',
      ubicacion: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contacto) => {
    setModalMode('edit');
    setSelectedContacto(contacto);
    setFormData({ ...contacto });
    setIsModalOpen(true);
  };

  const handleView = (contacto) => {
    setModalMode('view');
    setSelectedContacto(contacto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      const updated = contactos.filter(c => c.id !== id);
      setContactos(updated);
      saveToLocalStorage(updated);
    }
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.email) {
      alert('Por favor completa los campos obligatorios (Nombre y Email)');
      return;
    }

    let updated;
    if (modalMode === 'create') {
      const newContacto = {
        ...formData,
        id: Date.now()
      };
      updated = [...contactos, newContacto];
    } else {
      updated = contactos.map(c =>
        c.id === selectedContacto.id ? { ...c, ...formData } : c
      );
    }

    setContactos(updated);
    saveToLocalStorage(updated);
    setIsModalOpen(false);
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
    
    // Tabla
    const tableData = contactos.map(c => [
      c.nombre,
      c.cargo,
      c.empresa,
      c.email,
      c.telefono,
      c.area
    ]);

    doc.autoTable({
      startY: 35,
      head: [['Nombre', 'Cargo', 'Empresa', 'Email', 'Teléfono', 'Área']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('directorio-completo.pdf');
  };

  const handleExportContactPDF = (contacto) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(contacto.nombre, 20, yPosition);
    yPosition += 10;

    // Información
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    const info = [
      [`Cargo: ${contacto.cargo}`],
      [`Empresa: ${contacto.empresa}`],
      [`Email: ${contacto.email}`],
      [`Teléfono: ${contacto.telefono}`],
      [`Área: ${contacto.area}`],
      [`Ubicación: ${contacto.ubicacion}`]
    ];

    doc.autoTable({
      startY: yPosition,
      body: info,
      theme: 'plain',
      styles: { fontSize: 11 }
    });

    doc.save(`contacto-${contacto.nombre.replace(/\s+/g, '-')}.pdf`);
  };

  const filteredContactos = contactos.filter(contacto =>
    contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Gestión completa de contactos y colaboradores
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportAllPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Exportar Todo
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Contacto
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
              placeholder="Buscar contactos..."
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
              <button
                onClick={handleCreate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Agregar Primer Contacto
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {areas.map(area => (
                <div key={area}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-600">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">{area}</h2>
                    <span className="text-sm text-gray-500">
                      ({groupedContactos[area].length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedContactos[area].map(contacto => (
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
                            onClick={() => handleDelete(contacto.id)}
                            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
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
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contacto.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`tel:${contacto.telefono}`}
                              className="hover:text-blue-600 truncate"
                              onClick={(e) => e.stopPropagation()}
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
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-3xl">
                      {selectedContacto.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedContacto.nombre}</h3>
                      <p className="text-lg text-gray-600">{selectedContacto.cargo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <InfoRow icon={Building} label="Empresa" value={selectedContacto.empresa} />
                    <InfoRow icon={Mail} label="Email" value={selectedContacto.email} isLink={`mailto:${selectedContacto.email}`} />
                    <InfoRow icon={Phone} label="Teléfono" value={selectedContacto.telefono} isLink={`tel:${selectedContacto.telefono}`} />
                    <InfoRow icon={Users} label="Área" value={selectedContacto.area} />
                    <InfoRow icon={MapPin} label="Ubicación" value={selectedContacto.ubicacion} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Arquitecto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: ARQ.TVS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área
                      </label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Diseño">Diseño</option>
                        <option value="Gestión">Gestión</option>
                        <option value="Consultoría Externa">Consultoría Externa</option>
                        <option value="Proveedores">Proveedores</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ciudad, País"
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

// Componente auxiliar para mostrar información
const InfoRow = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
      {isLink ? (
        <a href={isLink} className="text-blue-600 hover:underline break-words">
          {value}
        </a>
      ) : (
        <p className="text-gray-900 break-words">{value}</p>
      )}
    </div>
  </div>
);

export default DirectorioCRUD;

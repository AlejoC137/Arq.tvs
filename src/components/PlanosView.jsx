import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  FileText,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ruler,
  Building
} from 'lucide-react';

const ETAPAS_PROYECTO = {
  ARQUITECTONICA: 'Arquitectónica',
  TECNICA: 'Técnica', 
  CONSTRUCCION: 'Construcción'
};

const ESCALAS_PLANOS = [
  '1:1000', '1:500', '1:250', '1:200', '1:100', 
  '1:75', '1:50', '1:25', '1:20', '1:10', '1:5', '1:1'
];

const TIPOS_PLANO = [
  'Planta Arquitectónica', 'Planta Estructural', 'Planta Instalaciones',
  'Cortes', 'Fachadas', 'Detalles Constructivos', 'Planta Cimentación',
  'Planta Cubierta', 'Localización', 'Paisajismo', 'Instalaciones Eléctricas',
  'Instalaciones Hidráulicas', 'Instalaciones Gas', 'Instalaciones Especiales'
];

const ESTADOS_PLANO = [
  'No Iniciado', 'En Desarrollo', 'Revisión Interna',
  'Revisión Cliente', 'Aprobado', 'En Construcción', 'As Built'
];

// Lista de plantillas de planos por etapas
const planosTemplates = {
  [ETAPAS_PROYECTO.ARQUITECTONICA]: [
    {
      id: 'arq-001',
      codigo: 'A-01',
      nombre: 'Plano de Localización General',
      escala: '1:2000',
      tiempoEstimado: '2-3 días',
      contenido: 'Ubicación del proyecto en el contexto urbano, vías de acceso, norte magnético',
      requiereEspecialista: false,
      categoria: 'Localización y Contexto'
    },
    {
      id: 'arq-002',
      codigo: 'A-02',
      nombre: 'Plano Topográfico',
      escala: '1:500',
      tiempoEstimado: '3-5 días',
      contenido: 'Curvas de nivel, cotas existentes, linderos, construcciones existentes',
      requiereEspecialista: true,
      categoria: 'Localización y Contexto'
    },
    {
      id: 'arq-003',
      codigo: 'A-03',
      nombre: 'Plano de Implantación',
      escala: '1:200',
      tiempoEstimado: '2-4 días',
      contenido: 'Ubicación de edificaciones, retiros, áreas verdes, accesos vehiculares y peatonales',
      requiereEspecialista: false,
      categoria: 'Localización y Contexto'
    },
    {
      id: 'arq-004',
      codigo: 'A-10',
      nombre: 'Plantas de Locales',
      escala: '1:100',
      tiempoEstimado: '3-5 días',
      contenido: 'Distribución de espacios, cotas, áreas, mobiliario fijo, nombres de locales por piso',
      requiereEspecialista: false,
      categoria: 'Plantas Arquitectónicas'
    },
    {
      id: 'arq-005',
      codigo: 'A-12',
      nombre: 'Planta de Cubiertas',
      escala: '1:100',
      tiempoEstimado: '2-3 días',
      contenido: 'Pendientes, canaletas, bajantes, materiales de cubierta, accesos',
      requiereEspecialista: false,
      categoria: 'Plantas Arquitectónicas'
    },
    {
      id: 'arq-006',
      codigo: 'A-20',
      nombre: 'Cortes Arquitectónicos',
      escala: '1:100',
      tiempoEstimado: '4-6 días',
      contenido: 'Alturas interiores, entrepisos, escaleras, niveles, pendientes de cubierta (longitudinales y transversales)',
      requiereEspecialista: false,
      categoria: 'Cortes Arquitectónicos'
    },
    {
      id: 'arq-007',
      codigo: 'A-30',
      nombre: 'Fachadas Arquitectónicas',
      escala: '1:100',
      tiempoEstimado: '6-10 días',
      contenido: 'Materiales, acabados, ventanería, puertas, cotas verticales (todas las orientaciones)',
      requiereEspecialista: false,
      categoria: 'Fachadas Arquitectónicas'
    },
    {
      id: 'arq-008',
      codigo: 'A-40',
      nombre: 'Paisajismo y Exteriores',
      escala: '1:200',
      tiempoEstimado: '8-12 días',
      contenido: 'Especies vegetales, senderos, mobiliario exterior, iluminación, detalles de jardinería',
      requiereEspecialista: true,
      categoria: 'Paisajismo y Exteriores'
    },
    {
      id: 'arq-009',
      codigo: 'A-50',
      nombre: 'Planos Normativa Urbanística',
      escala: '1:500',
      tiempoEstimado: '2-3 días',
      contenido: 'Cesiones, retiros, índices urbanísticos, áreas construidas, evacuación',
      requiereEspecialista: false,
      categoria: 'Normativa'
    }
  ],
  
  [ETAPAS_PROYECTO.TECNICA]: [
    {
      id: 'tec-001',
      codigo: 'E-10',
      nombre: 'Plantas Instalaciones Eléctricas',
      escala: '1:100',
      tiempoEstimado: '6-10 días',
      contenido: 'Salidas eléctricas, interruptores, tomas, iluminación, tableros (todos los niveles)',
      requiereEspecialista: true,
      categoria: 'Instalaciones Eléctricas'
    },
    {
      id: 'tec-002',
      codigo: 'E-20',
      nombre: 'Diagrama Unifilar Eléctrico',
      escala: 'S/E',
      tiempoEstimado: '3-5 días',
      contenido: 'Tableros principales, circuitos, protecciones, cargas',
      requiereEspecialista: true,
      categoria: 'Instalaciones Eléctricas'
    },
    {
      id: 'tec-003',
      codigo: 'H-10',
      nombre: 'Plantas Instalaciones Hidráulicas',
      escala: '1:100',
      tiempoEstimado: '6-10 días',
      contenido: 'Red de agua fría, caliente, puntos hidráulicos, diámetros (todos los niveles)',
      requiereEspecialista: true,
      categoria: 'Instalaciones Hidráulicas'
    },
    {
      id: 'tec-004',
      codigo: 'S-10',
      nombre: 'Plantas Instalaciones Sanitarias',
      escala: '1:100',
      tiempoEstimado: '6-10 días',
      contenido: 'Red de desagües, ventilaciones, cajas de inspección (todos los niveles)',
      requiereEspecialista: true,
      categoria: 'Instalaciones Sanitarias'
    },
    {
      id: 'tec-008',
      codigo: 'H-20',
      nombre: 'Esquema Isométrico Hidráulico',
      escala: 'S/E',
      tiempoEstimado: '3-4 días',
      contenido: 'Redes tridimensionales, alturas, diámetros, válvulas',
      requiereEspecialista: true,
      categoria: 'Instalaciones Hidráulicas'
    },
    {
      id: 'tec-009',
      codigo: 'G-10',
      nombre: 'Planta Instalaciones de Gas',
      escala: '1:100',
      tiempoEstimado: '3-5 días',
      contenido: 'Red de gas, puntos de conexión, reguladores, ventilaciones',
      requiereEspecialista: true,
      categoria: 'Instalaciones de Gas'
    },
    {
      id: 'tec-010',
      codigo: 'G-20',
      nombre: 'Esquema Isométrico de Gas',
      escala: 'S/E',
      tiempoEstimado: '2-3 días',
      contenido: 'Redes tridimensionales, diámetros, válvulas, reguladores',
      requiereEspecialista: true,
      categoria: 'Instalaciones de Gas'
    },
    {
      id: 'tec-011',
      codigo: 'SE-10',
      nombre: 'Planta Sistema de Seguridad',
      escala: '1:100',
      tiempoEstimado: '2-4 días',
      contenido: 'Cámaras, sensores, alarmas, cableado, central',
      requiereEspecialista: true,
      categoria: 'Instalaciones Especiales'
    },
    {
      id: 'tec-012',
      codigo: 'AU-10',
      nombre: 'Planta Sistema de Automatización',
      escala: '1:100',
      tiempoEstimado: '3-5 días',
      contenido: 'Domótica, control de iluminación, climatización',
      requiereEspecialista: true,
      categoria: 'Instalaciones Especiales'
    },
    {
      id: 'tec-013',
      codigo: 'C-10',
      nombre: 'Planta Instalaciones de Comunicaciones',
      escala: '1:100',
      tiempoEstimado: '2-4 días',
      contenido: 'TV, internet, telefonía, puntos de red',
      requiereEspecialista: true,
      categoria: 'Instalaciones de Comunicaciones'
    },
    {
      id: 'tec-014',
      codigo: 'MA-10',
      nombre: 'Planta de Manejo Ambiental',
      escala: '1:200',
      tiempoEstimado: '4-6 días',
      contenido: 'Manejo de aguas lluvias, residuos, energías alternativas',
      requiereEspecialista: true,
      categoria: 'Sostenibilidad'
    },
    {
      id: 'tec-015',
      codigo: 'I-20',
      nombre: 'Detalles Instalaciones Eléctricas',
      escala: '1:10',
      tiempoEstimado: '3-4 días',
      contenido: 'Conexiones especiales, tableros, acometidas',
      requiereEspecialista: true,
      categoria: 'Detalles Técnicos'
    },
    {
      id: 'tec-016',
      codigo: 'I-21',
      nombre: 'Detalles Instalaciones Sanitarias',
      escala: '1:20',
      tiempoEstimado: '3-4 días',
      contenido: 'Conexiones especiales, cajas de inspección, bajantes',
      requiereEspecialista: true,
      categoria: 'Detalles Técnicos'
    },
    {
      id: 'tec-017',
      codigo: 'I-22',
      nombre: 'Detalles Instalaciones de Gas',
      escala: '1:10',
      tiempoEstimado: '2-3 días',
      contenido: 'Conexiones, reguladores, ventilaciones, gabinetes',
      requiereEspecialista: true,
      categoria: 'Detalles Técnicos'
    },
    {
      id: 'tec-018',
      codigo: 'R-10',
      nombre: 'Planta General de Redes',
      escala: '1:500',
      tiempoEstimado: '5-8 días',
      contenido: 'Identificación ubicación de cajas de inspección, ingresos a casas y contadores',
      requiereEspecialista: true,
      categoria: 'Redes Generales'
    }
  ],
  
  [ETAPAS_PROYECTO.CONSTRUCCION]: [
    {
      id: 'cons-001',
      codigo: 'EST-10',
      nombre: 'Planta de Cimentación',
      escala: '1:75',
      tiempoEstimado: '5-8 días',
      contenido: 'Zapatas, vigas de cimentación, muros de contención, cotas, refuerzos',
      requiereEspecialista: true,
      categoria: 'Estructuras'
    },
    {
      id: 'cons-002',
      codigo: 'EST-11',
      nombre: 'Plantas Estructurales',
      escala: '1:75',
      tiempoEstimado: '8-12 días',
      contenido: 'Vigas, columnas, losas, dimensiones, refuerzos, niveles (todos los pisos)',
      requiereEspecialista: true,
      categoria: 'Estructuras'
    },
    {
      id: 'cons-003',
      codigo: 'EST-13',
      nombre: 'Planta Estructural de Cubierta',
      escala: '1:75',
      tiempoEstimado: '3-5 días',
      contenido: 'Estructura de cubierta, cerchas, correas, anclajes',
      requiereEspecialista: true,
      categoria: 'Estructuras'
    },
    {
      id: 'cons-005',
      codigo: 'EST-20',
      nombre: 'Detalles Estructurales',
      escala: '1:10',
      tiempoEstimado: '6-10 días',
      contenido: 'Conexiones, nudos, anclajes, refuerzos especiales',
      requiereEspecialista: true,
      categoria: 'Estructuras'
    },
    {
      id: 'cons-005',
      codigo: 'MAM-10',
      nombre: 'Plantas de Mampostería',
      escala: '1:50',
      tiempoEstimado: '5-8 días',
      contenido: 'Muros, espesores, materiales, hiladas, refuerzos (todos los niveles)',
      requiereEspecialista: false,
      categoria: 'Mampostería y Acabados'
    },
    {
      id: 'cons-006',
      codigo: 'AC-10',
      nombre: 'Plantas de Acabados',
      escala: '1:50',
      tiempoEstimado: '6-10 días',
      contenido: 'Pisos, enchapes, cielos rasos, pintura, especificaciones (todos los niveles)',
      requiereEspecialista: false,
      categoria: 'Mampostería y Acabados'
    },
    {
      id: 'cons-007',
      codigo: 'AC-20',
      nombre: 'Detalles de Acabados',
      escala: '1:5',
      tiempoEstimado: '5-8 días',
      contenido: 'Encuentros, molduras, zócalos, transiciones',
      requiereEspecialista: false,
      categoria: 'Mampostería y Acabados'
    },
    {
      id: 'cons-011',
      codigo: 'PV-10',
      nombre: 'Planta de Puertas y Ventanas',
      escala: '1:50',
      tiempoEstimado: '2-4 días',
      contenido: 'Ubicación, dimensiones, tipos, sentido de apertura',
      requiereEspecialista: false,
      categoria: 'Carpintería y Ventanería'
    },
    {
      id: 'cons-012',
      codigo: 'PV-20',
      nombre: 'Detalles de Puertas',
      escala: '1:10',
      tiempoEstimado: '3-5 días',
      contenido: 'Marcos, hojas, herrajes, acabados',
      requiereEspecialista: false,
      categoria: 'Carpintería y Ventanería'
    },
    {
      id: 'cons-013',
      codigo: 'PV-21',
      nombre: 'Detalles de Ventanas',
      escala: '1:10',
      tiempoEstimado: '3-5 días',
      contenido: 'Marcos, hojas, vidrios, herrajes, sellados',
      requiereEspecialista: false,
      categoria: 'Carpintería y Ventanería'
    },
    {
      id: 'cons-014',
      codigo: 'CAR-10',
      nombre: 'Detalles de Carpintería',
      escala: '1:10',
      tiempoEstimado: '6-10 días',
      contenido: 'Closets, muebles empotrados, repisas, divisiones',
      requiereEspecialista: false,
      categoria: 'Carpintería y Ventanería'
    },
    {
      id: 'cons-015',
      codigo: 'ESC-10',
      nombre: 'Detalles de Escaleras',
      escala: '1:25',
      tiempoEstimado: '4-6 días',
      contenido: 'Estructura, peldaños, barandas, pasamanos',
      requiereEspecialista: false,
      categoria: 'Elementos Especiales'
    },
    {
      id: 'cons-016',
      codigo: 'BAÑ-10',
      nombre: 'Detalles de Baños',
      escala: '1:25',
      tiempoEstimado: '3-5 días',
      contenido: 'Aparatos sanitarios, enchapes, instalaciones',
      requiereEspecialista: false,
      categoria: 'Elementos Especiales'
    },
    {
      id: 'cons-017',
      codigo: 'COC-10',
      nombre: 'Detalles de Cocina',
      escala: '1:25',
      tiempoEstimado: '4-7 días',
      contenido: 'Muebles, electrodomésticos, instalaciones, enchapes',
      requiereEspecialista: false,
      categoria: 'Elementos Especiales'
    },
    {
      id: 'cons-018',
      codigo: 'DET-10',
      nombre: 'Detalles Constructivos Generales',
      escala: '1:10',
      tiempoEstimado: '5-8 días',
      contenido: 'Encuentros especiales, juntas, impermeabilizaciones',
      requiereEspecialista: false,
      categoria: 'Detalles Generales'
    },
    {
      id: 'cons-019',
      codigo: 'EV-10',
      nombre: 'Plano de Evacuación',
      escala: '1:100',
      tiempoEstimado: '2-3 días',
      contenido: 'Rutas de evacuación, señalización, extintores, salidas',
      requiereEspecialista: false,
      categoria: 'Normativa y Seguridad'
    },
    {
      id: 'cons-020',
      codigo: 'CON-10',
      nombre: 'Planos de Construcción por Fases',
      escala: '1:100',
      tiempoEstimado: '3-5 días',
      contenido: 'Secuencia constructiva, etapas, cronograma gráfico',
      requiereEspecialista: false,
      categoria: 'Construcción'
    },
    {
      id: 'cons-021',
      codigo: 'ESP-10',
      nombre: 'Planos de Especificaciones Técnicas',
      escala: 'S/E',
      tiempoEstimado: '4-6 días',
      contenido: 'Materiales, acabados, normas técnicas, calidades',
      requiereEspecialista: false,
      categoria: 'Especificaciones'
    },
    {
      id: 'cons-022',
      codigo: 'AS-10',
      nombre: 'Planos As-Built',
      escala: '1:100',
      tiempoEstimado: '5-10 días',
      contenido: 'Planos finales como construido, modificaciones ejecutadas',
      requiereEspecialista: false,
      categoria: 'As-Built'
    }
  ]
};

// Obtener todas las plantillas en un arreglo plano
const getAllTemplates = () => {
  return Object.entries(planosTemplates).flatMap(([etapa, templates]) => 
    templates.map(template => ({ ...template, etapa }))
  );
};

const PlanosView = () => {
  const [templates] = useState(getAllTemplates());
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [filters, setFilters] = useState({
    etapa: '',
    categoria: '',
    especialista: '',
    escala: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState('');

  // Aplicar filtros
  useEffect(() => {
    let filtered = templates;

    if (filters.search) {
      filtered = filtered.filter(template =>
        template.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        template.categoria.toLowerCase().includes(filters.search.toLowerCase()) ||
        template.contenido.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.etapa) {
      filtered = filtered.filter(template => template.etapa === filters.etapa);
    }

    if (filters.categoria) {
      filtered = filtered.filter(template => template.categoria === filters.categoria);
    }

    if (filters.especialista !== '') {
      filtered = filtered.filter(template => 
        template.requiereEspecialista.toString() === filters.especialista
      );
    }

    if (filters.escala) {
      filtered = filtered.filter(template => template.escala === filters.escala);
    }

    setFilteredTemplates(filtered);
  }, [templates, filters]);

  // Funciones utilitarias
  const getEtapaColor = (etapa) => {
    const colors = {
      'Arquitectónica': 'bg-blue-100 text-blue-800',
      'Técnica': 'bg-purple-100 text-purple-800',
      'Construcción': 'bg-orange-100 text-orange-800'
    };
    return colors[etapa] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      'No Iniciado': 'bg-gray-100 text-gray-800',
      'En Desarrollo': 'bg-blue-100 text-blue-800',
      'Revisión Interna': 'bg-yellow-100 text-yellow-800',
      'Revisión Cliente': 'bg-orange-100 text-orange-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'En Construcción': 'bg-purple-100 text-purple-800',
      'As Built': 'bg-indigo-100 text-indigo-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  // Obtener categorías únicas por etapa
  const getCategoriasByEtapa = (etapa) => {
    return [...new Set(templates.filter(t => t.etapa === etapa).map(t => t.categoria))];
  };

  const getAllCategorias = () => {
    return [...new Set(templates.map(t => t.categoria))];
  };

  const getAllEscalas = () => {
    return [...new Set(templates.map(t => t.escala))].sort();
  };

  // Estadísticas
  const stats = {
    total: filteredTemplates.length,
    arquitectonica: filteredTemplates.filter(t => t.etapa === ETAPAS_PROYECTO.ARQUITECTONICA).length,
    tecnica: filteredTemplates.filter(t => t.etapa === ETAPAS_PROYECTO.TECNICA).length,
    construccion: filteredTemplates.filter(t => t.etapa === ETAPAS_PROYECTO.CONSTRUCCION).length,
    conEspecialista: filteredTemplates.filter(t => t.requiereEspecialista).length,
    sinEspecialista: filteredTemplates.filter(t => !t.requiereEspecialista).length
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catálogo de Planos Arquitectónicos</h1>
            <p className="text-gray-600">Plantillas estándar organizadas por etapas: Arquitectónica, Técnica y Construcción</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filtros
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(filteredTemplates, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', `catalogo_planos_${new Date().toISOString().split('T')[0]}.json`);
                linkElement.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Descargar Catálogo
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Total Plantillas: <strong>{stats.total}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">Arquitectónica: <strong>{stats.arquitectonica}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler size={16} className="text-purple-500" />
            <span className="text-sm text-gray-600">Técnica: <strong>{stats.tecnica}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">Construcción: <strong>{stats.construccion}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-red-500" />
            <span className="text-sm text-gray-600">Requiere Especialista: <strong>{stats.conEspecialista}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">Estándar: <strong>{stats.sinEspecialista}</strong></span>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="grid grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar planos..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
              <select
                value={filters.etapa}
                onChange={(e) => setFilters(prev => ({ ...prev, etapa: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las Etapas</option>
                {Object.values(ETAPAS_PROYECTO).map(etapa => (
                  <option key={etapa} value={etapa}>{etapa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={filters.categoria}
                onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las Categorías</option>
                {getAllCategorias().map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escala</label>
              <select
                value={filters.escala}
                onChange={(e) => setFilters(prev => ({ ...prev, escala: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las Escalas</option>
                {getAllEscalas().map(escala => (
                  <option key={escala} value={escala}>{escala}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialista</label>
              <select
                value={filters.especialista}
                onChange={(e) => setFilters(prev => ({ ...prev, especialista: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Requiere Especialista</option>
                <option value="false">No Requiere Especialista</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full bg-white">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b min-w-[300px]">Nombre del Plano</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Escala</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Etapa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tiempo Estimado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Especialista</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b min-w-[400px]">Contenido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTemplates.map((template, index) => (
                <tr 
                  key={template.id} 
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                >
                  <td className="px-4 py-3 border-r font-mono text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold">
                      {template.codigo}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r font-medium">
                    {template.nombre}
                  </td>
                  <td className="px-4 py-3 border-r">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {template.escala}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.etapa === 'Arquitectónica' ? 'bg-blue-100 text-blue-800' :
                      template.etapa === 'Técnica' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {template.etapa}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r text-sm">
                    {template.categoria}
                  </td>
                  <td className="px-4 py-3 border-r">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {template.tiempoEstimado}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r text-center">
                    {template.requiereEspecialista ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Sí
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {template.contenido}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlanosView;

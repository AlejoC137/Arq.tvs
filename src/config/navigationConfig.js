// ========================================
// NAVIGATION CONFIGURATION
// ========================================
// Configuración centralizada de todas las pestañas del sistema
// Para agregar una nueva pestaña, simplemente añade un nuevo objeto al array

import {
  LayoutDashboard,
  Table,
  FileText,
  Users,
  ListTodo,
  FolderKanban,
  BookOpen,
  Contact,
  Calendar,
  Layers, // Added for Espacios tab
  Box // Added for Componentes tab
} from 'lucide-react';

// Import de componentes (lazy loading para mejor performance)
import { lazy } from 'react';

const PreModalProjects = lazy(() => import('../components/PreModalProjects'));
const PlanosView = lazy(() => import('../components/PlanosView'));
const TeamView = lazy(() => import('../components/TeamView'));
const ProjectDashboard = lazy(() => import('../components/ProjectDashboard'));
const Materiales = lazy(() => import('../components/Materiales'));
const Protocolos = lazy(() => import('../components/ProtocolosSupabase'));
const Directorio = lazy(() => import('../components/DirectorioSupabase'));
const ProjectKanbanView = lazy(() => import('../components/ProjectKanbanView'));
const ProjectExcelView = lazy(() => import('../components/ProjectExcelView'));
const CalendarView = lazy(() => import('../components/CalendarView'));
const SpacesManager = lazy(() => import('../pages/SpacesManager')); // Added lazy import
const ComponentsManager = lazy(() => import('../pages/ComponentsManager')); // Added lazy import

// ========================================
// TAB CONFIGURATION
// ========================================

/**
 * Configuración de tabs/pestañas de la aplicación
 * 
 * @typedef {Object} TabConfig
 * @property {string} id - Identificador único del tab
 * @property {string} path - Ruta de navegación
 * @property {string} label - Texto visible en el menú
 * @property {React.Component} icon - Ícono del tab (Lucide React)
 * @property {string} [description] - Descripción breve (opcional)
 * @property {React.Component} component - Componente a renderizar
 * @property {boolean} [enabled] - Si el tab está habilitado (default: true)
 * @property {string[]} [requiredPermissions] - Permisos requeridos (futuro)
 * @property {string} [category] - Categoría para agrupar tabs
 */

export const navigationTabs = [
  {
    id: 'proyectos',
    path: '/proyectos',
    label: 'Proyectos',
    icon: FolderKanban,
    description: 'Gestión y visualización de proyectos',
    component: PreModalProjects,
    enabled: true,
    category: 'Gestión'
  },
  {
    id: 'equipo',
    path: '/equipo',
    label: 'Equipo',
    icon: Users,
    description: 'Gestión de tareas por persona',
    component: TeamView,
    enabled: true,
    category: 'Gestión'
  },
  {
    id: 'planos',
    path: '/planos',
    label: 'Plantillas de Entregables',
    icon: FileText,
    description: 'Gestión de planos por etapas',
    component: PlanosView,
    enabled: true,
    category: 'Documentos'
  },
  {
    id: 'Materiales',
    path: '/Materiales',
    label: 'Materiales',
    icon: LayoutDashboard,
    description: 'Gráficos y estadísticas ejecutivas',
    component: Materiales,
    enabled: true,
    category: 'Análisis'
  },
  {
    id: 'Protocolos',
    path: '/Protocolos',
    label: 'Protocolos',
    icon: BookOpen,
    description: 'Documentos y procedimientos del estudio',
    component: Protocolos,
    enabled: true,
    category: 'Documentos'
  },
  // Novedades: Espacios y Componentes
  {
    id: 'espacios',
    path: '/espacios',
    label: 'Espacios',
    icon: Layers, // Changed to component reference
    description: 'Gestión de espacios por proyecto',
    component: SpacesManager, // Changed to component reference
    enabled: true, // Added enabled property
    category: 'Gestión' // Added category property
  },
  {
    id: 'componentes',
    path: '/componentes',
    label: 'Componentes',
    icon: Box, // Changed to component reference
    description: 'Catálogo de componentes y acabados',
    component: ComponentsManager, // Changed to component reference
    enabled: true, // Added enabled property
    category: 'Gestión' // Added category property
  },
  {
    id: 'Directorio',
    path: '/Directorio',
    label: 'Directorio',
    icon: Contact,
    description: 'Contactos Internos',
    component: Directorio,
    enabled: true,
    category: 'Gestión'
  },
  {
    id: 'calendario',
    path: '/calendario',
    label: 'Calendario',
    icon: Calendar,
    description: 'Vista de calendario de tareas',
    component: CalendarView,
    enabled: true,
    category: 'Gestión'
  },
  // {
  //   id: 'kanban',
  //   path: '/kanban',
  //   label: 'Vista Kanban',
  //   icon: ListTodo,
  //   description: 'Tablero Kanban de tareas',
  //   component: ProjectKanbanView,
  //   enabled: false, // Deshabilitado por ahora
  //   category: 'Gestión'
  // },
  // {
  //   id: 'excel',
  //   path: '/excel',
  //   label: 'Vista Excel',
  //   icon: Table,
  //   description: 'Vista tipo Excel de tareas',
  //   component: ProjectExcelView,
  //   enabled: false, // Deshabilitado por ahora
  //   category: 'Gestión'
  // }
];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Obtiene solo los tabs habilitados
 */
export const getEnabledTabs = () => {
  return navigationTabs.filter(tab => tab.enabled !== false);
};

/**
 * Obtiene tabs por categoría
 */
export const getTabsByCategory = (category) => {
  return navigationTabs.filter(tab =>
    tab.category === category && tab.enabled !== false
  );
};

/**
 * Obtiene un tab por su ID
 */
export const getTabById = (id) => {
  return navigationTabs.find(tab => tab.id === id);
};

/**
 * Obtiene un tab por su path
 */
export const getTabByPath = (path) => {
  return navigationTabs.find(tab => tab.path === path);
};

/**
 * Obtiene la ruta por defecto (primera tab habilitada)
 */
export const getDefaultRoute = () => {
  const enabledTabs = getEnabledTabs();
  return enabledTabs.length > 0 ? enabledTabs[0].path : '/';
};

/**
 * Agrupa tabs por categoría
 */
export const getGroupedTabs = () => {
  const enabled = getEnabledTabs();
  return enabled.reduce((acc, tab) => {
    const category = tab.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tab);
    return acc;
  }, {});
};

export default navigationTabs;

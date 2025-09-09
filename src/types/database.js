// Staff table interface
export const StaffSchema = {
  id: 'string', // UUID
  name: 'string',
  role_description: 'string',
  Tasks: 'string' // Could be empty or contain task references
};

// Stage table interface  
export const StageSchema = {
  id: 'string', // UUID
  name: 'string',
  description: 'string',
  objectives: 'string',
  deliverables: 'string', 
  products: 'string',
  stakeholders: 'string'
};

// Tasks table interface
export const TasksSchema = {
  id: 'string', // UUID
  category: 'string',
  task_description: 'string',
  status: 'string', // 'Pendiente', 'En Diseño', 'En Progreso', 'Aprobación Requerida', 'Bloqueado', 'Completo', etc.
  notes: 'string',
  project_id: 'string', // UUID foreign key
  staff_id: 'string', // UUID foreign key  
  stage_id: 'string' // UUID foreign key
};

// Projects table interface
export const ProjectsSchema = {
  id: 'string', // UUID
  name: 'string',
  status: 'string', // 'Pendiente', 'En Progreso', 'En Diseño', etc.
  resp: 'string' // Responsible person
};

// Entregables template table interface
export const EntregablesTemplateSchema = {
  id: 'string', // UUID
  entregable_nombre: 'string',
  tipo: 'string', // '2D', '3D', '2D/3D'
  vistaTipo: 'string', // 'Planta', 'Alzado', 'Perspectiva', etc.
  escala_tipica: 'string', // '1:50', '1:100', 'Sin escala', etc.
  software_utilizado: 'string',
  Stage_id: 'string', // UUID foreign key
  vistaSubTipo: 'string'
};

// Status options for tasks
export const TaskStatusOptions = [
  'Pendiente',
  'En Diseño', 
  'En Progreso',
  'Aprobación Requerida',
  'Bloqueado',
  'En Discusión',
  'Completo'
];

// Status options for projects
export const ProjectStatusOptions = [
  'Pendiente',
  'En Progreso',
  'En Diseño',
  'Pausado',
  'Completo'
];

// Task categories
export const TaskCategories = [
  'Diseño estructural',
  'Revisión de diseño', 
  'Puertas',
  'Baños',
  'Exterior',
  'Obra',
  'Redes',
  'Interior',
  'Paisajismo',
  'Diseño técnico',
  'Fachada',
  'Entrega a Curaduría',
  'Habitación de huéspedes',
  'Diseño de espacio público',
  'General',
  'Acabados'
];

// View types for entregables
export const ViewTypes = [
  'Planta',
  'Alzado', 
  'Sección',
  'Perspectiva',
  'Axonométrica',
  'Isométrica',
  'Diagrama',
  'Plano Urbano',
  'Sección/Alzado Detallado'
];

// Software options
export const SoftwareOptions = [
  'Revit',
  'AutoCAD',
  'Adobe Suite',
  'Lumion/VRay',
  'SketchUp/Revit',
  'AutoCAD/GIS',
  'Revit/AutoCAD'
];

// Tipo options for entregables
export const EntregableTypes = [
  '2D',
  '3D', 
  '2D/3D'
];

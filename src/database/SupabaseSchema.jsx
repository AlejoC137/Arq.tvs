// MODELO DE BASE DE DATOS SUPABASE PARA ARQ.TVS
// Este archivo define la estructura de tablas necesaria para conectar con Supabase

// ================================
// CONFIGURACIÓN DE SUPABASE
// ================================
// Usamos el cliente ya configurado en config/supabaseClient
import supabaseClient from '../config/supabaseClient';
export const supabase = supabaseClient;

// ================================
// ESQUEMAS DE TABLAS PRINCIPALES
// ================================

/**
 * TABLA: Proyectos (ADAPTADA A CSV: Proyectos_rows.csv)
 * CSV tiene: id, name, status, resp
 */
export const PROYECTOS_SCHEMA = {
  table_name: 'Proyectos',
  columns: {
    id: { type: 'uuid', primary_key: true }, // UUID existente del CSV
    name: { type: 'varchar(100)', not_null: true }, // Nombre del proyecto del CSV
    status: {
      type: 'varchar(30)',
      check: "status IN ('En Progreso', 'Pendiente', 'En Diseño', 'Completado', 'Pausado')",
      default: "'Pendiente'"
    },
    resp: { type: 'text' }, // Campo responsable del CSV (puede estar vacío)
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

/**
 * TABLA: categorias
 * Descripción: Categorías de tareas (Diseño Estructural, Paisajismo, etc.)
 */
export const CATEGORIES_SCHEMA = {
  table_name: 'categorias',
  columns: {
    id: { type: 'uuid', primary_key: true, default: 'uuid_generate_v4()' },
    nombre: { type: 'varchar(100)', unique: true, not_null: true },
    descripcion: { type: 'text' },
    color: { type: 'varchar(7)', default: "'#6B7280'" }, // Código hexadecimal
    icono: { type: 'varchar(50)' }, // Nombre del ícono de Lucide
    etapa_principal: {
      type: 'varchar(30)',
      check: "etapa_principal IN ('Arquitectónica', 'Técnica', 'Construcción')"
    },
    created_at: { type: 'timestamptz', default: 'now()' }
  }
};

/**
 * TABLA: Staff (ADAPTADA A CSV: Staff_rows.csv)
 * CSV tiene: id, name, role_description, Tasks
 */
export const STAFF_SCHEMA = {
  table_name: 'Staff',
  columns: {
    id: { type: 'uuid', primary_key: true }, // UUID existente del CSV
    name: { type: 'varchar(100)', not_null: true }, // Nombre completo del CSV
    role_description: { type: 'text', not_null: true }, // Descripción del rol del CSV
    tema: { type: 'text' }, // Campo tema del CSV (anteriormente Tasks) (puede estar vacío)
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

/**
 * TABLA: Stage (ADAPTADA A CSV: Stage_rows.csv)
 * CSV tiene: name, description, objectives, deliverables, products, stakeholders, id
 */
export const STAGE_SCHEMA = {
  table_name: 'Stage',
  columns: {
    id: { type: 'uuid', primary_key: true }, // UUID existente del CSV
    name: { type: 'varchar(100)', not_null: true }, // Nombre de la etapa del CSV
    description: { type: 'text', not_null: true }, // Descripción del CSV
    objectives: { type: 'text', not_null: true }, // Objetivos como texto del CSV
    deliverables: { type: 'text', not_null: true }, // Entregables como texto del CSV
    products: { type: 'text', not_null: true }, // Productos como texto del CSV
    stakeholders: { type: 'text', not_null: true }, // Interesados como texto del CSV
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

/**
 * TABLA: Tareas (ADAPTADA A CSV: Tareas_rows.csv)
 * CSV tiene: id, category, tema, status, notes, project_id, staff_id, stage_id
 */
export const TAREAS_SCHEMA = {
  table_name: 'Tareas',
  columns: {
    id: { type: 'uuid', primary_key: true }, // UUID existente del CSV
    category: { type: 'varchar(100)', not_null: true }, // Categoría como texto del CSV
    tema: { type: 'text', not_null: true }, // Descripción de tarea del CSV (anteriormente task_description)
    status: {
      type: 'varchar(30)',
      check: "status IN ('Pendiente', 'En Progreso', 'En Diseño', 'Bloqueado', 'En Discusión', 'Aprobación Requerida', 'Completado')",
      default: "'Pendiente'"
    },
    notes: { type: 'text' }, // Notas del CSV
    project_id: {
      type: 'uuid',
      foreign_key: 'Proyectos(id) ON DELETE CASCADE'
    },
    staff_id: {
      type: 'uuid',
      foreign_key: 'Staff(id) ON DELETE SET NULL'
    },
    stage_id: {
      type: 'uuid',
      foreign_key: 'Stage(id) ON DELETE SET NULL'
    },
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

// NOTA: tareas_responsables no es necesario porque en CSV tenemos staff_id directamente en tareas

/**
 * TABLA: Entregables_template (ADAPTADA A CSV: Entregables_template_rows.csv)
 * CSV tiene: entregable_nombre, tipo, vistaTipo, escala_tipica, software_utilizado, id, Stage_id, vistaSubTipo
 */
export const ENTREGABLES_TEMPLATE_SCHEMA = {
  table_name: 'Entregables_template',
  columns: {
    id: { type: 'uuid', primary_key: true }, // UUID existente del CSV
    entregable_nombre: { type: 'varchar(255)', not_null: true }, // Nombre del entregable del CSV
    tipo: { type: 'varchar(50)', not_null: true }, // 2D/3D del CSV
    vistaTipo: { type: 'varchar(50)' }, // vistaTipo del CSV
    escala_tipica: { type: 'varchar(20)' }, // escala_tipica del CSV
    software_utilizado: { type: 'varchar(100)' }, // software_utilizado del CSV
    Stage_id: {
      type: 'uuid',
      foreign_key: 'Stage(id) ON DELETE SET NULL'
    }, // Stage_id del CSV
    vistaSubTipo: { type: 'varchar(50)' }, // vistaSubTipo del CSV
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

// NOTA: planos_proyecto no existe en CSV - se puede crear después si es necesario

// NOTA: actividades no existe en CSV - tabla para logging futuro

/**
 * TABLA: Espacio_Elemento (ADAPTADA A CSV: Espacio_Elemento_rows.csv)
 * CSV tiene: _id, nombre, tipo, piso, proyecto, etapa, componentes, tareas, apellido
 */
export const ESPACIO_ELEMENTO_SCHEMA = {
  table_name: 'Espacio_Elemento',
  columns: {
    id: { type: 'uuid', primary_key: true, default: 'uuid_generate_v4()' }, // _id del CSV
    nombre: { type: 'varchar(100)', not_null: true }, // nombre del CSV
    tipo: {
      type: 'varchar(50)',
      check: "tipo IN ('Espacio', 'Elemento')"
    }, // tipo del CSV
    piso: { type: 'varchar(50)' }, // piso del CSV
    proyecto_id: { // proyecto del CSV (se asume que es un ID o se relaciona)
      type: 'uuid',
      foreign_key: 'Proyectos(id) ON DELETE CASCADE'
    },
    etapa: { type: 'varchar(50)' }, // etapa del CSV
    descripcion: { type: 'text' }, // apellido? o extra
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

/**
 * TABLA: Componentes (ADAPTADA A CSV: Componentes_rows.csv)
 * CSV tiene: id, nombre, acabado, construcción, descripcion, espacio_elemento
 */
export const COMPONENTES_SCHEMA = {
  table_name: 'Componentes',
  columns: {
    id: { type: 'uuid', primary_key: true, default: 'uuid_generate_v4()' }, // id del CSV
    nombre: { type: 'varchar(100)', not_null: true }, // nombre del CSV
    acabado: { type: 'text' }, // acabado del CSV
    construccion: { type: 'text' }, // construcción del CSV
    descripcion: { type: 'text' }, // descripcion del CSV
    espacio_elemento_id: { // espacio_elemento del CSV
      type: 'uuid',
      foreign_key: 'Espacio_Elemento(id) ON DELETE SET NULL'
    },
    created_at: { type: 'timestamptz', default: 'now()' },
    updated_at: { type: 'timestamptz', default: 'now()' }
  }
};

// ================================
// FUNCIONES HELPER PARA SUPABASE
// ================================

/**
 * Función para obtener todas las tareas con sus relaciones
 */
export const getTareasCompletas = async () => {
  const { data, error } = await supabase
    .from('tareas')
    .select(`
      *,
      proyecto:proyectos(codigo, nombre),
      categoria:categorias(nombre, color),
      responsables:tareas_responsables(
        rol_en_tarea,
        responsable:responsables(nombre, especialidad)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Función para obtener planos de un proyecto específico
 */
export const getPlanosProyecto = async (proyectoId) => {
  const { data, error } = await supabase
    .from('planos_proyecto')
    .select(`
      *,
      proyecto:proyectos(codigo, nombre),
      plantilla:plantillas_planos(codigo, nombre, etapa, categoria, escala),
      responsable:responsables(nombre, especialidad)
    `)
    .eq('proyecto_id', proyectoId)
    .order('plantilla.etapa', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Función para crear una nueva tarea
 */
export const crearTarea = async (tareaData) => {
  const { data, error } = await supabase
    .from('tareas')
    .insert([tareaData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Función para actualizar el estado de una tarea
 */
export const actualizarEstadoTarea = async (tareaId, nuevoEstado, datosAdicionales = {}) => {
  const updateData = {
    estado: nuevoEstado,
    updated_at: new Date().toISOString(),
    ...datosAdicionales
  };

  const { data, error } = await supabase
    .from('tareas')
    .update(updateData)
    .eq('id', tareaId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Función para aprobar tareas
 */
export const aprobarTarea = async (tareaId, aprobadorTipo) => {
  const campoAprobacion = aprobadorTipo === 'ronald' ? 'aprobado_por_ronald' : 'aprobado_por_wiet';
  const campoFecha = aprobadorTipo === 'ronald' ? 'fecha_aprobacion_ronald' : 'fecha_aprobacion_wiet';

  const updateData = {
    [campoAprobacion]: true,
    [campoFecha]: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('tareas')
    .update(updateData)
    .eq('id', tareaId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ================================
// TIPOS TYPESCRIPT PARA REFERENCIA
// ================================

export const TYPESCRIPT_TYPES = `
// Tipos TypeScript para el proyecto
export interface Proyecto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente?: string;
  estado: 'Planificación' | 'En Desarrollo' | 'En Construcción' | 'Completado' | 'Pausado';
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  presupuesto?: number;
  porcentaje_avance: number;
  ubicacion?: string;
  created_at: string;
  updated_at: string;
}

export interface Tarea {
  id: string;
  proyecto_id: string;
  categoria_id: string;
  titulo: string;
  descripcion?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado' | 'En Revisión';
  prioridad: 'Alta' | 'Media' | 'Baja';
  deadline_diseno?: string;
  deadline_ejecucion?: string;
  aprobado_por_ronald: boolean;
  aprobado_por_wiet: boolean;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface PlantillaPlano {
  id: string;
  codigo: string;
  nombre: string;
  etapa: 'Arquitectónica' | 'Técnica' | 'Construcción';
  categoria: string;
  escala: string;
  tiempo_estimado_dias: string;
  contenido: string;
  requiere_especialista: boolean;
  created_at: string;
}
`;

export default {
  // ESQUEMAS ADAPTADOS A CSV EXISTENTE
  PROYECTOS_SCHEMA,
  STAFF_SCHEMA,
  STAGE_SCHEMA,
  TAREAS_SCHEMA,
  ENTREGABLES_TEMPLATE_SCHEMA,
  ESPACIO_ELEMENTO_SCHEMA,
  COMPONENTES_SCHEMA,

  // FUNCIONES HELPER (SE PUEDEN ACTUALIZAR DESPUÉS)
  getTareasCompletas,
  crearTarea,
  actualizarEstadoTarea
};

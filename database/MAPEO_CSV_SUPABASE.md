# MAPEO DE CAMPOS: CSV → SUPABASE

Esta guía detalla exactamente cómo mapear los datos existentes en CSV a las tablas de Supabase.

## 📊 **TABLA: PROYECTOS**

### CSV → Supabase
```javascript
// CSV tiene: id, name, status, resp
// Supabase necesita: id, codigo, nombre, descripcion, cliente, estado, fecha_inicio, fecha_fin_estimada, presupuesto, porcentaje_avance, ubicacion, responsable_principal_id, created_at, updated_at

const mapeoProyectos = {
  // Mapeo directo
  id: csv.id,                    // ✅ UUID existente
  nombre: csv.name,              // ✅ name → nombre
  
  // Generación de campos faltantes
  codigo: generarCodigo(csv.name), // CASA_1, CASA_2, etc.
  descripcion: `Desarrollo de ${csv.name}`,
  cliente: 'TVS Development',
  estado: mapearEstado(csv.status), // 'En Progreso' → 'En Desarrollo'
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin_estimada: calcularFechaFin(new Date(), 6), // 6 meses después
  presupuesto: asignarPresupuesto(csv.name), // Basado en tipo de casa
  porcentaje_avance: calcularPorcentaje(csv.status),
  ubicacion: generarUbicacion(csv.name),
  responsable_principal_id: buscarResponsableId(csv.resp), // Si existe
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mapeo de estados
const ESTADOS_PROYECTOS = {
  'En Progreso': 'En Desarrollo',
  'Pendiente': 'Planificación', 
  'En Diseño': 'En Desarrollo',
  'Completado': 'Completado',
  'Pausado': 'Pausado'
};
```

## 👥 **TABLA: RESPONSABLES (STAFF)**

### CSV → Supabase
```javascript
// CSV tiene: id, name, role_description, Tasks
// Supabase necesita: id, nombre, apellido, email, telefono, especialidad, activo, avatar_url, created_at

const mapeoResponsables = {
  // Mapeo directo
  id: csv.id,                    // ✅ UUID existente
  nombre: extraerNombre(csv.name), // Primer nombre
  apellido: extraerApellido(csv.name), // Resto del nombre
  especialidad: csv.role_description, // ✅ role_description → especialidad
  
  // Generación de campos faltantes
  email: `${csv.name.toLowerCase().replace(' ', '.')}@arq.tvs`,
  telefono: null, // Se puede agregar manualmente después
  activo: true,
  avatar_url: null,
  created_at: new Date().toISOString()
};

// Funciones helper
const extraerNombre = (fullName) => fullName.split(' ')[0];
const extraerApellido = (fullName) => fullName.split(' ').slice(1).join(' ');
```

## 📋 **TABLA: TAREAS**

### CSV → Supabase  
```javascript
// CSV tiene: id, category, task_description, status, notes, project_id, staff_id, stage_id
// Supabase necesita: id, proyecto_id, categoria_id, stage_id, titulo, descripcion, estado, prioridad, deadline_diseno, deadline_ejecucion, fecha_inicio_real, fecha_fin_real, tiempo_estimado_horas, tiempo_real_horas, porcentaje_avance, aprobado_por_ronald, aprobado_por_wiet, fecha_aprobacion_ronald, fecha_aprobacion_wiet, notas, archivos_adjuntos, dependencias, created_at, updated_at

const mapeoTareas = {
  // Mapeo directo
  id: csv.id,                    // ✅ UUID existente
  proyecto_id: csv.project_id,   // ✅ Debe existir en proyectos
  stage_id: csv.stage_id,        // ✅ Debe existir en etapas  
  notas: csv.notes,              // ✅ notes → notas
  
  // Conversiones necesarias
  categoria_id: await buscarCategoriaId(csv.category), // Texto → UUID
  titulo: limitarTitulo(csv.task_description, 255), // Primeros 255 chars
  descripcion: csv.task_description, // Descripción completa
  estado: mapearEstadoTarea(csv.status),
  
  // Generación de campos faltantes
  prioridad: inferirPrioridad(csv.status, csv.category),
  deadline_diseno: calcularDeadlineDiseno(),
  deadline_ejecucion: calcularDeadlineEjecucion(),
  fecha_inicio_real: inferirFechaInicio(csv.status),
  tiempo_estimado_horas: estimarTiempo(csv.category),
  porcentaje_avance: calcularPorcentajeAvance(csv.status),
  aprobado_por_ronald: csv.status.includes('Aprobación') ? false : false,
  aprobado_por_wiet: false,
  archivos_adjuntos: null,
  dependencias: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mapeo de estados de tareas
const ESTADOS_TAREAS = {
  'Pendiente': 'Pendiente',
  'En Progreso': 'En Proceso', 
  'En Diseño': 'En Proceso',
  'Bloqueado': 'En Revisión',
  'En Discusión': 'En Revisión',
  'Aprobación Requerida': 'En Revisión',
  'Completado': 'Completado'
};

// Mapeo de categorías (texto → UUID)
const MAPEO_CATEGORIES = {
  'Diseño estructural': 'Diseño Estructural',
  'Revisión de diseño': 'Diseño Arquitectónico', 
  'Puertas': 'Carpintería',
  'Baños': 'Diseño Hidráulico',
  'Exterior': 'Diseño Arquitectónico',
  'Obra': 'Acabados Exteriores',
  'Redes': 'Diseño Eléctrico',
  'Interior': 'Acabados Interiores',
  'Paisajismo': 'Diseño Paisajístico',
  'Diseño técnico': 'Diseño Arquitectónico',
  'Fachada': 'Acabados Exteriores',
  'Entrega a Curaduría': 'Diseño Arquitectónico',
  'Habitación de huéspedes': 'Acabados Interiores',
  'General': 'Diseño Arquitectónico',
  'Acabados': 'Acabados Interiores'
};
```

## 🏗️ **TABLA: ETAPAS (STAGE)**

### CSV → Supabase
```javascript
// CSV tiene: name, description, objectives, deliverables, products, stakeholders, id
// Supabase necesita: id, name, description, objectives, deliverables, products, stakeholders, created_at, updated_at

const mapeoEtapas = {
  // Mapeo directo - ¡Perfecto match!
  id: csv.id,                    // ✅ UUID existente
  name: csv.name,                // ✅ Exacto
  description: csv.description,   // ✅ Exacto
  
  // Conversión de strings a arrays
  objectives: csv.objectives.split(' | '),     // String → Array
  deliverables: csv.deliverables.split(' | '), // String → Array  
  products: csv.products.split(', '),          // String → Array
  stakeholders: csv.stakeholders.split(', '),  // String → Array
  
  // Campos adicionales
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
```

## 📐 **TABLA: PLANTILLAS_PLANOS (ENTREGABLES_TEMPLATE)**

### CSV → Supabase
```javascript
// CSV tiene: entregable_nombre, tipo, vistaTipo, escala_tipica, software_utilizado, id, Stage_id, vistaSubTipo
// Supabase necesita: id, codigo, nombre, etapa, categoria, escala, tiempo_estimado_dias, contenido, requiere_especialista, software_recomendado, normas_aplicables, tipo, vista_tipo, vista_sub_tipo, stage_id, activa, created_at, updated_at

const mapeoPlantillasPlanos = {
  // Mapeo directo
  id: csv.id,                    // ✅ UUID existente
  nombre: csv.entregable_nombre,  // ✅ entregable_nombre → nombre
  escala: csv.escala_tipica,     // ✅ escala_tipica → escala  
  tipo: csv.tipo,                // ✅ Exacto (2D/3D)
  vista_tipo: csv.vistaTipo,     // ✅ vistaTipo → vista_tipo
  vista_sub_tipo: csv.vistaSubTipo, // ✅ vistaSubTipo → vista_sub_tipo
  stage_id: csv.Stage_id,        // ✅ Stage_id → stage_id
  software_recomendado: [csv.software_utilizado], // String → Array JSON
  
  // Generación de campos faltantes
  codigo: generarCodigo(csv.entregable_nombre), // ARQ-001, EST-001, etc.
  etapa: inferirEtapa(csv.entregable_nombre), // Arquitectónica/Técnica/Construcción
  categoria: inferirCategoria(csv.entregable_nombre), // Plantas/Cortes/Detalles
  tiempo_estimado_dias: estimarTiempo(csv.tipo, csv.vistaTipo),
  contenido: generarContenido(csv.entregable_nombre, csv.vistaTipo),
  requiere_especialista: evaluarEspecialista(csv.entregable_nombre),
  normas_aplicables: [],
  activa: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mapeo de etapas basado en nombres
const MAPEO_ETAPAS_PLANOS = {
  'Diagrama Conceptual': 'Arquitectónica',
  'Planta Arquitectónica': 'Arquitectónica', 
  'Alzado': 'Arquitectónica',
  'Render': 'Arquitectónica',
  'Modelo BIM Arquitectónico': 'Arquitectónica',
  'Modelo BIM de Coordinación Técnica': 'Técnica',
  'Plano de Análisis Urbano': 'Construcción'
};
```

## ⚠️ **VALIDACIONES REQUERIDAS**

### Antes de migrar datos:

1. **Verificar UUIDs válidos:**
```javascript
const isValidUUID = (uuid) => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
};
```

2. **Verificar referencias existentes:**
```javascript
// Verificar que project_id existe en proyectos
const proyectoExiste = await supabase
  .from('proyectos')
  .select('id')
  .eq('id', csv.project_id);

// Verificar que stage_id existe en etapas  
const etapaExiste = await supabase
  .from('etapas')
  .select('id')
  .eq('id', csv.stage_id);
```

3. **Crear relaciones en tareas_responsables:**
```javascript
// Migrar staff_id de CSV a tabla intermedia
if (csv.staff_id) {
  await supabase
    .from('tareas_responsables')
    .insert({
      tarea_id: tarea.id,
      responsable_id: csv.staff_id,
      rol_en_tarea: 'Principal'
    });
}
```

## 🎯 **ORDEN DE MIGRACIÓN**

1. **etapas** (no tiene dependencias)
2. **categorias** (datos estáticos)  
3. **responsables** (Staff_rows.csv)
4. **proyectos** (Proyectos_rows.csv)
5. **tareas** (Tareas_rows.csv)
6. **tareas_responsables** (relación many-to-many)
7. **plantillas_planos** (Entregables_template_rows.csv)

## ✅ **VERIFICACIÓN POST-MIGRACIÓN**

```sql
-- Verificar integridad referencial
SELECT 
  't.proyecto_id inválido' as error,
  COUNT(*) as cantidad
FROM tareas t
LEFT JOIN proyectos p ON t.proyecto_id = p.id  
WHERE p.id IS NULL AND t.proyecto_id IS NOT NULL

UNION ALL

SELECT 
  't.categoria_id inválido' as error, 
  COUNT(*) as cantidad
FROM tareas t
LEFT JOIN categorias c ON t.categoria_id = c.id
WHERE c.id IS NULL AND t.categoria_id IS NOT NULL

UNION ALL

SELECT 
  't.stage_id inválido' as error,
  COUNT(*) as cantidad  
FROM tareas t
LEFT JOIN etapas e ON t.stage_id = e.id
WHERE e.id IS NULL AND t.stage_id IS NOT NULL;
```

Esta guía asegura que todos los campos CSV sean correctamente mapeados a Supabase manteniendo la integridad referencial.

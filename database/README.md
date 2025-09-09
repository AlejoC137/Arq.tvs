# Base de Datos - Arq.TVS

Este directorio contiene todos los archivos necesarios para configurar la base de datos del sistema de gestión de proyectos arquitectónicos Arq.TVS utilizando Supabase.

## 📁 Estructura de Archivos

```
database/
├── create_tables.sql          # Script principal para crear tablas
├── import_sample_data.sql     # Script para importar datos de ejemplo
├── sample_data/               # Archivos CSV con datos de ejemplo
│   ├── proyectos.csv         # Proyectos del conjunto residencial
│   ├── categorias.csv        # Categorías de tareas por especialidad
│   ├── responsables.csv      # Equipo de trabajo y especialistas
│   └── plantillas_planos.csv # Catálogo de plantillas de planos
└── README.md                 # Este archivo
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales

1. **proyectos** - Proyectos como CASA 1-7, PORTERÍA, PARCELACIÓN
2. **categorias** - Especialidades como Diseño Estructural, Paisajismo, etc.
3. **responsables** - Equipo de arquitectos, ingenieros y especialistas
4. **tareas** - Gestión principal de tareas de proyectos
5. **tareas_responsables** - Relación many-to-many entre tareas y responsables
6. **plantillas_planos** - Catálogo de plantillas de planos arquitectónicos
7. **planos_proyecto** - Planos específicos asignados a proyectos
8. **actividades** - Log de actividades y cambios en el sistema

### Características del Modelo

- ✅ **UUIDs** como claves primarias
- ✅ **Row Level Security (RLS)** habilitado
- ✅ **Triggers** para updated_at automático
- ✅ **Índices** optimizados para consultas frecuentes
- ✅ **Constraints** y validaciones de integridad
- ✅ **Campos JSONB** para metadatos flexibles

## 🚀 Instalación y Configuración

### Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la API key

### Paso 2: Ejecutar Scripts SQL

En el SQL Editor de Supabase, ejecuta los scripts en este orden:

1. **Crear Tablas:**
   ```sql
   -- Ejecutar todo el contenido de create_tables.sql
   ```

2. **Importar Datos de Ejemplo** (opcional):
   ```sql
   -- Ejecutar el contenido de import_sample_data.sql
   ```

### Paso 3: Verificar la Instalación

Ejecuta estas consultas para verificar que todo esté funcionando:

```sql
-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Contar registros en cada tabla
SELECT 'proyectos' AS tabla, COUNT(*) AS registros FROM proyectos
UNION ALL
SELECT 'categorias' AS tabla, COUNT(*) AS registros FROM categorias
UNION ALL
SELECT 'responsables' AS tabla, COUNT(*) AS registros FROM responsables
UNION ALL
SELECT 'plantillas_planos' AS tabla, COUNT(*) AS registros FROM plantillas_planos;
```

## 📊 Datos de Ejemplo Incluidos

### Proyectos (11 registros)
- **CASA 1-7**: Casas familiares con diferentes características
- **PORTERÍA**: Caseta de seguridad y control de acceso
- **PARCELACIÓN**: Diseño urbano del conjunto
- **VÍAS**: Infraestructura vial y drenajes
- **ZONAS COMUNES**: Áreas recreativas y equipamiento

### Categorías (16 registros)
Organizadas por etapas:
- **Arquitectónica**: Diseño Arquitectónico, Paisajismo
- **Técnica**: Estructural, Eléctrico, Hidráulico, Gases, Climatización, etc.
- **Construcción**: Acabados, Impermeabilizaciones, Carpintería, etc.

### Responsables (15 registros)
- Ronald García (Arquitecto Director)
- Wiet van der Berg (Arquitecto Senior)
- Especialistas en diferentes áreas técnicas

### Plantillas de Planos (33 registros)
Catálogo completo organizado por códigos:
- **ARQ-001 a ARQ-008**: Planos arquitectónicos
- **EST-001 a EST-005**: Planos estructurales  
- **ELE-001 a ELE-004**: Planos eléctricos
- **HID-001 a HID-005**: Planos hidráulicos
- **GAS, CLI, PIS, CON**: Otras especialidades

## 🔧 Conexión desde la Aplicación React

Actualiza tu archivo `SupabaseSchema.jsx` con las credenciales:

```javascript
const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseKey = 'tu-anon-key'
export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📱 Funcionalidades Implementadas

### Dashboard
- Estadísticas de proyectos por estado
- Tareas por prioridad y categoría
- Gráficos de avance y plazos

### Gestión de Tareas
- Vista tipo Excel interactiva
- Filtros por proyecto, estado, responsable
- Seguimiento de plazos y aprobaciones

### Catálogo de Planos
- Plantillas organizadas por etapa y categoría
- Filtros por especialista requerido y escala
- Tiempos estimados de desarrollo

## 🔒 Seguridad

- **RLS activado** en todas las tablas
- **Políticas básicas** para usuarios autenticados
- **Validación de integridad** con constraints
- **Campos sensibles** protegidos con tipos específicos

## 🛠️ Mantenimiento

### Backups Automáticos
Supabase maneja backups automáticos, pero puedes crear backups manuales:

```sql
-- Exportar datos específicos
\copy proyectos TO 'backup_proyectos.csv' WITH (FORMAT csv, HEADER true);
```

### Actualizaciones de Schema
Para modificaciones futuras, usa migraciones:

```sql
-- Ejemplo: Agregar nueva columna
ALTER TABLE proyectos ADD COLUMN nueva_columna TEXT;

-- Crear índice adicional
CREATE INDEX idx_nueva_columna ON proyectos(nueva_columna);
```

## 📞 Soporte

Para dudas sobre la configuración de la base de datos:

1. Revisa los logs de Supabase en el dashboard
2. Verifica que todas las políticas RLS estén configuradas
3. Asegúrate de que los datos se importaron correctamente
4. Consulta la documentación de Supabase para funciones avanzadas

---

**Nota**: Este modelo de datos está optimizado para el sistema de gestión de proyectos arquitectónicos de TVS Development y soporta todas las funcionalidades requeridas para el dashboard, gestión de tareas y catálogo de planos.

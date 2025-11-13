# Implementación del Campo Datos en Proyectos

## 📋 Resumen

Se ha implementado un nuevo sistema para gestionar datos estructurados de proyectos usando un campo JSON en la tabla `Proyectos` de Supabase. Este reemplaza el antiguo checklist de espacios con un sistema más robusto que incluye:

- **Materiales Constantes**: Materiales que se usan consistentemente en todo el proyecto
- **Etapa del Proyecto**: Estado en el ciclo de vida del proyecto
- **Presentaciones por Espacio**: Links a presentaciones (PPT, PDF) vinculadas a espacios específicos

---

## 🗂️ Archivos Creados/Modificados

### **Nuevos Archivos**

1. **`src/constants/datosProyecto.js`**
   - Constantes para categorías de materiales (20 categorías)
   - Constantes para etapas del proyecto (7 etapas)
   - Helpers: `parseDatosProyecto()`, `stringifyDatosProyecto()`, `validarDatosProyecto()`
   - Estructura inicial de datos

2. **`src/components/DatosProyectoEditor.jsx`**
   - Componente modal con 3 pestañas (Etapa, Materiales Constantes, Presentaciones)
   - Integración con tabla `Material` de Supabase
   - Filtrado de espacios por proyecto usando `getEspaciosPorProyecto()`
   - Validación y guardado en formato JSON

3. **`src/scripts/migrateProjectsDatos.js`**
   - Script de migración para inicializar campo `Datos` en proyectos existentes
   - Función `migrateProjectsDatos()`: Migra todos los proyectos
   - Función `checkMigrationStatus()`: Verifica estado de migración
   - Función `migrateProjectById()`: Migra un proyecto específico

4. **`src/components/MigracionDatosProyectos.jsx`**
   - Interfaz UI para ejecutar la migración
   - Muestra estado actual (con/sin datos)
   - Botones para verificar y ejecutar migración
   - Panel con instrucciones SQL

5. **`docs/ESQUEMA_DATOS_PROYECTO.md`**
   - Documentación completa del esquema JSON
   - Ejemplos para Casa 2, Casa 4, y estructura mínima
   - Código TypeScript para validación
   - Queries avanzadas en Supabase

6. **`docs/IMPLEMENTACION_DATOS_PROYECTO.md`** (este archivo)
   - Guía de implementación y uso

### **Archivos Modificados**

1. **`src/components/PreModalProjectsConfig.jsx`**
   - ❌ Eliminado: Checklist de espacios (`ESPACIOS_LISTA`, `espaciosSeleccionados`, `handleSpaceChange`)
   - ✅ Agregado: Botón "Configurar Datos del Proyecto" que abre `DatosProyectoEditor`
   - ✅ Agregado: Import de `DatosProyectoEditor` y icono `Settings`

2. **`src/App.jsx`**
   - ✅ Agregada ruta temporal: `/migracion-datos` → `MigracionDatosProyectos`

---

## 🏗️ Estructura de la Base de Datos

### Campo `Datos` en tabla `Proyectos`

**Tipo**: `TEXT` (JSON stringificado)

```sql
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "Datos" TEXT;
```

### Estructura del JSON

```json
{
  "tareas": ["uuid1", "uuid2"],
  "materialesConstantes": [
    {
      "categoria": "Griferias",
      "materialId": "uuid-material",
      "nombre": "Grifería Hansgrohe Talis S",
      "observaciones": "Para todos los baños"
    }
  ],
  "etapa": "En Diseño",
  "presentacionesEspacio": [
    {
      "espacio": "CocinaC2",
      "link": "https://drive.google.com/...",
      "fechaActualizacion": "2025-01-10"
    }
  ]
}
```

---

## 🚀 Pasos para Poner en Marcha

### Paso 1: Crear la Columna en Supabase

Ir al **SQL Editor** en Supabase y ejecutar:

```sql
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "Datos" TEXT;
```

### Paso 2: Ejecutar la Migración

**Opción A: Usar la Interfaz UI (Recomendado)**

1. Iniciar la aplicación: `npm run dev`
2. Navegar a: `http://localhost:3000/migracion-datos`
3. Hacer clic en **"Verificar Estado"** para ver qué proyectos necesitan migración
4. Hacer clic en **"Ejecutar Migración"**
5. Verificar en la consola que todo se ejecutó correctamente

**Opción B: Usar la Consola del Navegador**

1. Abrir DevTools (F12)
2. Ir a la pestaña Console
3. Ejecutar:
   ```javascript
   // Verificar estado
   await window.checkMigrationStatus();
   
   // Ejecutar migración
   await window.migrateProjectsDatos();
   ```

**Opción C: Importar el Script**

```javascript
import { migrateProjectsDatos } from './scripts/migrateProjectsDatos';
await migrateProjectsDatos();
```

### Paso 3: Verificar la Migración

Después de ejecutar la migración, todos los proyectos deberían tener:

```json
{
  "tareas": [],
  "materialesConstantes": [],
  "etapa": "Planificación",
  "presentacionesEspacio": []
}
```

Verificar en Supabase:

```sql
SELECT id, name, Datos FROM "Proyectos";
```

---

## 📖 Cómo Usar el Sistema

### 1. Configurar un Proyecto

1. Ir a **Proyectos** en la aplicación
2. Seleccionar un proyecto y hacer clic en el ícono de configuración ⚙️
3. En el modal, hacer clic en **"Configurar Datos del Proyecto"**
4. Se abrirá el editor de datos con 3 pestañas

### 2. Gestionar Etapa del Proyecto

- Pestaña: **Etapa**
- Seleccionar una etapa del dropdown:
  - Planificación
  - En Diseño
  - Construcción
  - Finalización
  - Completado
  - Pausado
  - Cancelado

### 3. Agregar Materiales Constantes

- Pestaña: **Materiales Constantes**
- Seleccionar categoría (Griferias, Zocalos, Pisos, etc.)
- Seleccionar el material de la base de datos (filtrado por categoría)
- Agregar observaciones opcionales
- Hacer clic en **"Agregar Material"**

**Ejemplo:**
- Categoría: Griferias
- Material: Grifería Hansgrohe Talis S
- Observaciones: Para todos los baños

### 4. Vincular Presentaciones

- Pestaña: **Presentaciones**
- Seleccionar el espacio del proyecto (solo espacios válidos para esa casa)
- Ingresar el link a la presentación (Google Drive, OneDrive, Canva, etc.)
- Opcionalmente agregar fecha de actualización
- Hacer clic en **"Agregar Presentación"**

**Ejemplo:**
- Espacio: CocinaC2
- Link: https://drive.google.com/presentation/d/abc123
- Fecha: 2025-01-10

### 5. Guardar Cambios

- Hacer clic en **"Guardar Cambios"** al final del modal
- Los datos se guardan en formato JSON en el campo `Datos`

---

## 🔧 API y Helpers

### Parsear Datos

```javascript
import { parseDatosProyecto } from '../constants/datosProyecto';

const proyecto = await getProject(id);
const datos = parseDatosProyecto(proyecto.Datos);

console.log(datos.etapa); // "En Diseño"
console.log(datos.materialesConstantes); // Array
```

### Guardar Datos

```javascript
import { stringifyDatosProyecto } from '../constants/datosProyecto';

const datos = {
  tareas: [],
  materialesConstantes: [...],
  etapa: "Construcción",
  presentacionesEspacio: [...]
};

const datosString = stringifyDatosProyecto(datos);

await supabase
  .from('Proyectos')
  .update({ Datos: datosString })
  .eq('id', projectId);
```

### Validar Estructura

```javascript
import { validarDatosProyecto } from '../constants/datosProyecto';

const esValido = validarDatosProyecto(datos);
if (!esValido) {
  console.error('Estructura de datos inválida');
}
```

---

## 🎨 Categorías de Materiales Disponibles

```javascript
const CATEGORIAS_MATERIALES = [
  "Griferias",
  "Zocalos",
  "Pisos",
  "Enchufes",
  "Interruptores",
  "Luminarias",
  "Puertas",
  "Manijas",
  "Cerraduras",
  "Ventanas",
  "Cortinas",
  "Persianas",
  "Pintura",
  "Mesones",
  "Lavaplatos",
  "Sanitarios",
  "Duchas",
  "Espejos",
  "Gabinetes",
  "Closets"
];
```

---

## 📊 Queries Útiles en Supabase

### Ver todos los proyectos con sus datos

```sql
SELECT id, name, Datos 
FROM "Proyectos";
```

### Buscar proyectos en una etapa específica

```javascript
const { data } = await supabase
  .from('Proyectos')
  .select('*')
  .filter('Datos->etapa', 'eq', 'En Diseño');
```

### Actualizar datos manualmente (SQL)

```sql
UPDATE "Proyectos"
SET "Datos" = '{"tareas":[],"materialesConstantes":[],"etapa":"Construcción","presentacionesEspacio":[]}'
WHERE id = 'uuid-del-proyecto';
```

---

## ⚠️ Notas Importantes

### Compatibilidad con Código Anterior

- El campo `espacios` en la tabla `Proyectos` ya no se usa en `PreModalProjectsConfig`
- Sin embargo, NO se eliminó del schema para mantener compatibilidad con código legacy
- Si hay referencias a `proyecto.espacios` en otros lugares, revisar y migrar

### Migración es Segura

- La migración solo actualiza proyectos que no tienen `Datos` o está vacío
- Se puede ejecutar múltiples veces sin problemas
- No sobrescribe datos existentes

### Performance

- El campo `Datos` es TEXT, no JSONB
- Si necesitas hacer queries complejos por contenido JSON, considera cambiar a JSONB:
  ```sql
  ALTER TABLE "Proyectos" ALTER COLUMN "Datos" TYPE JSONB USING "Datos"::JSONB;
  ```

### Espacios Filtrados

- El selector de espacios en "Presentaciones" usa `getEspaciosPorProyecto()`
- Solo muestra espacios válidos para la casa del proyecto (Casa 1, Casa 2, Casa 4)

---

## 🐛 Troubleshooting

### Error: "Column Datos does not exist"

**Solución**: Ejecutar el SQL para crear la columna:
```sql
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "Datos" TEXT;
```

### Error al parsear JSON

**Solución**: Verificar que el string JSON es válido:
```javascript
const datos = parseDatosProyecto(proyecto.Datos);
// Usa try-catch interno, retorna estructura por defecto si falla
```

### Materiales no aparecen en el selector

**Verificar**:
1. Que la tabla `Material` existe en Supabase
2. Que los materiales tienen el campo `categoria` poblado
3. Revisar la consola para errores de carga

### La migración no se ejecuta

**Verificar**:
1. Conexión a Supabase (ver `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)
2. Permisos en la tabla `Proyectos` (UPDATE debe estar habilitado)
3. Logs en la consola del navegador

---

## 🔮 Mejoras Futuras

### 1. Vincular Tareas al Proyecto

El campo `tareas` actualmente es un array vacío. Se puede poblar con:

```javascript
// Al crear/asignar tarea
const datos = parseDatosProyecto(proyecto.Datos);
datos.tareas.push(nuevaTarea.id);
await updateProjectDatos(proyecto.id, datos);
```

### 2. Dashboard de Materiales

Crear vista agregada de todos los materiales constantes usados en proyectos:

```javascript
// Obtener todos los proyectos
const { data: proyectos } = await supabase.from('Proyectos').select('*');

// Extraer materiales
const todosMateriales = proyectos.flatMap(p => {
  const datos = parseDatosProyecto(p.Datos);
  return datos.materialesConstantes.map(m => ({
    proyecto: p.name,
    ...m
  }));
});
```

### 3. Historial de Cambios

Implementar versionado del campo Datos:

```sql
CREATE TABLE "Proyectos_Historial_Datos" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID REFERENCES "Proyectos"(id),
  Datos TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Validación con Zod

Agregar validación estricta usando Zod (ver `docs/ESQUEMA_DATOS_PROYECTO.md`)

---

## 📞 Contacto y Soporte

Para preguntas o problemas:
1. Revisar este documento
2. Revisar `docs/ESQUEMA_DATOS_PROYECTO.md`
3. Consultar logs en consola del navegador
4. Revisar código en:
   - `src/constants/datosProyecto.js`
   - `src/components/DatosProyectoEditor.jsx`
   - `src/scripts/migrateProjectsDatos.js`

---

## ✅ Checklist de Implementación

- [x] Crear campo `Datos` en Supabase
- [x] Crear constantes y helpers
- [x] Implementar componente editor
- [x] Actualizar PreModalProjectsConfig
- [x] Crear script de migración
- [x] Crear interfaz UI para migración
- [x] Agregar ruta temporal
- [x] Documentar implementación
- [ ] Ejecutar migración en producción
- [ ] Eliminar ruta `/migracion-datos` (después de migrar)
- [ ] (Opcional) Cambiar tipo de columna a JSONB

---

**Última actualización**: 2025-01-13

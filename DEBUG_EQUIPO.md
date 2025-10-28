# 🐛 Debug: Vista de Equipo

## Problema: No aparecen las tareas

He agregado logs de depuración extensivos para identificar el problema.

---

## 📝 Cómo Ver los Logs

1. **Abrir DevTools del navegador:**
   - Chrome/Edge: `F12` o `Ctrl+Shift+I`
   - Firefox: `F12` o `Ctrl+Shift+K`

2. **Ir a la pestaña Console**

3. **Navegar a** `/equipo` en la aplicación

4. **Buscar estos emojis en los logs:**

### Logs de Carga de Datos (TeamView)

```
📊 Staff Result: {...}
📊 Tasks Result: {...}
👥 Staff loaded: X members
👥 Staff data: [...]
📋 Tasks loaded: X tasks
📋 Sample task: {...}
📈 Calculating stats...
👥 Staff count: X
📋 Tasks count: X
👤 [Nombre] (id): X tasks
📉 Stats calculated: {...}
```

### Logs del Modal (StaffTaskModal)

```
👤 Loading tasks for staff: [Nombre] ID: [uuid]
📋 Tasks by staff result: {...}
📁 Projects result: {...}
📂 Stages result: {...}
📊 Found X tasks for [Nombre]
📊 Task details: [...]
```

---

## 🔍 Qué Verificar

### 1. **¿Se están cargando las tablas?**

Buscar en los logs:
```
📊 Staff Result: { success: true, data: [...] }
📊 Tasks Result: { success: true, data: [...] }
```

**Si ves `success: false`:**
- Hay un error en Supabase
- Las tablas no existen
- No hay permisos (RLS)

### 2. **¿Cuántos registros hay?**

```
👥 Staff loaded: 5 members
📋 Tasks loaded: 20 tasks
```

**Si aparece `0 tasks`:**
- La tabla `Tareas` está vacía
- Verificar en Supabase directamente

### 3. **¿Cómo se llama el campo de relación?**

Buscar en los logs:
```
📋 Sample task: {
  id: "...",
  staff_id: "...",  // ← Este es el campo clave
  task_description: "...",
  ...
}
```

**Nombres posibles:**
- `staff_id` (esperado)
- `Staff_id` (con mayúscula)
- `staffId` (camelCase)

### 4. **¿Coinciden los IDs?**

```
👤 Juan Pérez (uuid-123): 5 tasks
👤 María García (uuid-456): 0 tasks
```

**Si todos tienen 0 tasks:**
- Los `staff_id` en la tabla `Tareas` no coinciden con los `id` en la tabla `Staff`
- Puede ser un problema de UUIDs

---

## 🔧 Soluciones Comunes

### Problema 1: Campo staff_id tiene otro nombre

**Síntoma:** Todos los staff tienen 0 tareas

**Solución:** El código ya busca múltiples variaciones:
```javascript
t.staff_id === member.id || 
t.Staff_id === member.id ||
t.staffId === member.id
```

Si el campo tiene otro nombre, necesitas ajustar en `TeamView.jsx` línea 65-68

### Problema 2: IDs no coinciden

**Síntoma:** Staff se carga, tareas se cargan, pero no se relacionan

**Solución:** Verificar en Supabase que:
```sql
-- Verificar que los IDs coincidan
SELECT 
  s.id as staff_id,
  s.name,
  COUNT(t.id) as task_count
FROM "Staff" s
LEFT JOIN "Tareas" t ON t.staff_id = s.id
GROUP BY s.id, s.name;
```

### Problema 3: No hay datos en Supabase

**Síntoma:** `Staff loaded: 0 members` o `Tasks loaded: 0 tasks`

**Solución:** Agregar datos de prueba:

```sql
-- Agregar un staff member
INSERT INTO "Staff" (name, role_description) 
VALUES ('Juan Pérez', 'Arquitecto');

-- Agregar una tarea (reemplazar los UUIDs)
INSERT INTO "Tareas" (
  task_description, 
  status, 
  category,
  staff_id,
  project_id,
  stage_id
) 
VALUES (
  'Diseño de planta arquitectónica',
  'En Progreso',
  'Diseño estructural',
  '[UUID del staff]',
  '[UUID del proyecto]',
  '[UUID del stage]'
);
```

### Problema 4: Permisos RLS (Row Level Security)

**Síntoma:** `success: false` en los resultados

**Solución:** Verificar políticas en Supabase:

1. Ir a `Authentication > Policies`
2. Para cada tabla (`Staff`, `Tareas`):
   - Debe haber al menos una política `SELECT` habilitada
   - O RLS deshabilitado para desarrollo

---

## 📋 Checklist de Verificación

- [ ] La tabla `Staff` existe en Supabase
- [ ] La tabla `Tareas` existe en Supabase
- [ ] Hay al menos 1 registro en `Staff`
- [ ] Hay al menos 1 registro en `Tareas`
- [ ] La columna de relación se llama `staff_id` en `Tareas`
- [ ] Los valores de `staff_id` coinciden con `id` en `Staff`
- [ ] RLS está deshabilitado o las políticas permiten SELECT
- [ ] El usuario está autenticado (si RLS está habilitado)

---

## 📊 Query de Diagnóstico

Ejecutar en Supabase SQL Editor:

```sql
-- 1. Verificar estructura de Staff
SELECT * FROM "Staff" LIMIT 5;

-- 2. Verificar estructura de Tareas
SELECT * FROM "Tareas" LIMIT 5;

-- 3. Verificar relación
SELECT 
  s.name as staff_name,
  t.task_description,
  t.status,
  t.staff_id
FROM "Staff" s
LEFT JOIN "Tareas" t ON t.staff_id = s.id
ORDER BY s.name;

-- 4. Contar tareas por staff
SELECT 
  s.name,
  COUNT(t.id) as total_tasks
FROM "Staff" s
LEFT JOIN "Tareas" t ON t.staff_id = s.id
GROUP BY s.name;
```

---

## 🚨 Información para Reportar

Si el problema persiste, proporciona:

1. **Logs completos de la consola** (desde que cargas /equipo)
2. **Screenshot de la estructura de Staff** en Supabase
3. **Screenshot de la estructura de Tareas** en Supabase
4. **Resultado del query de diagnóstico** (arriba)
5. **Estado de RLS** (habilitado/deshabilitado para cada tabla)

---

## 🔄 Próximos Pasos

Una vez identificado el problema con los logs:

1. Si es un problema de nombres de campos → Ajustar el código
2. Si es un problema de datos → Insertar datos de prueba
3. Si es un problema de permisos → Ajustar RLS
4. Si es un problema de IDs → Revisar las foreign keys

---

**Versión:** 1.0.0  
**Fecha:** 2025-01-27

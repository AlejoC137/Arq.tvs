# 🛠️ Solución Rápida para Errores 404/403 en Supabase

## 🚨 Problema
Tu aplicación muestra errores 404 en las consultas a las tablas de Supabase, aunque las tablas existen.

## 🔍 Causa Probable
**Row Level Security (RLS)** está habilitado en las tablas pero no hay políticas configuradas, o las políticas no permiten acceso público.

## ⚡ Solución Inmediata

### Opción 1: Deshabilitar RLS Temporalmente (Recomendado para desarrollo)

1. Ve a tu **Dashboard de Supabase**
2. Navega a **Authentication > Policies**
3. Para cada tabla (`projects`, `tasks`, `staff`, `stages`), ejecuta:

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE stages DISABLE ROW LEVEL SECURITY;
```

### Opción 2: Crear Políticas Permisivas (Para desarrollo)

Si prefieres mantener RLS habilitado, ejecuta este SQL:

```sql
-- Políticas para la tabla projects
CREATE POLICY "Enable all operations for projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para la tabla tasks
CREATE POLICY "Enable all operations for tasks" ON tasks
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para la tabla staff
CREATE POLICY "Enable all operations for staff" ON staff
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para la tabla stages
CREATE POLICY "Enable all operations for stages" ON stages
  FOR ALL USING (true) WITH CHECK (true);
```

## 🧪 Verificar la Solución

1. Recarga tu aplicación
2. Haz clic en **"Ejecutar Diagnóstico"** en el componente de diagnóstico
3. Deberías ver ✅ en "Acceso tabla projects" y "Acceso tabla tasks"

## 📋 Pasos Detallados

### 1. Acceder al Dashboard de Supabase
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto

### 2. Ir al SQL Editor
- En el menú lateral, busca **"SQL Editor"**
- Haz clic en **"New query"**

### 3. Ejecutar el Script
- Pega el SQL de la Opción 1 o 2 (recomiendo Opción 1 para desarrollo)
- Haz clic en **"Run"** o presiona `Ctrl+Enter`

### 4. Verificar los Cambios
- Ve a **"Authentication > Policies"**
- Deberías ver que RLS está deshabilitado o que existen las nuevas políticas

## 🔧 Comandos Útiles para Diagnóstico

### Verificar estado de RLS:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('projects', 'tasks', 'staff', 'stages');
```

### Ver políticas existentes:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('projects', 'tasks', 'staff', 'stages');
```

### Verificar datos en las tablas:
```sql
SELECT 'projects' as table_name, count(*) as record_count FROM projects
UNION ALL
SELECT 'tasks' as table_name, count(*) as record_count FROM tasks
UNION ALL
SELECT 'staff' as table_name, count(*) as record_count FROM staff
UNION ALL
SELECT 'stages' as table_name, count(*) as record_count FROM stages;
```

## ⚠️ Importante para Producción

**Para aplicaciones en producción**, deberías:

1. **Mantener RLS habilitado**
2. **Crear políticas específicas** según tus necesidades de seguridad
3. **Configurar autenticación** adecuada
4. **Limitar acceso** según roles de usuario

Ejemplo de política más restrictiva para producción:
```sql
-- Solo usuarios autenticados pueden leer
CREATE POLICY "Authenticated users can read" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden insertar
CREATE POLICY "Authenticated users can insert" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 🎯 Después de la Solución

Una vez que funcione:

1. **Remueve** el componente `SupabaseDiagnostic` del dashboard
2. **Prueba** las funcionalidades de CRUD
3. **Configura autenticación** si planeas usar la app en producción
4. **Revisa las políticas RLS** para mayor seguridad

---

**¿Necesitas ayuda adicional?** Ejecuta el diagnóstico y comparte los resultados para obtener soluciones específicas.

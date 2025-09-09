# 🚨 LISTA CONSOLIDADA: LO QUE FALTA EN SUPABASE

## 📊 **RESUMEN EJECUTIVO**
He adaptado los esquemas JSX para que coincidan **exactamente** con los datos CSV. Ahora necesitas agregar estas columnas en Supabase para que coincidan con tus datos existentes.

---

## 📋 **TABLA: PROYECTOS**

### ✅ **LO QUE YA TIENES EN SUPABASE:**
- `id` (UUID)

### ❌ **LO QUE FALTA AGREGAR:**
```sql
-- En tabla 'proyectos' agregar estas columnas:
ALTER TABLE proyectos ADD COLUMN name VARCHAR(100) NOT NULL;
ALTER TABLE proyectos ADD COLUMN status VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE proyectos ADD COLUMN resp TEXT;
ALTER TABLE proyectos ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE proyectos ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Agregar constraint para status
ALTER TABLE proyectos ADD CONSTRAINT check_status 
CHECK (status IN ('En Progreso', 'Pendiente', 'En Diseño', 'Completado', 'Pausado'));
```

---

## 👥 **TABLA: STAFF**

### ✅ **LO QUE YA TIENES EN SUPABASE:**
- `id` (UUID)

### ❌ **LO QUE FALTA AGREGAR:**
```sql
-- En tabla 'staff' agregar estas columnas:
ALTER TABLE staff ADD COLUMN name VARCHAR(100) NOT NULL;
ALTER TABLE staff ADD COLUMN role_description TEXT NOT NULL;
ALTER TABLE staff ADD COLUMN tasks TEXT;
ALTER TABLE staff ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE staff ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## 🏗️ **TABLA: STAGE**

### ✅ **LO QUE YA TIENES EN SUPABASE:**
- `id` (UUID)

### ❌ **LO QUE FALTA AGREGAR:**
```sql
-- En tabla 'stage' agregar estas columnas:
ALTER TABLE stage ADD COLUMN name VARCHAR(100) NOT NULL;
ALTER TABLE stage ADD COLUMN description TEXT NOT NULL;
ALTER TABLE stage ADD COLUMN objectives TEXT NOT NULL;
ALTER TABLE stage ADD COLUMN deliverables TEXT NOT NULL;
ALTER TABLE stage ADD COLUMN products TEXT NOT NULL;
ALTER TABLE stage ADD COLUMN stakeholders TEXT NOT NULL;
ALTER TABLE stage ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE stage ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## 📋 **TABLA: TAREAS**

### ✅ **LO QUE YA TIENES EN SUPABASE:**
- `id` (UUID)

### ❌ **LO QUE FALTA AGREGAR:**
```sql
-- En tabla 'tareas' agregar estas columnas:
ALTER TABLE tareas ADD COLUMN category VARCHAR(100) NOT NULL;
ALTER TABLE tareas ADD COLUMN task_description TEXT NOT NULL;
ALTER TABLE tareas ADD COLUMN status VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE tareas ADD COLUMN notes TEXT;
ALTER TABLE tareas ADD COLUMN project_id UUID REFERENCES proyectos(id) ON DELETE CASCADE;
ALTER TABLE tareas ADD COLUMN staff_id UUID REFERENCES staff(id) ON DELETE SET NULL;
ALTER TABLE tareas ADD COLUMN stage_id UUID REFERENCES stage(id) ON DELETE SET NULL;
ALTER TABLE tareas ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE tareas ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Agregar constraint para status
ALTER TABLE tareas ADD CONSTRAINT check_task_status 
CHECK (status IN ('Pendiente', 'En Progreso', 'En Diseño', 'Bloqueado', 'En Discusión', 'Aprobación Requerida', 'Completado'));
```

---

## 📐 **TABLA: ENTREGABLES_TEMPLATE**

### ✅ **LO QUE YA TIENES EN SUPABASE:**
- `id` (UUID)

### ❌ **LO QUE FALTA AGREGAR:**
```sql
-- En tabla 'entregables_template' agregar estas columnas:
ALTER TABLE entregables_template ADD COLUMN entregable_nombre VARCHAR(255) NOT NULL;
ALTER TABLE entregables_template ADD COLUMN tipo VARCHAR(50) NOT NULL;
ALTER TABLE entregables_template ADD COLUMN vista_tipo VARCHAR(50);
ALTER TABLE entregables_template ADD COLUMN escala_tipica VARCHAR(20);
ALTER TABLE entregables_template ADD COLUMN software_utilizado VARCHAR(100);
ALTER TABLE entregables_template ADD COLUMN stage_id UUID REFERENCES stage(id) ON DELETE SET NULL;
ALTER TABLE entregables_template ADD COLUMN vista_sub_tipo VARCHAR(50);
ALTER TABLE entregables_template ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE entregables_template ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## ⚠️ **FOREIGN KEYS IMPORTANTES**

Una vez que agregues todas las columnas, necesitas crear las relaciones:

```sql
-- Crear foreign keys
ALTER TABLE tareas 
ADD CONSTRAINT fk_tareas_project 
FOREIGN KEY (project_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE tareas 
ADD CONSTRAINT fk_tareas_staff 
FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE tareas 
ADD CONSTRAINT fk_tareas_stage 
FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE SET NULL;

ALTER TABLE entregables_template 
ADD CONSTRAINT fk_entregables_stage 
FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE SET NULL;
```

---

## 🔧 **TRIGGERS PARA UPDATED_AT**

```sql
-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
CREATE TRIGGER update_proyectos_updated_at 
BEFORE UPDATE ON proyectos 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stage_updated_at 
BEFORE UPDATE ON stage 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tareas_updated_at 
BEFORE UPDATE ON tareas 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entregables_updated_at 
BEFORE UPDATE ON entregables_template 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 **SCRIPT COMPLETO PARA EJECUTAR**

Puedes copiar y pegar este script completo en el SQL Editor de Supabase:

```sql
-- ================================
-- AGREGAR TODAS LAS COLUMNAS FALTANTES
-- ================================

-- PROYECTOS
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS resp TEXT;
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- STAFF  
ALTER TABLE staff ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS role_description TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS tasks TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE staff ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- STAGE
ALTER TABLE stage ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE stage ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE stage ADD COLUMN IF NOT EXISTS objectives TEXT;
ALTER TABLE stage ADD COLUMN IF NOT EXISTS deliverables TEXT;
ALTER TABLE stage ADD COLUMN IF NOT EXISTS products TEXT;
ALTER TABLE stage ADD COLUMN IF NOT EXISTS stakeholders TEXT;
ALTER TABLE stage ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE stage ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- TAREAS
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS task_description TEXT;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS staff_id UUID;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS stage_id UUID;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ENTREGABLES_TEMPLATE
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS entregable_nombre VARCHAR(255);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS vista_tipo VARCHAR(50);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS escala_tipica VARCHAR(20);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS software_utilizado VARCHAR(100);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS stage_id UUID;
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS vista_sub_tipo VARCHAR(50);
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE entregables_template ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ================================
-- CREAR FOREIGN KEYS
-- ================================

ALTER TABLE tareas ADD CONSTRAINT IF NOT EXISTS fk_tareas_project 
FOREIGN KEY (project_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE tareas ADD CONSTRAINT IF NOT EXISTS fk_tareas_staff 
FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE tareas ADD CONSTRAINT IF NOT EXISTS fk_tareas_stage 
FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE SET NULL;

ALTER TABLE entregables_template ADD CONSTRAINT IF NOT EXISTS fk_entregables_stage 
FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE SET NULL;

-- ================================
-- FUNCIÓN Y TRIGGERS UPDATED_AT
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers
DROP TRIGGER IF EXISTS update_proyectos_updated_at ON proyectos;
CREATE TRIGGER update_proyectos_updated_at 
BEFORE UPDATE ON proyectos 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stage_updated_at ON stage;
CREATE TRIGGER update_stage_updated_at 
BEFORE UPDATE ON stage 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tareas_updated_at ON tareas;
CREATE TRIGGER update_tareas_updated_at 
BEFORE UPDATE ON tareas 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entregables_updated_at ON entregables_template;
CREATE TRIGGER update_entregables_updated_at 
BEFORE UPDATE ON entregables_template 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- VERIFICACIÓN
-- ================================

SELECT 'COLUMNAS AGREGADAS EXITOSAMENTE!' as resultado;

-- Mostrar estructura final
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('proyectos', 'staff', 'stage', 'tareas', 'entregables_template')
ORDER BY table_name, ordinal_position;
```

---

## ✅ **VERIFICACIÓN POST-EJECUCIÓN**

Después de ejecutar el script, verifica que todo esté correcto:

```sql
-- Verificar que todas las columnas existen
SELECT 
    'proyectos' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'proyectos'

UNION ALL

SELECT 
    'staff' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'staff'

UNION ALL

SELECT 
    'stage' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'stage'

UNION ALL

SELECT 
    'tareas' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'tareas'

UNION ALL

SELECT 
    'entregables_template' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'entregables_template';
```

**RESULTADOS ESPERADOS:**
- **proyectos**: 6 columnas
- **staff**: 6 columnas  
- **stage**: 8 columnas
- **tareas**: 10 columnas
- **entregables_template**: 10 columnas

Una vez que ejecutes este script, tus tablas de Supabase estarán **100% sincronizadas** con tus archivos CSV! 🎯

-- ================================
-- SCRIPT CORREGIDO PARA SUPABASE - NOMBRES EXACTOS
-- ================================

-- IMPORTANTE: Este script usa los nombres EXACTOS de las tablas como aparecen en Supabase
-- Y los nombres EXACTOS de las columnas como aparecen en los CSV

-- ================================
-- TABLA: Proyectos
-- ================================
-- CSV tiene: id,name,status,resp
-- Agregar columnas faltantes:

ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "status" VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "resp" TEXT;
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- Constraint para status
ALTER TABLE "Proyectos" DROP CONSTRAINT IF EXISTS check_proyectos_status;
ALTER TABLE "Proyectos" ADD CONSTRAINT check_proyectos_status 
CHECK ("status" IN ('En Progreso', 'Pendiente', 'En Diseño', 'Completado', 'Pausado'));

-- ================================
-- TABLA: Staff  
-- ================================
-- CSV tiene: id,name,role_description,Tasks
-- Agregar columnas faltantes:

ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "role_description" TEXT;
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "Tasks" TEXT;
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- ================================
-- TABLA: Stage
-- ================================
-- CSV tiene: name,description,objectives,deliverables,products,stakeholders,id
-- Agregar columnas faltantes:

ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "objectives" TEXT;
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "deliverables" TEXT;
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "products" TEXT;
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "stakeholders" TEXT;
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Stage" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- ================================
-- TABLA: Tareas
-- ================================
-- CSV tiene: id,category,task_description,status,notes,project_id,staff_id,stage_id
-- Agregar columnas faltantes:

ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "category" VARCHAR(100);
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "task_description" TEXT;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "status" VARCHAR(30) DEFAULT 'Pendiente';
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "project_id" UUID;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "staff_id" UUID;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "stage_id" UUID;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- Constraint para status de tareas
ALTER TABLE "Tareas" DROP CONSTRAINT IF EXISTS check_tareas_status;
ALTER TABLE "Tareas" ADD CONSTRAINT check_tareas_status 
CHECK ("status" IN ('Pendiente', 'En Progreso', 'En Diseño', 'Bloqueado', 'En Discusión', 'Aprobación Requerida', 'Completado'));

-- ================================
-- TABLA: Entregables_template
-- ================================
-- CSV tiene: entregable_nombre,tipo,vistaTipo,escala_tipica,software_utilizado,id,Stage_id,vistaSubTipo
-- Agregar columnas faltantes:

ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "entregable_nombre" VARCHAR(255);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "tipo" VARCHAR(50);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "vistaTipo" VARCHAR(50);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "escala_tipica" VARCHAR(20);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "software_utilizado" VARCHAR(100);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "Stage_id" UUID;
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "vistaSubTipo" VARCHAR(50);
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Entregables_template" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();

-- ================================
-- CREAR FOREIGN KEYS
-- ================================

-- Foreign keys para Tareas
ALTER TABLE "Tareas" DROP CONSTRAINT IF EXISTS fk_tareas_project;
ALTER TABLE "Tareas" ADD CONSTRAINT fk_tareas_project 
FOREIGN KEY ("project_id") REFERENCES "Proyectos"("id") ON DELETE CASCADE;

ALTER TABLE "Tareas" DROP CONSTRAINT IF EXISTS fk_tareas_staff;
ALTER TABLE "Tareas" ADD CONSTRAINT fk_tareas_staff 
FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL;

ALTER TABLE "Tareas" DROP CONSTRAINT IF EXISTS fk_tareas_stage;
ALTER TABLE "Tareas" ADD CONSTRAINT fk_tareas_stage 
FOREIGN KEY ("stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL;

-- Foreign key para Entregables_template
ALTER TABLE "Entregables_template" DROP CONSTRAINT IF EXISTS fk_entregables_stage;
ALTER TABLE "Entregables_template" ADD CONSTRAINT fk_entregables_stage 
FOREIGN KEY ("Stage_id") REFERENCES "Stage"("id") ON DELETE SET NULL;

-- ================================
-- FUNCIÓN Y TRIGGERS PARA UPDATED_AT
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla (eliminar existentes primero)
DROP TRIGGER IF EXISTS update_proyectos_updated_at ON "Proyectos";
CREATE TRIGGER update_proyectos_updated_at 
BEFORE UPDATE ON "Proyectos" 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON "Staff";
CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON "Staff" 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stage_updated_at ON "Stage";
CREATE TRIGGER update_stage_updated_at 
BEFORE UPDATE ON "Stage" 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tareas_updated_at ON "Tareas";
CREATE TRIGGER update_tareas_updated_at 
BEFORE UPDATE ON "Tareas" 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entregables_updated_at ON "Entregables_template";
CREATE TRIGGER update_entregables_updated_at 
BEFORE UPDATE ON "Entregables_template" 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- VERIFICACIÓN FINAL
-- ================================

SELECT 'TODAS LAS COLUMNAS AGREGADAS CORRECTAMENTE!' as resultado;

-- Mostrar estructura final de cada tabla
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('Proyectos', 'Staff', 'Stage', 'Tareas', 'Entregables_template')
ORDER BY table_name, ordinal_position;

-- Verificar conteo de columnas por tabla
SELECT 
    'Proyectos' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'Proyectos'

UNION ALL

SELECT 
    'Staff' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'Staff'

UNION ALL

SELECT 
    'Stage' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'Stage'

UNION ALL

SELECT 
    'Tareas' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'Tareas'

UNION ALL

SELECT 
    'Entregables_template' as tabla,
    COUNT(*) as columnas_total
FROM information_schema.columns 
WHERE table_name = 'Entregables_template';

-- RESULTADOS ESPERADOS:
-- Proyectos: 6 columnas
-- Staff: 6 columnas
-- Stage: 8 columnas  
-- Tareas: 10 columnas
-- Entregables_template: 10 columnas

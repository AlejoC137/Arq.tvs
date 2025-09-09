-- ================================
-- MIGRACIÓN: AGREGAR CAMPOS Y TABLAS FALTANTES
-- ================================

-- 1. CREAR TABLA ETAPAS (faltante)
CREATE TABLE etapas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    objectives TEXT[],
    deliverables TEXT[],
    products TEXT[],
    stakeholders TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AGREGAR CAMPOS FALTANTES A PROYECTOS
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS responsable_principal_id UUID REFERENCES responsables(id);

-- 3. AGREGAR CAMPOS FALTANTES A TAREAS
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS stage_id UUID REFERENCES etapas(id);

-- 4. AGREGAR CAMPOS FALTANTES A PLANTILLAS_PLANOS
ALTER TABLE plantillas_planos ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);
ALTER TABLE plantillas_planos ADD COLUMN IF NOT EXISTS vista_tipo VARCHAR(50);
ALTER TABLE plantillas_planos ADD COLUMN IF NOT EXISTS vista_sub_tipo VARCHAR(50);
ALTER TABLE plantillas_planos ADD COLUMN IF NOT EXISTS stage_id UUID REFERENCES etapas(id);

-- 5. CREAR TABLA PARA MAPEO DE ESTADOS (compatibilidad)
CREATE TABLE estados_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estado_csv VARCHAR(50),
    estado_supabase VARCHAR(50),
    tabla_origen VARCHAR(50)
);

-- Insertar mapeos de estados
INSERT INTO estados_mapping (estado_csv, estado_supabase, tabla_origen) VALUES
-- Proyectos
('En Progreso', 'En Desarrollo', 'proyectos'),
('Pendiente', 'Planificación', 'proyectos'),
('En Diseño', 'En Desarrollo', 'proyectos'),

-- Tareas  
('En Progreso', 'En Proceso', 'tareas'),
('Pendiente', 'Pendiente', 'tareas'),
('En Diseño', 'En Proceso', 'tareas'),
('Bloqueado', 'En Revisión', 'tareas'),
('En Discusión', 'En Revisión', 'tareas'),
('Aprobación Requerida', 'En Revisión', 'tareas');

-- 6. HABILITAR RLS EN NUEVAS TABLAS
ALTER TABLE etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_mapping ENABLE ROW LEVEL SECURITY;

-- 7. CREAR POLÍTICAS RLS
CREATE POLICY "Permitir todo a usuarios autenticados" ON etapas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON estados_mapping FOR ALL USING (auth.role() = 'authenticated');

-- 8. CREAR TRIGGERS PARA UPDATED_AT
CREATE TRIGGER update_etapas_updated_at BEFORE UPDATE ON etapas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. CREAR ÍNDICES
CREATE INDEX idx_tareas_stage_id ON tareas(stage_id);
CREATE INDEX idx_plantillas_planos_stage_id ON plantillas_planos(stage_id);
CREATE INDEX idx_proyectos_responsable_principal ON proyectos(responsable_principal_id);

-- ================================
-- COMENTARIOS EN NUEVAS TABLAS
-- ================================
COMMENT ON TABLE etapas IS 'Etapas del proceso arquitectónico: Cabida, Factibilidad, Idea Básica, etc.';
COMMENT ON TABLE estados_mapping IS 'Mapeo entre estados de CSV existentes y estados de Supabase';

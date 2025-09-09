-- ================================
-- CREACIÓN DE TABLAS SUPABASE ARQ.TVS
-- ================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: proyectos
CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cliente VARCHAR(100),
    estado VARCHAR(30) CHECK (estado IN ('Planificación', 'En Desarrollo', 'En Construcción', 'Completado', 'Pausado')) DEFAULT 'Planificación',
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    presupuesto DECIMAL(12,2),
    porcentaje_avance INTEGER DEFAULT 0 CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100),
    ubicacion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: categorias
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    icono VARCHAR(50),
    etapa_principal VARCHAR(30) CHECK (etapa_principal IN ('Arquitectónica', 'Técnica', 'Construcción')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: responsables
CREATE TABLE responsables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),
    especialidad VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: tareas
CREATE TABLE tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) CHECK (estado IN ('Pendiente', 'En Proceso', 'Completado', 'Cancelado', 'En Revisión')) DEFAULT 'Pendiente',
    prioridad VARCHAR(10) CHECK (prioridad IN ('Alta', 'Media', 'Baja')) DEFAULT 'Media',
    deadline_diseno DATE,
    deadline_ejecucion DATE,
    fecha_inicio_real DATE,
    fecha_fin_real DATE,
    tiempo_estimado_horas INTEGER,
    tiempo_real_horas INTEGER,
    porcentaje_avance INTEGER DEFAULT 0,
    aprobado_por_ronald BOOLEAN DEFAULT FALSE,
    aprobado_por_wiet BOOLEAN DEFAULT FALSE,
    fecha_aprobacion_ronald TIMESTAMPTZ,
    fecha_aprobacion_wiet TIMESTAMPTZ,
    notas TEXT,
    archivos_adjuntos JSONB,
    dependencias JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: tareas_responsables (relación many-to-many)
CREATE TABLE tareas_responsables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    responsable_id UUID NOT NULL REFERENCES responsables(id) ON DELETE CASCADE,
    rol_en_tarea VARCHAR(50) CHECK (rol_en_tarea IN ('Principal', 'Apoyo', 'Revisor', 'Consultor')) DEFAULT 'Principal',
    asignado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tarea_id, responsable_id)
);

-- Tabla: plantillas_planos
CREATE TABLE plantillas_planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    etapa VARCHAR(30) CHECK (etapa IN ('Arquitectónica', 'Técnica', 'Construcción')) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    escala VARCHAR(20) NOT NULL,
    tiempo_estimado_dias VARCHAR(20),
    contenido TEXT NOT NULL,
    requiere_especialista BOOLEAN DEFAULT FALSE,
    software_recomendado JSONB,
    normas_aplicables JSONB,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: planos_proyecto
CREATE TABLE planos_proyecto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    plantilla_plano_id UUID NOT NULL REFERENCES plantillas_planos(id) ON DELETE RESTRICT,
    responsable_id UUID REFERENCES responsables(id) ON DELETE SET NULL,
    nombre_personalizado VARCHAR(255),
    estado VARCHAR(30) CHECK (estado IN ('No Iniciado', 'En Desarrollo', 'Revisión Interna', 'Revisión Cliente', 'Aprobado', 'En Construcción', 'As Built')) DEFAULT 'No Iniciado',
    revision_actual VARCHAR(10) DEFAULT 'A',
    fecha_inicio DATE,
    fecha_entrega_estimada DATE,
    fecha_entrega_real DATE,
    archivo_url TEXT,
    observaciones TEXT,
    aprobado_por_ronald BOOLEAN DEFAULT FALSE,
    aprobado_por_wiet BOOLEAN DEFAULT FALSE,
    fecha_aprobacion_ronald TIMESTAMPTZ,
    fecha_aprobacion_wiet TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: actividades (log de cambios)
CREATE TABLE actividades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id UUID NOT NULL,
    accion VARCHAR(20) CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE', 'APPROVE')) NOT NULL,
    descripcion TEXT NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================

-- Índices para tareas
CREATE INDEX idx_tareas_proyecto_id ON tareas(proyecto_id);
CREATE INDEX idx_tareas_categoria_id ON tareas(categoria_id);
CREATE INDEX idx_tareas_estado ON tareas(estado);
CREATE INDEX idx_tareas_prioridad ON tareas(prioridad);
CREATE INDEX idx_tareas_deadline_diseno ON tareas(deadline_diseno);
CREATE INDEX idx_tareas_deadline_ejecucion ON tareas(deadline_ejecucion);

-- Índices para planos_proyecto
CREATE INDEX idx_planos_proyecto_proyecto_id ON planos_proyecto(proyecto_id);
CREATE INDEX idx_planos_proyecto_plantilla_id ON planos_proyecto(plantilla_plano_id);
CREATE INDEX idx_planos_proyecto_responsable_id ON planos_proyecto(responsable_id);
CREATE INDEX idx_planos_proyecto_estado ON planos_proyecto(estado);

-- Índices para actividades
CREATE INDEX idx_actividades_tabla_registro ON actividades(tabla_afectada, registro_id);
CREATE INDEX idx_actividades_usuario_id ON actividades(usuario_id);
CREATE INDEX idx_actividades_created_at ON actividades(created_at);

-- ================================
-- TRIGGERS PARA UPDATED_AT
-- ================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_proyectos_updated_at BEFORE UPDATE ON proyectos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tareas_updated_at BEFORE UPDATE ON tareas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plantillas_planos_updated_at BEFORE UPDATE ON plantillas_planos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_proyecto_updated_at BEFORE UPDATE ON planos_proyecto FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- RLS (Row Level Security) POLICIES
-- ================================

-- Habilitar RLS en todas las tablas
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsables ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas_responsables ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantillas_planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para usuarios autenticados)
-- En producción, estas deben ser más restrictivas

CREATE POLICY "Permitir todo a usuarios autenticados" ON proyectos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON responsables FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON tareas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON tareas_responsables FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON plantillas_planos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON planos_proyecto FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir todo a usuarios autenticados" ON actividades FOR ALL USING (auth.role() = 'authenticated');

-- ================================
-- COMENTARIOS EN TABLAS
-- ================================

COMMENT ON TABLE proyectos IS 'Proyectos principales como CASA 1-7, PORTERÍA, PARCELACIÓN';
COMMENT ON TABLE categorias IS 'Categorías de tareas como Diseño Estructural, Paisajismo, etc.';
COMMENT ON TABLE responsables IS 'Personas responsables de las tareas del proyecto';
COMMENT ON TABLE tareas IS 'Tabla principal de gestión de tareas de proyectos';
COMMENT ON TABLE tareas_responsables IS 'Relación many-to-many entre tareas y responsables';
COMMENT ON TABLE plantillas_planos IS 'Catálogo de plantillas de planos arquitectónicos';
COMMENT ON TABLE planos_proyecto IS 'Planos específicos asignados a proyectos basados en plantillas';
COMMENT ON TABLE actividades IS 'Log de actividades y cambios en el sistema';

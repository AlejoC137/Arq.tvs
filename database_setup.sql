-- =====================================================
-- SCRIPT PARA CREAR LAS TABLAS EN SUPABASE
-- =====================================================

-- Eliminar tablas existentes (en orden correcto para evitar errores de FK)
DROP TABLE IF EXISTS entregables_template;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS stages;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS projects;

-- =====================================================
-- TABLA: projects
-- =====================================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(100) DEFAULT 'Pendiente',
  resp VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: staff
-- =====================================================
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role_description TEXT NOT NULL,
  Tasks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: stages
-- =====================================================
CREATE TABLE stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  objectives TEXT,
  deliverables TEXT,
  products TEXT,
  stakeholders TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: tasks
-- =====================================================
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  task_description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pendiente',
  notes TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: entregables_template
-- =====================================================
CREATE TABLE entregables_template (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entregable_nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  vistaTipo VARCHAR(100) NOT NULL,
  escala_tipica VARCHAR(50),
  software_utilizado VARCHAR(100) NOT NULL,
  Stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
  vistaSubTipo VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índices en tasks para búsquedas frecuentes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_staff_id ON tasks(staff_id);
CREATE INDEX idx_tasks_stage_id ON tasks(stage_id);

-- Índices en projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_name ON projects(name);

-- Índices en staff
CREATE INDEX idx_staff_name ON staff(name);

-- Índices en stages
CREATE INDEX idx_stages_name ON stages(name);

-- Índices en entregables_template
CREATE INDEX idx_entregables_tipo ON entregables_template(tipo);
CREATE INDEX idx_entregables_stage_id ON entregables_template(Stage_id);

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entregables_updated_at BEFORE UPDATE ON entregables_template
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregables_template ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo (ajustar según necesidades de producción)
-- NOTA: En producción, deberías implementar políticas más restrictivas

-- Projects
CREATE POLICY "Enable all operations for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Staff
CREATE POLICY "Enable all operations for authenticated users" ON staff
  FOR ALL USING (auth.role() = 'authenticated');

-- Stages
CREATE POLICY "Enable all operations for authenticated users" ON stages
  FOR ALL USING (auth.role() = 'authenticated');

-- Tasks
CREATE POLICY "Enable all operations for authenticated users" ON tasks
  FOR ALL USING (auth.role() = 'authenticated');

-- Entregables Template
CREATE POLICY "Enable all operations for authenticated users" ON entregables_template
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar datos de ejemplo de projects
INSERT INTO projects (id, name, status, resp) VALUES
  ('102b423c-a0cd-43c1-b9e2-f20988fe9bc5', 'Parcelación', 'En Progreso', ''),
  ('1be938a8-1c77-43e5-b45a-50d18e2bc3a5', 'Casa 3', 'Pendiente', ''),
  ('30b7290b-8808-4d51-8d7a-588a83e3e3a5', 'Portería', 'En Progreso', ''),
  ('3f2e8f0f-6639-4fd5-ab82-fc69ebcddd87', 'Casa 5', 'En Progreso', ''),
  ('4134e618-8e2d-408c-bb14-f1c030f8380b', 'Casa 2', 'En Progreso', ''),
  ('5c84c703-7277-4c44-98f5-462f6489b41e', 'Casa 1', 'Pendiente', ''),
  ('7574915a-7946-4553-930e-1fc50de5a01c', 'Casa 6', 'En Diseño', ''),
  ('a2a30815-c0f4-472d-a6be-d81115ae05e6', 'Casa 7', 'En Progreso', ''),
  ('e22e0ee8-49f8-4ef6-b03d-fd4146aaffe6', 'Casa 4', 'En Progreso', '');

-- Insertar datos de ejemplo de staff
INSERT INTO staff (id, name, role_description, Tasks) VALUES
  ('00791d3f-fdcd-47b4-a6d5-03dccab59e36', 'Manuela', 'Diseño e Interiorismo Básico', ''),
  ('09d55258-9b05-467b-ad50-4424daec977e', 'Miguel', 'Búsqueda de Materiales, Ayudante de Ronald', ''),
  ('112973d6-7f9e-4b48-b484-73eca526b905', 'Alejandro', 'Coordinador Técnico y de Desarrollo', ''),
  ('388a96d7-f984-40f6-8b97-5696247b825e', 'David', 'Desarrollo Técnico de Mobiliario Fijo', ''),
  ('82820457-5115-4fc8-8b1b-bb5492d57314', 'Francisco', 'Encargado de Obra (Casa 2)', ''),
  ('a34c5425-c7e3-4eb9-8037-dcab5aaef592', 'Laura', 'Encargada de Obra (Casa 4 y 5)', ''),
  ('fcd2bdcd-2abc-4b3f-a7d8-e85bccc30840', 'Santiago', 'Encargado de Obra (Casa 7 y Parqueadero Lote 6), Paisajismo', '');

-- Insertar datos de ejemplo de stages
INSERT INTO stages (id, name, description, objectives, deliverables, products, stakeholders) VALUES
  ('26e4d53a-197f-4b75-a0a1-21b8e0c29072', 'Anteproyecto', 'Desarrollo detallado del diseño. Se definen los aspectos formales, funcionales, estructurales y de instalaciones del edificio.', 'Obtener la aprobación del diseño por parte del cliente | Servir como base para la solicitud de licencias | Coordinar las distintas especialidades (ingenierías).', 'Planos arquitectónicos detallados | Memoria descriptiva | Vistas 3D o renders | Esquemas de instalaciones y estructura.', 'Planos arquitectónicos generales, Renders de presentación, Esquemas de ingenierías.', 'Arquitecto, Cliente, Ingenieros especialistas.'),
  ('6bb2cf42-9b93-45d7-9732-9bfc69f632a2', 'Pre-anteproyecto', 'Se refina la idea básica, definiendo con mayor precisión la distribución, la volumetrie y la relación con el entorno.', 'Consolidar una propuesta de diseño coherente | Realizar una primera estimación de costos más detallada | Verificar el cumplimiento de la normativa principal.', 'Planos de plantas, cortes y alzados a escala | Vistas 3D o modelos esquemáticos | Cuadro de áreas preliminar.', 'Modelos 3D, Planos básicos, Renders preliminares.', 'Arquitecto, Cliente.'),
  ('71714b98-3c62-4937-8299-02bae1036259', 'Proyecto Ejecutivo', 'Elaboración de toda la documentación técnica necesaria para la construcción de la obra. Es el conjunto de planos y especificaciones finales para licitar y construir.', 'Definir de manera inequívoca todos los detalles constructivos | Permitir la cotización precisa por parte de los constructores | Guiar la ejecución de la obra en sitio.', 'Planos Arquitectónicos (Localización, Plantas Acotadas, Cubiertas, Cortes, Fachadas, Detalles, Acabados) | Planos de Ingenierías (Estructurales, Eléctricos, Hidrosanitarios) | Documentos (Memoria Descriptiva, Presupuesto, Programación).', 'Juego completo de planos constructivos, Especificaciones técnicas detalladas.', 'Arquitecto, Ingenieros especialistas, Dibujantes técnicos.');

-- =====================================================
-- VERIFICACIÓN DE LA ESTRUCTURA
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('projects', 'staff', 'stages', 'tasks', 'entregables_template')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- COMENTARIOS ADICIONALES
-- =====================================================

-- Este script crea:
-- 1. Todas las tablas necesarias con sus relaciones
-- 2. Índices para mejorar el rendimiento
-- 3. Triggers para actualizar automáticamente updated_at
-- 4. Políticas RLS básicas para seguridad
-- 5. Datos de ejemplo para testing

-- IMPORTANTE: 
-- - Asegúrate de tener las variables de entorno configuradas en tu .env
-- - Ajusta las políticas RLS según tus necesidades de seguridad
-- - Los datos de ejemplo son opcionales y pueden eliminarse en producción

-- Script para crear las tablas necesarias en Supabase
-- Ejecuta este script en el SQL Editor de tu dashboard de Supabase

-- 1. Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(100) DEFAULT 'Activo',
    resp VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de staff (personal)
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de stages (etapas)
CREATE TABLE IF NOT EXISTS stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    task_description TEXT NOT NULL,
    status VARCHAR(100) DEFAULT 'Pendiente',
    notes TEXT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    stage_id INTEGER REFERENCES stages(id) ON DELETE SET NULL,
    priority VARCHAR(50) DEFAULT 'Media',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_staff_id ON tasks(staff_id);
CREATE INDEX IF NOT EXISTS idx_tasks_stage_id ON tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- 6. Insertar datos de ejemplo para staff
INSERT INTO staff (name, role) VALUES
    ('Juan Pérez', 'Arquitecto Principal'),
    ('María García', 'Diseñadora'),
    ('Carlos López', 'Ingeniero'),
    ('Ana Martínez', 'Coordinadora de Proyecto'),
    ('Luis Rodríguez', 'Técnico')
ON CONFLICT DO NOTHING;

-- 7. Insertar datos de ejemplo para stages
INSERT INTO stages (name, description, order_index) VALUES
    ('Planificación', 'Fase inicial de planificación del proyecto', 1),
    ('Diseño', 'Fase de diseño y modelado', 2),
    ('Desarrollo', 'Fase de implementación y construcción', 3),
    ('Revisión', 'Fase de revisión y control de calidad', 4),
    ('Entrega', 'Fase final de entrega al cliente', 5)
ON CONFLICT DO NOTHING;

-- 8. Insertar datos de ejemplo para proyectos
INSERT INTO projects (name, status, resp) VALUES
    ('Edificio Residencial Las Palmas', 'En Progreso', 'Juan Pérez'),
    ('Centro Comercial Plaza Norte', 'Planificación', 'María García'),
    ('Casa Familiar Moderna', 'Completo', 'Carlos López'),
    ('Oficinas Corporativas Tech', 'En Progreso', 'Ana Martínez'),
    ('Restaurante Gourmet Downtown', 'Pendiente', 'Luis Rodríguez')
ON CONFLICT DO NOTHING;

-- 9. Insertar datos de ejemplo para tareas
INSERT INTO tasks (category, task_description, status, notes, project_id, staff_id, stage_id, priority) VALUES
    ('Diseño', 'Crear planos arquitectónicos principales', 'En Progreso', 'Incluir detalles de fachada', 1, 1, 2, 'Alta'),
    ('Planificación', 'Estudio de viabilidad del terreno', 'Completo', 'Análisis geotécnico completado', 1, 3, 1, 'Alta'),
    ('Desarrollo', 'Solicitud de permisos municipales', 'Pendiente', 'Pendiente documentación adicional', 1, 4, 3, 'Media'),
    ('Diseño', 'Modelado 3D del proyecto', 'En Progreso', 'Usando software BIM', 2, 2, 2, 'Media'),
    ('Revisión', 'Revisión estructural de planos', 'Pendiente', 'Requiere aprobación de ingeniero', 2, 3, 4, 'Alta'),
    ('Entrega', 'Presentación final al cliente', 'Completo', 'Cliente satisfecho con el resultado', 3, 1, 5, 'Baja'),
    ('Planificación', 'Análisis de requisitos del cliente', 'En Progreso', 'Reunión programada para la próxima semana', 4, 4, 1, 'Alta'),
    ('Diseño', 'Diseño de interiores', 'Pendiente', 'Esperando confirmación de materiales', 5, 2, 2, 'Media')
ON CONFLICT DO NOTHING;

-- 10. Habilitar Row Level Security (RLS) - Opcional pero recomendado
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 11. Crear políticas básicas (descomenta si quieres habilitar RLS)
-- CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON projects FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON projects FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON projects FOR DELETE USING (true);

-- Repetir políticas similares para las otras tablas si se habilita RLS

COMMENT ON TABLE projects IS 'Tabla para gestionar los proyectos arquitectónicos';
COMMENT ON TABLE staff IS 'Tabla para gestionar el personal del equipo';
COMMENT ON TABLE stages IS 'Tabla para definir las etapas de los proyectos';
COMMENT ON TABLE tasks IS 'Tabla para gestionar las tareas de cada proyecto';

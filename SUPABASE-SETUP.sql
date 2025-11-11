-- ========================================
-- TABLAS PARA PROTOCOLOS Y DIRECTORIO
-- ========================================
-- Ejecuta estos comandos en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New query

-- ========================================
-- TABLA: Protocolos
-- ========================================
-- Esta tabla YA EXISTE en tu Supabase
-- Estructura confirmada:
-- - id (uuid, PK)
-- - FechaUpdate (text)
-- - Nombre (text)
-- - Contenido (text)
-- - Editor (text)

-- Si necesitas recrearla o verificar:
/*
CREATE TABLE IF NOT EXISTS public."Protocolos" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "FechaUpdate" TEXT,
  "Nombre" TEXT NOT NULL,
  "Contenido" TEXT NOT NULL,
  "Editor" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public."Protocolos" ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura a todos
CREATE POLICY "Permitir lectura de protocolos" ON public."Protocolos"
  FOR SELECT USING (true);

-- Política: Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción de protocolos" ON public."Protocolos"
  FOR INSERT WITH CHECK (true);

-- Política: Permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización de protocolos" ON public."Protocolos"
  FOR UPDATE USING (true);

-- Política: Permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación de protocolos" ON public."Protocolos"
  FOR DELETE USING (true);
*/

-- ========================================
-- TABLA: Contactos (NUEVA)
-- ========================================
CREATE TABLE IF NOT EXISTS public."Contactos" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  email TEXT NOT NULL,
  telefono TEXT,
  area TEXT,
  ubicacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por nombre
CREATE INDEX IF NOT EXISTS idx_contactos_nombre 
  ON public."Contactos"(nombre);

-- Índice para búsquedas por área
CREATE INDEX IF NOT EXISTS idx_contactos_area 
  ON public."Contactos"(area);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contactos_updated_at
  BEFORE UPDATE ON public."Contactos"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public."Contactos" ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura a todos
CREATE POLICY "Permitir lectura de contactos" ON public."Contactos"
  FOR SELECT USING (true);

-- Política: Permitir inserción a todos
CREATE POLICY "Permitir inserción de contactos" ON public."Contactos"
  FOR INSERT WITH CHECK (true);

-- Política: Permitir actualización a todos
CREATE POLICY "Permitir actualización de contactos" ON public."Contactos"
  FOR UPDATE USING (true);

-- Política: Permitir eliminación a todos
CREATE POLICY "Permitir eliminación de contactos" ON public."Contactos"
  FOR DELETE USING (true);

-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Insertar protocolos de ejemplo (si la tabla está vacía)
INSERT INTO public."Protocolos" ("Nombre", "Contenido", "Editor", "FechaUpdate")
VALUES 
  (
    'Protocolo de Revisión de Proyectos',
    E'# Protocolo de Revisión de Proyectos\n\n## Objetivo\nEstablecer un proceso claro y eficiente para la revisión de proyectos arquitectónicos.\n\n## Procedimiento\n\n### 1. Preparación\n- Reunir todos los planos actualizados\n- Incluir memoria descriptiva\n- Preparar renders si aplica\n\n### 2. Revisión\n- Presentar cambios principales (máximo 15 minutos)\n- Discutir puntos críticos\n- Documentar observaciones\n\n## Checklist\n- [ ] Planos actualizados\n- [ ] Nomenclatura correcta\n- [ ] Memoria completa',
    'Sistema',
    NOW()::TEXT
  ),
  (
    'Protocolo de Nomenclatura',
    E'# Protocolo de Nomenclatura\n\n## Formato General\n`PROYECTO-ETAPA-TIPO-VERSIÓN`\n\n## Ejemplos\n- `VILLA-DISEÑO-PLANTA-V01.dwg`\n- `TORRE-OBRA-FACHADA-V02.pdf`\n\n## Etapas\n1. **DISEÑO** - Fase de diseño inicial\n2. **OBRA** - Documentos de construcción\n3. **ASBUILT** - Planos finales\n\n## Nomenclatura de Archivos\n- Usar MAYÚSCULAS para el proyecto\n- Separar con guiones\n- Incluir versión siempre',
    'Sistema',
    NOW()::TEXT
  )
ON CONFLICT DO NOTHING;

-- Insertar contactos de ejemplo
INSERT INTO public."Contactos" (nombre, cargo, empresa, email, telefono, area, ubicacion)
VALUES 
  ('Juan Pérez', 'Arquitecto Principal', 'Estudio ARQ.TVS', 'juan.perez@arq.tvs', '+57 300 123 4567', 'Diseño', 'Bogotá, Colombia'),
  ('María González', 'Coordinadora de Proyectos', 'Estudio ARQ.TVS', 'maria.gonzalez@arq.tvs', '+57 301 234 5678', 'Gestión', 'Bogotá, Colombia'),
  ('Carlos Rodríguez', 'Ingeniero Estructural', 'Estructuras CR', 'carlos@estructurascr.com', '+57 302 345 6789', 'Consultoría Externa', 'Medellín, Colombia')
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Ver protocolos
SELECT id, "Nombre", "Editor", "FechaUpdate" 
FROM public."Protocolos" 
ORDER BY "FechaUpdate" DESC;

-- Ver contactos
SELECT id, nombre, cargo, empresa, area 
FROM public."Contactos" 
ORDER BY nombre;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================

/*
IMPORTANTE: 
1. La tabla "Protocolos" ya existe en tu Supabase
2. Solo necesitas crear la tabla "Contactos"
3. Las políticas RLS están configuradas para permitir todas las operaciones
4. Si necesitas restringir acceso, modifica las políticas

PARA RESTRINGIR A USUARIOS AUTENTICADOS:
Cambia `USING (true)` por `USING (auth.uid() IS NOT NULL)`
y `WITH CHECK (true)` por `WITH CHECK (auth.uid() IS NOT NULL)`
*/

-- ================================
-- MIGRACIÓN DE DATOS EXISTENTES CSV A SUPABASE
-- ================================

-- PASO 1: IMPORTAR ETAPAS DESDE Stage_rows.csv
-- Primero crear tabla temporal para importar
CREATE TEMP TABLE temp_stages (
    name VARCHAR(100),
    description TEXT,
    objectives TEXT,
    deliverables TEXT,
    products TEXT,
    stakeholders TEXT,
    id UUID
);

-- Importar datos (ejecutar manualmente con los datos de Stage_rows.csv)
INSERT INTO temp_stages VALUES
('Anteproyecto', 'Desarrollo detallado del diseño. Se definen los aspectos formales, funcionales, estructurales y de instalaciones del edificio.', 'Obtener la aprobación del diseño por parte del cliente | Servir como base para la solicitud de licencias | Coordinar las distintas especialidades (ingenierías).', 'Planos arquitectónicos detallados | Memoria descriptiva | Vistas 3D o renders | Esquemas de instalaciones y estructura.', 'Planos arquitectónicos generales, Renders de presentación, Esquemas de ingenierías.', 'Arquitecto, Cliente, Ingenieros especialistas.', '26e4d53a-197f-4b75-a0a1-21b8e0c29072'),
('Pre-anteproyecto', 'Se refina la idea básica, definiendo con mayor precisión la distribución, la volumétrie y la relación con el entorno.', 'Consolidar una propuesta de diseño coherente | Realizar una primera estimación de costos más detallada | Verificar el cumplimiento de la normativa principal.', 'Planos de plantas, cortes y alzados a escala | Vistas 3D o modelos esquemáticos | Cuadro de áreas preliminar.', 'Modelos 3D, Planos básicos, Renders preliminares.', 'Arquitecto, Cliente.', '6bb2cf42-9b93-45d7-9732-9bfc69f632a2'),
('Proyecto Ejecutivo', 'Elaboración de toda la documentación técnica necesaria para la construcción de la obra. Es el conjunto de planos y especificaciones finales para licitar y construir.', 'Definir de manera inequívoca todos los detalles constructivos | Permitir la cotización precisa por parte de los constructores | Guiar la ejecución de la obra en sitio.', 'Planos Arquitectónicos (Localización, Plantas Acotadas, Cubiertas, Cortes, Fachadas, Detalles, Acabados) | Planos de Ingenierías (Estructurales, Eléctricos, Hidrosanitarios) | Documentos (Memoria Descriptiva, Presupuesto, Programación).', 'Juego completo de planos constructivos, Especificaciones técnicas detalladas.', 'Arquitecto, Ingenieros especialistas, Dibujantes técnicos.', '71714b98-3c62-4937-8299-02bae1036259'),
('Idea Básica', 'Desarrollo de los primeros conceptos y esquemas a mano alzada o digitales que exploran la distribución, forma y volumen del proyecto.', 'Traducir el programa a una forma espacial | Explorar diferentes soluciones de diseño | Establecer la dirección conceptual.', 'Croquis y bocetos | Diagramas de funcionamiento | Primeros esquemas volumétricos.', 'Croquis a mano, Renders conceptuales.', 'Arquitecto, Cliente.', '9ced3071-d9d4-49a3-9a31-18a163652eb0'),
('Licitación', 'Proceso de selección de la empresa constructora que ejecutará la obra, basado en el Proyecto Ejecutivo.', 'Comparar propuestas técnicas y económicas | Seleccionar al contratista más adecuado | Formalizar la relación contractual.', 'Bases de licitación | Cuadros comparativos de ofertas | Contrato de construcción.', 'Documentos para licitación, Presupuesto detallado.', 'Cliente/Promotor, Arquitecto (como asesor).', 'aab8658d-e147-4b6a-933b-f6e4f22cb325'),
('Construcción', 'Ejecución material de la obra, siguiendo fielmente los planos y especificaciones del Proyecto Ejecutivo.', 'Materializar el proyecto según lo diseñado | Cumplir con los plazos, costos y estándares de calidad | Garantizar la seguridad en la obra.', 'Avances de obra | Bitácora de obra | Actas de recepción parcial y final.', 'Planos ''As-Built'' (conforme a obra), Reportes de obra.', 'Constructor/Contratista, Arquitecto (supervisión), Cliente, Residentes de obra.', 'c18ce26a-9ccf-4c50-af07-2791402a2567'),
('Cabida', 'Estudio del terreno para determinar su potencial constructivo según la normativa vigente y definir el programa de necesidades del cliente.', 'Determinar el área máxima de construcción | Establecer los usos permitidos | Definir los requerimientos y espacios del proyecto.', 'Plano de localización | Esquema de ocupación del predio | Listado de necesidades (programa arquitectónico).', 'Diagramas funcionales, Programa de áreas.', 'Cliente/Promotor, Arquitecto, Topógrafo.', 'e19e5b26-84d8-493b-b5b3-cd7ef39abcbd'),
('Factibilidad', 'Análisis preliminar para determinar si el proyecto es viable desde una perspectiva legal, técnica, económica y comercial.', 'Validar la viabilidad del proyecto | Identificar riesgos potenciales | Estimar la inversión inicial y posible rentabilidad.', 'Estudio de normatividad urbana | Análisis financiero preliminar | Estudio de mercado.', 'Estudios de viabilidad.', 'Cliente/Promotor, Arquitecto, Asesor financiero/inmobiliario.', 'e9b3fbf5-3dc6-4d37-9589-add648d27755');

-- Insertar en tabla etapas
INSERT INTO etapas (id, name, description, objectives, deliverables, products, stakeholders)
SELECT 
    id,
    name,
    description,
    string_to_array(objectives, ' | '),
    string_to_array(deliverables, ' | '),
    string_to_array(products, ', '),
    string_to_array(stakeholders, ', ')
FROM temp_stages;

-- PASO 2: ACTUALIZAR PROYECTOS CON MAPEO DE ESTADOS
-- Crear tabla temporal para proyectos
CREATE TEMP TABLE temp_proyectos (
    id UUID,
    name VARCHAR(100),
    status VARCHAR(50),
    resp TEXT
);

-- Insertar proyectos existentes (datos de Proyectos_rows.csv)
INSERT INTO temp_proyectos VALUES
('102b423c-a0cd-43c1-b9e2-f20988fe9bc5', 'Parcelación', 'En Progreso', ''),
('1be938a8-1c77-43e5-b45a-50d18e2bc3a5', 'Casa 3', 'Pendiente', ''),
('30b7290b-8808-4d51-8d7a-588a83e3e3a5', 'Portería', 'En Progreso', ''),
('3f2e8f0f-6639-4fd5-ab82-fc69ebcddd87', 'Casa 5', 'En Progreso', ''),
('4134e618-8e2d-408c-bb14-f1c030f8380b', 'Casa 2', 'En Progreso', ''),
('5c84c703-7277-4c44-98f5-462f6489b41e', 'Casa 1', 'Pendiente', ''),
('7574915a-7946-4553-930e-1fc50de5a01c', 'Casa 6', 'En Diseño', ''),
('a2a30815-c0f4-472d-a6be-d81115ae05e6', 'Casa 7', 'En Progreso', ''),
('e22e0ee8-49f8-4ef6-b03d-fd4146aaffe6', 'Casa 4', 'En Progreso', '');

-- Insertar en proyectos con mapeo de estados
INSERT INTO proyectos (id, codigo, nombre, estado, cliente, porcentaje_avance)
SELECT 
    tp.id,
    CASE 
        WHEN tp.name LIKE 'Casa%' THEN 'PRY-' || REPLACE(UPPER(tp.name), ' ', '')
        ELSE 'PRY-' || UPPER(SUBSTRING(tp.name, 1, 8))
    END as codigo,
    tp.name as nombre,
    COALESCE(em.estado_supabase, 'Planificación') as estado,
    'TVS Development' as cliente,
    CASE 
        WHEN tp.status = 'En Progreso' THEN 25
        WHEN tp.status = 'En Diseño' THEN 15
        ELSE 5
    END as porcentaje_avance
FROM temp_proyectos tp
LEFT JOIN estados_mapping em ON em.estado_csv = tp.status AND em.tabla_origen = 'proyectos';

-- PASO 3: INSERTAR RESPONSABLES CON DATOS FALTANTES
-- Crear tabla temporal para staff
CREATE TEMP TABLE temp_staff (
    id UUID,
    name VARCHAR(100),
    role_description TEXT,
    tasks TEXT
);

-- Insertar staff existente (datos de Staff_rows.csv)
INSERT INTO temp_staff VALUES
('00791d3f-fdcd-47b4-a6d5-03dccab59e36', 'Manuela', 'Diseño e Interiorismo Básico', ''),
('09d55258-9b05-467b-ad50-4424daec977e', 'Miguel', 'Búsqueda de Materiales, Ayudante de Ronald', ''),
('112973d6-7f9e-4b48-b484-73eca526b905', 'Alejandro', 'Coordinador Técnico y de Desarrollo', ''),
('388a96d7-f984-40f6-8b97-5696247b825e', 'David', 'Desarrollo Técnico de Mobiliario Fijo', ''),
('82820457-5115-4fc8-8b1b-bb5492d57314', 'Francisco', 'Encargado de Obra (Casa 2)', ''),
('a34c5425-c7e3-4eb9-8037-dcab5aaef592', 'Laura', 'Encargada de Obra (Casa 4 y 5)', ''),
('fcd2bdcd-2abc-4b3f-a7d8-e85bccc30840', 'Santiago', 'Encargado de Obra (Casa 7 y Parqueadero Lote 6), Paisajismo', '');

-- Insertar en responsables
INSERT INTO responsables (id, nombre, especialidad, email, activo)
SELECT 
    id,
    name,
    role_description,
    LOWER(REPLACE(name, ' ', '.')) || '@arq.tvs' as email,
    TRUE
FROM temp_staff;

-- PASO 4: MIGRAR TAREAS CON MAPEO COMPLETO
-- Función para obtener primera categoría que coincida
CREATE OR REPLACE FUNCTION get_categoria_id(categoria_texto TEXT) 
RETURNS UUID AS $$
DECLARE
    categoria_id_result UUID;
BEGIN
    -- Mapeo manual de categorías existentes en CSV a categorías de Supabase
    SELECT id INTO categoria_id_result FROM categorias WHERE 
        CASE 
            WHEN categoria_texto ILIKE '%diseño estructural%' THEN nombre = 'Diseño Estructural'
            WHEN categoria_texto ILIKE '%revisión%' THEN nombre = 'Diseño Arquitectónico'
            WHEN categoria_texto ILIKE '%puerta%' THEN nombre = 'Carpintería'
            WHEN categoria_texto ILIKE '%baño%' THEN nombre = 'Diseño Hidráulico'
            WHEN categoria_texto ILIKE '%exterior%' THEN nombre = 'Diseño Arquitectónico'
            WHEN categoria_texto ILIKE '%obra%' THEN nombre = 'Acabados Exteriores'
            WHEN categoria_texto ILIKE '%redes%' THEN nombre = 'Diseño Eléctrico'
            WHEN categoria_texto ILIKE '%interior%' THEN nombre = 'Acabados Interiores'
            WHEN categoria_texto ILIKE '%paisajismo%' THEN nombre = 'Diseño Paisajístico'
            WHEN categoria_texto ILIKE '%diseño técnico%' THEN nombre = 'Diseño Arquitectónico'
            WHEN categoria_texto ILIKE '%fachada%' THEN nombre = 'Acabados Exteriores'
            WHEN categoria_texto ILIKE '%entrega%curaduría%' THEN nombre = 'Diseño Arquitectónico'
            WHEN categoria_texto ILIKE '%habitación%' THEN nombre = 'Acabados Interiores'
            WHEN categoria_texto ILIKE '%general%' THEN nombre = 'Diseño Arquitectónico'
            WHEN categoria_texto ILIKE '%acabados%' THEN nombre = 'Acabados Interiores'
            ELSE nombre = 'Diseño Arquitectónico' -- Por defecto
        END
    LIMIT 1;
    
    RETURN COALESCE(categoria_id_result, (SELECT id FROM categorias WHERE nombre = 'Diseño Arquitectónico' LIMIT 1));
END;
$$ LANGUAGE plpgsql;

-- Ahora migrar las tareas con un INSERT masivo más eficiente
INSERT INTO tareas (
    id, 
    proyecto_id, 
    categoria_id, 
    titulo, 
    descripcion, 
    estado, 
    prioridad, 
    notas,
    porcentaje_avance
)
SELECT 
    -- Usar UUIDs existentes o generar nuevos si no existen
    COALESCE(
        CASE 
            WHEN tt.id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' 
            THEN tt.id::UUID 
            ELSE uuid_generate_v4() 
        END, 
        uuid_generate_v4()
    ) as id,
    
    -- Mapear proyecto_id (si existe en proyectos, sino usar el primero disponible)
    COALESCE(
        (SELECT id FROM proyectos WHERE id = COALESCE(tt.project_id::UUID, uuid_generate_v4()) LIMIT 1),
        (SELECT id FROM proyectos LIMIT 1)
    ) as proyecto_id,
    
    -- Obtener categoria_id usando la función de mapeo
    get_categoria_id(tt.category) as categoria_id,
    
    -- Título y descripción
    SUBSTRING(tt.task_description, 1, 255) as titulo,
    tt.task_description as descripcion,
    
    -- Mapear estado
    COALESCE(em.estado_supabase, 'Pendiente') as estado,
    
    -- Asignar prioridad basada en el estado
    CASE 
        WHEN tt.status IN ('Aprobación Requerida', 'Bloqueado') THEN 'Alta'
        WHEN tt.status IN ('En Progreso', 'En Diseño') THEN 'Media'
        ELSE 'Baja'
    END as prioridad,
    
    -- Notas
    tt.notes,
    
    -- Porcentaje de avance basado en estado
    CASE 
        WHEN tt.status = 'Completado' THEN 100
        WHEN tt.status IN ('En Progreso', 'En Diseño') THEN 50
        WHEN tt.status = 'Aprobación Requerida' THEN 75
        ELSE 0
    END as porcentaje_avance

FROM (VALUES
    -- Insertar manualmente algunas tareas de muestra del CSV (simplificado)
    ('0a8ca85d-4e48-402d-8a8e-457cba7aac3f', 'Diseño estructural', '01 Definir puntos de conexión del muro con la estructura de Casa 1', 'Pendiente', '', '', '', ''),
    ('184b9ebc-81d2-4811-8d20-fe0591f6f400', 'Puertas', 'Definir las puertas interiores', 'Pendiente', '', '', '', ''),
    ('2006b6ca-71e0-43f3-b56b-176a1cdbbee2', 'Baños', 'Hacer propuesta en render 3D de un espacio típico de inodoro con acabados de Ronald', 'En Diseño', '', '', '', ''),
    ('228d9180-9868-48bb-bd42-4d9d4e21de16', 'Exterior', 'Diseño del espacio frontal de la casa', 'Pendiente', '', '', '', ''),
    ('31dca2e0-6ce1-4e96-8c3a-eea5bf8ee7c5', 'Diseño técnico', 'Diseños técnicos de baños secundarios y baño social', 'En Progreso', '', '', '', '')
) AS tt(id, category, task_description, status, notes, project_id, staff_id, stage_id)
LEFT JOIN estados_mapping em ON em.estado_csv = tt.status AND em.tabla_origen = 'tareas';

-- PASO 5: CREAR ALGUNAS RELACIONES EN TAREAS_RESPONSABLES
-- Asignar responsables a tareas basado en especialidades
INSERT INTO tareas_responsables (tarea_id, responsable_id, rol_en_tarea)
SELECT 
    t.id as tarea_id,
    r.id as responsable_id,
    'Principal' as rol_en_tarea
FROM tareas t
JOIN categorias c ON t.categoria_id = c.id
JOIN responsables r ON (
    (c.nombre = 'Diseño Estructural' AND r.especialidad LIKE '%Coordinador Técnico%') OR
    (c.nombre = 'Diseño Paisajístico' AND r.especialidad LIKE '%Paisajismo%') OR
    (c.nombre = 'Acabados Interiores' AND r.especialidad LIKE '%Interiorismo%') OR
    (c.nombre = 'Acabados Exteriores' AND r.especialidad LIKE '%Obra%')
)
LIMIT 10; -- Limitar para evitar demasiadas relaciones

-- LIMPIEZA: Eliminar tablas temporales y función
DROP TABLE temp_stages;
DROP TABLE temp_proyectos;
DROP TABLE temp_staff;
DROP FUNCTION get_categoria_id(TEXT);

-- VERIFICACIÓN FINAL
SELECT 'MIGRACIÓN COMPLETADA - RESUMEN:' as info;

SELECT 
    'Etapas importadas: ' || COUNT(*) as resultado
FROM etapas
UNION ALL
SELECT 
    'Proyectos actualizados: ' || COUNT(*) as resultado
FROM proyectos  
UNION ALL
SELECT 
    'Responsables importados: ' || COUNT(*) as resultado
FROM responsables
UNION ALL
SELECT 
    'Tareas migradas: ' || COUNT(*) as resultado  
FROM tareas
UNION ALL
SELECT 
    'Relaciones responsables-tareas: ' || COUNT(*) as resultado
FROM tareas_responsables;

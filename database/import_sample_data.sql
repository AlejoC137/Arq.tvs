-- ================================
-- SCRIPT PARA IMPORTAR DATOS DE EJEMPLO
-- ================================

-- IMPORTANTE: Este script debe ejecutarse después de crear las tablas
-- Los archivos CSV deben estar disponibles en la ruta especificada

-- ================================
-- IMPORTAR PROYECTOS
-- ================================
-- Nota: Los UUIDs se generarán automáticamente
\copy proyectos(codigo, nombre, descripcion, cliente, estado, fecha_inicio, fecha_fin_estimada, presupuesto, porcentaje_avance, ubicacion) FROM 'C:\Users\Alejandro\Documents\GitHub\Arq.tvs\database\sample_data\proyectos.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- ================================
-- IMPORTAR CATEGORÍAS
-- ================================
\copy categorias(nombre, descripcion, color, icono, etapa_principal) FROM 'C:\Users\Alejandro\Documents\GitHub\Arq.tvs\database\sample_data\categorias.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- ================================
-- IMPORTAR RESPONSABLES
-- ================================
\copy responsables(nombre, apellido, email, telefono, especialidad, activo) FROM 'C:\Users\Alejandro\Documents\GitHub\Arq.tvs\database\sample_data\responsables.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- ================================
-- IMPORTAR PLANTILLAS DE PLANOS
-- ================================
\copy plantillas_planos(codigo, nombre, etapa, categoria, escala, tiempo_estimado_dias, contenido, requiere_especialista, activa) FROM 'C:\Users\Alejandro\Documents\GitHub\Arq.tvs\database\sample_data\plantillas_planos.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- ================================
-- VERIFICAR DATOS IMPORTADOS
-- ================================

-- Contar registros importados
SELECT 'proyectos' AS tabla, COUNT(*) AS registros FROM proyectos
UNION ALL
SELECT 'categorias' AS tabla, COUNT(*) AS registros FROM categorias
UNION ALL
SELECT 'responsables' AS tabla, COUNT(*) AS registros FROM responsables
UNION ALL
SELECT 'plantillas_planos' AS tabla, COUNT(*) AS registros FROM plantillas_planos;

-- Mostrar algunos registros de ejemplo
SELECT 'PROYECTOS - Primeros 5 registros:' AS info;
SELECT codigo, nombre, estado, porcentaje_avance FROM proyectos LIMIT 5;

SELECT 'CATEGORÍAS - Por etapa:' AS info;
SELECT etapa_principal, COUNT(*) as cantidad FROM categorias GROUP BY etapa_principal ORDER BY etapa_principal;

SELECT 'RESPONSABLES - Especialidades:' AS info;
SELECT especialidad, COUNT(*) as cantidad FROM responsables GROUP BY especialidad ORDER BY especialidad;

SELECT 'PLANTILLAS DE PLANOS - Por etapa:' AS info;
SELECT etapa, COUNT(*) as cantidad FROM plantillas_planos GROUP BY etapa ORDER BY etapa;

-- ================================
-- CREAR DATOS DE EJEMPLO ADICIONALES
-- ================================

-- Crear algunas tareas de ejemplo para el proyecto CASA 1
INSERT INTO tareas (
    proyecto_id, 
    categoria_id, 
    titulo, 
    descripcion, 
    estado, 
    prioridad, 
    deadline_diseno, 
    deadline_ejecucion,
    tiempo_estimado_horas,
    porcentaje_avance
) 
SELECT 
    p.id as proyecto_id,
    c.id as categoria_id,
    'Desarrollo de ' || c.nombre || ' - ' || p.nombre as titulo,
    'Desarrollo completo de ' || c.descripcion || ' para el proyecto ' || p.nombre as descripcion,
    CASE 
        WHEN c.nombre IN ('Diseño Arquitectónico', 'Diseño Estructural') THEN 'En Proceso'
        WHEN c.nombre IN ('Diseño Eléctrico', 'Diseño Hidráulico') THEN 'Pendiente'
        ELSE 'Pendiente'
    END as estado,
    CASE 
        WHEN c.nombre IN ('Diseño Arquitectónico', 'Diseño Estructural') THEN 'Alta'
        ELSE 'Media'
    END as prioridad,
    CURRENT_DATE + INTERVAL '15 days' as deadline_diseno,
    CURRENT_DATE + INTERVAL '45 days' as deadline_ejecucion,
    CASE 
        WHEN c.etapa_principal = 'Arquitectónica' THEN 40
        WHEN c.etapa_principal = 'Técnica' THEN 60
        WHEN c.etapa_principal = 'Construcción' THEN 30
    END as tiempo_estimado_horas,
    CASE 
        WHEN c.nombre = 'Diseño Arquitectónico' THEN 75
        WHEN c.nombre = 'Diseño Estructural' THEN 40
        ELSE 0
    END as porcentaje_avance
FROM proyectos p
CROSS JOIN categorias c
WHERE p.codigo = 'PRY-CASA1' AND c.nombre IN (
    'Diseño Arquitectónico', 'Diseño Estructural', 'Diseño Eléctrico', 
    'Diseño Hidráulico', 'Diseño Paisajístico', 'Acabados Interiores'
);

-- Asignar algunos responsables a las tareas creadas
INSERT INTO tareas_responsables (tarea_id, responsable_id, rol_en_tarea)
SELECT 
    t.id as tarea_id,
    r.id as responsable_id,
    'Principal' as rol_en_tarea
FROM tareas t
JOIN categorias c ON t.categoria_id = c.id
JOIN responsables r ON (
    (c.nombre = 'Diseño Arquitectónico' AND r.especialidad = 'Arquitecto Director') OR
    (c.nombre = 'Diseño Estructural' AND r.especialidad = 'Ingeniero Estructural') OR
    (c.nombre = 'Diseño Eléctrico' AND r.especialidad = 'Ingeniero Eléctrico') OR
    (c.nombre = 'Diseño Hidráulico' AND r.especialidad = 'Ingeniera Hidráulica') OR
    (c.nombre = 'Diseño Paisajístico' AND r.especialidad = 'Arquitecto Paisajista') OR
    (c.nombre = 'Acabados Interiores' AND r.especialidad = 'Diseñadora de Interiores')
)
WHERE EXISTS (SELECT 1 FROM proyectos p WHERE p.id = t.proyecto_id AND p.codigo = 'PRY-CASA1');

-- Crear algunos planos para el proyecto CASA 1
INSERT INTO planos_proyecto (
    proyecto_id,
    plantilla_plano_id,
    responsable_id,
    nombre_personalizado,
    estado,
    fecha_inicio,
    fecha_entrega_estimada
)
SELECT 
    p.id as proyecto_id,
    pp.id as plantilla_plano_id,
    r.id as responsable_id,
    pp.nombre || ' - ' || p.nombre as nombre_personalizado,
    CASE 
        WHEN pp.codigo IN ('ARQ-001', 'ARQ-002') THEN 'En Desarrollo'
        WHEN pp.codigo IN ('EST-001') THEN 'Revisión Interna'
        ELSE 'No Iniciado'
    END as estado,
    CASE 
        WHEN pp.codigo IN ('ARQ-001', 'ARQ-002', 'EST-001') THEN CURRENT_DATE - INTERVAL '5 days'
        ELSE NULL
    END as fecha_inicio,
    CURRENT_DATE + INTERVAL '20 days' as fecha_entrega_estimada
FROM proyectos p
CROSS JOIN plantillas_planos pp
LEFT JOIN responsables r ON (
    (pp.etapa = 'Arquitectónica' AND r.especialidad = 'Arquitecto Director') OR
    (pp.etapa = 'Técnica' AND pp.categoria = 'Estructural' AND r.especialidad = 'Ingeniero Estructural') OR
    (pp.etapa = 'Técnica' AND pp.categoria = 'Instalaciones Eléctricas' AND r.especialidad = 'Ingeniero Eléctrico')
)
WHERE p.codigo = 'PRY-CASA1' 
AND pp.codigo IN ('ARQ-001', 'ARQ-002', 'ARQ-003', 'EST-001', 'ELE-001', 'HID-001');

-- ================================
-- VERIFICACIONES FINALES
-- ================================

SELECT 'RESUMEN FINAL DE DATOS:' AS info;

SELECT 
    'Total de tareas creadas para CASA 1: ' || COUNT(*) as resumen
FROM tareas t
JOIN proyectos p ON t.proyecto_id = p.id
WHERE p.codigo = 'PRY-CASA1';

SELECT 
    'Total de asignaciones de responsables: ' || COUNT(*) as resumen
FROM tareas_responsables;

SELECT 
    'Total de planos de proyecto creados: ' || COUNT(*) as resumen
FROM planos_proyecto;

-- Mostrar el estado actual del proyecto CASA 1
SELECT 
    p.nombre as proyecto,
    p.estado as estado_proyecto,
    p.porcentaje_avance as avance_proyecto,
    COUNT(t.id) as total_tareas,
    COUNT(CASE WHEN t.estado = 'Completado' THEN 1 END) as tareas_completadas,
    COUNT(CASE WHEN t.estado = 'En Proceso' THEN 1 END) as tareas_en_proceso,
    COUNT(CASE WHEN t.estado = 'Pendiente' THEN 1 END) as tareas_pendientes
FROM proyectos p
LEFT JOIN tareas t ON p.id = t.proyecto_id
WHERE p.codigo = 'PRY-CASA1'
GROUP BY p.id, p.nombre, p.estado, p.porcentaje_avance;

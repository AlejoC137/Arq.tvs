-- ================================
-- MIGRACIÓN: Agregar columna 'espacio' a la tabla tasks
-- ================================
-- Descripción: Agrega un campo espacio a las tareas para categorizar por habitación/área

-- Agregar la columna espacio a la tabla tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS espacio VARCHAR(100);

-- Crear índice para mejorar búsquedas por espacio
CREATE INDEX IF NOT EXISTS idx_tasks_espacio ON tasks(espacio);

-- Comentario explicativo
COMMENT ON COLUMN tasks.espacio IS 'Espacio o habitación donde aplica la tarea (ej: HabitacionPrincipal, Cocina, etc.)';

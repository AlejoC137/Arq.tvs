# Guía de Uso del Sistema de Actions

## 📦 Sistema Unificado de Actions

El proyecto ahora cuenta con un sistema unificado y modular de Redux actions que facilita el CRUD completo de todas las tablas.

---

## 🎯 Estructura del Sistema

```
src/store/actions/
├── actions.js           # ⭐ PUNTO DE ENTRADA ÚNICO - Re-exporta todo
├── crudActions.js       # Factory para generar CRUD automático
├── projectActions.js    # Actions específicas de proyectos
├── taskActions.js       # Actions específicas de tareas
├── staffActions.js      # Actions específicas de staff
├── stagesActions.js     # Actions específicas de etapas
└── entregablesActions.js # Actions específicas de entregables
```

---

## 💡 Uso Básico

### Importar Actions

**✅ CORRECTO - Importar desde un solo lugar:**
```javascript
import { 
  updateTask, 
  fetchTasks, 
  createTask,
  updateProject,
  fetchStaff 
} from '../store/actions/actions';
```

**❌ INCORRECTO - No importar de múltiples archivos:**
```javascript
// NO HACER ESTO:
import { updateTask } from '../store/actions/taskActions';
import { updateProject } from '../store/actions/projectActions';
```

---

## 🔧 Operaciones CRUD

### Tareas (Tasks)

```javascript
import { useDispatch } from 'react-redux';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  fetchTaskById 
} from '../store/actions/actions';

const MyComponent = () => {
  const dispatch = useDispatch();

  // 1. Obtener todas las tareas
  const loadTasks = async () => {
    const result = await dispatch(fetchTasks());
    if (result.success) {
      console.log('Tareas cargadas:', result.data);
    }
  };

  // 2. Crear nueva tarea
  const addNewTask = async () => {
    const taskData = {
      category: 'Diseño estructural',
      task_description: 'Nueva tarea de ejemplo',
      status: 'Pendiente',
      notes: 'Notas de la tarea',
      project_id: 'uuid-del-proyecto',
      staff_id: 'uuid-del-staff',
      stage_id: 'uuid-del-stage'
    };
    
    const result = await dispatch(createTask(taskData));
    if (result.success) {
      console.log('Tarea creada:', result.data);
    }
  };

  // 3. Actualizar tarea
  const modifyTask = async (taskId) => {
    const updates = {
      status: 'En Progreso',
      notes: 'Actualizado'
    };
    
    const result = await dispatch(updateTask(taskId, updates));
    if (result.success) {
      console.log('Tarea actualizada:', result.data);
    }
  };

  // 4. Eliminar tarea
  const removeTask = async (taskId) => {
    const result = await dispatch(deleteTask(taskId));
    if (result.success) {
      console.log('Tarea eliminada');
    }
  };

  // 5. Obtener tarea por ID
  const getTask = async (taskId) => {
    const result = await dispatch(fetchTaskById(taskId));
    if (result.success) {
      console.log('Tarea:', result.data);
    }
  };

  return (
    <div>
      <button onClick={loadTasks}>Cargar Tareas</button>
      <button onClick={addNewTask}>Crear Tarea</button>
      {/* ... */}
    </div>
  );
};
```

### Proyectos (Projects)

```javascript
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../store/actions/actions';

// Obtener proyectos
dispatch(fetchProjects());

// Crear proyecto
dispatch(createProject({
  name: 'Nuevo Proyecto',
  status: 'Pendiente',
  resp: 'Juan Pérez'
}));

// Actualizar proyecto
dispatch(updateProject(projectId, { 
  status: 'En Progreso' 
}));

// Eliminar proyecto
dispatch(deleteProject(projectId));
```

### Staff

```javascript
import { 
  fetchStaff, 
  createStaff, 
  updateStaff, 
  deleteStaff 
} from '../store/actions/actions';

// Operaciones similares a proyectos y tareas
dispatch(fetchStaff());
dispatch(createStaff(staffData));
dispatch(updateStaff(staffId, updates));
dispatch(deleteStaff(staffId));
```

### Etapas (Stages)

```javascript
import { 
  fetchStages, 
  createStage, 
  updateStage, 
  deleteStage 
} from '../store/actions/actions';

dispatch(fetchStages());
dispatch(createStage(stageData));
dispatch(updateStage(stageId, updates));
dispatch(deleteStage(stageId));
```

### Entregables

```javascript
import { 
  fetchEntregables, 
  createEntregable, 
  updateEntregable, 
  deleteEntregable 
} from '../store/actions/actions';

dispatch(fetchEntregables());
dispatch(createEntregable(entregableData));
dispatch(updateEntregable(entregableId, updates));
dispatch(deleteEntregable(entregableId));
```

---

## 🚀 Actions Específicas

### Tareas

```javascript
import {
  updateTaskStatus,
  updateTaskPriority,
  assignTask,
  moveTaskToProject,
  setTaskStage,
  setTaskDueDate,
  fetchTasksByProject,
  fetchTasksByStaff,
  fetchTasksByStatus,
  fetchOverdueTasks,
  fetchTasksDueThisWeek
} from '../store/actions/actions';

// Actualizar solo el estado
dispatch(updateTaskStatus(taskId, 'Completo'));

// Actualizar prioridad
dispatch(updateTaskPriority(taskId, 'Alta'));

// Asignar a un staff member
dispatch(assignTask(taskId, staffId));

// Mover a otro proyecto
dispatch(moveTaskToProject(taskId, newProjectId));

// Cambiar de etapa
dispatch(setTaskStage(taskId, stageId));

// Establecer fecha límite
dispatch(setTaskDueDate(taskId, '2025-12-31'));

// Filtrar tareas
dispatch(fetchTasksByProject(projectId));
dispatch(fetchTasksByStaff(staffId));
dispatch(fetchTasksByStatus('En Progreso'));
dispatch(fetchOverdueTasks());
dispatch(fetchTasksDueThisWeek());
```

### Proyectos

```javascript
import {
  fetchProjectsWithStats,
  fetchActiveProjects,
  updateProjectStatus,
  assignResponsible,
  archiveProject,
  restoreProject,
  duplicateProject
} from '../store/actions/actions';

// Proyectos con estadísticas
dispatch(fetchProjectsWithStats());

// Solo proyectos activos
dispatch(fetchActiveProjects());

// Actualizar estado
dispatch(updateProjectStatus(projectId, 'En Progreso'));

// Asignar responsable
dispatch(assignResponsible(projectId, 'María García'));

// Archivar proyecto
dispatch(archiveProject(projectId));

// Restaurar proyecto archivado
dispatch(restoreProject(projectId));

// Duplicar proyecto
dispatch(duplicateProject(projectId, { name: 'Nuevo nombre' }));
```

---

## 🔄 Actions Genéricas (Para Tablas Personalizadas)

Si necesitas trabajar con una tabla que no tiene actions específicas:

```javascript
import { 
  getAllFromTable,
  createInTable,
  updateInTable,
  deleteFromTable 
} from '../store/actions/actions';

// Obtener datos de cualquier tabla
dispatch(getAllFromTable('NombreTabla'));

// Crear en cualquier tabla
dispatch(createInTable('NombreTabla', {
  campo1: 'valor1',
  campo2: 'valor2'
}));

// Actualizar en cualquier tabla
dispatch(updateInTable('NombreTabla', id, {
  campo1: 'nuevo valor'
}));

// Eliminar de cualquier tabla
dispatch(deleteFromTable('NombreTabla', id));
```

---

## 📝 Patrón de Uso Completo

```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask } from '../store/actions/actions';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const loading = useSelector(state => state.tasks.loading);
  const [error, setError] = useState(null);

  // Cargar tareas al montar
  useEffect(() => {
    const loadTasks = async () => {
      const result = await dispatch(fetchTasks());
      if (!result.success) {
        setError(result.error);
      }
    };
    
    loadTasks();
  }, [dispatch]);

  // Actualizar tarea
  const handleUpdateTask = async (taskId, updates) => {
    const result = await dispatch(updateTask(taskId, updates));
    if (result.success) {
      console.log('✅ Tarea actualizada');
    } else {
      console.error('❌ Error:', result.error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.task_description}</h3>
          <button onClick={() => handleUpdateTask(task.id, { 
            status: 'Completo' 
          })}>
            Marcar como completo
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
```

---

## ⚠️ Problemas Comunes y Soluciones

### 1. "updateTask is not a function"

**Problema:** Importación incorrecta
```javascript
// ❌ INCORRECTO
import { updateTask } from './actions/actions';

// ✅ CORRECTO
import { updateTask } from '../store/actions/actions';
```

### 2. "Cannot find module"

**Solución:** Verificar la ruta relativa correcta
```javascript
// Desde un componente en src/components/
import { updateTask } from '../store/actions/actions';

// Desde una página en src/pages/
import { updateTask } from '../store/actions/actions';
```

### 3. Actions no actualizan el estado

**Solución:** Asegúrate de usar `await` o `.then()`
```javascript
// ✅ CORRECTO
const result = await dispatch(updateTask(id, data));

// O con .then()
dispatch(updateTask(id, data)).then(result => {
  if (result.success) {
    console.log('Actualizado');
  }
});
```

---

## 📊 Estructura de Respuesta

Todas las actions retornan un objeto con la siguiente estructura:

```javascript
// Éxito
{
  success: true,
  data: { /* datos de la operación */ }
}

// Error
{
  success: false,
  error: "Mensaje de error"
}
```

Ejemplo de uso:
```javascript
const result = await dispatch(updateTask(taskId, updates));

if (result.success) {
  console.log('✅ Operación exitosa:', result.data);
} else {
  console.error('❌ Error:', result.error);
  // Mostrar mensaje al usuario
  alert(`Error: ${result.error}`);
}
```

---

## 🎓 Mejores Prácticas

1. **Siempre importar de `actions.js`**
2. **Usar async/await** para manejar resultados
3. **Verificar `result.success`** antes de continuar
4. **Manejar errores** apropiadamente
5. **No modificar el estado directamente**, usar actions
6. **Usar actions específicas** cuando estén disponibles (ej: `updateTaskStatus` en lugar de `updateTask`)

---

## 📚 Referencia Rápida

| Entidad | Fetch | Create | Update | Delete | FetchById |
|---------|-------|--------|--------|--------|-----------|
| **Tasks** | `fetchTasks()` | `createTask(data)` | `updateTask(id, updates)` | `deleteTask(id)` | `fetchTaskById(id)` |
| **Projects** | `fetchProjects()` | `createProject(data)` | `updateProject(id, updates)` | `deleteProject(id)` | `fetchProjectById(id)` |
| **Staff** | `fetchStaff()` | `createStaff(data)` | `updateStaff(id, updates)` | `deleteStaff(id)` | `fetchStaffById(id)` |
| **Stages** | `fetchStages()` | `createStage(data)` | `updateStage(id, updates)` | `deleteStage(id)` | `fetchStageById(id)` |
| **Entregables** | `fetchEntregables()` | `createEntregable(data)` | `updateEntregable(id, updates)` | `deleteEntregable(id)` | `fetchEntregableById(id)` |

---

**Versión:** 1.1.0  
**Última actualización:** 2025-01-27

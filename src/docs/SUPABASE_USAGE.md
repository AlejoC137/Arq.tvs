# Guía de Uso del Cliente Supabase

## Configuración

El cliente de Supabase está configurado en `src/lib/supabase.js` y utiliza las variables de entorno del archivo `.env`.

### Variables de Entorno

```env
VITE_SUPABASE_URL=https://cgsyfkfdecpwcekfiaic.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Servicios Disponibles

### 1. Servicio de Proyectos (`src/services/projectsService.js`)

```javascript
import { projectsService } from '../services/projectsService.js';

// Obtener todos los proyectos
const result = await projectsService.getAll();
if (result.success) {
  console.log('Proyectos:', result.data);
}

// Crear un nuevo proyecto
const newProject = {
  name: 'Mi Proyecto',
  status: 'Activo',
  resp: 'Juan Pérez'
};
const createResult = await projectsService.create(newProject);

// Actualizar un proyecto
const updateResult = await projectsService.update(projectId, {
  name: 'Proyecto Actualizado',
  status: 'Completado'
});

// Eliminar un proyecto
const deleteResult = await projectsService.delete(projectId);
```

### 2. Servicio de Tareas (`src/services/tasksService.js`)

```javascript
import { tasksService } from '../services/tasksService.js';

// Obtener todas las tareas
const result = await tasksService.getAll();

// Crear una nueva tarea
const newTask = {
  category: 'Diseño',
- `tema` (text)
  status: 'Pendiente',
  notes: 'Incluir detalles de fachada',
  project_id: 1,
  staff_id: 2,
  stage_id: 1
};
const createResult = await tasksService.create(newTask);

// Actualizar una tarea
const updateResult = await tasksService.update(taskId, {
  status: 'En Progreso',
  notes: 'Revisión inicial completada'
});

// Obtener tareas por proyecto
const projectTasks = await tasksService.getByProject(projectId);

// Obtener tareas por estado
const pendingTasks = await tasksService.getByStatus('Pendiente');
```

## Hooks Personalizados

### 1. Hook useSupabase

```javascript
import { useSupabase } from '../hooks/useSupabase.js';

function MyComponent() {
  const { supabase, loading, error, executeQuery } = useSupabase();

  const fetchData = async () => {
    const result = await executeQuery(async () => {
      const { data, error } = await supabase
        .from('mi_tabla')
        .select('*');
      
      if (error) throw error;
      return data;
    });

    if (result.success) {
      console.log('Datos:', result.data);
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      <button onClick={fetchData}>Cargar Datos</button>
    </div>
  );
}
```

### 2. Hook useProjects

```javascript
import { useProjects } from '../hooks/useSupabase.js';

function ProjectsComponent() {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    const result = await createProject({
      name: 'Nuevo Proyecto',
      status: 'Activo',
      resp: 'María García'
    });

    if (result.success) {
      console.log('Proyecto creado exitosamente');
    }
  };

  return (
    <div>
      {loading && <p>Cargando proyectos...</p>}
      {error && <p>Error: {error.message}</p>}
      
      <button onClick={handleCreateProject}>
        Crear Proyecto
      </button>
      
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name} - {project.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Hook useTasks

```javascript
import { useTasks } from '../hooks/useSupabase.js';

function TasksComponent() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const result = await updateTask(taskId, { status: newStatus });
    
    if (result.success) {
      console.log('Tarea actualizada');
    }
  };

  return (
    <div>
      {loading && <p>Cargando tareas...</p>}
      {error && <p>Error: {error.message}</p>}
      
      <div>
        {tasks.map(task => (
          <div key={task.id}>
            <h3>{task.tema}</h3>
            <p>Estado: {task.status}</p>
            <button 
              onClick={() => handleUpdateTaskStatus(task.id, 'Completo')}
            >
              Marcar Completa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Uso en Redux Actions

Las acciones de Redux ya están configuradas para usar los servicios de Supabase:

```javascript
import { fetchProjects, createProject } from '../store/actions/projectActions.js';
import { fetchTasks, createTask } from '../store/actions/taskActions.js';

// En un componente React
const dispatch = useDispatch();

// Cargar proyectos
useEffect(() => {
  dispatch(fetchProjects());
}, [dispatch]);

// Crear un nuevo proyecto
const handleCreateProject = async () => {
  const result = await dispatch(createProject({
    name: 'Mi Proyecto',
    status: 'Activo',
    resp: 'Juan Pérez'
  }));

  if (result.success) {
    console.log('Proyecto creado');
  }
};
```

## Prueba de Conexión

Puedes usar el componente `SupabaseTest` para verificar que la conexión esté funcionando:

```javascript
import SupabaseTest from '../components/SupabaseTest.jsx';

function App() {
  return (
    <div>
      <SupabaseTest />
      {/* Resto de tu aplicación */}
    </div>
  );
}
```

## Funciones de Utilidad

### testConnection()

```javascript
import { testConnection } from '../lib/supabase.js';

const checkConnection = async () => {
  const result = await testConnection();
  
  if (result.success) {
    console.log('✅ Conexión exitosa');
  } else {
    console.error('❌ Error de conexión:', result.error);
  }
};
```

### handleSupabaseError() y handleSupabaseSuccess()

```javascript
import { handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase.js';

// En caso de error
const error = new Error('Algo salió mal');
const errorResponse = handleSupabaseError(error);
// { success: false, error: 'Algo salió mal', details: Error }

// En caso de éxito
const data = { id: 1, name: 'Proyecto' };
const successResponse = handleSupabaseSuccess(data, 'Operación exitosa');
// { success: true, data: {...}, message: 'Operación exitosa' }
```

## Estructura de Base de Datos Esperada

El código asume las siguientes tablas en Supabase:

### Tabla `projects`
- `id` (integer, primary key)
- `name` (text)
- `status` (text)
- `resp` (text)
- `created_at` (timestamp)

### Tabla `tasks`
- `id` (integer, primary key)
- `category` (text)
- `tema` (text)
- `status` (text)
- `notes` (text)
- `project_id` (integer, foreign key)
- `staff_id` (integer, foreign key)
- `stage_id` (integer, foreign key)
- `created_at` (timestamp)

### Tabla `staff`
- `id` (integer, primary key)
- `name` (text)

### Tabla `stages`
- `id` (integer, primary key)
- `name` (text)

## Seguridad

- Las credenciales están configuradas como variables de entorno
- Se usa la clave anónima (ANON_KEY) para operaciones del cliente
- Configura Row Level Security (RLS) en Supabase para proteger tus datos
- Nunca expongas la clave de servicio (SERVICE_KEY) en el código del cliente

## Troubleshooting

1. **Error de conexión**: Verifica que las variables de entorno estén configuradas correctamente
2. **Error 404**: Asegúrate de que las tablas existan en tu base de datos
3. **Error de permisos**: Configura las políticas de RLS en Supabase
4. **Error de CORS**: Configura los dominios permitidos en tu proyecto de Supabase

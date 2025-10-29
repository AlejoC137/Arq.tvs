# Componentes Modulares de ProjectTaskModal

Este directorio contiene los componentes modulares que facilitan la gestión y visualización de proyectos y sus planos arquitectónicos.

## Estructura de Archivos

```
ProjectPlans/
├── index.js              # Exportaciones principales
├── PlansViewer.jsx       # Componente de visualización de planos
├── ProjectHeader.jsx     # Header con información del proyecto
├── TasksToolbar.jsx      # Barra de herramientas para tareas
└── README.md            # Este archivo
```

## Componentes

### PlansViewer
Componente encargado de renderizar y navegar entre los planos de un proyecto.

**Props:**
- `project` (Object): Objeto del proyecto actual
- `selectedRoom` (String): Espacio/habitación seleccionado actualmente
- `onRoomSelect` (Function): Callback cuando se selecciona un espacio
- `onClose` (Function): Callback para cerrar el visor de planos

**Características:**
- Carga automática de configuración de planos según el proyecto
- Navegación entre múltiples planos mediante tabs
- Filtrado de tareas por espacio seleccionado
- Muestra mensaje cuando no hay planos configurados

### ProjectHeader
Componente que muestra la información principal del proyecto.

**Props:**
- `project` (Object): Objeto del proyecto
- `projectProgress` (Number): Porcentaje de progreso (0-100)

**Información mostrada:**
- Nombre del proyecto
- Cliente
- Fechas (inicio y fin)
- Estado actual
- Barra de progreso

### TasksToolbar
Barra de herramientas para gestionar la lista de tareas.

**Props:**
- `searchTerm` (String): Término de búsqueda actual
- `onSearchChange` (Function): Callback al cambiar búsqueda
- `sortConfig` (Object): Configuración de ordenamiento `{ key, direction }`
- `onSortChange` (Function): Callback al cambiar criterio de orden
- `onToggleDirection` (Function): Callback para cambiar dirección
- `onNewTask` (Function): Callback para crear nueva tarea
- `project` (Object): Proyecto actual
- `showPlanView` (Boolean): Si la vista de planos está visible
- `onTogglePlanView` (Function): Callback para toggle de planos

**Características:**
- Barra de búsqueda
- Selector de ordenamiento (Prioridad, Nombre, Estado)
- Botón para cambiar dirección de orden
- Botón para crear nueva tarea
- Botón para mostrar/ocultar planos (solo si el proyecto tiene planos)

## Configuración de Planos

La configuración de planos por proyecto se maneja en:
```
src/config/projectPlansConfig.js
```

### Agregar planos para un nuevo proyecto

1. Importar los componentes de los planos:
```javascript
import P1NuevoProyecto from '../components/casas/NuevoProyecto/p1';
import P2NuevoProyecto from '../components/casas/NuevoProyecto/p2';
```

2. Agregar entrada en `PROJECT_PLANS_CONFIG`:
```javascript
export const PROJECT_PLANS_CONFIG = {
  // ... configuraciones existentes
  
  'nuevoproyecto': {
    title: 'Nuevo Proyecto',
    defaultPlan: 'p1',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1NuevoProyecto
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2NuevoProyecto
      }
    ]
  }
};
```

**Nota:** El key del proyecto se deriva del nombre del proyecto en minúsculas sin espacios. Por ejemplo, "Casa 2" → "casa2".

### Funciones Helper

#### `getProjectPlanConfig(project)`
Obtiene la configuración de planos para un proyecto específico.

**Retorna:**
```javascript
{
  title: String,       // Título para mostrar
  defaultPlan: String, // ID del plano por defecto
  plans: Array        // Array de configuraciones de planos
}
```

#### `hasProjectPlans(project)`
Verifica si un proyecto tiene planos configurados.

**Retorna:** `Boolean`

## Ejemplo de Uso

```jsx
import { PlansViewer, ProjectHeader, TasksToolbar } from './ProjectPlans';

function MyComponent() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPlanView, setShowPlanView] = useState(true);
  
  return (
    <div>
      <ProjectHeader 
        project={currentProject} 
        projectProgress={75} 
      />
      
      {showPlanView && (
        <PlansViewer
          project={currentProject}
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
          onClose={() => setShowPlanView(false)}
        />
      )}
      
      <TasksToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortConfig={sortConfig}
        onSortChange={(key) => setSortConfig({ ...sortConfig, key })}
        onToggleDirection={() => setSortConfig({
          ...sortConfig,
          direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
        })}
        onNewTask={() => setIsFormOpen(true)}
        project={currentProject}
        showPlanView={showPlanView}
        onTogglePlanView={() => setShowPlanView(!showPlanView)}
      />
    </div>
  );
}
```

## Ventajas de la Modularización

1. **Reutilización**: Los componentes pueden usarse en otros contextos
2. **Mantenibilidad**: Código más organizado y fácil de mantener
3. **Escalabilidad**: Fácil agregar nuevos proyectos y planos
4. **Separación de Responsabilidades**: Cada componente tiene un propósito específico
5. **Testing**: Más fácil probar componentes individuales
6. **Configuración Centralizada**: Un solo lugar para definir planos por proyecto

## Próximas Mejoras

- [ ] Añadir lazy loading para componentes de planos
- [ ] Implementar caché de planos cargados
- [ ] Agregar animaciones de transición entre planos
- [ ] Permitir configuración dinámica desde base de datos
- [ ] Añadir vista en miniatura de todos los planos

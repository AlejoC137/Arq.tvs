# Guía de Uso: espacios.js

## 📋 Descripción

El archivo `espacios.js` ha sido reestructurado para organizar los espacios por casa y piso, evitando contaminación cruzada entre diferentes casas del proyecto.

## 🏗️ Estructura

```javascript
ESPACIOS_CASA1 = {
  piso1: { espacios: [...], muebles: [...] },
  piso2: { espacios: [...], muebles: [...] }
}

ESPACIOS_CASA2 = {
  piso1: { espacios: [...], muebles: [...] },
  piso2: { espacios: [...], muebles: [...] }
}

ESPACIOS_CASA4 = {
  piso1: { espacios: [...], muebles: [...] },
  piso2: { espacios: [...], muebles: [...] }
}
```

## 📖 API de Funciones

### 1. `getEspaciosPorCasa(casaNumber, pisoNumber, includeMuebles)`

Obtiene los espacios de una casa específica.

**Parámetros:**
- `casaNumber` (number): Número de casa (1, 2, 4)
- `pisoNumber` (number | null): Número de piso (1, 2). Si es `null`, devuelve todos los pisos
- `includeMuebles` (boolean): Si debe incluir muebles (default: `false`)

**Ejemplos:**

```javascript
import { getEspaciosPorCasa } from '@/constants/espacios';

// Obtener solo espacios de Casa 2, Piso 1
const espaciosC2P1 = getEspaciosPorCasa(2, 1);
// → ['DespensaC2', 'CocinaC2', 'ComedorC2', ...]

// Obtener espacios y muebles de Casa 1, Piso 2
const todosC1P2 = getEspaciosPorCasa(1, 2, true);
// → ['HabitacionAuxiliar1', ..., 'MuebleVestierHabitacionAuxiliar1', ...]

// Obtener todos los espacios de Casa 4 (ambos pisos)
const todosC4 = getEspaciosPorCasa(4);
// → ['CocinaComedor', ..., 'Escaleras']
```

### 2. `validarEspacio(espacioId, casaNumber)`

Valida si un espacio existe en una casa específica.

**Parámetros:**
- `espacioId` (string): ID del espacio
- `casaNumber` (number): Número de casa

**Ejemplos:**

```javascript
import { validarEspacio } from '@/constants/espacios';

validarEspacio('CocinaC2', 2);        // → true
validarEspacio('CocinaC2', 4);        // → false (no existe en Casa 4)
validarEspacio('BalconJacuzzi', 4);   // → true
```

### 3. `getTodosLosEspacios(includeMuebles)`

Obtiene todos los espacios de todas las casas.

**Parámetros:**
- `includeMuebles` (boolean): Si debe incluir muebles (default: `false`)

**Ejemplos:**

```javascript
import { getTodosLosEspacios } from '@/constants/espacios';

const todosEspacios = getTodosLosEspacios();
const todosConMuebles = getTodosLosEspacios(true);
```

## 🎯 Casos de Uso

### Caso 1: Formulario de Tareas - Dropdown de Espacios por Casa

```javascript
import { getEspaciosPorCasa } from '@/constants/espacios';

function TaskForm({ casaId }) {
  // Obtener solo los espacios de la casa actual
  const espaciosDisponibles = getEspaciosPorCasa(casaId);
  
  return (
    <select name="espacio">
      {espaciosDisponibles.map(espacio => (
        <option key={espacio} value={espacio}>
          {espacio}
        </option>
      ))}
    </select>
  );
}
```

### Caso 2: Validación de Espacios al Crear Tarea

```javascript
import { validarEspacio } from '@/constants/espacios';

function crearTarea(data) {
  if (!validarEspacio(data.espacio, data.casaId)) {
    throw new Error(`Espacio ${data.espacio} no existe en Casa ${data.casaId}`);
  }
  
  // Continuar con la creación...
}
```

### Caso 3: FloorPlan Component - Validar Espacios del SVG

```javascript
import { getEspaciosPorCasa } from '@/constants/espacios';

function FloorPlanC2P1({ tasks }) {
  const casaId = 2;
  const pisoId = 1;
  const espaciosValidos = getEspaciosPorCasa(casaId, pisoId);
  
  // Filtrar tareas solo de este piso
  const tareasDelPiso = tasks.filter(task => 
    espaciosValidos.includes(task.espacio)
  );
  
  // Renderizar...
}
```

### Caso 4: Filtrar Tareas por Casa/Piso

```javascript
import { getEspaciosPorCasa } from '@/constants/espacios';

function filtrarTareasPorCasaPiso(todasLasTareas, casaId, pisoId) {
  const espaciosDelPiso = getEspaciosPorCasa(casaId, pisoId);
  
  return todasLasTareas.filter(tarea => 
    espaciosDelPiso.includes(tarea.espacio)
  );
}
```

## 🔄 Migración del Código Existente

### Antes (DEPRECATED)

```javascript
import { ESPACIOS_HABITACIONES } from '@/constants/espacios';

// Array plano con todos los espacios mezclados
const espacios = ESPACIOS_HABITACIONES;
```

### Después (RECOMENDADO)

```javascript
import { getEspaciosPorCasa } from '@/constants/espacios';

// Espacios específicos por casa
const espaciosC2 = getEspaciosPorCasa(2);
const espaciosC4P1 = getEspaciosPorCasa(4, 1);
```

## ⚠️ Notas Importantes

1. **`ESPACIOS_HABITACIONES` está DEPRECATED**: Aún existe para compatibilidad pero se recomienda usar las nuevas funciones.

2. **Contaminación Cruzada**: Antes, un dropdown de Casa 2 podía mostrar espacios de Casa 4. Ahora esto está solucionado usando `getEspaciosPorCasa()`.

3. **Escalabilidad**: Al agregar nuevas casas, solo se necesita:
   ```javascript
   export const ESPACIOS_CASA5 = {
     piso1: { espacios: [...], muebles: [...] },
     piso2: { espacios: [...], muebles: [...] }
   };
   ```
   Y actualizar `casaMap` en `getEspaciosPorCasa()`.

4. **Validación en Runtime**: Usar `validarEspacio()` en formularios para evitar inconsistencias.

## 📝 Estado de Implementación

### ✅ Componentes Actualizados (Filtrado por Casa)

- **`FormTask.jsx`**: ✅ Filtra espacios por proyecto usando `getEspaciosPorProyecto()`
  - El dropdown de "Espacio" muestra solo espacios de la casa correspondiente al proyecto seleccionado
  - Se actualiza dinámicamente cuando cambia el proyecto

### ⚠️ Componentes Pendientes

- **`InlineActionsTask.jsx`**: ⚠️ Usa datalist con todos los espacios
  - Permite texto libre con sugerencias de `ESPACIOS_HABITACIONES`
  - **Razón**: No tiene acceso directo al proyecto en su contexto actual
  - **Impacto**: Menor, ya que es un campo de autocompletado que permite texto libre
  - **Solución futura**: Pasar `project` como prop desde `ProjectTaskModal` y `StaffTaskModal`

- **`StaffTaskModal.jsx`**: ⚠️ Usa `ESPACIOS_HABITACIONES` en EditableCell
  - Línea 605: `<EditableCell ... type="espacio-select" options={ESPACIOS_HABITACIONES.map(...)} />`
  - **Solución futura**: Determinar proyecto de cada tarea y filtrar espacios dinámicamente

- **`ProjectTaskModal.jsx`**: ⚠️ Similar a StaffTaskModal
  - Usa `ESPACIOS_HABITACIONES` para el EditableCell de espacios

### 🔧 Cómo Completar la Migración
#### 1. InlineActionsTask
```javascript
// En ProjectTaskModal.jsx y StaffTaskModal.jsx
<InlineActionsTask task={task} project={selectedProject} />

// En InlineActionsTask.jsx
import { getEspaciosPorProyecto } from '../constants/espacios';

const InlineActionsTask = ({ task, project }) => {
  const espaciosDisponibles = useMemo(() => {
    return getEspaciosPorProyecto(project, false);
  }, [project]);
  
  // Actualizar datalist
  <datalist id="espacios-list">
    {espaciosDisponibles.map(e => <option key={e} value={e} />)}
  </datalist>
};
```

#### 2. EditableCell en Modales
```javascript
// En StaffTaskModal.jsx / ProjectTaskModal.jsx
const EditableCell = ({ rowId, field, value, type, options, task }) => {
  // ...
  
  if (type === 'espacio-select') {
    const project = projects.find(p => p.id === task.project_id);
    const espaciosDisponibles = getEspaciosPorProyecto(project, false);
    options = espaciosDisponibles.map(e => ({ id: e, name: e }));
  }
  
  // resto del código...
};
```

## 🧪 Testing

```javascript
import { getEspaciosPorCasa, validarEspacio } from '@/constants/espacios';

// Test 1: Casa 2 no contiene espacios de Casa 4
const c2 = getEspaciosPorCasa(2);
console.assert(!c2.includes('BalconJacuzzi'), 'Casa 2 no debe tener BalconJacuzzi');

// Test 2: Validación correcta
console.assert(validarEspacio('CocinaC2', 2) === true);
console.assert(validarEspacio('CocinaC2', 4) === false);

// Test 3: Piso específico
const c4p1 = getEspaciosPorCasa(4, 1);
console.assert(c4p1.length === 10, 'Casa 4 Piso 1 debe tener 10 espacios');
```

## 📚 Recursos Adicionales

- Ver `src/constants/espacios.js` para la implementación completa
- Consultar los FloorPlan components para ejemplos en producción

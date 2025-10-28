# DEBUG: Filtros de Espacios No Funcionan

## Pasos para Depurar

### 1. Verifica que el click en plano funciona

Abre la consola del navegador (F12) y busca estos mensajes cuando haces click en un espacio del plano:

```
Espacio seleccionado: Piscina
```

**Si NO aparece:** El problema está en los componentes de plano (P1Casa2/P2Casa2)

### 2. Verifica estructura de acciones en tareas

En la consola, ejecuta:

```javascript
// Obtener todas las tareas del proyecto actual
const tareas = /* desde Redux state o global */;

// Ver primera tarea con acciones
const tarea = tareas.find(t => t.acciones);
console.log('Tarea con acciones:', tarea.id);
console.log('Tipo de acciones:', typeof tarea.acciones);
console.log('Valor de acciones:', tarea.acciones);

// Si es string, parsear
if (typeof tarea.acciones === 'string') {
  const parsed = JSON.parse(tarea.acciones);
  console.log('Acciones parseadas:', parsed);
  console.log('Primera acción:', parsed[0]);
}
```

**Estructura esperada:**
```json
[
  {
    "id": 1234567890,
    "espacio": "Piscina",
    "nombreEspacio": "Piscina principal",
    "accion": "Colocar azulejos",
    "objetivo": "Acabado",
    "ejecutor": "Juan",
    "completado": false
  }
]
```

### 3. Activa logs de debug

En `ProjectTaskModal.jsx` línea 150 y 168, **descomenta** los console.log:

```javascript
// Línea 150
if (!task.acciones) {
   console.log(`Tarea ${task.id} sin campo 'acciones'`); // ← DESCOMENTA ESTO
   return false;
}

// Línea 162
if (!Array.isArray(acciones)) {
   console.log(`Tarea ${task.id}: 'acciones' no es un array`, acciones); // ← DESCOMENTA ESTO
   return false;
}

// Línea 168
const match = acciones.some(accion => accion && accion.espacio === selectedRoom);
if (match) console.log(`Tarea ${task.id} coincide con ${selectedRoom}`); // ← DESCOMENTA ESTO
return match;
```

### 4. Verifica que onRoomClick llega al componente

En `P2Casa2.jsx` (línea 5-11), agrega logs:

```javascript
const P2Casa2 = ({ onRoomSelect, selectedRoom }) => {
  console.log('P2Casa2 props:', { onRoomSelect: !!onRoomSelect, selectedRoom });
  
  const handleRoomClick = (roomId) => {
    console.log(`Casa 2 - Piso 2, Habitación seleccionada: ${roomId}`);
    if (onRoomSelect) {
      console.log('Llamando a onRoomSelect con:', roomId);
      onRoomSelect(roomId);
    }
  };
```

### 5. Verifica nombres EXACTOS de espacios

Los IDs en FloorPlan2.jsx DEBEN coincidir EXACTAMENTE con el campo `espacio` en acciones:

**FloorPlan2 IDs:**
- HabitacionAuxiliar1
- VestierHabitacionAuxiliar1
- EstudioPiso2
- HallPiso2
- HabitacionPrincipalPiso2
- ClosetHabitacionPrincipalPiso2
- HabitacionAuxiliar2
- TerrazaHabitacionPrincipalPiso2
- BañoHabitacionAuxiliar
- ClostHabitacionAuxiliar (⚠️ nota: "Clost" no "Closet")
- BañoHabitacionPrincipalPiso2
- BañoHabitacionAuxiliar1

## Posibles Causas

### A. Props incorrectos en componentes de plano

El componente recibe `onRoomSelect` pero `FloorPlan2` espera `onRoomClick`.

**Solución:** Verificar que P2Casa2 pase correctamente:

```jsx
<FloorPlan2
  selectedRoom={selectedRoom}
  onRoomClick={handleRoomClick}  // ← Debe ser onRoomClick
/>
```

### B. Campo acciones vacío o mal formateado

Si las tareas NO tienen el campo `acciones` o está vacío, el filtro no encuentra nada.

**Solución:** Agregar acciones a las tareas desde InlineActionsTask.

### C. Nombres de espacios no coinciden

Si en las acciones usas "Piscina" pero en el SVG el ID es "Piscina_principal", NO coincide.

**Solución:** Usar EXACTAMENTE los mismos IDs del SVG en el select de `InlineActionsTask`.

## Solución Rápida

Agrega este código temporal en ProjectTaskModal después de línea 177:

```javascript
useEffect(() => {
  if (selectedRoom) {
    console.log('=== DEBUG FILTRO ===');
    console.log('Espacio seleccionado:', selectedRoom);
    console.log('Total tareas proyecto:', projectTasks.length);
    
    projectTasks.forEach(task => {
      if (task.acciones) {
        try {
          const acc = typeof task.acciones === 'string' ? JSON.parse(task.acciones) : task.acciones;
          const espacios = acc.map(a => a?.espacio).filter(Boolean);
          console.log(`Tarea ${task.id}: espacios =`, espacios);
        } catch (e) {
          console.error(`Tarea ${task.id}: error parseando acciones`);
        }
      } else {
        console.log(`Tarea ${task.id}: SIN acciones`);
      }
    });
    
    console.log('Tareas filtradas:', tasksForSelectedRoom.length);
    console.log('===================');
  }
}, [selectedRoom, projectTasks, tasksForSelectedRoom]);
```

Esto te mostrará en consola exactamente qué está pasando con cada tarea.

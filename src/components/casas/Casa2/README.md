# Casa 2 - Planos y Componentes

Esta carpeta contiene todos los planos y componentes relacionados con Casa 2.

## Estructura

### Archivos de Texto (.txt)
- **p1.txt**: Descripción de Planta Piso 1
- **p2.txt**: Descripción de Planta Piso 2
- **s1.txt**: Descripción de Sección 1
- **t1.txt**: Descripción de Detalles Técnicos

### Componentes React (.jsx)
- **p1.jsx**: Componente de Planta Piso 1 con espacios interactivos
- **p2.jsx**: Componente de Planta Piso 2 con FloorPlan2
- **s1.jsx**: Componente de Sección 1
- **t1.jsx**: Componente de Detalles Técnicos

## Espacios Casa 2

### Piso 1
- HabitacionPrincipal
- Cocina
- BalconOficina
- Oficina
- ClosetHabitacionPrincipal
- Piscina
- Servicios
- BañoOficina
- BañoHabitacionPrincipal
- Escalera
- EtudioPiso1
- Sala
- Comedor
- JardinInterior
- Acceso
- Deck

### Piso 2
- HabitacionAuxiliar1
- VestierHabitacionAuxiliar1
- EstudioPiso2
- HallPiso2
- HabitacionPrincipalPiso2
- ClosetHabitacionPrincipalPiso2
- HabitacionAuxiliar2
- TerrazaHabitacionPrincipalPiso2
- BañoHabitacionAuxiliar
- ClostHabitacionAuxiliar
- BañoHabitacionPrincipalPiso2
- BañoHabitacionAuxiliar1

## Uso en ProjectTaskModal

Los componentes se integran en ProjectTaskModal permitiendo:
1. Seleccionar diferentes vistas (p1, p2, s1, t1)
2. Hacer clic en espacios para filtrar tareas
3. Ver tareas relacionadas con cada espacio según el campo `espacio` en acciones

## Integración

```jsx
import { P1Casa2, P2Casa2, S1Casa2, T1Casa2 } from './casas/Casa2';

// Uso
<P2Casa2 
  onRoomSelect={(room) => console.log(room)} 
  selectedRoom={selectedRoom} 
/>
```

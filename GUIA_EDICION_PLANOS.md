# 🏗️ Guía de Edición de Planos Arquitectónicos

Esta guía te ayudará a personalizar y editar los planos de tu proyecto.

## 📍 Ubicación de los Archivos

Los planos se encuentran en:
```
src/components/
├── FloorPlan1.jsx          # Plano original Piso 1
├── FloorPlan2.jsx          # Plano original Piso 2
├── FloorPlan2Enhanced.jsx  # Plano mejorado con contadores (NUEVO)
└── casas/
    ├── Casa1/
    │   ├── p1.jsx          # Wrapper Planta 1 Casa 1
    │   └── p2.jsx          # Wrapper Planta 2 Casa 1
    └── Casa2/
        ├── p1.jsx          # Wrapper Planta 1 Casa 2
        ├── p2.jsx          # Wrapper Planta 2 Casa 2
        ├── s1.jsx          # Wrapper Sección 1
        └── t1.jsx          # Wrapper Técnico 1
```

## 🎨 Cómo Cambiar Colores de los Elementos

### 1. Cambiar Color de las Habitaciones

En `FloorPlan2Enhanced.jsx` (líneas 16-42):

```javascript
const TASK_STATUS_COLORS = {
  none: {
    fill: 'fill-gray-100',      // Sin tareas - Cambia aquí
    hover: 'hover:fill-gray-200',
    selected: 'fill-gray-300'
  },
  low: {  // 1-2 tareas
    fill: 'fill-green-100',     // Pocas tareas - Cambia aquí
    hover: 'hover:fill-green-200',
    selected: 'fill-green-400'
  },
  medium: {  // 3-5 tareas
    fill: 'fill-yellow-100',    // Tareas moderadas - Cambia aquí
    hover: 'hover:fill-yellow-200',
    selected: 'fill-yellow-400'
  },
  high: {  // 6+ tareas
    fill: 'fill-orange-100',    // Muchas tareas - Cambia aquí
    hover: 'hover:fill-orange-200',
    selected: 'fill-orange-400'
  },
  critical: {  // 10+ tareas
    fill: 'fill-red-100',       // Crítico - Cambia aquí
    hover: 'hover:fill-red-200',
    selected: 'fill-red-400'
  }
};
```

**Colores Tailwind disponibles:**
- `fill-blue-100`, `fill-blue-200`, ..., `fill-blue-900`
- `fill-purple-100`, `fill-purple-200`, ..., `fill-purple-900`
- `fill-pink-100`, `fill-pink-200`, ..., `fill-pink-900`
- Etc. (Ver: https://tailwindcss.com/docs/customizing-colors)

### 2. Cambiar Color de los Muros

En `FloorPlan2Enhanced.jsx` (línea 238):

```javascript
<g id="Capa_3" className="fill-gray-700 pointer-events-none" fill="#636466">
  {/* Cambia fill-gray-700 por otro color */}
</g>
```

**Opciones:**
- `fill-gray-900` - Más oscuro
- `fill-gray-500` - Más claro
- `fill-black` - Negro
- `fill-slate-800` - Gris azulado

### 3. Cambiar Color de Ventanas

En `FloorPlan2Enhanced.jsx` (línea 273):

```javascript
<g id="Capa_5" className="fill-none stroke-blue-400 pointer-events-none stroke-[2px]">
  {/* Cambia stroke-blue-400 por otro color */}
</g>
```

**Opciones:**
- `stroke-cyan-400` - Cyan
- `stroke-teal-400` - Verde azulado
- `stroke-sky-500` - Azul cielo

### 4. Cambiar Color de Estructura (Puntos rosas)

En `FloorPlan2Enhanced.jsx` (línea 268):

```javascript
<g id="Capa_4" className="pointer-events-none fill-pink-400">
  {/* Cambia fill-pink-400 por otro color */}
</g>
```

## 📊 Contadores de Tareas

### Activar/Desactivar Contadores

Los contadores se muestran automáticamente cuando pasas el prop `tasks` al componente:

```jsx
<FloorPlan2 
  selectedRoom={selectedRoom}
  onRoomClick={handleClick}
  tasks={projectTasks}  // Pasar las tareas aquí
/>
```

### Personalizar Colores de los Contadores

En `FloorPlan2Enhanced.jsx` (líneas 101-107):

```javascript
const badgeColors = {
  none: 'fill-gray-200 text-gray-700',
  low: 'fill-green-500 text-white',      // 1-2 tareas
  medium: 'fill-yellow-500 text-gray-900', // 3-5 tareas
  high: 'fill-orange-500 text-white',    // 6-9 tareas
  critical: 'fill-red-500 text-white'    // 10+ tareas
};
```

### Cambiar Umbrales de Conteo

En `FloorPlan2Enhanced.jsx` (líneas 47-53):

```javascript
const getTaskLevel = (count) => {
  if (count === 0) return 'none';
  if (count <= 2) return 'low';     // Cambia 2 por otro valor
  if (count <= 5) return 'medium';   // Cambia 5 por otro valor
  if (count <= 9) return 'high';     // Cambia 9 por otro valor
  return 'critical';
};
```

### Ajustar Posición de los Contadores

En `FloorPlan2Enhanced.jsx` (líneas 76-89):

```javascript
const ROOM_CENTERS = {
  'HabitacionAuxiliar1': { x: 197, y: 100 },  // Ajusta x, y
  'VestierHabitacionAuxiliar1': { x: 197, y: 153 },
  'EstudioPiso2': { x: 295, y: 157 },
  // ...
};
```

**Cómo encontrar las coordenadas correctas:**
1. Abre el archivo SVG en un editor (ej: Inkscape, Figma)
2. Encuentra el centro de cada habitación
3. Anota las coordenadas X, Y
4. Actualiza los valores en `ROOM_CENTERS`

### Cambiar Tamaño de los Badges

En `FloorPlan2Enhanced.jsx` (línea 118):

```javascript
<circle
  cx="0"
  cy="0"
  r="12"  // Cambia el radio aquí (más grande = badge más grande)
  className={`${color} stroke-gray-900 stroke-[1px] transition-all duration-200`}
/>
```

Y el tamaño del texto (línea 130):

```javascript
style={{ fontSize: '12px', fill: 'currentColor' }}  // Cambia 12px
```

## 🔧 Cambiar Grosor de Líneas

### Bordes de Habitaciones

En `FloorPlan2Enhanced.jsx` (línea 59):

```javascript
const baseClasses = "stroke-gray-900 stroke-[1.5px] cursor-pointer transition-all duration-200";
// Cambia stroke-[1.5px] por stroke-[2px], stroke-[3px], etc.
```

### Muros

Las líneas de muros tienen un ancho fijo en el SVG. Para cambiarlos necesitas modificar el `width` y `height` de cada `<rect>` de muro.

### Ventanas

En `FloorPlan2Enhanced.jsx` (línea 273):

```javascript
className="fill-none stroke-blue-400 pointer-events-none stroke-[2px]"
// Cambia stroke-[2px] por stroke-[1px], stroke-[3px], etc.
```

## 🏠 Agregar o Modificar Habitaciones

### 1. Agregar una Nueva Habitación

1. Edita el SVG en tu editor favorito
2. Exporta el nuevo `<polygon>` o `<rect>`
3. Agrégalo en la Capa 2 del componente FloorPlan2Enhanced.jsx:

```javascript
<rect 
  id="NuevaHabitacion" 
  x="100" 
  y="100" 
  width="50" 
  height="50"
  className={getRoomClassName('NuevaHabitacion', selectedRoom, taskCountByRoom['NuevaHabitacion'])}
  onClick={() => onRoomClick('NuevaHabitacion')}
/>
```

4. Agrega la posición del contador en `ROOM_CENTERS`:

```javascript
const ROOM_CENTERS = {
  // ... otras habitaciones
  'NuevaHabitacion': { x: 125, y: 125 }
};
```

5. Agrega el nombre de la habitación a `ESPACIOS_HABITACIONES` en `src/constants/espacios.js`

## 🔄 Usar el Plano Mejorado en tu Proyecto

### Opción 1: Reemplazar el componente actual

En `src/components/casas/Casa2/p2.jsx`:

```javascript
// Cambiar esta línea:
import { FloorPlan2 } from '../../FloorPlan2';

// Por esta:
import { FloorPlan2 } from '../../FloorPlan2Enhanced';
```

### Opción 2: Crear un wrapper que pase las tareas

```javascript
// src/components/casas/Casa2/p2.jsx
import React from 'react';
import { FloorPlan2 } from '../../FloorPlan2Enhanced';
import { useSelector } from 'react-redux';

const P2Casa2 = ({ onRoomSelect, selectedRoom }) => {
  // Obtener las tareas del proyecto actual
  const tasks = useSelector(state => state.tasks.tasks);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Piso 2 - Casa 2</h3>
      <div className="flex-grow w-full h-full">
        <FloorPlan2
          selectedRoom={selectedRoom}
          onRoomClick={onRoomSelect}
          tasks={tasks}  // ¡Pasar las tareas aquí!
        />
      </div>
    </div>
  );
};

export default P2Casa2;
```

## 💡 Tips y Trucos

### 1. Ver cambios en tiempo real
Los cambios en las clases de Tailwind se reflejan inmediatamente al guardar el archivo.

### 2. Modo Debug
Agrega esto temporalmente para ver las coordenadas de cada habitación:

```javascript
<text x={position.x} y={position.y - 20} fill="red" fontSize="10">
  {roomId}: {position.x},{position.y}
</text>
```

### 3. Colores personalizados
Si necesitas un color que no está en Tailwind, usa estilos inline:

```javascript
<circle 
  style={{ fill: '#FF5733' }} 
  // ...
/>
```

### 4. Animaciones
Todas las habitaciones tienen `transition-all duration-200` para animaciones suaves. Cambia `duration-200` por `duration-500` para animaciones más lentas.

## 📚 Recursos Adicionales

- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [React SVG Guide](https://react-svgr.com/)

## ⚠️ Notas Importantes

1. **Siempre haz un backup** antes de hacer cambios grandes
2. **Prueba en navegador** después de cada cambio
3. **Mantén los IDs únicos** para cada habitación
4. **Respeta la estructura SVG** (no cambies el `viewBox` sin saber qué haces)

---

¿Tienes dudas? Revisa el código en `FloorPlan2Enhanced.jsx` con los comentarios detallados. 🚀

# TeamView - Desplegable de Tareas

## ✅ Cambios Implementados

### Nueva Funcionalidad: Desplegable de Tareas

Cada card de miembro del equipo ahora tiene un botón para desplegar/ocultar la lista de tareas.

### Estructura Visual

```
┌─────────────────────────────┐
│ [A] Alejandro               │ ← Header
│     Coordinador Técnico     │
├─────────────────────────────┤
│ 📋 12 tareas   85%   [▼]    │ ← Contador + Botón
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Tarea 1: Descripción... │ │ ← Lista desplegable
│ │ Tarea 2: Descripción... │ │   (max-h-64, scroll)
│ │ Tarea 3: Descripción... │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Ver tareas →                │ ← Footer (link)
└─────────────────────────────┘
```

### Características

1. **Botón Chevron:**
   - `>` Colapsado (ChevronRight)
   - `v` Expandido (ChevronDown)
   - Aparece solo si hay tareas (total > 0)

2. **Lista de Tareas:**
   - Solo muestra descripción (`task_description`)
   - `line-clamp-2`: Máximo 2 líneas por tarea
   - Scroll si hay muchas tareas (`max-h-64`)
   - Fondo gris claro (`bg-gray-50`)

3. **Estado:**
   - Usa `Set` para tracking de cards expandidas
   - Cada card se expande/colapsa independientemente

### Código Clave

#### Import de iconos:
```javascript
import { ChevronDown, ChevronRight } from 'lucide-react';
```

#### Estado de expansión:
```javascript
const [expandedCards, setExpandedCards] = useState(new Set());
const isExpanded = expandedCards.has(staff.id);
```

#### Toggle:
```javascript
const toggleExpand = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setExpandedCards(prev => {
    const newSet = new Set(prev);
    if (newSet.has(staff.id)) {
      newSet.delete(staff.id);
    } else {
      newSet.add(staff.id);
    }
    return newSet;
  });
};
```

#### Render condicional:
```javascript
{isExpanded && memberTasks.length > 0 && (
  <div className="border-t border-gray-200 bg-gray-50 max-h-64 overflow-y-auto">
    <div className="p-2 space-y-1">
      {memberTasks.map((task) => (
        <div className="text-xs p-2 bg-white rounded border">
          <p className="text-gray-700 line-clamp-2">
            {task.task_description || 'Sin descripción'}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
```

### Tailwind Classes Usadas

- `line-clamp-2`: Trunca texto a 2 líneas con "..."
- `max-h-64`: Altura máxima de 16rem (256px)
- `overflow-y-auto`: Scroll vertical si excede altura
- `space-y-1`: Gap de 0.25rem entre items

### UX Mejorada

1. **Vista Compacta por Defecto:**
   - Solo muestra contador
   - Cards pequeñas y manejables

2. **Exploración Rápida:**
   - Click en chevron → ver todas las tareas
   - Sin necesidad de abrir modal completo

3. **Scroll Interno:**
   - Si hay muchas tareas, solo la lista hace scroll
   - Card mantiene su tamaño

4. **Link al Modal:**
   - Footer sigue funcionando como link
   - Abre vista completa en nueva pestaña

### Responsive

El desplegable funciona en todos los tamaños:
- Mobile (1 col): Lista vertical
- Tablet (2-3 col): Compacto
- Desktop (4-5 col): Máxima densidad

### Testing

1. **Test Básico:**
   - Click en chevron → lista aparece
   - Click nuevamente → lista desaparece

2. **Test Multiple:**
   - Expandir varias cards
   - Cada una mantiene su estado independiente

3. **Test Scroll:**
   - Miembro con 20+ tareas
   - Lista debe hacer scroll interno

4. **Test Sin Tareas:**
   - Miembro con 0 tareas
   - No debe mostrar chevron ni lista

---

## Archivos Modificados

- ✅ `src/components/TeamView.jsx` - Desplegable completo

## Siguiente

Esta funcionalidad puede extenderse para:
- Mostrar estado de cada tarea (badge de color)
- Agregar filtro por estado
- Click en tarea para editar inline
- Mostrar progreso individual por tarea

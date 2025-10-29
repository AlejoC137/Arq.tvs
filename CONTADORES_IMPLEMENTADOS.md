# ✅ Contadores de Tareas Implementados

## 🎉 Estado de Implementación: COMPLETO

Los contadores de tareas ahora están completamente integrados en el sistema de planos.

## 📋 Cambios Realizados

### 1. ✅ Componente Enhanced Creado
- `src/components/FloorPlan2Enhanced.jsx` - Plano P2 con contadores de tareas

### 2. ✅ PlansViewer Actualizado
- `src/components/ProjectPlans/PlansViewer.jsx`
- Ahora obtiene las tareas del proyecto desde Redux
- Filtra las tareas por `project_id`
- Pasa las tareas a todos los componentes de planos

### 3. ✅ Wrappers de Planos Actualizados
Los siguientes componentes ahora aceptan y pasan el prop `tasks`:

- ✅ `src/components/casas/Casa2/p1.jsx` 
- ✅ `src/components/casas/Casa2/p2.jsx` (usa FloorPlan2Enhanced)
- ✅ `src/components/casas/Casa2/s1.jsx`
- ✅ `src/components/casas/Casa2/t1.jsx`

## 🎨 Características de los Contadores

### Colores por Carga de Trabajo
Los espacios cambian de color según la cantidad de tareas:

| Cantidad | Color | Descripción |
|----------|-------|-------------|
| 0 tareas | Gris | Sin trabajo |
| 1-2 tareas | Verde | Carga baja |
| 3-5 tareas | Amarillo | Carga media |
| 6-9 tareas | Naranja | Carga alta |
| 10+ tareas | Rojo | Carga crítica |

### Badges con Números
- Círculo con número de tareas sobre cada espacio
- Color del badge coincide con el nivel de carga
- Se agrandan cuando el espacio está seleccionado
- Solo aparecen si hay tareas (no molestan visualmente)

## 🚀 Cómo Funciona

### Flujo de Datos

```
ProjectTaskModal
    ↓
PlansViewer (obtiene tasks de Redux)
    ↓ filtra por project_id
Componente de Plano (p1, p2, s1, t1)
    ↓ pasa tasks
FloorPlan2Enhanced
    ↓ cuenta tareas por espacio
TaskCounter (renderiza badges)
```

### Conteo de Tareas

El sistema cuenta tareas de dos formas:

1. **Campo directo `espacio`**: Si la tarea tiene `espacio: 'Cocina'`
2. **Acciones con espacio**: Si la tarea tiene acciones con campo `espacio`

```javascript
// Ejemplo de tarea contada:
{
  id: '123',
  espacio: 'Cocina',  // Se cuenta aquí
  acciones: [
    { espacio: 'Cocina', accion: '...' },  // Y también aquí
    { espacio: 'Sala', accion: '...' }     // Y aquí para Sala
  ]
}
```

## 📊 Verificación

Para verificar que funciona:

1. Ve a un proyecto (Casa 2)
2. Haz clic en "Ver Planos"
3. Selecciona "Planta P2"
4. Deberías ver:
   - ✅ Habitaciones coloreadas según carga
   - ✅ Badges circulares con números
   - ✅ Al hacer clic en un espacio, se filtra la lista de tareas

## 🎯 Próximos Pasos (Opcional)

Si quieres mejorar aún más:

1. **Crear FloorPlan1Enhanced** con contadores para P1
   - Copiar FloorPlan2Enhanced.jsx
   - Reemplazar el SVG con el de FloorPlan1
   - Actualizar ROOM_CENTERS con las coordenadas de P1

2. **Agregar tooltips** al pasar el mouse sobre los badges
   ```javascript
   <title>{`${count} tarea${count !== 1 ? 's' : ''} en ${roomId}`}</title>
   ```

3. **Animaciones** al cambiar el contador
   ```javascript
   className="... animate-pulse"  // cuando el número cambia
   ```

4. **Leyenda** de colores en el PlansViewer
   ```javascript
   <div className="p-2 bg-white border-t">
     <p className="text-xs text-gray-600">
       <span className="inline-block w-3 h-3 bg-green-100 mr-1"></span>Baja
       <span className="inline-block w-3 h-3 bg-yellow-100 mr-1 ml-2"></span>Media
       ...
     </p>
   </div>
   ```

## 🐛 Troubleshooting

### No veo los contadores
- Verifica que existan tareas con el campo `espacio` asignado
- Revisa la consola para errores de Redux
- Asegúrate de estar en Casa 2 (Casa 1 aún no tiene contadores)

### Los números no son correctos
- Verifica que los nombres en `ESPACIOS_HABITACIONES` coincidan con los IDs del SVG
- Revisa que las tareas tengan el formato correcto

### Los colores no cambian
- Verifica la configuración en `TASK_STATUS_COLORS` (línea 16)
- Asegúrate que Tailwind esté compilando las clases

## 📁 Archivos Clave

```
src/
├── components/
│   ├── FloorPlan2Enhanced.jsx          ← Componente principal con contadores
│   ├── ProjectPlans/
│   │   └── PlansViewer.jsx             ← Pasa tareas a planos
│   └── casas/Casa2/
│       ├── p1.jsx                      ← Actualizado
│       ├── p2.jsx                      ← Actualizado (usa Enhanced)
│       ├── s1.jsx                      ← Actualizado
│       └── t1.jsx                      ← Actualizado
├── constants/
│   └── espacios.js                     ← Lista de espacios
└── config/
    └── projectPlansConfig.js           ← Configuración de planos
```

## ✨ Resultado Final

Ahora cuando veas el Piso 2 de Casa 2:
- Las habitaciones tienen colores según su carga de trabajo
- Cada habitación muestra un número indicando cuántas tareas tiene
- Puedes hacer clic en una habitación para filtrar solo sus tareas
- La experiencia visual es clara e intuitiva

---

**¡Los contadores están listos para usar! 🎉**

# Implementación de Sistema de Planos por Casa

## ✅ Cambios Realizados

### 1. Estructura de Carpetas
```
src/components/casas/
├── Casa1/ (plantilla creada)
├── Casa2/ (completamente implementada) ✓
├── Casa3/ - Casa7/ (plantillas base)
└── README.md
```

### 2. Archivos Corregidos

#### Test.jsx
- ✅ Ahora muestra **FloorPlan1** para Piso 1
- ✅ Muestra **FloorPlan2** para Piso 2
- Los botones de piso funcionan correctamente

```jsx
{currentFloor === 1 && (
  <FloorPlan1 selectedRoom={selectedRoomLocal} onRoomClick={handleRoomClick} />
)}
{currentFloor === 2 && (
  <FloorPlan2 selectedRoom={selectedRoomLocal} onRoomClick={handleRoomClick} />
)}
```

#### Casa2/p1.jsx
- ✅ Actualizado para usar **FloorPlan1** (SVG interactivo completo)
- ❌ Ya NO usa grid de botones
- ✅ Importa correctamente `import { FloorPlan1 } from '../../FloorPlan1';`

#### Casa2/p2.jsx
- ✅ Usa **FloorPlan2** correctamente
- ✅ Importa `import { FloorPlan2 } from '../../FloorPlan2';`

### 3. ProjectTaskModal
- ✅ Panel lateral con selector de planos (P1, P2, S1, T1)
- ✅ Filtrado de tareas por espacio seleccionado
- ✅ Botón "Ver Planos" para toggle del panel
- ✅ Integración con componentes de Casa2

## 🎯 Funcionamiento

### Flujo de Trabajo
1. Usuario abre ProjectTaskModal de un proyecto
2. Clic en **"Ver Planos"** → panel lateral se abre
3. Selecciona tipo de plano:
   - **P1**: Planta Piso 1 (FloorPlan1)
   - **P2**: Planta Piso 2 (FloorPlan2)
   - **S1**: Sección 1 (placeholder)
   - **T1**: Detalles Técnicos (placeholder)
4. Hace clic en un espacio del plano SVG
5. Las tareas se filtran automáticamente

### Filtrado de Tareas
```javascript
// En ProjectTaskModal
if (selectedRoom) {
  items = items.filter(task => {
    const acciones = JSON.parse(task.acciones);
    return acciones.some(accion => accion.espacio === selectedRoom);
  });
}
```

## 📦 Componentes Implementados

### Casa 2 (Completa)
- ✅ `p1.jsx` - FloorPlan1 completo
- ✅ `p2.jsx` - FloorPlan2 completo
- ✅ `s1.jsx` - Sección (placeholder)
- ✅ `t1.jsx` - Detalles (placeholder)
- ✅ `index.js` - Exportaciones
- ✅ `README.md` - Documentación

### Casa 1 (Plantilla)
- ✅ `p1.jsx` - Con FloorPlan1
- ✅ `p2.jsx` - Con FloorPlan2
- Faltan: s1.jsx, t1.jsx, index.js

### Casas 3-7
- Carpetas creadas
- Archivos .txt creados
- Pendiente: crear componentes .jsx

## 🔧 Próximos Pasos para Otras Casas

Para implementar Casa1, Casa3-Casa7:

1. **Copiar componentes de Casa2:**
   ```bash
   # Desde Casa2/ copiar a CasaX/
   cp s1.jsx ../CasaX/
   cp t1.jsx ../CasaX/
   cp p1.jsx ../CasaX/  # si aún no existe
   cp p2.jsx ../CasaX/  # si aún no existe
   ```

2. **Modificar nombres:**
   - Cambiar `P1Casa2` → `P1CasaX`
   - Cambiar `"Casa 2"` → `"Casa X"`

3. **Crear index.js:**
   ```javascript
   export { default as P1CasaX } from './p1';
   export { default as P2CasaX } from './p2';
   export { default as S1CasaX } from './s1';
   export { default as T1CasaX } from './t1';
   ```

4. **Actualizar ProjectTaskModal:**
   ```javascript
   // Añadir imports
   import P1CasaX from './casas/CasaX/p1';
   import P2CasaX from './casas/CasaX/p2';
   // etc.
   ```

## 📋 Espacios de ESPACIOS_HABITACIONES

### Piso 1 (FloorPlan1)
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

### Piso 2 (FloorPlan2)
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

## ✅ Verificación

Para verificar que todo funciona:

1. Abre Test.jsx en el navegador
2. Cambia entre Piso 1 y Piso 2
3. Verifica que FloorPlan1 aparece en Piso 1
4. Verifica que FloorPlan2 aparece en Piso 2
5. Haz clic en espacios y verifica la selección
6. Abre ProjectTaskModal de Casa2
7. Clic en "Ver Planos"
8. Selecciona P1 y P2, verifica que cargan
9. Haz clic en un espacio
10. Verifica que las tareas se filtran

## 🐛 Solución de Problemas

### FloorPlan1 no se muestra
- Verificar import: `import { FloorPlan1 } from '../../FloorPlan1';`
- Verificar que existe `src/components/FloorPlan1.jsx`

### Las tareas no se filtran
- Verificar que las tareas tienen campo `acciones`
- Verificar que `acciones` es un array con objetos que tienen `espacio`
- Verificar que `espacio` coincide con los IDs del SVG

### Panel de planos no se abre
- Verificar estado `showPlanView` en ProjectTaskModal
- Verificar botón "Ver Planos" tiene onClick correcto

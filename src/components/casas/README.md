# Carpeta Casas - Estructura de Planos

Esta carpeta contiene la organización de planos y componentes para cada casa del proyecto.

## Estructura General

```
casas/
├── Casa1/
│   ├── p1.txt, p1.jsx  # Planta Piso 1
│   ├── p2.txt, p2.jsx  # Planta Piso 2
│   ├── s1.txt, s1.jsx  # Sección 1
│   ├── t1.txt, t1.jsx  # Detalles Técnicos
│   └── README.md
├── Casa2/ (Implementado)
│   ├── p1.txt, p1.jsx
│   ├── p2.txt, p2.jsx
│   ├── s1.txt, s1.jsx
│   ├── t1.txt, t1.jsx
│   ├── index.js
│   └── README.md
├── Casa3/ ... Casa7/ (Pendientes)
└── README.md (este archivo)
```

## Convenciones

### Nomenclatura de Archivos
- **p[n].txt/jsx**: Planta del piso n
- **s[n].txt/jsx**: Sección n
- **t[n].txt/jsx**: Detalles técnicos n

### Archivos TXT
Contienen la lista de espacios y descripción de cada plano/sección.

### Archivos JSX
Componentes React que:
- Reciben props: `onRoomSelect` y `selectedRoom`
- Permiten selección interactiva de espacios
- Se integran con ProjectTaskModal para filtrar tareas

## Casa 2 (Implementada)

Casa 2 está completamente implementada con:
- FloorPlan2 (SVG interactivo del Piso 2)
- Grid de botones para Piso 1
- Componentes de sección y detalles técnicos
- Integración con ProjectTaskModal

## Implementación en ProjectTaskModal

El modal ahora incluye:
1. **Panel lateral**: Vista de planos con selector de tipo (p1, p2, s1, t1)
2. **Filtro por espacio**: Al hacer clic en un espacio, filtra tareas
3. **Indicador visual**: Muestra el espacio seleccionado
4. **Filtrado de tareas**: Solo muestra tareas con acciones en el espacio seleccionado

### Filtrado de Tareas por Espacio

Las tareas se filtran buscando en el campo `acciones`:
```javascript
if (selectedRoom) {
  items = items.filter(task => {
    const acciones = JSON.parse(task.acciones);
    return acciones.some(accion => accion.espacio === selectedRoom);
  });
}
```

## Próximos Pasos

Para implementar Casa1, Casa3...Casa7:
1. Crear archivos .txt con lista de espacios
2. Crear componentes .jsx similares a Casa2
3. Añadir imports en ProjectTaskModal
4. Configurar selector de casa en el modal

## Espacios de ESPACIOS_HABITACIONES

Todos los espacios válidos están definidos en `InlineActionsTask.jsx`:
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

# ESPECIFICACIÓN TÉCNICA MAESTRA: ARK TVS COMMAND CENTER (THE ULTIMATE WORKER)

Este documento es la condensación total y detallada de cada pulgada de la plataforma **ARK TVS**. Ha sido diseñado para ser la "Biblia de Replicación" para cualquier IA o Arquitecto de Software que herede este sistema.

---

## 🏗️ 1. NÚCLEO ARQUITECTÓNICO (EL CEREBRO)

### A. Action Inspector Panel (La "Navaja Suiza" de 152KB)
Es el componente más complejo del sistema. No es solo un modal, es un **Motor de Contexto Dinámico** que se inyecta en la base de la pantalla.
- **Funcionalidades Críticas**: 
    - **Gestión de Dependencias en Cascada**: Sincronización bidireccional de tareas (`Condiciona A` <-> `Condicionada Por`). Si una tarea madre cambia, las hijas se actualizan automáticamente en la DB.
    - **Double-Approval System**: Lógica integrada de aprobación por roles directivos (Ronald, Wiet, Alejo) con disparadores de estados visuales.
    - **Timeline Interactivo**: Permite redimensionar y reordenar "sub-acciones" mediante Drag-and-Drop y cálculos de porcentajes de duración en tiempo real.
    - **Integración VoIP/Log**: Botón de llamada directa que registra automáticamente el evento en la tabla `Calls` vinculando al responsable.
    - **Evidencia Visual**: `EvidenceUploader` integrado para subir fotos a Supabase Storage (`evidencias/`) con políticas RLS personalizadas.

### B. Enrutamiento Estratégico (`App.jsx`)
Cubre 10 dominios operativos distintos, todos coordinados mediante Redux:
1.  `/calendar/:view`: Vistas de Weekly/Monthly con filtros por proyecto.
2.  `/houses/:id`: Gestión granular de proyectos arquitectónicos (Cronograma, Informe, Facturación).
3.  `/parcels`: Modo especial para "Parcelación" (Gestión del lote maestro).
4.  `/spaces` & `/components`: Desglose atómico del proyecto (Arquitectura Paramétrica).
5.  `/protocols`: Base de conocimiento SOP con motor de Markdown.
6.  `/calls`: Monitor de comunicaciones pendientes.
7.  `/team` & `/directory`: Gestión de nodos humanos internos y externos.

---

## 🛠️ 2. CATÁLOGO DE MÓDULOS (DETALLE EXAGERADO)

### 📂 Módulo de Gestión de Casas (Houses)
**Ubicación**: `src/components/CommandCenter/HousesView.jsx`
- **ADN**: Controla el ciclo de vida de la obra.
- **Funcionalidad Exagerada**: Posee un sistema de "Informes Automáticos" (`HouseReportModal`) que extrae el porcentaje de avance real basado en la sumatoria de materiales instalados y tareas completadas. Su columna JSON `Datos` guarda configuraciones de Canva para presentaciones de lujo.

### 📅 Módulo de Calendario de Ingeniería
**Ubicación**: `src/components/CommandCenter/WeeklyCalendar.jsx`
- **ADN**: Visualización de carga de trabajo.
- **Funcionalidad Exagerada**: No solo muestra fechas; calcula el "gap" de días entre la fecha estimada y la real, coloreando las celdas con gradientes de criticidad. Está sincronizado con el `ActionInspectorPanel` para que cualquier clic en un día abra el inspector de tareas.

### 📜 Módulo de Protocolos de Trabajo (SOPs)
**Ubicación**: `src/components/CommandCenter/ProtocolsView.jsx`
- **ADN**: Conocimiento técnico.
- **Funcionalidad Exagerada**: Editor de Markdown híbrido (Visual/Código) que permite a los directores escribir especificaciones técnicas y exportarlas instantáneamente a PDFs brandeados mediante `printUtils`.

### 📦 Módulo BIM (Espacios, Componentes y Materiales)
**Ubicación**: `src/services/spacesService.js`, `materialsService.js`
- **ADN**: El inventario físico de la realidad.
- **Funcionalidad Exagerada**: Sistema de "Instanciamiento de Componentes". Un material (ej: Perfil de Aluminio) no existe solo en una lista; existe como una `Instancia` dentro de un `Espacio`. Si el stock global de materiales baja, el sistema puede alertar en qué proyecto se está consumiendo el recurso.

### 📞 Módulo de Comunicaciones (Calls)
**Ubicación**: `src/components/CommandCenter/CallsView.jsx`
- **ADN**: Auditoría de interacción.
- **Funcionalidad Exagerada**: Registro de llamadas con contador de "Pendientes" que se refresca cada 30 segundos (`setInterval` en `App.jsx`). Asegura que ninguna solicitud de obra quede sin respuesta.

---

## 🔌 3. ESPECIFICACIONES DE REPLICACIÓN (PAQUETES)

| Funcionalidad | SQL Schema | Frontend Service | UI Component (Principal) |
| :--- | :--- | :--- | :--- |
| **Directorio** | `Directorio_rows.sql` | `directoryService.js` | `DirectoryView.jsx` |
| **Tareas** | `Tareas_rows.sql` | `tasksService.js` | `ActionInspectorPanel.jsx` |
| **Materiales**| `Materiales_rows.sql` | `materialsService.js` | `MaterialsView.jsx` |
| **Staff** | `Staff_rows.sql` | `spacesService.js` | `TeamView.jsx` |
| **Protocolos**| `Protocolos_rows.sql`| `protocolsService.js` | `ProtocolsView.jsx` |

---

## 🧪 4. FLUJO DE DATOS (EL SISTEMA NERVIOSO)
1. **Request**: El usuario clica en una Casa.
2. **Redux**: `dispatch(setSelectedProject(project))`.
3. **Service**: `getTasksByProject(id)` -> Llamada a Supabase.
4. **Transformación**: La lógica en `ActionInspectorPanel` procesa los JSON subordinados.
5. **Renderizado**: React actualiza el Inspector y el Calendario en paralelo (Multi-view Sync).

---
*Documento Final de Especificación v2.0 - Ark Tvs Command Center Core*

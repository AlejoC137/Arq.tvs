# 🏗️ Sistema de Gestión de Proyectos Arquitectónicos ARQ.TVS

## 📋 Descripción

Sistema completo de gestión de proyectos arquitectónicos con interfaz tipo Excel que permite gestionar todas las tareas, responsables, deadlines y estados de múltiples proyectos de construcción simultáneamente.

## ✨ Características Principales

### 🔢 Vista Excel Interactiva
- **Edición inline**: Haz clic en cualquier celda para editarla directamente
- **Dropdowns inteligentes**: Selección rápida de estados, prioridades, proyectos y categorías
- **Date pickers**: Asignación fácil de fechas límite
- **Selección múltiple**: Selecciona varias tareas para acciones en lote
- **Filtrado avanzado**: Filtra por proyecto, categoría, responsable, estado y búsqueda libre

### 📊 Dashboard Ejecutivo
- **Gráficos dinámicos**: Pie charts y bar charts con estadísticas en tiempo real
- **KPIs principales**: Total de tareas, completadas, en proceso y vencidas
- **Alertas inteligentes**: Notificaciones de tareas vencidas y próximas a vencer
- **Progreso por proyecto**: Barras de progreso individuales para cada casa/proyecto

### ⚡ Acciones Rápidas
- **Cambios de estado masivos**: Marcar múltiples tareas como completadas, en proceso, etc.
- **Asignación de responsables**: Asignar tareas a miembros del equipo en lote
- **Gestión de prioridades**: Cambiar prioridades de múltiples tareas
- **Duplicación de tareas**: Crear copias de tareas existentes
- **Asignación de fechas**: Establecer deadlines en lote

### 💾 Gestión de Datos
- **Exportación a Excel**: Descarga datos filtrados en formato .xlsx
- **Importación desde Excel**: Carga datos masivos desde archivos Excel
- **Backup automático**: Guardado automático en localStorage
- **Backup manual**: Exportación/importación en formato JSON

## 🎯 Proyectos Gestionados

### 🏠 Proyectos Residenciales
- **CASA 1**: Diseño estructural y paisajismo
- **CASA 2**: Fachadas, interiores y exteriores completos
- **CASA 3**: En definición de alcance
- **CASA 4**: Diseños técnicos de cocina y habitaciones
- **CASA 5**: Diseños técnicos y paisajismo
- **CASA 6**: Diseño arquitectónico y normativa
- **CASA 7**: Entrega a curaduría y obra de cimentación

### 🏢 Infraestructura
- **PORTERÍA**: Paisajismo y acabados
- **PARCELACIÓN**: Redes de servicios públicos y espacio público

## 👥 Equipo de Trabajo

### Roles y Responsabilidades
- **Francisco**: Fachadas y diseños exteriores
- **Manuela**: Diseños interiores y renders
- **David**: Desarrollos técnicos y carpintería
- **Laura**: Supervisión técnica y coordinación
- **Santiago**: Paisajismo, curaduría y obra
- **Alejandro**: Coordinación general y gestión
- **Wiet**: Apoyo en coordinación
- **Miyagi**: Dirección de obra

## 🗂️ Categorías de Tareas

### 🏗️ Diseño y Arquitectura
- Diseño Estructural
- Diseño Arquitectónico
- Diseño Técnico
- Fachada y Fachada Trasera

### 🌿 Espacios
- Interior - General
- Exterior
- Paisajismo
- Espacio Público

### 🏠 Áreas Específicas
- Habitaciones Principales (Piso 1 y 2)
- Habitación de Huéspedes
- Baños (General y de Huéspedes)
- Puertas

### 🔧 Ejecución
- Obra (Cimentación)
- Acabados
- Redes
- Normativa
- Entrega Curaduría
- Señalización

## 🎨 Estados de Tareas

- **🟡 Pendiente**: Tarea no iniciada
- **🔵 En Proceso**: Tarea en desarrollo activo
- **🟢 Completado**: Tarea finalizada
- **🟣 En Revisión**: Tarea en proceso de revisión/aprobación
- **🔴 Cancelado**: Tarea cancelada

## 📈 Niveles de Prioridad

- **🔴 Alta**: Tareas críticas que bloquean otros procesos
- **🟡 Media**: Tareas importantes con deadline establecido
- **🟢 Baja**: Tareas de mejora o no críticas

## 🚀 Funcionalidades Avanzadas

### 📱 Interfaz Responsive
- Optimizada para desktop, tablet y móvil
- Diseño adaptable con Tailwind CSS
- Iconografía con Lucide React

### ⚡ Rendimiento
- Filtrado eficiente con React hooks
- Actualizaciones en tiempo real
- Gestión de estado optimizada

### 🔍 Búsqueda Inteligente
- Búsqueda en texto libre en tareas, proyectos y categorías
- Filtros combinables
- Resultados instantáneos

### 📊 Reportes y Analytics
- Estadísticas por proyecto
- Carga de trabajo por responsable
- Análisis de vencimientos
- Métricas de progreso

## 💻 Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Iconos
- **Recharts**: Gráficos y visualizaciones

### Librerías Especializadas
- **XLSX**: Manejo de archivos Excel
- **Framer Motion**: Animaciones
- **React Router**: Navegación (si se requiere)

## 🔧 Instalación y Uso

### Prerrequisitos
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Instalación
```bash
git clone [repository-url]
cd Arq.tvs
npm install
```

### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

### Build de Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ProjectApp.jsx          # Componente principal con navegación
│   ├── ProjectExcelView.jsx    # Vista tipo Excel
│   ├── ProjectDashboard.jsx    # Dashboard con gráficos
│   └── TaskActions.jsx         # Acciones rápidas para tareas
├── data/
│   └── projectsData.js         # Modelo de datos y constantes
└── index.css                   # Estilos globales
```

## 🎯 Casos de Uso Principal

### Para Coordinadores de Proyecto
1. **Vista general**: Dashboard para ver el estado global de todos los proyectos
2. **Asignación de tareas**: Asignar responsables y establecer prioridades
3. **Seguimiento de deadlines**: Monitorear tareas vencidas y próximas a vencer
4. **Reportes**: Generar reportes en Excel para stakeholders

### Para Arquitectos y Diseñadores
1. **Vista por responsable**: Filtrar tareas asignadas específicamente
2. **Actualización de estados**: Marcar tareas como completadas o en proceso
3. **Gestión de notas**: Agregar comentarios y observaciones
4. **Vista por proyecto**: Enfocarse en un proyecto específico

### Para Directores y Gerentes
1. **Dashboard ejecutivo**: KPIs y métricas clave
2. **Análisis de carga de trabajo**: Distribución de tareas por responsable
3. **Alertas críticas**: Identificar cuellos de botella y retrasos
4. **Seguimiento de progreso**: Avance por proyecto y general

## 🔄 Flujo de Trabajo Típico

1. **Planificación**: Crear nuevas tareas desde la vista Excel
2. **Asignación**: Asignar responsables y establecer deadlines
3. **Seguimiento**: Monitorear progreso en el dashboard
4. **Actualización**: Los responsables actualizan estados y notas
5. **Revisión**: Coordinadores revisan y aprueban tareas
6. **Reportes**: Generar reportes para reuniones y revisiones

## 🔐 Persistencia de Datos

### Local Storage
- Guardado automático de todos los cambios
- Recuperación automática al recargar la página
- No se requiere servidor para uso básico

### Backup y Restauración
- **Backup automático**: Datos guardados en localStorage
- **Backup manual**: Exportación en JSON para respaldo externo
- **Importación**: Restauración desde archivos JSON o Excel

## ⚠️ Consideraciones Importantes

### Limitaciones Actuales
- Los datos se almacenan solo localmente (localStorage)
- No hay sincronización entre múltiples usuarios
- Las notificaciones son solo visuales (no emails/SMS)

### Extensiones Futuras Recomendadas
- **Backend con base de datos**: Para colaboración multi-usuario
- **Notificaciones push**: Alertas por email o móvil
- **Control de versiones**: Historial de cambios en tareas
- **Integración con calendarios**: Sync con Google Calendar, Outlook
- **Comunicación integrada**: Chat por tarea o proyecto

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Datos perdidos**: Verificar si localStorage está habilitado
2. **Filtros no funcionan**: Refrescar página o limpiar filtros
3. **Exportación fallida**: Verificar permisos de descarga del navegador

### Backup de Emergencia
Siempre usa el botón "Backup" en el sidebar para crear copias de seguridad antes de cambios importantes.

## 📞 Soporte

Para soporte técnico o consultas sobre nuevas funcionalidades, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2025  
**Desarrollado para**: ARQ.TVS - Gestión de Proyectos Arquitectónicos

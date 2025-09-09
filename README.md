# Arq.tvs - Sistema de Gestión Arquitectónica

Un sistema completo de gestión de proyectos arquitectónicos con operaciones CRUD completas usando React, Redux, y Supabase.

## 🚀 Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar registros en todas las tablas
- **Gestión de Personal**: Administra el equipo arquitectónico y sus roles
- **Proyectos**: Gestiona proyectos arquitectónicos y su estado
- **Tareas**: Sistema completo de gestión de tareas con asignación de responsables
- **Etapas**: Define y gestiona las fases del desarrollo arquitectónico
- **Entregables**: Catálogo de plantillas de entregables por etapa
- **Dashboard**: Panel principal con estadísticas y métricas en tiempo real
- **Navegación Intuitiva**: Sidebar responsivo con navegación clara
- **Tiempo Real**: Actualizaciones automáticas usando Supabase
- **Validación**: Formularios con validación completa y manejo de errores
- **Responsive**: Diseño adaptativo para desktop y móvil

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Redux Toolkit, React Router
- **UI**: Tailwind CSS, Framer Motion, Lucide React
- **Base de Datos**: Supabase (PostgreSQL)
- **Bundler**: Vite
- **Desarrollo**: ESLint, Hot Module Replacement

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (gratuita)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Arq.tvs.git
cd Arq.tvs
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Espera a que el proyecto se configure completamente

#### 3.2 Obtener Credenciales

1. En tu dashboard de Supabase, ve a **Settings > API**
2. Copia la **URL** y **anon key**

#### 3.3 Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar Base de Datos

#### 4.1 Ejecutar Script SQL

1. En tu dashboard de Supabase, ve al **SQL Editor**
2. Copia y ejecuta el contenido del archivo `database_setup.sql`
3. Esto creará todas las tablas, índices, triggers y datos de ejemplo

#### 4.2 Verificar Tablas

Deberías ver las siguientes tablas creadas:
- `projects` - Proyectos arquitectónicos
- `staff` - Personal del equipo
- `stages` - Etapas del desarrollo
- `tasks` - Tareas del proyecto
- `entregables_template` - Plantillas de entregables

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📊 Estructura de Datos

### Tablas Principales

#### Projects (Proyectos)
- `id`: UUID único
- `name`: Nombre del proyecto
- `status`: Estado (Pendiente, En Progreso, etc.)
- `resp`: Responsable del proyecto

#### Staff (Personal)
- `id`: UUID único
- `name`: Nombre del miembro
- `role_description`: Descripción del rol
- `Tasks`: Notas sobre tareas asignadas

#### Tasks (Tareas)
- `id`: UUID único
- `category`: Categoría de la tarea
- `task_description`: Descripción detallada
- `status`: Estado actual
- `notes`: Notas adicionales
- `project_id`: Referencia al proyecto
- `staff_id`: Referencia al responsable
- `stage_id`: Referencia a la etapa

#### Stages (Etapas)
- `id`: UUID único
- `name`: Nombre de la etapa
- `description`: Descripción detallada
- `objectives`: Objetivos de la etapa
- `deliverables`: Entregables esperados
- `products`: Productos generados
- `stakeholders`: Involucrados

#### Entregables Template
- `id`: UUID único
- `entregable_nombre`: Nombre del entregable
- `tipo`: Tipo (2D, 3D, 2D/3D)
- `vistaTipo`: Tipo de vista
- `escala_tipica`: Escala utilizada
- `software_utilizado`: Software requerido
- `Stage_id`: Referencia a la etapa

## 🎯 Funcionalidades Principales

### Dashboard
- Estadísticas de proyectos y tareas
- Resumen del equipo de trabajo
- Tareas recientes y pendientes

### Gestión de Proyectos
- Crear, editar y eliminar proyectos
- Cambiar estados de proyectos
- Asignar responsables

### Gestión de Tareas
- CRUD completo de tareas
- Asignación a proyectos, personal y etapas
- Filtros avanzados por estado, categoría, etc.
- Actualización rápida de estados

### Gestión de Personal
- Administrar miembros del equipo
- Definir roles y responsabilidades
- Ver tareas asignadas

### Gestión de Etapas
- Definir fases del proyecto
- Establecer objetivos y entregables
- Gestionar stakeholders

### Gestión de Entregables
- Catálogo de plantillas
- Clasificación por tipo y software
- Asociación con etapas

## 🔧 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   ├── DataTable.jsx   # Tabla de datos genérica
│   ├── CrudForm.jsx    # Formulario CRUD genérico
│   └── Navigation.jsx  # Navegación sidebar
├── pages/              # Páginas principales
│   ├── Dashboard.jsx   # Panel principal
│   ├── ProjectsPage.jsx
│   ├── TasksPage.jsx
│   ├── StaffPage.jsx
│   ├── StagesPage.jsx
│   └── EntregablesPage.jsx
├── services/           # Servicios de API
│   ├── projectsService.js
│   ├── tasksService.js
│   └── ...
├── store/              # Redux store
│   ├── actions/
│   ├── reducers/
│   └── store.js
├── types/              # Tipos y esquemas
└── lib/                # Utilidades
```

## 🔐 Seguridad

- **Row Level Security (RLS)**: Habilitado en todas las tablas
- **Políticas de Acceso**: Configuradas para usuarios autenticados
- **Validación**: Validación en frontend y backend
- **Error Boundary**: Manejo de errores a nivel de aplicación

## 📱 Responsive Design

- **Desktop**: Navegación sidebar fija
- **Tablet**: Navegación adaptativa
- **Mobile**: Navegación por menú hamburguesa
- **Formularios**: Diseño adaptativo en todos los tamaños

## 🎨 Personalización

### Temas y Colores

La aplicación usa CSS custom properties para fácil personalización:

```css
:root {
  --primary: /* Color primario */
  --secondary: /* Color secundario */
  --accent: /* Color de acento */
  /* ... más variables */
}
```

### Agregar Nuevas Tablas

1. Definir esquema en `types/database.js`
2. Crear servicio en `services/`
3. Crear actions y reducer en `store/`
4. Crear página de gestión en `pages/`
5. Agregar ruta en `App.jsx`

## 📈 Performance

- **Lazy Loading**: Carga bajo demanda de componentes
- **Memoización**: React.memo y useMemo donde corresponde
- **Índices DB**: Índices optimizados en Supabase
- **Virtualization**: Para listas grandes (implementar si necesario)

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🆘 Soporte

Si tienes problemas:

1. Revisa que las variables de entorno estén configuradas
2. Verifica que las tablas se hayan creado correctamente en Supabase
3. Revisa la consola del navegador para errores
4. Abre un issue en GitHub con los detalles del problema

## 🎉 Agradecimientos

- **Supabase** por la base de datos y backend
- **React** por el framework frontend
- **Tailwind CSS** por el sistema de diseño
- **Lucide React** por los iconos

---

**Desarrollado con ❤️ para la gestión de proyectos arquitectónicos**

# 🏗️ Dashboard de Gestión de Proyectos Arquitectónicos

Una aplicación web moderna para la gestión integral de proyectos arquitectónicos, desarrollada con React, Redux y TailwindCSS.

## 🌟 Características

- **📊 Dashboard interactivo** con estadísticas en tiempo real
- **👥 Gestión de equipo** con roles y responsabilidades
- **📋 Sistema de tareas** con filtros avanzados
- **🏠 Gestión de proyectos** arquitectónicos múltiples
- **🎨 Interfaz moderna** con componentes reutilizables
- **📱 Diseño responsive** optimizado para todos los dispositivos
- **⚡ Animaciones fluidas** con Framer Motion

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **React 18.3.1** - Biblioteca principal
- **Vite 6.3.5** - Build tool y dev server
- **Redux + Redux Thunk** - Gestión del estado global
- **React Router DOM** - Navegación entre páginas

### UI/UX
- **TailwindCSS 3.4.11** - Framework de CSS
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconografía moderna
- **Framer Motion** - Animaciones y transiciones
- **Class Variance Authority** - Variantes de componentes

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS + Autoprefixer** - Procesamiento de CSS
- **Axios** - Cliente HTTP

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd proyectocafeweb

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build de producción
npm run preview

# Linting del código
npm run lint
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── ui/             # Componentes base (Button, Card, Badge)
├── store/              # Redux store
│   ├── actions/        # Action creators y thunks
│   └── reducers/       # Reducers para estado global
├── lib/                # Utilidades
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🏢 Datos del Proyecto

### Equipo Arquitectónico
- **Alejandro** - Coordinador Técnico y de Desarrollo
- **Laura** - Encargada de Obra (Casa 4 y 5)
- **Francisco** - Encargado de Obra (Casa 2)
- **Santiago** - Encargado de Obra (Casa 7), Paisajismo
- **Manuela** - Diseño e Interiorismo Básico
- **Miguel** - Búsqueda de Materiales
- **David** - Desarrollo Técnico de Mobiliario Fijo

### Proyectos Activos
- **Casa 1** - Muro de contención y estructura
- **Casa 2** - Rediseño de fachada y interiores
- **Casa 4** - Desarrollo técnico de espacios
- **Casa 5** - Diseño interior y paisajismo
- **Casa 6** - Diseño arquitectónico inicial
- **Casa 7** - Licencias y desarrollo estructural
- **Portería** - Paisajismo y acabados
- **Parcelación** - Redes y paisajismo general

## 🔧 Funcionalidades Principales

### Dashboard
- Estadísticas de proyectos y tareas
- Métricas de progreso en tiempo real
- Visualización del estado del equipo

### Gestión de Tareas
- Vista de tarjetas con información completa
- Filtros por proyecto, responsable, estado y categoría
- Estados: Pendiente, En Diseño, En Progreso, Aprobación Requerida, Bloqueado, Completo
- Prioridades: Baja, Media, Alta, Crítica
- Fechas de vencimiento

### Sistema de Filtros
- Filtrado múltiple simultáneo
- Búsqueda por texto en tareas y notas
- Limpieza rápida de todos los filtros

## 🎨 Características de Diseño

- **Sistema de color consistente** con variables CSS
- **Componentes modulares** con variantes
- **Animaciones suaves** en hover y transiciones
- **Estados visuales claros** con badges y colores
- **Tipografía jerárquica** para mejor legibilidad
- **Espaciado sistemático** usando grid de TailwindCSS

## 🔮 Extensibilidad

El proyecto está diseñado para ser fácilmente extensible:

- **Nuevos componentes**: Siguiendo el patrón establecido
- **Estados adicionales**: Agregando a los reducers
- **Integración con APIs**: Reemplazar thunks simulados
- **Nuevas páginas**: Usando React Router
- **Temas personalizados**: Modificando variables CSS

## 🤝 Integración con Supabase

Para conectar con una base de datos real, reemplazar las llamadas simuladas en los thunks con:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);
```

## 📄 Licencia

Este proyecto es parte de un sistema de gestión arquitectónica privado.

---

**Desarrollado con ❤️ para la gestión eficiente de proyectos arquitectónicos**

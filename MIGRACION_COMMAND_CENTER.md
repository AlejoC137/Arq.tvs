# Guía Maestra de Migración: Arq.tvs Command Center

Este documento es el **"Paquete de Exportación"** definitivo para trasladar las funcionalidades del ecosistema Arq.tvs a nuevas aplicaciones. Sigue el método de empaquetado por dominio (SQL + Servicio + UI).

---

## 1. Contexto Global de Arquitectura

### Estructura de Proyecto (React + Vite)
El proyecto sigue una arquitectura modular donde la lógica de datos está aislada de la UI.
- `src/config/supabaseClient.js`: Conexión central.
- `src/services/`: Lógica de fetching (Aislada).
- `src/store/`: Estado global (Redux).
- `src/components/CommandCenter/`: Vistas de usuario.

### Esquema de Base de Datos (Supabase/PostgreSQL)
Las tablas principales se relacionan mediante `uuid`. La columna `Datos` (JSONB) en la tabla `Proyectos` es crítica para configuraciones dinámicas.

---

## 2. Módulo: Directorio (Contactos)

### SQL (Esquema)
```sql
CREATE TABLE public."Directorio" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "Nombre" text NOT NULL,
    "Contacto" text,
    "Cargo" text
);
```

### Servicio (`src/services/directoryService.js`)
```javascript
import supabase from '../config/supabaseClient';

export const getContacts = async () => {
    const { data, error } = await supabase
        .from('Directorio')
        .select('id, Nombre, Contacto, Cargo')
        .order('Nombre', { ascending: true });
    return data || [];
};

export const createContact = async (contactData) => {
    const { data, error } = await supabase.from('Directorio').insert([contactData]).select().single();
    return data;
};
```

### UI (`src/components/CommandCenter/DirectoryView.jsx`)
Vista de lista/detalle con búsqueda integrada y modales de edición. Requiere `lucide-react` y un `ContactModal` adicional.

---

## 3. Módulo: Proyectos y Casas (Houses)

### SQL (Esquema)
```sql
CREATE TABLE public."Proyectos" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    responsable uuid REFERENCES public."Staff"(id),
    status text,
    "Datos" jsonb DEFAULT '{}'::jsonb
);
```

### Servicio (`src/services/projectsService.js`)
Gestiona la lógica de "Casas" vs "Parcelación" y realiza el `merge` manual de la columna JSON `Datos`.

```javascript
export const updateProject = async (projectId, updates) => {
    const currentProject = await getProjectById(projectId);
    const updatePayload = { ...updates };
    if (updates.Datos) {
        updatePayload.Datos = { ...currentProject.Datos, ...updates.Datos };
    }
    const { data } = await supabase.from('Proyectos').update(updatePayload).eq('id', projectId).select().single();
    return data;
};
```

---

## 4. Módulo: Protocolos (SOPs)

### SQL (Esquema)
```sql
CREATE TABLE public."Protocolos" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "Nombre" text NOT NULL,
    "Contenido" text, -- Formato Markdown
    "Categoria" text,
    "Editor" text,
    "FechaUpdate" timestamp with time zone DEFAULT now()
);
```

### UI (`src/components/CommandCenter/ProtocolsView.jsx`)
Incluye un editor de Markdown con vista previa (Visual/Código) y funcionalidad de exportación a PDF.

---

## 5. Módulo: BIM Inventory (Espacios y Materiales)

### Relación Crítica:
- **Materiales**: Catálogo maestro de insumos.
- **Espacio_Elemento**: Estructura física del proyecto.
- **Instancias_Componentes**: Tabla pivote que vincula materiales/componentes a espacios específicos con cantidades.

```sql
CREATE TABLE public."Instancias_Componentes" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    espacio_id uuid REFERENCES public."Espacio_Elemento"(_id),
    componente_id uuid REFERENCES public."Materiales"(id),
    cantidad numeric,
    estado text
);
```

---
*Este documento resume +40 archivos de código fuente para facilitar su clonación por IA.*

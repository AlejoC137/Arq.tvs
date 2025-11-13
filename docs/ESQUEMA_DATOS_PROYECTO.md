# Esquema del Campo `Datos` en Proyectos

## 📋 Descripción General

El campo `Datos` en la tabla `Proyectos` de Supabase almacenará un objeto JSON stringificado con toda la información adicional del proyecto.

---

## 🏗️ Estructura del Objeto

```typescript
interface DatosProyecto {
  tareas: string[];                        // Array de IDs de tareas
  materialesConstantes: MaterialConstante[]; // Materiales recurrentes
  etapa: string;                            // Etapa actual del proyecto
  presentacionesEspacio: PresentacionEspacio[]; // Presentaciones por espacio
}

interface MaterialConstante {
  categoria: string;      // Ej: "Griferias", "Zocalos", "Pisos"
  materialId: string;     // ID del material en tabla Materiales
  nombre: string;         // Nombre del material
  observaciones?: string; // Notas adicionales (opcional)
}

interface PresentacionEspacio {
  espacio: string;        // Nombre del espacio (Ej: "CocinaC2", "SalaPrincipal")
  link: string;           // URL de la presentación PPT
  fechaActualizacion?: string; // Última actualización (opcional)
}
```

---

## 📝 Ejemplo Completo - Casa 2

```json
{
  "tareas": [
    "task-uuid-001",
    "task-uuid-002",
    "task-uuid-003"
  ],
  "materialesConstantes": [
    {
      "categoria": "Griferias",
      "materialId": "mat-grif-001",
      "nombre": "Grifería Hansgrohe Talis S",
      "observaciones": "Para todos los baños"
    },
    {
      "categoria": "Zocalos",
      "materialId": "mat-zoc-045",
      "nombre": "Zócalo MDF Blanco 10cm"
    },
    {
      "categoria": "Pisos",
      "materialId": "mat-piso-023",
      "nombre": "Porcelanato Gris 60x60",
      "observaciones": "Áreas sociales"
    },
    {
      "categoria": "Enchufes",
      "materialId": "mat-elec-112",
      "nombre": "Enchufes Schneider Serie Unica"
    }
  ],
  "etapa": "En Diseño",
  "presentacionesEspacio": [
    {
      "espacio": "CocinaC2",
      "link": "https://drive.google.com/presentation/d/abc123",
      "fechaActualizacion": "2025-01-10"
    },
    {
      "espacio": "SalaPrincipalC2",
      "link": "https://drive.google.com/presentation/d/def456"
    },
    {
      "espacio": "HabitacionPrincipalPiso2C2",
      "link": "https://onedrive.live.com/edit.aspx?resid=xyz789"
    }
  ]
}
```

---

## 📝 Ejemplo Completo - Casa 4

```json
{
  "tareas": [
    "task-uuid-101",
    "task-uuid-102"
  ],
  "materialesConstantes": [
    {
      "categoria": "Griferias",
      "materialId": "mat-grif-002",
      "nombre": "Grifería FV Linea Toscana"
    },
    {
      "categoria": "Luminarias",
      "materialId": "mat-lum-067",
      "nombre": "Luminaria LED Empotrable 12W",
      "observaciones": "Para toda la casa"
    },
    {
      "categoria": "Puertas",
      "materialId": "mat-puerta-034",
      "nombre": "Puerta Tambor MDF Blanca"
    }
  ],
  "etapa": "Construcción",
  "presentacionesEspacio": [
    {
      "espacio": "CocinaComedor",
      "link": "https://docs.google.com/presentation/d/casa4cocina"
    },
    {
      "espacio": "HabitacionPrincipalPiso2",
      "link": "https://www.canva.com/design/casa4hab"
    }
  ]
}
```

---

## 📝 Ejemplo Mínimo (Proyecto Nuevo)

```json
{
  "tareas": [],
  "materialesConstantes": [],
  "etapa": "Planificación",
  "presentacionesEspacio": []
}
```

---

## 🔧 Cómo se Almacena en Supabase

### En la tabla `Proyectos`:

| id | name | Datos (text) |
|----|------|-------------|
| uuid-1 | Casa 2 | `"{\"tareas\":[...],\"materialesConstantes\":[...],\"etapa\":\"En Diseño\",\"presentacionesEspacio\":[...]}"` |

### Código para guardar:

```javascript
const datosProyecto = {
  tareas: ["task-1", "task-2"],
  materialesConstantes: [
    {
      categoria: "Griferias",
      materialId: "mat-001",
      nombre: "Grifería XYZ"
    }
  ],
  etapa: "En Diseño",
  presentacionesEspacio: [
    {
      espacio: "CocinaC2",
      link: "https://..."
    }
  ]
};

// Convertir a string para Supabase
const datosString = JSON.stringify(datosProyecto);

// Guardar en Supabase
await supabase
  .from('Proyectos')
  .update({ Datos: datosString })
  .eq('id', projectId);
```

### Código para leer:

```javascript
// Leer de Supabase
const { data } = await supabase
  .from('Proyectos')
  .select('Datos')
  .eq('id', projectId)
  .single();

// Parsear el JSON
const datosProyecto = JSON.parse(data.Datos || '{}');

// Usar los datos
console.log(datosProyecto.etapa); // "En Diseño"
console.log(datosProyecto.materialesConstantes); // Array de materiales
```

---

## 📊 Categorías Comunes de Materiales

Aquí hay una lista sugerida de categorías para `materialesConstantes`:

```javascript
const CATEGORIAS_MATERIALES = [
  "Griferias",
  "Zocalos",
  "Pisos",
  "Enchufes",
  "Interruptores",
  "Luminarias",
  "Puertas",
  "Manijas",
  "Cerraduras",
  "Ventanas",
  "Cortinas",
  "Persianas",
  "Pintura",
  "Mesones",
  "Lavaplatos",
  "Sanitarios",
  "Duchas",
  "Espejos",
  "Gabinetes",
  "Closets"
];
```

---

## 🔄 Migración de Datos Existentes

Si ya hay proyectos sin el campo `Datos`, se puede crear un script de migración:

```javascript
// Script de migración
const migrateProjects = async () => {
  const { data: projects } = await supabase
    .from('Proyectos')
    .select('id, name');
  
  for (const project of projects) {
    const datosInicial = {
      tareas: [],
      materialesConstantes: [],
      etapa: "Planificación",
      presentacionesEspacio: []
    };
    
    await supabase
      .from('Proyectos')
      .update({ Datos: JSON.stringify(datosInicial) })
      .eq('id', project.id);
    
    console.log(`✅ Migrado: ${project.name}`);
  }
};
```

---

## 🎨 Componente de UI para Editar `Datos`

### Pestañas sugeridas en el modal de edición:

```
┌─────────────────────────────────────────┐
│  Datos del Proyecto                     │
├─────────────────────────────────────────┤
│ [Etapa] [Materiales] [Presentaciones]   │ ← Tabs
├─────────────────────────────────────────┤
│                                         │
│  Etapa Actual: [Dropdown]              │
│                                         │
│  Materiales Constantes:                │
│  ┌───────────────────────────────────┐ │
│  │ + Grifería Hansgrohe        [X]   │ │
│  │ + Zócalo MDF Blanco         [X]   │ │
│  │ [+ Agregar Material]              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Presentaciones por Espacio:           │
│  ┌───────────────────────────────────┐ │
│  │ CocinaC2: [URL]             [X]   │ │
│  │ Sala: [URL]                 [X]   │ │
│  │ [+ Agregar Presentación]          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Cancelar]            [Guardar]       │
└─────────────────────────────────────────┘
```

---

## ✅ Ventajas de esta Estructura

1. **Flexible**: Fácil agregar nuevos campos sin cambiar schema de DB
2. **Escalable**: Cada proyecto puede tener diferentes materiales
3. **Versionable**: Se puede guardar historial de cambios
4. **Portable**: JSON es universal
5. **Queryable**: Se pueden hacer búsquedas con operadores JSON en Supabase

---

## 🔍 Queries Avanzadas en Supabase

```javascript
// Buscar proyectos en etapa específica
const { data } = await supabase
  .from('Proyectos')
  .select('*')
  .filter('Datos->etapa', 'eq', 'En Diseño');

// Buscar proyectos con material específico
const { data } = await supabase
  .from('Proyectos')
  .select('*')
  .contains('Datos->materialesConstantes', [{ materialId: 'mat-001' }]);
```

---

## 📝 Validación con Zod (Opcional)

```typescript
import { z } from 'zod';

const MaterialConstanteSchema = z.object({
  categoria: z.string(),
  materialId: z.string(),
  nombre: z.string(),
  observaciones: z.string().optional()
});

const PresentacionEspacioSchema = z.object({
  espacio: z.string(),
  link: z.string().url(),
  fechaActualizacion: z.string().optional()
});

const DatosProyectoSchema = z.object({
  tareas: z.array(z.string()),
  materialesConstantes: z.array(MaterialConstanteSchema),
  etapa: z.enum([
    "Planificación",
    "En Diseño",
    "Construcción",
    "Finalización",
    "Completado"
  ]),
  presentacionesEspacio: z.array(PresentacionEspacioSchema)
});

// Uso
const validarDatos = (datos) => {
  try {
    return DatosProyectoSchema.parse(datos);
  } catch (error) {
    console.error("Datos inválidos:", error);
    return null;
  }
};
```

---

## 🚀 Próximos Pasos

1. ✅ Crear campo `Datos` en tabla `Proyectos` (tipo TEXT o JSONB)
2. ⬜ Implementar componente de edición de `Datos`
3. ⬜ Migrar proyectos existentes con estructura inicial
4. ⬜ Remover checklist de espacios del UI
5. ⬜ Integrar con selector de materiales
6. ⬜ Agregar vista de presentaciones por espacio

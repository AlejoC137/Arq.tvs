# Quick Start - Campo Datos en Proyectos

## ⚡ Implementación en 3 Pasos

### 1️⃣ Crear la Columna en Supabase

Ir a **Supabase → SQL Editor** y ejecutar:

```sql
ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "Datos" TEXT;
```

### 2️⃣ Ejecutar la Migración

Iniciar la app y navegar a: **`http://localhost:3000/migracion-datos`**

1. Click en **"Verificar Estado"**
2. Click en **"Ejecutar Migración"**
3. ✅ Listo!

### 3️⃣ Usar el Editor

1. Ir a **Proyectos** → Configurar proyecto ⚙️
2. Click en **"Configurar Datos del Proyecto"**
3. Editar en las 3 pestañas:
   - **Etapa**: Planificación, En Diseño, Construcción, etc.
   - **Materiales Constantes**: Griferias, Zocalos, Pisos, etc.
   - **Presentaciones**: Links a PPTs por espacio
4. **Guardar Cambios**

---

## 📦 ¿Qué se Eliminó?

- ❌ Checklist de espacios en configuración de proyectos
- ❌ Campo `espacios` (array) en el formulario

## 📦 ¿Qué se Agregó?

- ✅ Campo `Datos` (JSON) en tabla Proyectos
- ✅ Editor de datos con 3 pestañas
- ✅ 20 categorías de materiales
- ✅ Filtrado de espacios por casa
- ✅ Herramienta de migración

---

## 📚 Documentación Completa

- **Esquema JSON**: `docs/ESQUEMA_DATOS_PROYECTO.md`
- **Guía completa**: `docs/IMPLEMENTACION_DATOS_PROYECTO.md`

---

## 🔧 Archivos Principales

```
src/
├── constants/
│   └── datosProyecto.js         # Constantes y helpers
├── components/
│   ├── DatosProyectoEditor.jsx  # Editor modal
│   ├── PreModalProjectsConfig.jsx # (modificado)
│   └── MigracionDatosProyectos.jsx # Herramienta migración
└── scripts/
    └── migrateProjectsDatos.js  # Script migración
```

---

## 🎯 Estructura del JSON

```json
{
  "tareas": [],
  "materialesConstantes": [
    {
      "categoria": "Griferias",
      "materialId": "uuid",
      "nombre": "Grifería X",
      "observaciones": "Para baños"
    }
  ],
  "etapa": "En Diseño",
  "presentacionesEspacio": [
    {
      "espacio": "CocinaC2",
      "link": "https://...",
      "fechaActualizacion": "2025-01-10"
    }
  ]
}
```

---

**¿Problemas?** Ver `docs/IMPLEMENTACION_DATOS_PROYECTO.md` sección "Troubleshooting"

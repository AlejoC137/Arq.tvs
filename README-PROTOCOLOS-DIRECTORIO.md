# 📚 Protocolos y Directorio - Sistema CRUD Completo

Sistema completo de gestión para **Protocolos** y **Directorio** con soporte para Markdown, edición en línea y exportación a PDF.

## ✨ Características Implementadas

### 🔷 Protocolos
- ✅ **CRUD completo**: Crear, Ver, Editar, Eliminar
- ✅ **Soporte Markdown**: Escribe y visualiza en formato MD
- ✅ **Exportación PDF**: Descarga cualquier protocolo como PDF
- ✅ **Búsqueda en tiempo real**
- ✅ **Agrupación por categoría**
- ✅ **Almacenamiento local**: Los datos persisten en localStorage
- ✅ **Editor Markdown integrado**
- ✅ **Vista previa en tiempo real**

### 👥 Directorio
- ✅ **CRUD completo**: Crear, Ver, Editar, Eliminar contactos
- ✅ **Exportación PDF individual**: Un contacto
- ✅ **Exportación PDF completa**: Todo el directorio en tabla
- ✅ **Búsqueda avanzada**
- ✅ **Agrupación por área**
- ✅ **Enlaces directos**: Email y teléfono clickeables
- ✅ **Tarjetas interactivas**: Hover para ver acciones

## 🚀 Cómo Usar

### Protocolos

#### Crear un Nuevo Protocolo
1. Navega a **Protocolos** en el menú lateral
2. Click en **"Nuevo Protocolo"**
3. Completa el formulario:
   - **Nombre**: Título del protocolo
   - **Categoría**: Selecciona (INTERNO ARQ, INTERNO OBRA, etc.)
   - **Descripción**: Breve resumen
   - **Contenido**: Escribe en Markdown
4. Click en **"Guardar"**

#### Ver un Protocolo
1. Click en el ícono **👁️ (Ver)** de cualquier protocolo
2. Se mostrará el contenido renderizado en Markdown
3. Desde aquí puedes:
   - **Exportar a PDF**
   - **Editar** el contenido

#### Editar un Protocolo
1. Click en el ícono **✏️ (Editar)**
2. Modifica el contenido en Markdown
3. Click en **"Guardar"**

#### Eliminar un Protocolo
1. Click en el ícono **🗑️ (Eliminar)**
2. Confirma la eliminación

#### Exportar a PDF
- **Individual**: Click en el ícono **📥 (Exportar)** de cada protocolo
- **Desde vista**: Al ver un protocolo, click en "Exportar PDF"

### Directorio

#### Agregar un Nuevo Contacto
1. Navega a **Directorio** en el menú lateral
2. Click en **"Nuevo Contacto"**
3. Completa el formulario:
   - **Nombre**: Nombre completo *
   - **Cargo**: Posición en la empresa
   - **Empresa**: Nombre de la organización
   - **Email**: Correo electrónico *
   - **Teléfono**: Número de contacto
   - **Área**: Categoría (Diseño, Gestión, etc.)
   - **Ubicación**: Ciudad, País
4. Click en **"Guardar"**

*Campos obligatorios

#### Ver Contacto Completo
1. Click en el ícono **👁️ (Ver)** sobre la tarjeta del contacto
2. Se muestra toda la información detallada
3. Desde aquí puedes:
   - **Exportar a PDF**
   - **Editar** información

#### Editar un Contacto
1. Hover sobre la tarjeta del contacto
2. Click en el ícono **✏️ (Editar)**
3. Modifica la información
4. Click en **"Guardar"**

#### Eliminar un Contacto
1. Hover sobre la tarjeta
2. Click en el ícono **🗑️ (Eliminar)**
3. Confirma la eliminación

#### Exportar a PDF
- **Individual**: Click en **📥** sobre cualquier contacto
- **Todo el directorio**: Click en **"Exportar Todo"** en la parte superior

## 📝 Sintaxis Markdown (Protocolos)

El editor de protocolos soporta Markdown completo:

```markdown
# Título Principal (H1)
## Subtítulo (H2)
### Sección (H3)

**Texto en negrita**
*Texto en cursiva*
~~Texto tachado~~

- Lista sin orden
- Otro item
  - Sub-item

1. Lista ordenada
2. Segundo item
3. Tercer item

> Cita o nota importante

`código inline`

\```javascript
// Bloque de código
function ejemplo() {
  console.log("Hola");
}
\```

[Enlace](https://ejemplo.com)

---

- [ ] Checkbox sin marcar
- [x] Checkbox marcado
```

## 🔄 Convertir Archivos DOCX Existentes

Si tienes archivos `.docx` y quieres convertirlos a Markdown:

### Opción 1: Automática con Pandoc

1. **Instala Pandoc**: https://pandoc.org/installing.html

2. **Ejecuta el script de conversión**:
   ```powershell
   cd "C:\Users\VANESSA\Documents\GitHub\Arq.tvs\src\assets\Protocolos"
   .\convert-all.ps1
   ```

3. Revisa los archivos `.md` generados

### Opción 2: Online
- Visita: https://word2md.com/
- Sube tu archivo `.docx`
- Copia el resultado y pégalo en un nuevo protocolo

### Opción 3: Manual
1. Crea un nuevo protocolo desde la interfaz
2. Copia el contenido del Word
3. Formatea usando la sintaxis Markdown

**Ver guía completa**: `CONVERSION-GUIA.md`

## 💾 Almacenamiento de Datos

### Actual: LocalStorage
Los datos se guardan en el navegador (localStorage):
- **Protocolos**: `localStorage.getItem('protocolos')`
- **Directorio**: `localStorage.getItem('directorio')`

**Ventajas:**
- ✅ Funciona offline
- ✅ Sin necesidad de backend
- ✅ Rápido y simple

**Desventajas:**
- ⚠️ Los datos son por navegador/dispositivo
- ⚠️ Si limpias el navegador, pierdes los datos
- ⚠️ No hay sincronización entre usuarios

### Futuro: Supabase (Recomendado)

Para un sistema más robusto, se puede migrar a Supabase:

```sql
-- Tabla de Protocolos
CREATE TABLE protocolos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT NOT NULL,
  fecha_actualizacion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Directorio
CREATE TABLE contactos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  email TEXT NOT NULL,
  telefono TEXT,
  area TEXT,
  ubicacion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📂 Estructura de Archivos

```
src/
├── components/
│   ├── ProtocolosCRUD.jsx    ✨ Gestión completa de protocolos
│   ├── DirectorioCRUD.jsx    ✨ Gestión completa de directorio
│   ├── Protocolos.jsx         (versión anterior - opcional)
│   └── Directorio.jsx         (versión anterior - opcional)
├── assets/
│   ├── Protocolos/
│   │   ├── *.docx             Archivos originales
│   │   ├── *.md               Archivos Markdown convertidos
│   │   ├── protocolos.json    Índice (opcional)
│   │   └── convert-all.ps1    ✨ Script de conversión
│   ├── Directorio/
│   │   ├── directorio.json    Datos estructurados
│   │   └── directorio.docx    Archivo original
│   └── README.md              Guía de gestión
├── config/
│   └── navigationConfig.js    Configuración de rutas
└── index.css                  ✨ Estilos Markdown agregados
```

## 🎨 Personalización

### Cambiar Categorías de Protocolos

Edita `ProtocolosCRUD.jsx`, líneas 410-419:

```javascript
<select value={formData.categoria} ...>
  <option value="INTERNO ARQ">INTERNO ARQ</option>
  <option value="INTERNO OBRA">INTERNO OBRA</option>
  <option value="PROVEEDORES">PROVEEDORES</option>
  <option value="CLIENTES">CLIENTES</option>
  <option value="TU_CATEGORIA">TU CATEGORIA</option>  // Agregar aquí
</select>
```

### Cambiar Áreas del Directorio

Edita `DirectorioCRUD.jsx`, líneas 514-526:

```javascript
<select value={formData.area} ...>
  <option value="Diseño">Diseño</option>
  <option value="Gestión">Gestión</option>
  <option value="Consultoría Externa">Consultoría Externa</option>
  <option value="Proveedores">Proveedores</option>
  <option value="Construcción">Construcción</option>
  <option value="Tu Área">Tu Área</option>  // Agregar aquí
</select>
```

### Modificar Estilos de Markdown

Edita `src/index.css` a partir de la línea 61:

```css
.prose h1 {
  @apply text-3xl font-bold ...;
}
/* Personaliza según necesites */
```

## 🐛 Solución de Problemas

### Los datos se perdieron al recargar
- **Causa**: Se limpió el localStorage del navegador
- **Solución**: Hacer backups periódicos o migrar a Supabase

### El Markdown no se renderiza bien
- **Causa**: Sintaxis incorrecta
- **Solución**: Revisa la sintaxis en la guía de Markdown

### El PDF se ve mal
- **Causa**: Contenido muy largo o caracteres especiales
- **Solución**: Simplifica el contenido o ajusta el tamaño de fuente

### No puedo exportar a PDF
- **Causa**: Error en jsPDF
- **Solución**: Revisa la consola del navegador (F12)

## 📦 Dependencias Instaladas

```json
{
  "react-markdown": "^9.0.0",      // Renderizado de Markdown
  "remark-gfm": "^4.0.0",          // GitHub Flavored Markdown
  "jspdf": "^2.5.0",               // Generación de PDFs
  "jspdf-autotable": "^3.8.0",     // Tablas en PDFs
  "react-dropzone": "^14.0.0"      // Para futuros uploads
}
```

## 🚀 Próximas Mejoras

- [ ] Integración con Supabase para persistencia real
- [ ] Upload de archivos directamente
- [ ] Versionado de protocolos
- [ ] Comentarios y colaboración
- [ ] Exportación a Word
- [ ] Plantillas predefinidas
- [ ] Búsqueda de contenido dentro de protocolos
- [ ] Tags y etiquetas personalizadas

## 📞 Soporte

Para dudas o problemas:
1. Revisa esta documentación
2. Consulta `CONVERSION-GUIA.md` para temas de Markdown
3. Revisa la consola del navegador (F12) para errores técnicos

---

**¡El sistema está listo para usar!** 🎉

Comienza creando tu primer protocolo o contacto desde la interfaz.

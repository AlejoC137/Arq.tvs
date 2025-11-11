# 📁 Gestión de Archivos Estáticos

Este directorio contiene archivos estáticos utilizados en la aplicación ARQ.TVS.

## 📂 Estructura

```
assets/
├── Protocolos/         # Documentos de protocolos y procedimientos
│   ├── protocolos.json # Índice de protocolos
│   └── *.docx          # Archivos de protocolo
├── Directorio/         # Información de contactos
│   ├── directorio.json # Lista de contactos
│   └── directorio.docx # Archivo Word del directorio
└── README.md           # Esta guía
```

## 🔧 Protocolos

### Archivos actuales
Los archivos `.docx` se pueden descargar desde la interfaz de la aplicación.

### Gestión de Protocolos

Para **agregar un nuevo protocolo**:

1. Guarda el archivo `.docx` en la carpeta `Protocolos/`
2. Edita el archivo `protocolos.json` y agrega una nueva entrada:

```json
{
  "id": 6,
  "nombre": "Nombre del protocolo",
  "categoria": "CATEGORIA",
  "archivo": "nombre-del-archivo.docx",
  "descripcion": "Descripción breve",
  "fechaActualizacion": "DD/MM/YYYY"
}
```

3. Actualiza el componente `Protocolos.jsx` si usas datos hardcodeados, o modifica para leer desde el JSON.

### Categorías disponibles
- `INTERNO ARQ` - Procedimientos internos de arquitectura
- `INTERNO OBRA` - Procedimientos de obra
- `PROVEEDORES` - Documentos para proveedores
- `CLIENTES` - Documentos para clientes

## 👥 Directorio

### Gestión de Contactos

Para **agregar un nuevo contacto**:

1. Edita el archivo `directorio.json` y agrega una nueva entrada:

```json
{
  "id": 6,
  "nombre": "Nombre Completo",
  "cargo": "Cargo",
  "empresa": "Nombre de la Empresa",
  "email": "email@ejemplo.com",
  "telefono": "+57 XXX XXX XXXX",
  "area": "Área",
  "ubicacion": "Ciudad, País"
}
```

2. Las áreas disponibles incluyen:
   - `Diseño` - Equipo de diseño
   - `Gestión` - Coordinación y gestión
   - `Consultoría Externa` - Consultores y asesores
   - `Proveedores` - Proveedores de materiales
   - `Construcción` - Contratistas y constructores

## 🔄 Mejoras Futuras

### Opción 1: Usar archivos JSON dinámicamente

Modificar los componentes para cargar los archivos JSON:

```javascript
// En Protocolos.jsx
useEffect(() => {
  fetch('/src/assets/Protocolos/protocolos.json')
    .then(res => res.json())
    .then(data => setProtocolos(data));
}, []);
```

### Opción 2: Convertir a Markdown

Los archivos `.docx` se pueden convertir a `.md` (Markdown) para:
- Visualizarlos directamente en la app
- Facilitar el control de versiones con Git
- Mejorar la búsqueda de contenido

**Herramientas recomendadas:**
- [Pandoc](https://pandoc.org/) - Conversor universal de documentos
- [Word to Markdown](https://word2md.com/) - Conversor online

### Opción 3: Integrar con Supabase

Para una gestión más robusta, considera crear tablas en Supabase:

```sql
-- Tabla de Protocolos
CREATE TABLE protocolos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  archivo_url TEXT,
  descripcion TEXT,
  fecha_actualizacion DATE
);

-- Tabla de Directorio
CREATE TABLE contactos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  email TEXT,
  telefono TEXT,
  area TEXT,
  ubicacion TEXT
);
```

## 📝 Notas

- Los archivos DOCX no se pueden visualizar directamente en el navegador
- Se recomienda usar formatos más web-friendly como Markdown o HTML
- Mantén los archivos JSON sincronizados con los archivos reales
- Considera implementar un sistema de upload de archivos en el futuro

## 🚀 Próximos Pasos

1. ✅ Implementar carga dinámica desde JSON
2. ⏳ Convertir DOCX a Markdown
3. ⏳ Implementar editor de protocolos
4. ⏳ Integrar con Supabase Storage
5. ⏳ Sistema de versionado de documentos

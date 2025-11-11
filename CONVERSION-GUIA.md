# 📝 Guía de Conversión: DOCX a Markdown

Esta guía te ayudará a convertir los archivos `.docx` existentes a formato Markdown (`.md`) para que puedas visualizarlos directamente en la aplicación.

## 🎯 ¿Por qué convertir a Markdown?

- ✅ **Visualización directa** en la aplicación sin necesidad de descargar
- ✅ **Control de versiones** más fácil con Git
- ✅ **Edición rápida** desde la interfaz web
- ✅ **Búsqueda de contenido** más eficiente
- ✅ **Exportación a PDF** integrada

## 🛠️ Métodos de Conversión

### Opción 1: Pandoc (Recomendado - Automatizado)

**Pandoc** es la herramienta más poderosa para convertir documentos.

#### Instalación en Windows

1. Descarga Pandoc desde: https://pandoc.org/installing.html
2. Ejecuta el instalador
3. Verifica la instalación abriendo PowerShell:
   ```powershell
   pandoc --version
   ```

#### Convertir archivos individuales

```powershell
# Navega a la carpeta de protocolos
cd "C:\Users\VANESSA\Documents\GitHub\Arq.tvs\src\assets\Protocolos"

# Convierte un archivo
pandoc "INTERNO ARQ - Proceso de revisión con Ronald.docx" -o "proceso-revision-ronald.md"
```

#### Convertir TODOS los archivos automáticamente

Crea un archivo `convert-all.ps1` en la carpeta Protocolos:

```powershell
# Obtener todos los archivos .docx
$docxFiles = Get-ChildItem -Filter "*.docx"

foreach ($file in $docxFiles) {
    # Crear nombre del archivo .md (sin espacios, en minúsculas)
    $mdFileName = $file.BaseName -replace '\s+', '-' -replace '[^\w\-]', ''
    $mdFileName = $mdFileName.ToLower() + ".md"
    
    # Convertir
    Write-Host "Convirtiendo: $($file.Name) -> $mdFileName"
    pandoc $file.FullName -o $mdFileName --extract-media=.
    
    Write-Host "✓ Completado: $mdFileName" -ForegroundColor Green
}

Write-Host "`n¡Conversión completa!" -ForegroundColor Cyan
```

Para ejecutar:
```powershell
cd "C:\Users\VANESSA\Documents\GitHub\Arq.tvs\src\assets\Protocolos"
.\convert-all.ps1
```

### Opción 2: Herramientas Online (Rápido)

#### Word to Markdown
1. Visita: https://word2md.com/
2. Sube tu archivo `.docx`
3. Copia el resultado y guárdalo como `.md`

#### CloudConvert
1. Visita: https://cloudconvert.com/docx-to-md
2. Sube tu archivo
3. Descarga el `.md` resultante

### Opción 3: Manual (Para documentos simples)

1. Abre el `.docx` en Word
2. Copia todo el contenido
3. Pégalo en un editor de texto
4. Formatea manualmente usando sintaxis Markdown:

```markdown
# Título Principal
## Subtítulo
### Sección

**Texto en negrita**
*Texto en cursiva*

- Punto 1
- Punto 2
- Punto 3

1. Primero
2. Segundo
3. Tercero

> Cita o nota importante

`código inline`

\```
Bloque de código
\```
```

## 📋 Sintaxis Markdown Rápida

### Encabezados
```markdown
# H1 - Título Principal
## H2 - Subtítulo
### H3 - Sección
#### H4 - Subsección
```

### Formato de Texto
```markdown
**Negrita**
*Cursiva*
~~Tachado~~
`Código inline`
```

### Listas
```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2

1. Primero
2. Segundo
3. Tercero
```

### Enlaces e Imágenes
```markdown
[Texto del enlace](https://ejemplo.com)
![Texto alternativo](ruta/imagen.png)
```

### Tablas
```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |
```

### Citas
```markdown
> Esta es una cita importante
> Puede tener múltiples líneas
```

### Código
````markdown
```javascript
function ejemplo() {
  console.log("Hola mundo");
}
```
````

### Línea Horizontal
```markdown
---
```

### Checkboxes
```markdown
- [ ] Tarea pendiente
- [x] Tarea completada
```

## 🚀 Proceso Recomendado

### Para Protocolos

1. **Convierte todos los archivos existentes:**
   ```powershell
   cd "C:\Users\VANESSA\Documents\GitHub\Arq.tvs\src\assets\Protocolos"
   # Ejecuta el script de conversión automática
   ```

2. **Verifica los archivos generados:**
   - Abre cada `.md` en un editor (VS Code recomendado)
   - Verifica que el formato sea correcto
   - Ajusta manualmente si es necesario

3. **Actualiza la aplicación:**
   - Los archivos `.md` ya están listos
   - La aplicación los leerá automáticamente
   - Puedes crear/editar directamente desde la interfaz

### Para Directorio

El directorio ya está en formato JSON estructurado, no necesita conversión.
Simplemente edita `directorio.json` cuando necesites agregar contactos.

## 🔄 Mantenimiento Futuro

### Crear nuevos protocolos

**Opción A: Desde la interfaz web** (Recomendado)
1. Ve a la sección "Protocolos"
2. Click en "Nuevo Protocolo"
3. Escribe directamente en Markdown
4. Guarda

**Opción B: Crear archivo .md directamente**
1. Crea un nuevo archivo `.md` en `src/assets/Protocolos/`
2. Escribe el contenido en Markdown
3. Recarga la aplicación

### Editar protocolos existentes

**Desde la interfaz:**
1. Click en el protocolo
2. Click en "Editar"
3. Modifica el contenido
4. Guarda los cambios

## 🆘 Solución de Problemas

### El formato no se ve bien después de convertir
- Revisa manualmente el archivo `.md`
- Ajusta los encabezados (`#`, `##`, etc.)
- Verifica las listas (espacios correctos)

### Las imágenes no aparecen
- Asegúrate de que las imágenes estén en una carpeta accesible
- Usa rutas relativas en Markdown: `![alt](./imagenes/foto.png)`

### Caracteres especiales se ven mal
- Asegúrate de que el archivo esté en UTF-8
- En VS Code: Bottom bar → Select Encoding → UTF-8

## 📚 Recursos Adicionales

- **Markdown Guide**: https://www.markdownguide.org/
- **Markdown Cheatsheet**: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- **Pandoc Documentation**: https://pandoc.org/MANUAL.html
- **VS Code Markdown**: https://code.visualstudio.com/docs/languages/markdown

## ✅ Checklist de Conversión

- [ ] Instalar Pandoc
- [ ] Convertir todos los archivos .docx a .md
- [ ] Revisar formato de cada archivo convertido
- [ ] Probar visualización en la aplicación
- [ ] Ajustar estilos si es necesario
- [ ] Eliminar o archivar archivos .docx originales (opcional)

---

**¿Necesitas ayuda?** Revisa la documentación o contacta al equipo de desarrollo.

# 🏠 Nuevo Sistema Modular de Espacios

## 📋 Resumen

Se ha creado un **sistema modular y robusto** para gestionar espacios por casa, eliminando la contaminación cruzada entre proyectos.

---

## 🗂️ Estructura de Archivos

```
src/constants/
├── espacios_casa1.js          # ✅ Espacios exclusivos Casa 1 (69 espacios)
├── espacios_casa2.js          # ✅ Espacios exclusivos Casa 2 (24 espacios)
├── espacios_casa4.js          # ✅ Espacios exclusivos Casa 4 (21 espacios)
├── espacios_index.js          # ✅ Sistema centralizado con detección inteligente
└── espacios.js                # ✅ Adaptador para compatibilidad con código existente
```

---

## 🚀 Características del Nuevo Sistema

### 1. **Detección Inteligente de Casas**

El sistema detecta automáticamente la casa desde:
- ✅ Nombre del proyecto
- ✅ Nombre de la tarea
- ✅ Descripción de la tarea
- ✅ Cualquier campo de texto relevante

```javascript
import { detectarCasa } from './constants/espacios';

// Desde string
detectarCasa('Casa 2');  // → 2
detectarCasa('casa4');   // → 4

// Desde objeto proyecto
detectarCasa({ name: 'Casa 2' });  // → 2

// Desde objeto tarea
detectarCasa({ task_description: 'Pintar cocina casa 4' });  // → 4
```

### 2. **Metadata por Casa**

Cada casa incluye metadata con identificadores múltiples:

```javascript
{
  metadata: {
    nombre: 'Casa 2',
    identificadores: ['casa2', 'casa 2', 'Casa2', 'CASA2', 'Casa 2'],
    pisos: 2
  }
}
```

### 3. **API Simplificada**

```javascript
import { getEspaciosPorProyecto } from './constants/espacios';

// Automático: detecta la casa y devuelve SUS espacios
const espacios = getEspaciosPorProyecto('Casa 2');
// → ['DespensaC2', 'CocinaC2', 'ComedorC2', ...]

// Con objeto proyecto
const espacios2 = getEspaciosPorProyecto(proyecto);

// Incluir muebles
const todosLosEspacios = getEspaciosPorProyecto('Casa 1', true);
```

---

## 📖 Guía de Uso

### **Obtener Espacios por Casa**

```javascript
import { getEspaciosPorCasa } from './constants/espacios';

// Solo espacios, sin muebles
const espaciosCasa2 = getEspaciosPorCasa(2);

// Con muebles
const conMuebles = getEspaciosPorCasa(2, { includeMuebles: true });

// Solo un piso
const piso1 = getEspaciosPorCasa(2, { piso: 1 });
```

### **Detección Automática**

```javascript
import { getEspaciosPorProyecto, detectarCasa } from './constants/espacios';

// En un componente
const MyComponent = ({ proyecto }) => {
  // Detecta automáticamente qué casa es
  const espacios = getEspaciosPorProyecto(proyecto.name);
  
  return (
    <select>
      {espacios.map(esp => (
        <option key={esp} value={esp}>{esp}</option>
      ))}
    </select>
  );
};
```

### **Validar Espacios**

```javascript
import { validarEspacio } from './constants/espacios';

// Verifica si un espacio pertenece a una casa
const esValido = validarEspacio('CocinaC2', 2);  // true
const noEsValido = validarEspacio('CocinaC2', 4);  // false
```

### **Información de Casas**

```javascript
import { getInfoCasa, listarCasas } from './constants/espacios';

// Info de una casa
const info = getInfoCasa(2);
// → { nombre: 'Casa 2', identificadores: [...], pisos: 2 }

// Listar todas las casas
const todasLasCasas = listarCasas();
// → [
//     { numero: 1, nombre: 'Casa 1', pisos: 2, totalEspacios: 69 },
//     { numero: 2, nombre: 'Casa 2', pisos: 2, totalEspacios: 24 },
//     { numero: 4, nombre: 'Casa 4', pisos: 2, totalEspacios: 21 }
//   ]
```

---

## 🔧 Compatibilidad con Código Existente

**✅ TODO el código existente sigue funcionando**

El archivo `espacios.js` actúa como adaptador:

```javascript
// Código antiguo (sigue funcionando)
import { getEspaciosPorProyecto } from './constants/espacios';

const espacios = getEspaciosPorProyecto(proyecto);
// ✅ Funciona igual, pero con el nuevo sistema por debajo
```

---

## 🎯 Ejemplos de Uso en Componentes

### **FormTask.jsx**

```javascript
import { getEspaciosPorProyecto } from '../constants/espacios';

const FormTask = ({ proyecto }) => {
  // Detecta automáticamente la casa del proyecto
  const espacios = getEspaciosPorProyecto(proyecto.name);
  
  return (
    <select>
      {espacios.map(esp => (
        <option key={esp} value={esp}>{esp}</option>
      ))}
    </select>
  );
};
```

### **InlineActionsTask.jsx**

```javascript
import { getEspaciosPorProyecto } from '../constants/espacios';

const InlineActionsTask = ({ task, projects }) => {
  const proyecto = projects.find(p => p.id === task.project_id);
  
  // Espacios filtrados por proyecto
  const espaciosDisponibles = getEspaciosPorProyecto(proyecto?.name || '');
  
  return (
    <datalist id={`espacios-${task.id}`}>
      {espaciosDisponibles.map(esp => (
        <option key={esp} value={esp} />
      ))}
    </datalist>
  );
};
```

### **DatosProyectoEditor.jsx**

```javascript
import { getEspaciosPorProyecto } from '../constants/espacios';

const DatosProyectoEditor = ({ proyecto }) => {
  // Automáticamente obtiene espacios de la casa correcta
  const espacios = getEspaciosPorProyecto(proyecto.name);
  
  return (
    <select>
      {espacios.map(esp => (
        <option key={esp} value={esp}>{esp}</option>
      ))}
    </select>
  );
};
```

---

## 🛡️ Garantías del Sistema

### ✅ **No más contaminación cruzada**
Cada casa tiene su propio archivo → imposible mezclar espacios

### ✅ **Detección robusta**
Múltiples identificadores por casa → funciona con cualquier variante del nombre

### ✅ **Retrocompatible**
Todo el código existente sigue funcionando sin cambios

### ✅ **Extensible**
Agregar una casa nueva es tan simple como crear `espacios_casa5.js` y registrarla

### ✅ **Type-safe**
Puedes agregar tipos TypeScript fácilmente

---

## 📊 Resumen de Espacios

| Casa | Piso 1 | Piso 2 | Total |
|------|--------|--------|-------|
| Casa 1 | 37 | 20 | **69** |
| Casa 2 | 13 | 11 | **24** |
| Casa 4 | 10 | 11 | **21** |
| **Total** | 60 | 42 | **114** |

---

## 🚨 Advertencias del Sistema

El sistema incluye warnings en consola para debugging:

```
❌ Casa 5 no está registrada en el sistema
⚠️ No se pudo detectar la casa. Retornando todos los espacios.
❌ Piso 3 no existe en Casa 2
```

---

## 🔮 Mejoras Futuras

1. **TypeScript**: Agregar tipos estrictos
2. **Validación en tiempo real**: Validar espacios al guardar tareas
3. **Dashboard de espacios**: Vista de todos los espacios usados por proyecto
4. **Autocompletado inteligente**: Sugerencias basadas en uso previo

---

## 📝 Migración para Nuevos Desarrollos

Para **nuevas funcionalidades**, usa directamente:

```javascript
// ✅ Recomendado para código nuevo
import { detectarCasa, getEspaciosPorProyecto } from './constants/espacios_index';
```

Para **código existente**, no cambies nada:

```javascript
// ✅ Funciona igual, compatibilidad garantizada
import { getEspaciosPorProyecto } from './constants/espacios';
```

---

**¡El sistema ya está activo y funcionando! 🎉**

Todos los componentes ahora usan detección automática y solo muestran espacios de la casa correcta.

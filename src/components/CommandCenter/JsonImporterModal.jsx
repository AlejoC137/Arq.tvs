import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, AlertTriangle, Upload, FileJson, Database, User, Briefcase } from 'lucide-react';
import supabase from '../../config/supabaseClient';
import { getStaffers } from '../../services/spacesService';
import { getProjects } from '../../services/tasksService';

const ENTITY_CONFIG = {
    tasks: {
        label: 'Jerarquía Tarea + Acciones',
        table: 'Tareas',
        prompt: `Actúa como un experto DBA. Tu objetivo es organizar información desestructurada (ej: de Excel) en una jerarquía de Tarea Principal y sus Acciones/Actividades asociadas.

ESTRUCTURA DE SALIDA (JSON):
{
  "task": {
    "task_description": "Título de la tarea principal",
    "status": "Pendiente",
    "Priority": "Media",
    "fecha_inicio": "YYYY-MM-DD",
    "fecha_fin_estimada": "YYYY-MM-DD"
  },
  "actions": [
    {
       "descripcion": "Descripción de la actividad 1",
       "completado": false
    },
    ...
  ]
}

REGLAS:
1. Identifica una sola Tarea Principal que englobe a las demás.
2. Todas las demás líneas deben ser objetos dentro del array 'actions'.
3. La 'task' debe tener Priority (Baja, Media, Alta, Urgente) y status.
4. Las 'actions' NO tienen Priority ni status, solo tienen 'descripcion' y 'completado' (boolean true/false).
5. Si el input tiene fechas, colócalas en la 'task'.
6. No incluyes UUIDs.
7. El output debe ser ÚNICAMENTE el objeto JSON.`
    },
    materials: {
        label: 'Materiales',
        table: 'Materiales',
        prompt: `Actúa como un experto DBA. Convierte la lista de materiales a un JSON Array para la tabla 'Materiales'.

COLUMNAS Y TIPOS:
- Nombre (text, requerido): Nombre del material.
- categoria (text): Categoría (ej: Grifería, Madera, Drywall).
- tipo (text): Tipo o especificación técnica.
- precio_COP (numeric): Precio unitario en pesos colombianos.
- stock (numeric): Cantidad disponible en inventario.
- unidad (text): Unidad de medida (und, m2, ml, kg).
- proveedor (text): Nombre del proveedor.
- alto_mm, ancho_mm, espesor_mm (numeric): Dimensiones técnicas en milímetros.
- largo_m (numeric): Largo en metros.
- acabado (text): Tipo de acabado superficial.
- observaciones_tecnicas (text): Notas de uso o técnicas.
- notas (text): Comentarios adicionales.

REGLAS CRÍTICAS:
1. Los campos numéricos (precio, stock, dimensiones) deben ser números puros, sin símbolos de moneda ni letras.
2. No inventes IDs.
3. El output debe ser ÚNICAMENTE el JSON Array.`
    },
    staff: {
        label: 'Equipo (Staff)',
        table: 'Staff',
        prompt: `Actúa como DBA. Convierte los datos de personal a un JSON Array para la tabla 'Staff'.

COLUMNAS Y TIPOS:
- name (text, requerido): Nombre completo.
- role_description (text): Cargo o descripción de funciones.
- email (text): Correo electrónico.
- telefono (text): Número de contacto.

REGLAS:
1. Asegúrate de limpiar los nombres y roles.
2. Output: JSON Array puro.`
    },
    projects: {
        label: 'Proyectos',
        table: 'Proyectos',
        prompt: `Actúa como DBA. Genera un JSON Array para la tabla 'Proyectos'.

COLUMNAS:
- name (text, requerido): Nombre del proyecto/obra.
- responsable (uuid, opcional): ID del arquitecto responsable.
- status (uuid, opcional): ID del estado del proyecto.
- espacios (text): Descripción o lista de espacios.
- Datos (text): Configuración adicional en formato texto o JSON stringified.

REGLAS:
1. Los campos marcados como UUID deben ser null si no se conoce el ID exacto.
2. Output: JSON Array puro.`
    },
    protocols: {
        label: 'Protocolos',
        table: 'Protocolos',
        prompt: `Actúa como DBA. Genera un JSON Array para la tabla 'Protocolos'.

COLUMNAS:
- Nombre (text, requerido): Título del protocolo.
- Contenido (text): Cuerpo del protocolo en formato Markdown.
- Categoria (text): Categoría del protocolo.
- Editor (text): Nombre de quien redactó o editó.
- FechaUpdate (text): Fecha de última actualización.

REGLAS:
1. Asegura que el campo 'Contenido' escape correctamente saltos de línea y caracteres de Markdown para ser un string JSON válido.
2. Output: JSON Array puro.`
    }
};

const JsonImporterModal = ({ isOpen, onClose }) => {
    const [entity, setEntity] = useState('tasks');
    const [jsonInput, setJsonInput] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, parsing, uploading, success, error
    const [copyFeedback, setCopyFeedback] = useState(false);

    // Default Values State
    const [staffList, setStaffList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [defaultStaff, setDefaultStaff] = useState('');
    const [defaultProject, setDefaultProject] = useState('');

    useEffect(() => {
        getStaffers().then(setStaffList).catch(console.error);
        getProjects().then(setProjectList).catch(console.error);
    }, []);

    if (!isOpen) return null;

    const handleCopyPrompt = () => {
        const text = ENTITY_CONFIG[entity].prompt;
        navigator.clipboard.writeText(text);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const handleJsonChange = (e) => {
        const text = e.target.value;
        setJsonInput(text);
        setError(null);
        setParsedData(null);

        if (!text.trim()) return;

        try {
            const parsed = JSON.parse(text);
            // Support both Array (Simple) and Object (Hierarchy)
            const isHierarchy = !Array.isArray(parsed) && parsed.task && Array.isArray(parsed.actions);
            const isArray = Array.isArray(parsed);

            if (!isArray && !isHierarchy) {
                throw new Error('El JSON debe ser un Array [...] o un objeto { "task": {...}, "actions": [...] }');
            }
            setParsedData(parsed);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpload = async () => {
        if (!parsedData) return;

        setStatus('uploading');
        const tableName = ENTITY_CONFIG[entity].table;

        try {
            const isHierarchy = !Array.isArray(parsedData) && parsedData.task;

            if (isHierarchy) {
                // Step 1: Insert Task
                const taskPayload = {
                    ...parsedData.task,
                    staff_id: parsedData.task.staff_id || defaultStaff || null,
                    project_id: parsedData.task.project_id || defaultProject || null
                };

                const { data: taskData, error: taskError } = await supabase
                    .from('Tareas')
                    .insert([taskPayload])
                    .select();

                if (taskError) throw taskError;

                const newTaskId = taskData[0].id;

                // Step 2: Insert Actions linked to Task
                if (parsedData.actions && parsedData.actions.length > 0) {
                    const taskDate = parsedData.task.fecha_inicio || new Date().toISOString().split('T')[0];

                    const actionsWithId = parsedData.actions.map(a => {
                        // Clean up non-existent columns and map status to completado if needed
                        const cleanedAction = {
                            tarea_id: newTaskId,
                            descripcion: a.descripcion || 'Sin descripción',
                            completado: a.completado === true || a.status === 'Completado',
                            fecha_ejecucion: a.fecha_ejecucion || taskDate, // Use task date as fallback
                        };
                        return cleanedAction;
                    });

                    const { error: actionsError } = await supabase
                        .from('Acciones')
                        .insert(actionsWithId);

                    if (actionsError) throw actionsError;
                }
            } else {
                // Simple Array Insert - Apply defaults to each record if relevant
                const processedData = parsedData.map(item => {
                    const cleanItem = { ...item };
                    if (entity === 'tasks') {
                        cleanItem.staff_id = cleanItem.staff_id || defaultStaff || null;
                        cleanItem.project_id = cleanItem.project_id || defaultProject || null;
                    } else if (entity === 'projects') {
                        cleanItem.responsable = cleanItem.responsable || defaultStaff || null;
                    } else if (entity === 'protocols') {
                        cleanItem.Editor = cleanItem.Editor || defaultStaff || null;
                    }
                    return cleanItem;
                });

                const { error: uploadError } = await supabase
                    .from(tableName)
                    .insert(processedData);

                if (uploadError) throw uploadError;
            }

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setJsonInput('');
                setParsedData(null);
                alert('Datos importados correctamente.');
                onClose();
            }, 1000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setError('Error en la importación: ' + err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Database size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Importador Universal</h2>
                            <p className="text-xs text-gray-500">Carga masiva de datos asistida por IA</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Section A: Config */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Selecciona Entidad</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500"
                                    value={entity}
                                    onChange={(e) => {
                                        setEntity(e.target.value);
                                        setJsonInput('');
                                        setParsedData(null);
                                        setError(null);
                                    }}
                                >
                                    {Object.entries(ENTITY_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Section B: Defaults */}
                            {(entity === 'tasks' || entity === 'projects') && (
                                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-3">
                                    <label className="block text-xs font-bold text-gray-400 uppercase">Valores por Defecto</label>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-500">Profesional / Responsable</span>
                                        </div>
                                        <select
                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px]"
                                            value={defaultStaff}
                                            onChange={(e) => setDefaultStaff(e.target.value)}
                                        >
                                            <option value="">(No asignar automáticamente)</option>
                                            {staffList.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {entity === 'tasks' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Briefcase size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-500">Proyecto</span>
                                            </div>
                                            <select
                                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px]"
                                                value={defaultProject}
                                                onChange={(e) => setDefaultProject(e.target.value)}
                                            >
                                                <option value="">(No asignar automáticamente)</option>
                                                {projectList.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {entity === 'protocols' && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <User size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-500">Editor Predeterminado</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px]"
                                                placeholder="Nombre del editor..."
                                                value={defaultStaff}
                                                onChange={(e) => setDefaultStaff(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Section C: AI Prompt */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <label className="block text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-2">2. Asistente IA</label>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 leading-relaxed">
                                    Genera el JSON usando este prompt estructurado.
                                </p>
                                <button
                                    onClick={handleCopyPrompt}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 hover:shadow-sm transition-all"
                                >
                                    {copyFeedback ? <CheckCircle size={14} /> : <Copy size={14} />}
                                    {copyFeedback ? '¡Copiado!' : 'Copiar Prompt'}
                                </button>
                            </div>
                        </div>

                        {/* Section C: Input Area */}
                        <div className="md:col-span-2 space-y-2 flex flex-col">
                            <label className="block text-xs font-bold text-gray-500 uppercase">3. Pega el JSON aquí</label>
                            <div className="relative flex-1">
                                <textarea
                                    className={`w-full h-48 md:h-full p-4 rounded-xl border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-zinc-700 focus:ring-blue-500'} font-mono text-xs resize-none bg-gray-50 dark:bg-zinc-900/50 focus:bg-white transition-all`}
                                    placeholder='[{ "campo": "valor" }, ...]'
                                    value={jsonInput}
                                    onChange={handleJsonChange}
                                    spellCheck={false}
                                />
                                <div className="absolute bottom-3 right-3 pointer-events-none">
                                    {parsedData && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold shadow-sm">JSON Válido ({parsedData.length} items)</span>}
                                    {error && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold shadow-sm">Error de Sintaxis</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section D: Preview */}
                    {parsedData && !error && (
                        <div className="space-y-3 animation-fade-in">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h3 className="text-sm font-bold text-gray-700">
                                    Vista Previa {!Array.isArray(parsedData) ? '(Jerarquía)' : `(${parsedData.length} registros)`}
                                </h3>
                            </div>

                            {!Array.isArray(parsedData) ? (
                                <div className="space-y-4">
                                    {/* Task Header Preview */}
                                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                                            <span className="text-[10px] font-bold text-blue-800 uppercase">Tarea Principal</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <p className="text-gray-400 text-[10px]">Descripción</p>
                                                <p className="font-medium text-gray-900">{parsedData.task.task_description}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-gray-400 text-[10px]">Estado</p>
                                                    <p className="font-medium text-gray-900">{parsedData.task.status}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px]">Inicio</p>
                                                    <p className="font-medium text-gray-900">{parsedData.task.fecha_inicio || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Table Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Acciones / Actividades ({parsedData.actions?.length || 0})</span>
                                        </div>
                                        <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                            <table className="w-full text-left text-[10px]">
                                                <thead className="bg-gray-50 text-gray-400 font-bold uppercase">
                                                    <tr>
                                                        <th className="px-3 py-2">Descripción</th>
                                                        <th className="px-3 py-2 text-right">Completado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {(parsedData.actions || []).slice(0, 5).map((action, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-3 py-1.5 text-gray-600">{action.descripcion}</td>
                                                            <td className="px-3 py-1.5 text-right font-medium text-gray-900">
                                                                {action.completado ? 'Sí' : 'No'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                                            <tr>
                                                {Object.keys(parsedData[0] || {}).map(key => (
                                                    <th key={key} className="px-4 py-3">{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {parsedData.slice(0, 3).map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    {Object.values(item).map((val, vIdx) => (
                                                        <td key={vIdx} className="px-4 py-2 border-r border-gray-100 last:border-0 truncate max-w-[200px]">
                                                            {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {Array.isArray(parsedData) && parsedData.length > 3 && (
                                <p className="text-xs text-center text-gray-400 italic">... y {parsedData.length - 3} más</p>
                            )}
                            {!Array.isArray(parsedData) && parsedData.actions?.length > 5 && (
                                <p className="text-xs text-center text-gray-400 italic">... y {parsedData.actions.length - 5} actividades más</p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2">
                            <AlertTriangle size={16} />
                            <span className="font-mono">{error}</span>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!parsedData || !!error || status === 'uploading'}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-2 shadow-sm
                            transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'}
                        `}
                    >
                        {status === 'uploading' ? (
                            <>
                                <span className="animate-spin">⏳</span> Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload size={14} /> Subir a Base de Datos
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JsonImporterModal;

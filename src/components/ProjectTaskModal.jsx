import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import {
  User, Calendar, Tag, Plus, Search, ArrowUp, ArrowDown,
  ChevronDown, ChevronRight, Settings
} from 'lucide-react';

// --- Acciones de Redux ---
import {
  getAllFromTable,
  updateTask,
  addTask,
  deleteTask
} from '../store/actions/actions';

// --- Componentes externos que ya tienes ---
import TaskActions from './TaskActions';
import TaskLog from './TaskLog';
import InlineActionsTask from './InlineActionsTask';
import FormTask from './FormTask';

// --- Constantes y Helpers de Estilo ---
const ESTADOS = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Progreso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
  EN_REVISION: 'En Revisión',
  BLOQUEADO: 'Bloqueado',
  APROBACION_REQUERIDA: 'Aprobación Requerida',
  EN_DISENO: 'En Diseño',
  EN_DISCUSION: 'En Discusión'
};

const getEstadoColor = (estado) => {
  const colors = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'En Progreso': 'bg-blue-100 text-blue-800',
    'Completado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
    'En Revisión': 'bg-purple-100 text-purple-800',
    'Bloqueado': 'bg-gray-400 text-white',
    'Aprobación Requerida': 'bg-orange-100 text-orange-800',
    'En Diseño': 'bg-pink-100 text-pink-800',
    'En Discusión': 'bg-indigo-100 text-indigo-800'
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};

const ProjectTaskModal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- ESTADOS ---
  const [data, setData] = useState([]);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const [projectTasks, setProjectTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stages, setStages] = useState([]);
  const [entregables, setEntregables] = useState([]);
  const [Priorities] = useState([
    { id: "Baja", name: "Baja" },
    { id: "Media-Baja", name: "Media-Baja" },
    { id: "Media", name: "Media" },
    { id: "Media-Alta", name: "Media-Alta" },
    { id: "Alta", name: "Alta" },
  ]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'Priority', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');

  // --- ACCIONES CRUD (helpers) ---
  const updateCell = (rowId, fieldsToUpdate) =>
    dispatch(updateTask(rowId, fieldsToUpdate))
      .then(() => setProjectTasks(p => p.map(i => i.id === rowId ? { ...i, ...fieldsToUpdate } : i)));

  const handleSelectRow = (rowId) =>
    setSelectedRows(p => {
      const n = new Set(p);
      n.has(rowId) ? n.delete(rowId) : n.add(rowId);
      return n;
    });

  const deselectAll = () => setSelectedRows(new Set());

  const updateMultipleTasks = (fieldsToUpdate) =>
    Promise.all(Array.from(selectedRows).map(tid => dispatch(updateTask(tid, fieldsToUpdate))))
      .then(() => { fetchData(); deselectAll(); });

  const handleBulkDelete = () => {
    if (window.confirm(`¿Eliminar ${selectedRows.size} tarea(s)?`)) {
      Promise.all(Array.from(selectedRows).map(tid => dispatch(deleteTask(tid))))
        .then(() => { fetchData(); deselectAll(); });
    }
  };

  const handleDuplicateTasks = () =>
    Promise.all(projectTasks.filter(t => selectedRows.has(t.id)).map(t => {
      const { id: _omit, created_at, ...n } = t;
      return dispatch(addTask({
        ...n,
        task_description: `${t.task_description} (Copia)`,
        status: 'Pendiente',
        Progress: 0
      }));
    }))
      .then(() => { fetchData(); deselectAll(); });

  // --- LÓGICA DE DATOS ---
  const fetchData = useCallback(async () => {
    dispatch(getAllFromTable("Proyectos"));
    const [tareasAction, staffAction, stagesAction, entregablesAction] = await Promise.all([
      dispatch(getAllFromTable("Tareas")),
      dispatch(getAllFromTable("Staff")),
      dispatch(getAllFromTable("Stage")),
      dispatch(getAllFromTable("Entregables_template"))
    ]);
    if (staffAction?.payload) setStaff(staffAction.payload);
    if (stagesAction?.payload) setStages(stagesAction.payload);
    if (entregablesAction?.payload) setEntregables(entregablesAction.payload);
    if (tareasAction?.payload) setProjectTasks(tareasAction.payload.filter(p => p.project_id === id));
  }, [dispatch, id, isFormOpen]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const projectProgress = useMemo(() => {
    if (!projectTasks || projectTasks.length === 0) return 0;
    return Math.round(
      projectTasks.reduce((sum, task) => sum + (Number(task.Progress) || 0), 0) / projectTasks.length
    );
  }, [projectTasks, isFormOpen]);

  const filteredAndSortedTasks = useMemo(() => {
    let items = [...projectTasks];
    if (searchTerm)
      items = items.filter(task =>
        task.task_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const priorityOrder = { 'Alta': 5, 'Media-Alta': 4, 'Media': 3, 'Media-Baja': 2, 'Baja': 1, 'undefined': 0 };
    items.sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === 'Priority') {
        aValue = priorityOrder[a.Priority] || 0;
        bValue = priorityOrder[b.Priority] || 0;
      } else {
        aValue = a[sortConfig.key] || '';
        bValue = b[sortConfig.key] || '';
      }
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return items;
  }, [projectTasks, sortConfig, searchTerm]);

  const selectedProject = projects.find(p => p.id === id);

  if (loading && !selectedProject) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!selectedProject) return <div className="p-8 text-center">Proyecto no encontrado.</div>;

  const fetchTasks = async () => {
    const tareasAction = await dispatch(getAllFromTable("Tareas"));
    if (tareasAction?.payload) setData(tareasAction.payload);
  };

  const handleAddTask = (taskData) => {
    const sanitizedTaskData = { ...taskData };
    ['project_id', 'staff_id', 'stage_id', 'entregable_id'].forEach(field => {
      if (sanitizedTaskData[field] === '') sanitizedTaskData[field] = null;
    });
    dispatch(addTask(sanitizedTaskData)).then(fetchTasks);
    setIsFormOpen(false);
  };

  // --- Componente de Celda Editable ---
  const EditableCell = ({ rowId, field, value, type = 'text', options = [], onExitEditing = () => {} }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const endEditing = () => { setIsEditing(false); onExitEditing(); };

    const handleSave = () => {
      let finalValue = editValue;
      if (type === 'progress') finalValue = Math.max(0, Math.min(100, Number(finalValue) || 0));
      if (finalValue !== value) {
        const fieldsToUpdate = { [field]: finalValue };
        if (field === 'Progress' && finalValue === 100) fieldsToUpdate.status = 'Completado';
        updateCell(rowId, fieldsToUpdate);
      }
      endEditing();
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && type !== 'textarea') handleSave();
      else if (e.key === 'Escape') { setEditValue(value); endEditing(); }
    };

    if (isEditing) {
      switch (type) {
        case 'progress':
          return (
            <input
              type="number" min="0" max="100"
              value={editValue || 0}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none bg-transparent"
              autoFocus
            />
          );
        case 'select':
        case 'status-select':
        case 'priority-select':
          return (
            <select
              value={editValue || ''} onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none bg-white" autoFocus
            >
              <option value="">-- Seleccionar --</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          );
        case 'entregable-select':
          return (
            <select
              value={editValue || ''} onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none" autoFocus
            >
              <option value="">-- Seleccionar --</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>{option.entregable_nombre}</option>
              ))}
            </select>
          );
        default:
          return (
            <textarea
              value={editValue || ''} onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none" rows="3" autoFocus
            />
          );
      }
    }

    const displayValue = (field, val) => {
      switch (field) {
        case 'staff_id': return staff.find(s => s.id === val)?.name || val || '-';
        case 'stage_id': return stages.find(s => s.id === val)?.name || val || '-';
        case 'entregable_id': return entregables.find(e => e.id === val)?.entregable_nombre || val || '-';
        default: return val || '-';
      }
    };

    if (field === 'Progress') {
      const progress = Math.max(0, Math.min(100, Number(value) || 0));
      return (
        <div className="w-full p-1 cursor-pointer" onClick={() => setIsEditing(true)}>
          <div className="flex items-center">
            <span className="text-xs font-semibold mr-2 w-8">{progress}%</span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (field === 'status') {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getEstadoColor(value)}`}
          onClick={() => setIsEditing(true)}
        >
          {value || '-'}
        </span>
      );
    }

    return (
      <div className="cursor-pointer p-1 min-h-[28px]" onClick={() => setIsEditing(true)}>
        {displayValue(field, value)}
      </div>
    );
  };

  // --- Componente de Tarea (interno) ---
  const TaskItem = React.memo(({ task, isSelected, onSelectRow }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const taskRef = useRef(null);

    // --- Fechas ---
    const initialDates = useMemo(
      () => task.dates ? JSON.parse(task.dates) : { assignDate: '', dueDate: '' },
      [task.dates]
    );
    const [assignDate, setAssignDate] = useState(initialDates.assignDate);
    const [dueDate, setDueDate] = useState(initialDates.dueDate);

    useEffect(() => {
      const newDates = task.dates ? JSON.parse(task.dates) : { assignDate: '', dueDate: '' };
      setAssignDate(newDates.assignDate);
      setDueDate(newDates.dueDate);
    }, [task.dates, data, isFormOpen]);

    const handleDateChange = (field, value) => {
      const updatedDates = {
        assignDate: field === 'assignDate' ? value : assignDate,
        dueDate: field === 'dueDate' ? value : dueDate,
      };
      updateCell(task.id, { dates: JSON.stringify(updatedDates) });
    };

    const responsible = staff.find(s => s.id === task.staff_id);

    // --- IMPRIMIR SOLO ESTA TAREA (versión limpia) ---
    const handlePrintInPlace = () => {
      if (!taskRef.current) return;

      const prevExpanded = isExpanded;
      if (!prevExpanded) setIsExpanded(true);

      setTimeout(() => {
        const node = taskRef.current;
        if (!node) return;

        // Clonar
        const clone = node.cloneNode(true);

        // Quitar controles
        clone.querySelectorAll('button, [type="checkbox"], [data-print-hide="true"]').forEach(el => el.remove());

        // Sustituir inputs/textarea/select por su valor
        clone.querySelectorAll('input, textarea, select').forEach((el) => {
          const span = document.createElement('span');
          let val = '';
          if (el.tagName === 'INPUT') val = el.value || el.getAttribute('value') || '';
          if (el.tagName === 'TEXTAREA') val = el.value || el.textContent || '';
          if (el.tagName === 'SELECT') val = el.options[el.selectedIndex]?.text || '';
          span.textContent = val;
          span.className = 'print-value';
          el.parentNode.replaceChild(span, el);
        });

        // --- Inserta “ – ” entre acción y ejecutor en la impresión ---
        const staffNames = staff.map(s => s?.name).filter(Boolean).sort((a, b) => b.length - a.length);
        const actionNodes = clone.querySelectorAll('.actions-print-scope > *, .actions-print-scope li');
        actionNodes.forEach(n => {
          const txt = n.textContent || '';
          for (const name of staffNames) {
            const i = txt.lastIndexOf(name);
            if (i > 0) {
              const before = txt[i - 1] || '';
              if (!/[-–—]\s*$/.test(txt.slice(0, i))) {
                const newTxt = txt.slice(0, i).replace(/\s*$/, ' ') + '– ' + txt.slice(i);
                n.textContent = newTxt;
              }
              break;
            }
          }
        });

        // Contenedor temporal
        const container = document.createElement('div');
        container.className = '__task_print_container__';
        container.style.position = 'absolute';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '100%';
        container.style.background = 'white';
        container.style.padding = '8mm';
        container.appendChild(clone);
        document.body.appendChild(container);

        // Estilos de impresión (limpia + checks + anchos)
        const style = document.createElement('style');
        style.setAttribute('data-print-style', 'true');
        style.innerHTML = `
          @page { size: A4; margin: 8mm; }
          @media print {
            html, body { padding:0 !important; margin:0 !important; }
            body * { visibility: hidden !important; }
            .__task_print_container__, .__task_print_container__ * { visibility: visible !important; }

            .__task_print_container__ { font-size: 12px !important; line-height: 1.35 !important; }
            .__task_print_container__ .grid { display:block !important; }
            .__task_print_container__ .grid > * { width:100% !important; }

            /* Quitar decoraciones y paddings grandes */
            .__task_print_container__ [class*="w-1.5"][class*="absolute"] { display:none !important; }
            .__task_print_container__ .py-2 { padding-top: 6px !important; padding-bottom: 6px !important; }
            .__task_print_container__ .px-3, .__task_print_container__ .px-4 { padding-left: 8px !important; padding-right: 8px !important; }

            /* No truncar texto */
            .__task_print_container__ * {
              overflow: visible !important;
              text-overflow: clip !important;
              white-space: normal !important;
              -webkit-line-clamp: initial !important;
              max-height: none !important;
            }

            /* Evitar cortes dentro de bloques */
            .__task_print_container__ [data-print-block="true"],
            .__task_print_container__ .print-avoid-break {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /* Dos columnas etiqueta/valor en datos superiores si quieres activarlo:
            .__task_print_container__ [data-print-fields="true"]{
              display:grid !important; grid-template-columns: 150px 1fr !important;
              column-gap:10px !important; row-gap:4px !important;
            }
            .__task_print_container__ [data-print-fields="true"] .print-row{ display:contents !important; }
            */

            /* Barras de progreso fuera en impresión */
            .__task_print_container__ .bg-blue-600.h-2,
            .__task_print_container__ .w-full.bg-gray-200.rounded-full.h-2 { display:none !important; }

            /* ---------- Checks antes de cada acción (solo impresión) ---------- */
            .__task_print_container__ .actions-print-scope > * ,
            .__task_print_container__ .actions-print-scope li {
              position: relative !important;
              padding-left: 18px !important;
              margin-bottom: 4px !important;
            }
            .__task_print_container__ .actions-print-scope > *::before,
            .__task_print_container__ .actions-print-scope li::before {
              content: "" !important;
              display: inline-block !important;
              width: 12px !important;
              height: 12px !important;
              border: 1.5px solid #000 !important;
              box-sizing: border-box !important;
              position: absolute !important;
              left: 0 !important;
              top: 0.25em !important;
            }
          }
        `;
        document.head.appendChild(style);

        const originalTitle = document.title;
        document.title = `Tarea ${task.id || ''}`;
        window.print();

        // Limpieza
        document.title = originalTitle;
        if (style.parentNode) style.parentNode.removeChild(style);
        if (container.parentNode) container.parentNode.removeChild(container);

        if (!prevExpanded) setIsExpanded(false);
      }, 0);
    };
    // --- FIN IMPRIMIR ---

    return (
      <div ref={taskRef} className={`relative ${isSelected ? 'bg-blue-50' : 'bg-white'}`} data-print-block="true">
        <div className="flex items-center w-full pl-6 pr-4 py-2">
          <div className="flex items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200 mr-2"
              data-print-hide="true"
            >
              {isExpanded ? <ChevronDown size={20} className="text-gray-600" /> : <ChevronRight size={20} className="text-gray-500" />}
            </button>
            <input type="checkbox" checked={isSelected} onChange={onSelectRow} className="w-5 h-5" data-print-hide="true" />
          </div>

          <div
            className="flex-grow font-medium text-gray-800 ml-4 print-avoid-break"
            onClick={() => { if (!isEditingDesc) setIsExpanded(!isExpanded); }}
          >
            {isEditingDesc ? (
              <EditableCell
                rowId={task.id}
                field="task_description"
                value={task.task_description}
                type="textarea"
                onExitEditing={() => setIsEditingDesc(false)}
              />
            ) : (
              <div className="p-1 min-h-[28px] cursor-pointer select-text">
                {task.task_description || '-'}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-6 mx-4 md:mx-6 text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center gap-2" title="Responsable">
              <User size={16} className="text-gray-400" />
              <span>{responsible?.name || 'Sin asignar'}</span>
            </div>
            <div className="flex items-center gap-2" title="Fecha Límite">
              <Calendar size={16} className="text-gray-400" />
              <span>{dueDate || 'Sin fecha'}</span>
            </div>
            <div title="Estado">
              <EditableCell
                rowId={task.id}
                field="status"
                value={task.status}
                type="status-select"
                options={Object.keys(ESTADOS).map(k => ({ id: ESTADOS[k], name: ESTADOS[k] }))}
              />
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setIsEditingDesc(true); }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
              title="Editar descripción"
              data-print-hide="true"
            >
              <Settings size={16} />
            </button>

            <button
              data-print-btn="true"
              onClick={(e) => { e.stopPropagation(); handlePrintInPlace(); }}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
              title="Imprimir esta tarea"
            >
              Imprimir
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-16 pr-8 pb-4 pt-2 bg-gray-50/50 border-t border-gray-200">
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 text-sm mb-4"
              data-print-block="true"
              data-print-fields="true"
            >
              <div className="print-row">
                <label className="font-medium text-gray-500">Prioridad</label>
                <EditableCell rowId={task.id} field="Priority" value={task.Priority} type="priority-select" options={Priorities} />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500">Etapa</label>
                <EditableCell rowId={task.id} field="stage_id" value={task.stage_id} type="select" options={stages} />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500">Entregable</label>
                <EditableCell rowId={task.id} field="entregable_id" value={task.entregable_id} type="entregable-select" options={entregables} />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500">Progreso</label>
                <EditableCell rowId={task.id} field="Progress" value={task.Progress} type="progress" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-4 text-sm">
              <div data-print-block="true" data-print-dates="true">
                <label className="font-medium text-gray-500">Fechas y Actividad</label>
                <div className="flex items-end gap-x-4 gap-y-2 p-1 flex-wrap">
                  <div>
                    <label htmlFor={`assign-date-${task.id}`} className="block text-xs text-gray-500 mb-1">Asignación</label>
                    <input
                      id={`assign-date-${task.id}`} type="date"
                      value={assignDate || ''} onChange={(e) => setAssignDate(e.target.value)}
                      onBlur={(e) => handleDateChange('assignDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`due-date-${task.id}`} className="block text-xs text-gray-500 mb-1">Límite</label>
                    <input
                      id={`due-date-${task.id}`} type="date"
                      value={dueDate || ''} onChange={(e) => setDueDate(e.target.value)}
                      onBlur={(e) => handleDateChange('dueDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="pt-2" data-print-hide="true">
                    <TaskLog task={task} onSave={updateCell} />
                  </div>
                </div>
              </div>

              <div data-print-block="true">
                <label className="font-medium text-gray-500">Notas</label>
                <EditableCell rowId={task.id} field="notes" value={task.notes} type="textarea" />
              </div>

              {/* ---- Acciones: envueltas para checks y guion antes del ejecutor (solo print) ---- */}
              <div data-print-block="true" data-section="acciones">
                <label className="font-medium text-gray-500">Acciones y Actividad</label>
                <div className="actions-print-scope">
                  <InlineActionsTask task={task} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-4 md:p-8 gap-6">
      <FormTask
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
        proyecto={id}
        staff={staff}
        stages={stages}
        entregables={entregables}
        estados={ESTADOS}
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedProject.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-600">Cliente</p>
              <p className="text-gray-800">{selectedProject.client_name || 'No especificado'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-600">Fechas</p>
              <p className="text-gray-800">{`Inicio: ${selectedProject.start_date || 'N/A'} | Fin: ${selectedProject.end_date || 'N/A'}`}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-600">Estado Actual</p>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {selectedProject.status || 'No definido'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Progreso General</span>
            <span className="text-sm font-bold text-blue-600">{projectProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${projectProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-grow min-h-0">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-600">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortConfig.key}
                onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Priority">Prioridad</option>
                <option value="task_description">Nombre Tarea</option>
                <option value="status">Estado</option>
              </select>
              <button
                onClick={() =>
                  setSortConfig({
                    ...sortConfig,
                    direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                  })
                }
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                {sortConfig.direction === 'ascending' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <Plus size={18} /> Nueva Tarea
          </button>
        </div>

        <div className="divide-y divide-gray-200 overflow-y-auto">
          {filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedRows.has(task.id)}
              onSelectRow={() => handleSelectRow(task.id)}
            />
          ))}
          {filteredAndSortedTasks.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p className="font-semibold">No se encontraron tareas</p>
              <p className="text-sm mt-1">
                {searchTerm ? "Intenta con otra búsqueda." : "Crea una nueva tarea para empezar."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <TaskActions
          selectedRows={selectedRows}
          data={projectTasks}
          staff={staff}
          updateMultipleTasks={updateMultipleTasks}
          handleBulkDelete={handleBulkDelete}
          handleDuplicateTasks={handleDuplicateTasks}
          deselectAll={deselectAll}
        />
      </div>
    </div>
  );
};

export default ProjectTaskModal;

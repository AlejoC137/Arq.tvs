import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import {
  User, Calendar, Tag, Plus, Search, ArrowUp, ArrowDown,
  ChevronDown, ChevronRight, Settings
} from 'lucide-react';
import {
  getAllFromTable,
  updateTask,
  addTask,
  deleteTask
} from '../store/actions/actions';

import TaskActions from './TaskActions';
import TaskLog from './TaskLog';
import InlineActionsTask from './InlineActionsTask';
import FormTask from './FormTask';
// import { getEspaciosPorProyecto } from '../constants/espacios';
import { PlansViewer, ProjectHeader, TasksToolbar } from './ProjectPlans';
import { hasProjectPlans } from '../config/projectPlansConfig';

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
    'BLOQUEADO': 'bg-gray-400 text-white',
    'Bloqueado': 'bg-gray-400 text-white',
    'Aprobación Requerida': 'bg-orange-100 text-orange-800',
    'En Diseño': 'bg-pink-100 text-pink-800',
    'En Discusión': 'bg-indigo-100 text-indigo-800'
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};


// Importación de espacios desde BD (reemplazando constantes)
// import { getEspaciosPorProyecto } from '../constants/espacios'; 

const ProjectTaskModal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Selectors
  const projects = useSelector(state => state.projects.projects);
  const tasks = useSelector(state => state.tasks.tasks);
  const dbSpaces = useSelector(state => state.tables?.Espacio_Elemento || []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPlanView, setShowPlanView] = useState(false);

  // Obtener proyecto actual
  const selectedProject = useMemo(() =>
    projects.find(p => p.id === id || p.id === parseInt(id)),
    [projects, id]);

  // Cargar espacios de la BD
  useEffect(() => {
    if (!dbSpaces.length) {
      dispatch(getAllFromTable('Espacio_Elemento'));
    }
  }, [dispatch, dbSpaces.length]);

  // Filtrar espacios para el proyecto actual
  const projectSpaces = useMemo(() => {
    if (!selectedProject) return [];

    // Si tenemos espacios en BD para este proyecto, usarlos
    const dbProjectSpaces = dbSpaces.filter(s =>
      s.proyecto_id === selectedProject.id && s.tipo === 'Espacio'
    );

    if (dbProjectSpaces.length > 0) {
      return dbProjectSpaces.map(s => s.nombre);
    }

    // Fallback: tratar de usar el sistema antiguo si no hay datos en BD
    // Esto asegura compatibilidad durante la migración
    try {
      // Import dinámico o lógica inline si es necesario, 
      // pero idealmente ya deberíamos tener datos en BD.
      // Por ahora retornamos array vacío si no hay coincidencias de proyecto
      return [];
    } catch (e) {
      return [];
    }
  }, [dbSpaces, selectedProject]);

  const [data, setData] = useState([]);
  const { loading, error } = useSelector((state) => state.projects);
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [temaFilter, setTemaFilter] = useState('all'); // Nuevo filtro por Tema

  useEffect(() => {
    if (id) {
      // Cargar tareas si es necesario
      // dispatch(fetchTasksByProject(id)); // Asumiendo que esto ya se hace o se maneja globalmente
    }
  }, [dispatch, id]);

  // Derivar listas de filtros
  const temas = useMemo(() => [...new Set(projectTasks.map(t => t.tema).filter(Boolean))], [projectTasks]);
  const managers = useMemo(() => [...new Set(projectTasks.map(t => t.manager).filter(Boolean))], [projectTasks]);

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
        tema: `${t.tema} (Copia)`,
        status: 'Pendiente',
        Progress: 0
      }));
    }))
      .then(() => { fetchData(); deselectAll(); });

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
        task.tema?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedRoom) {
      items = items.filter(task => {
        if (task.espacio === selectedRoom) return true;
        if (!task.acciones) return false;
        try {
          const acciones = typeof task.acciones === 'string' ? JSON.parse(task.acciones) : task.acciones;
          if (!Array.isArray(acciones)) return false;
          return acciones.some(accion => accion.espacio === selectedRoom);
        } catch (e) {
          return false;
        }
      });
    }

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
  }, [projectTasks, sortConfig, searchTerm, selectedRoom]);



  // Auto-abrir vista de planos si el proyecto tiene planos configurados
  useEffect(() => {
    if (selectedProject && hasProjectPlans(selectedProject)) {
      setShowPlanView(true);
    }
  }, [selectedProject]);

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

  const EditableCell = ({ rowId, field, value, type = 'text', options = [], onExitEditing = () => { } }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const endEditing = () => {
      setIsEditing(false);
      onExitEditing();
    };

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
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none bg-white"
              autoFocus
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
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none"
              autoFocus
            >
              <option value="">-- Seleccionar --</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>{option.entregable_nombre}</option>
              ))}
            </select>
          );
        case 'espacio-select':
          return (
            <select
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none"
              autoFocus
            >
              <option value="">-- Sin Asignar --</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          );
        default:
          return (
            <textarea
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} onKeyDown={handleKeyPress}
              className="w-full p-1 border rounded focus:outline-none"
              rows="3" autoFocus
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

  const TaskItem = React.memo(({ task, isSelected, onSelectRow }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const taskRef = useRef(null);

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

    const getPriorityClasses = (priority) => {
      const base = 'w-1.5 h-full absolute top-0 left-0';
      switch (priority) {
        case 'Alta': return `${base} bg-red-500`;
        case 'Media-Alta': return `${base} bg-orange-500`;
        case 'Media': return `${base} bg-yellow-400`;
        case 'Media-Baja': return `${base} bg-green-400`;
        case 'Baja': return `${base} bg-blue-400`;
        default: return `${base} bg-gray-300`;
      }
    };

    const responsible = staff.find(s => s.id === task.staff_id);

    // ========================= IMPRESIÓN NUEVA =========================
    const printTask = () => {
      const title = task.tema || '-';
      const responsable = responsible?.name || 'Sin asignar';
      const fecha = dueDate || 'Sin fecha';
      const estado = task.status || 'Pendiente';
      const prioridad = task.Priority || '-';
      const etapa = stages.find(s => s.id === task.stage_id)?.name || '-';
      const entregable = entregables.find(e => e.id === task.entregable_id)?.entregable_nombre || '-';
      const progreso = `${Math.max(0, Math.min(100, Number(task.Progress) || 0))}%`;
      const notas = (task.notes && String(task.notes).trim()) ? task.notes : '-';
      const asignacion = assignDate || '-';
      const limite = dueDate || '-';

      const accionesNode = taskRef.current?.querySelector('[data-section="acciones"]');
      const accionesHTML = accionesNode ? accionesNode.innerHTML : '<div>-</div>';

      const container = document.createElement('div');
      container.className = '__print_root__';
      document.body.appendChild(container);

      const css = `
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { padding:0; margin:0; }
          body * { visibility: hidden; }
          .__print_root__, .__print_root__ * { visibility: visible; }
        }
        .__print_root__{
          position: absolute; inset: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
          font-size: 12.5px; line-height: 1.35; color:#0f172a; background:#fff; padding: 0 2mm;
        }
        .hdr { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
        .title { font-size:16px; font-weight:700; color:#111827; }
        .chips { display:flex; gap:8px; flex-wrap:wrap; }
        .chip { padding:3px 8px; border-radius:9999px; border:1px solid #e5e7eb; background:#f8fafc; font-weight:600; font-size:11px; }
        .chip.estado.pendiente { background:#fef3c7; border-color:#fde68a; color:#92400e; }
        .sep { border:0; border-top:1px solid #e5e7eb; margin:8px 0 10px; }

        .grid4 { 
          display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); 
          gap:14px; margin-top:6px; 
        }
        .blk h4 { font-size:12px; font-weight:700; color:#111827; margin:12px 0 6px; }
        .kv { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .kv .k { color:#6b7280; min-width:110px; }
        .kv .v { color:#111827; font-weight:600; }

        .subgrid2 { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:16px; }
        .box { border:1px solid #e5e7eb; border-radius:8px; padding:8px; background:#fafafa; }
        .muted { color:#6b7280; }

        .acciones input[type="checkbox"]{
          appearance:none; -webkit-appearance:none; width:14px; height:14px;
          border:1.5px solid #9ca3af; border-radius:3px; margin-right:8px; vertical-align:middle; position:relative; top:-1px; background:#fff;
        }
        .acciones input[type="checkbox"]:checked::after{
          content:""; position:absolute; left:3px; top:0px; width:5px; height:9px; border: solid #2563eb;
          border-width:0 2px 2px 0; transform:rotate(45deg);
        }

        .avoid { break-inside: avoid; page-break-inside: avoid; }
      `;

      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

      container.innerHTML = `
        <div class="hdr">
          <div class="title">${title}</div>
          <div class="chips">
            <span class="chip">${responsable}</span>
            <span class="chip">${fecha}</span>
            <span class="chip estado ${estado.toLowerCase().replace(/\s+/g, '-')}">${estado}</span>
          </div>
        </div>
        <hr class="sep"/>

        <div class="grid4 avoid">
          <div class="kv"><span class="k">Prioridad</span><span class="v">${prioridad}</span></div>
          <div class="kv"><span class="k">Etapa</span><span class="v">${etapa}</span></div>
          <div class="kv"><span class="k">Entregable</span><span class="v">${entregable}</span></div>
          <div class="kv"><span class="k">Progreso</span><span class="v">${progreso}</span></div>
        </div>

        <div class="blk avoid">
          <h4>Fechas y Actividad</h4>
          <div class="subgrid2">
            <div class="kv"><span class="k">Asignación</span><span class="v">${asignacion}</span></div>
            <div class="kv"><span class="k">Límite</span><span class="v">${limite}</span></div>
          </div>
        </div>

        <div class="blk avoid">
          <h4>Notas</h4>
          <div class="box">${notas ? String(notas).replace(/\n/g, '<br/>') : '<span class="muted">-</span>'}</div>
        </div>

        <div class="blk avoid acciones">
          <h4>Acciones y Actividad</h4>
          ${accionesHTML}
        </div>
      `;

      const originalTitle = document.title;
      document.title = title.slice(0, 120);
      window.print();

      document.title = originalTitle;
      if (style.parentNode) style.parentNode.removeChild(style);
      if (container.parentNode) container.parentNode.removeChild(container);
    };
    // ======================= FIN IMPRESIÓN NUEVA =======================

    const datesForLatest = task.dates ? JSON.parse(task.dates) : {};
    const latestLog = (datesForLatest.logs && datesForLatest.logs.length > 0)
      ? datesForLatest.logs[datesForLatest.logs.length - 1]
      : null;

    return (
      <div ref={taskRef} className={`relative ${isSelected ? 'bg-blue-50' : 'bg-white'}`} data-print-block="true">
        <div className={getPriorityClasses(task.Priority)} title={`Prioridad: ${task.Priority}`}></div>
        <div className="flex items-start w-full pl-3 pr-2 py-2 gap-2">
          {/* Controles: expand + checkbox */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 rounded hover:bg-gray-200"
              data-print-hide="true"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
            <input type="checkbox" checked={isSelected} onChange={onSelectRow} className="w-4 h-4" data-print-hide="true" />
          </div>

          {/* Descripción */}
          <div
            className="flex-1 min-w-0 font-medium text-gray-800 text-sm"
            onClick={() => { if (!isEditingDesc) setIsExpanded(!isExpanded); }}
          >
            {isEditingDesc ? (
              <EditableCell
                rowId={task.id}
                field="tema"
                value={task.tema}
                type="textarea"
                onExitEditing={() => setIsEditingDesc(false)}
              />
            ) : (
              <div className="p-1 cursor-pointer break-words line-clamp-2">
                {task.tema || '-'}
              </div>
            )}
          </div>

          {/* Info y acciones compactas */}
          <div className="flex flex-col gap-1.5 flex-shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-gray-600" title="Responsable">
                <User size={12} className="text-gray-400" />
                <span className="truncate max-w-[80px]">{staff.find(s => s.id === task.staff_id)?.name || 'Sin asignar'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600" title="Fecha">
                <Calendar size={12} className="text-gray-400" />
                <span className="truncate max-w-[70px]">{dueDate || 'Sin fecha'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div title="Estado" className="flex-shrink-0">
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
                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                title="Editar"
                data-print-hide="true"
              >
                <Settings size={12} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); printTask(); }}
                className="px-1.5 py-0.5 border border-gray-300 rounded hover:bg-gray-100 whitespace-nowrap"
                title="Imprimir"
                data-print-btn="true"
              >
                🖨️
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="pl-6 pr-3 pb-3 pt-2 bg-gray-50/50 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs mb-3" data-print-block="true" data-print-fields="true">
              <div className="print-row">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Prioridad</label>
                <EditableCell rowId={task.id} field="Priority" value={task.Priority} type="priority-select" options={Priorities} />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Progreso</label>
                <EditableCell rowId={task.id} field="Progress" value={task.Progress} type="progress" />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Etapa</label>
                <EditableCell rowId={task.id} field="stage_id" value={task.stage_id} type="select" options={stages} />
              </div>
              <div className="print-row">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Entregable</label>
                <EditableCell rowId={task.id} field="entregable_id" value={task.entregable_id} type="entregable-select" options={entregables} />
              </div>
              <div className="print-row col-span-2">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Espacio</label>
                <EditableCell
                  rowId={task.id}
                  field="espacio"
                  value={task.espacio}
                  type="espacio-select"
                  options={projectSpaces.map(e => ({ id: e, name: e }))}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div data-print-block="true" data-print-dates="true">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Fechas y Actividad</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={`assign-date-${task.id}`} className="block text-[10px] text-gray-500 mb-0.5">Asignación</label>
                    <input
                      id={`assign-date-${task.id}`}
                      type="date"
                      value={assignDate || ''}
                      onChange={(e) => setAssignDate(e.target.value)}
                      onBlur={(e) => handleDateChange('assignDate', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`due-date-${task.id}`} className="block text-[10px] text-gray-500 mb-0.5">Límite</label>
                    <input
                      id={`due-date-${task.id}`}
                      type="date"
                      value={dueDate || ''}
                      onChange={(e) => setDueDate(e.target.value)}
                      onBlur={(e) => handleDateChange('dueDate', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2" data-print-hide="true">
                    <TaskLog task={task} onSave={updateCell} />
                  </div>
                  <div className="col-span-2">
                    <div
                      className="w-full p-2 border border-gray-200 bg-gray-50 rounded text-xs text-gray-600 min-h-[36px] flex items-center"
                      title={
                        (task.dates && JSON.parse(task.dates)?.logs?.length)
                          ? `${JSON.parse(task.dates).logs.slice(-1)[0].date}: ${JSON.parse(task.dates).logs.slice(-1)[0].event}`
                          : 'No hay eventos.'
                      }
                    >
                      {latestLog ? (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="font-semibold whitespace-nowrap">{latestLog.date}:</span>
                          <span className="break-words">{latestLog.event}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No hay eventos registrados.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div data-print-block="true">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Notas</label>
                <EditableCell rowId={task.id} field="notes" value={task.notes} type="textarea" />
              </div>

              <div data-print-block="true" data-section="acciones">
                <label className="font-medium text-gray-500 text-xs mb-1 block">Acciones y Actividad</label>
                <InlineActionsTask task={task} projects={projects} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });


  return (
    <div className="h-screen bg-gray-50 p-2 md:p-4">
      <div className={`grid gap-3 h-full ${showPlanView ? 'grid-cols-1 md:grid-cols-[1.5fr_1fr]' : 'grid-cols-1'}`}>
        {/* Panel izquierdo: Vista de planos */}
        {showPlanView && (
          <div className="flex flex-col overflow-hidden min-h-0">
            <PlansViewer
              tasks={projectTasks}
              project={selectedProject}
              spaces={dbSpaces.filter(s => s.proyecto === id)} // PASAR ESPACIOS FILTRADOS
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
              onClose={() => {
                setShowPlanView(false);
                setSelectedRoom(null);
              }}
            />
          </div>
        )}

        {/* Panel derecho: Lista de tareas */}
        <div className={`${showPlanView ? '' : 'max-w-7xl mx-auto w-full'} flex flex-col gap-3 min-h-0`}>
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

          <ProjectHeader project={selectedProject} projectProgress={projectProgress} />

          {/* Área scroll con lista de tareas + acciones abajo */}
          <div className="flex-1 grid grid-rows-[1fr_auto] gap-3 min-h-0">
            {/* Lista de tareas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0">
              <TasksToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSortChange={(key) => setSortConfig({ ...sortConfig, key })}
                onToggleDirection={() => setSortConfig({
                  ...sortConfig,
                  direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                })}
                onNewTask={() => setIsFormOpen(true)}
                project={selectedProject}
                showPlanView={showPlanView}
                // Props for space filtering
                spaces={projectSpaces}
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
                onTogglePlanView={() => setShowPlanView(!showPlanView)}
              />

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

            {/* Acciones para selección (abajo) */}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskModal;

import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, Download, Plus,
  XCircle, Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Assuming these components and actions exist in the specified paths
import FormTask from './FormTask'; 
import { getAllFromTable, updateTask, addTask, deleteTask } from '../store/actions/actions'; 

// --- Constants and Helper Functions (Unchanged) ---
const ESTADOS = {
  PENDIENTE: 'Pendiente', EN_PROCESO: 'En Progreso', COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado', EN_REVISION: 'En Revisión', BLOQUEADO: 'Bloqueado',
  APROBACION_REQUERIDA: 'Aprobación Requerida', EN_DISENO: 'En Diseño', EN_DISCUSION: 'En Discusión'
};

const getEstadoColor = (estado) => {
  const colors = {
    'Pendiente': 'bg-yellow-100 text-yellow-800', 'En Progreso': 'bg-blue-100 text-blue-800', 
    'Completado': 'bg-green-100 text-green-800', 'Cancelado': 'bg-red-100 text-red-800',
    'En Revisión': 'bg-purple-100 text-purple-800', 'Bloqueado': 'bg-gray-400 text-white',
    'Aprobación Requerida': 'bg-orange-100 text-orange-800', 'En Diseño': 'bg-pink-100 text-pink-800',
    'En Discusión': 'bg-indigo-100 text-indigo-800'
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority) => {
    if (priority === "Alta") return "border-l-4 border-red-500";
    if (priority === "Media") return "border-l-4 border-orange-500";
    if (priority === "Baja") return "border-l-4 border-yellow-500";
    return "border-l-4 border-gray-300";
};


const ProjectKanbanView = () => {
  const dispatch = useDispatch();
  
  // --- State Declarations (Mostly Unchanged) ---
  const [data, setData] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stages, setStages] = useState([]);
  const [entregables, setEntregables] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const initialFiltersState = { project_id: '', stage_id: '', staff_id: '', status: '', search: '' };
  const [filters, setFilters] = useState(initialFiltersState);

  // --- Data Fetching Effect (Unchanged) ---
  useEffect(() => {
    const fetchAllData = async () => {
      const [tareasAction, proyectosAction, staffAction, stagesAction, entregablesAction] = await Promise.all([
        dispatch(getAllFromTable("Tareas")), 
        dispatch(getAllFromTable("Proyectos")),
        dispatch(getAllFromTable("Staff")), 
        dispatch(getAllFromTable("Stage")),
        dispatch(getAllFromTable("Entregables_template"))
      ]);
      if (tareasAction?.payload) setData(tareasAction.payload);
      if (proyectosAction?.payload) setProyectos(proyectosAction.payload);
      if (staffAction?.payload) setStaff(staffAction.payload);
      if (stagesAction?.payload) setStages(stagesAction.payload);
      if (entregablesAction?.payload) setEntregables(entregablesAction.payload);
    };
    fetchAllData();
  }, [dispatch]);
  
  // --- Data Filtering (Unchanged) ---
  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
    if (filters.project_id) filtered = filtered.filter(item => item.project_id === filters.project_id);
    if (filters.stage_id) filtered = filtered.filter(item => item.stage_id === filters.stage_id);
    if (filters.staff_id) filtered = filtered.filter(item => item.staff_id === filters.staff_id);
    if (filters.status) filtered = filtered.filter(item => item.status === filters.status);
    return filtered;
  }, [data, filters]);

  // --- KEY CHANGE: Grouping data for Kanban View ---
  const groupedByProject = useMemo(() => {
    // We use reduce to transform the flat array into an object
    // where keys are project IDs and values are arrays of tasks.
    return filteredData.reduce((acc, task) => {
      const projectId = task.project_id || 'unassigned';
      if (!acc[projectId]) {
        acc[projectId] = [];
      }
      acc[projectId].push(task);
      return acc;
    }, {});
  }, [filteredData]);

  // --- Action Handlers (Unchanged) ---
  const handleAddTask = (taskData) => { dispatch(addTask(taskData)); };
  
  const handleDeleteTask = (taskId, taskDescription) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea?\n\n"${taskDescription}"`)) {
      dispatch(deleteTask(taskId));
    }
  };
  
  // Note: The `updateCell` function is kept for potential future use (e.g., in a modal),
  // but the inline `EditableCell` component is removed in favor of a simpler card display.
  const updateCell = (rowId, fieldsToUpdate) => {
    setData(prevData => prevData.map(item => item.id === rowId ? { ...item, ...fieldsToUpdate } : item));
    dispatch(updateTask(rowId, fieldsToUpdate));
  };
  
  const exportToExcel = () => {
    const dataToExport = filteredData.map(item => ({
      'Proyecto': proyectos.find(p => p.id === item.project_id)?.name || 'Sin Asignar',
      'Etapa': stages.find(s => s.id === item.stage_id)?.name || item.stage_id,
      'Entregable': entregables.find(e => e.id === item.entregable_id)?.entregable_nombre || item.entregable_id,
      'Tarea': item.task_description,
      'Progreso': `${item.Progress || 0}%`,
      'Estado': item.status,
      'Responsable': staff.find(s => s.id === item.staff_id)?.name || item.staff_id,
      'Prioridad': item.Priority,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
    XLSX.writeFile(workbook, "Gestion_Tareas_Kanban.xlsx");
  };

  return (
    <>
      <FormTask isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddTask} proyectos={proyectos} staff={staff} stages={stages} entregables={entregables} estados={ESTADOS}/>
      
      <div className="flex flex-col h-screen bg-gray-100 font-sans">
        {/* --- Header and Filters (Similar to original) --- */}
        <header className="bg-white shadow-sm border-b p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas (Kanban)</h1>
              <p className="text-sm text-gray-600">Vista de tarjetas por proyecto</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600   rounded-lg hover:bg-green-700 text-sm"><Download size={16} /> Exportar Vista</button>
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600   rounded-lg hover:bg-blue-700 text-sm"><Plus size={16} /> Nueva Tarea</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg border">
             <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label><div className="relative"><Search size={16} className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Buscar en tareas, notas..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="pl-10 w-full p-2 border border-gray-300 rounded-lg text-sm"/></div></div>
             <div><label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label><select value={filters.stage_id} onChange={(e) => setFilters(prev => ({ ...prev, stage_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg text-sm"><option value="">Todas</option>{stages.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
             <div><label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label><select value={filters.staff_id} onChange={(e) => setFilters(prev => ({ ...prev, staff_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg text-sm"><option value="">Todos</option>{staff.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
             <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label><select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg text-sm"><option value="">Todos</option>{Object.values(ESTADOS).map(estado => (<option key={estado} value={estado}>{estado}</option>))}</select></div>
             <div className="flex items-end"><button onClick={() => setFilters(initialFiltersState)} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600   rounded-lg hover:bg-gray-700 w-full text-sm"><XCircle size={16} /> Limpiar</button></div>
          </div>
        </header>

        {/* --- KANBAN BOARD --- */}
        <main className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full">
            {Object.entries(groupedByProject).map(([projectId, tasks]) => {
              const project = proyectos.find(p => p.id === projectId);
              return (
                <div key={projectId} className="flex-shrink-0 w-80 bg-gray-200 rounded-lg shadow-md">
                  {/* Column Header */}
                  <div className="p-3 bg-white border-b rounded-t-lg sticky top-0">
                    <h2 className="font-bold text-gray-800">{project?.name || "Tareas sin Proyecto"}</h2>
                    <p className="text-xs text-gray-500">{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}</p>
                  </div>
                  
                  {/* Cards Container */}
                  <div className="p-2 overflow-y-auto h-[calc(100%-60px)]">
                    {tasks.map(task => (
                      <div key={task.id} className={`bg-white rounded-lg shadow-sm p-3 mb-3 hover:shadow-lg transition-shadow ${getPriorityColor(task.Priority)}`}>
                        {/* Card Content */}
                        <div className="flex justify-between items-start">
                           <p className="font-semibold text-sm text-gray-800 break-words mb-2">{task.task_description}</p>
                           <button onClick={() => handleDeleteTask(task.id, task.task_description)} className="text-gray-400 hover:text-red-500 p-1 rounded-full flex-shrink-0"><Trash2 size={14} /></button>
                        </div>
                       
                        <div className="text-xs text-gray-600 space-y-2 mb-3">
                            <p><strong>Entregable:</strong> {entregables.find(e => e.id === task.entregable_id)?.entregable_nombre || '-'}</p>
                            <p><strong>Responsable:</strong> {staff.find(s => s.id === task.staff_id)?.name || '-'}</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-semibold text-gray-700 w-9">{task.Progress || 0}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${task.Progress || 0}%` }}></div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-start">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(task.status)}`}>{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectKanbanView;
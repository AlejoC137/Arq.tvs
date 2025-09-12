
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, Download, Upload, Plus, Tag,
  XCircle, ArrowUpDown, Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Asumiendo que estos componentes existen en las rutas especificadas
import TaskActions from './TaskActions';
import FormTask from './FormTask'; 
import { getAllFromTable, updateTask, addTask, deleteTask } from '../store/actions/actions'; 
import { CATEGORIES } from '../store/actionTypes';

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

const ProjectExcelView = () => {
  const dispatch = useDispatch();
  
  const [data, setData] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stages, setStages] = useState([]);
  const [entregables, setEntregables] = useState([]);
  const [Priorities, setPriorities] = useState([
  { level: 1, name: "Alta", color: "bg-red-200 text-red-800" },
  { level: 2, name: "Media", color: "bg-orange-200 text-orange-800" },
  { level: 3, name: "Baja", color: "bg-yellow-200 text-yellow-800" },
]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const initialFiltersState = { project_id: '', stage_id: '', staff_id: '', status: '', search: '' };
  const [filters, setFilters] = useState(initialFiltersState);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'task_description', direction: 'ascending' });

  useEffect(() => {
    const fetchAllData = async () => {
      // Usamos Promise.all para cargar todos los datos en paralelo
      const [tareasAction, proyectosAction, staffAction, stagesAction, entregablesAction, ] = await Promise.all([
        dispatch(getAllFromTable("Tareas")), 
        dispatch(getAllFromTable("Proyectos")),
        dispatch(getAllFromTable("Staff")), 
        dispatch(getAllFromTable("Stage")),
        dispatch(getAllFromTable("Entregables_template"))
      ]);
      // Asignamos los datos a los estados correspondientes
      if (tareasAction?.payload) setData(tareasAction.payload);
      if (proyectosAction?.payload) setProyectos(proyectosAction.payload);
      if (staffAction?.payload) setStaff(staffAction.payload);
      if (stagesAction?.payload) setStages(stagesAction.payload);
      if (entregablesAction?.payload) setEntregables(entregablesAction.payload);
    };
    fetchAllData();
    console.log(data);
    
  }, [dispatch]);
  
  // Memoizamos el filtrado de datos para mejorar el rendimiento
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

  // Memoizamos el ordenamiento de datos para mejorar el rendimiento
  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Función de ayuda para obtener el valor a comparar (incluyendo nombres de relaciones)
        const getValue = (item, key) => {
            let value = item[key] || '';
            switch (key) {
                case 'project_id': return proyectos.find(p => p.id === value)?.name || value;
                case 'staff_id': return staff.find(s => s.id === value)?.name || value;
                case 'stage_id': return stages.find(s => s.id === value)?.name || value;
                case 'entregable_id': return entregables.find(e => e.id === value)?.entregable_nombre || value;
                case 'Progress': return Number(value || 0);
                default: return value;
            }
        };
        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig, proyectos, staff, stages, entregables]);
   
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleSelectRow = (rowId) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return newSelected;
    });
  };

  const handleAddTask = (taskData) => { 
    const processedTaskData = {
      ...taskData,
      project_id: taskData.project_id || null,
      staff_id: taskData.staff_id || null,
      stage_id: taskData.stage_id || null,
      entregable_id: taskData.entregable_id || null,
      notes: taskData.notes || null
    };
    dispatch(addTask(processedTaskData)); 
  };
  
  const handleDeleteTask = (taskId, taskDescription) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea?\n\n"${taskDescription}"`)) {
      dispatch(deleteTask(taskId));
    }
  };
  
  const updateCell = (rowId, fieldsToUpdate) => {
    setData(prevData => prevData.map(item => item.id === rowId ? { ...item, ...fieldsToUpdate } : item));
    dispatch(updateTask(rowId, fieldsToUpdate));
  };

  // Componente interno para celdas editables
  const EditableCell = ({ rowId, field, value, type = 'text', options = [], currentStageId = null , }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    
    const handleSave = () => {
        let finalValue = editValue;
        if (type === 'progress') {
            finalValue = Math.max(0, Math.min(100, Number(finalValue) || 0));
        }

        if (finalValue !== value) {
            let fieldsToUpdate = { [field]: finalValue };
            
            // Lógica para limpiar el entregable al cambiar la etapa
            if (field === 'stage_id') {
                // fieldsToUpdate.entregable_id = null;
            }
            
            // Si el progreso llega a 100, cambiar el estado a "Completado"
            if (field === 'Progress' && finalValue === 100) {
                fieldsToUpdate.status = 'Completado';
            }

            updateCell(rowId, fieldsToUpdate);
        }
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && type !== 'textarea') handleSave();
      else if (e.key === 'Escape') { setEditValue(value); setIsEditing(false); }
    };
    
    if (isEditing) {
        switch(type) {
            case 'progress':
                return <input type="number" min="0" max="100" value={editValue || 0} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyPress} className="w-full p-1 border rounded focus:outline-none" autoFocus />;
            case 'select':
            case 'status-select':
                return <select value={editValue || ''} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyPress} className="w-full p-1 border rounded focus:outline-none" autoFocus><option value="">-- Seleccionar --</option>{options.map(option => (<option key={option.id} value={option.id}>{option.name}</option>))}</select>;
            case 'entregable-select':
                const filteredOptions = options.filter(o => o.Stage_id === currentStageId);
                return <select value={editValue || ''} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyPress} className="w-full p-1 border rounded focus:outline-none" autoFocus><option value="">-- Seleccionar --</option>{filteredOptions.map(option => (<option key={option.id} value={option.id}>{option.entregable_nombre}</option>))}</select>;
            default:
                return <textarea value={editValue || ''} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyPress} className="w-full p-1 border rounded focus:outline-none" rows="3" autoFocus/>;
        }
    }
    
    // Vistas no editables
    const displayValue = (field, val) => {
      switch(field) {
        case 'project_id': return proyectos.find(p => p.id === val)?.name || val || '-';
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
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }
    if (field === 'status') {
        return <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getEstadoColor(value)}`} onClick={() => setIsEditing(true)}>{value}</span>;
    }
// console.log(options);

    return <div className={`cursor-pointer p-1 min-h-[28px] ${options.color}`} onClick={() => setIsEditing(true)}>{displayValue(field, value)}</div>;
  };

  const exportToExcel = () => {
    const dataToExport = sortedItems.map(item => ({
      'Etapa': stages.find(s => s.id === item.stage_id)?.name || item.stage_id,
      'Entregable': entregables.find(e => e.id === item.entregable_id)?.entregable_nombre || item.entregable_id,
      'Tarea': item.task_description,
      'Progreso': `${item.Progress || 0}%`,
      'Estado': item.status,
      'Proyecto': proyectos.find(p => p.id === item.project_id)?.name || item.project_id,
      'Responsable': staff.find(s => s.id === item.staff_id)?.name || item.staff_id,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
    XLSX.writeFile(workbook, "Gestion_Tareas.xlsx");
  };

  const updateMultipleTasks = (fieldsToUpdate) => {
    // Lógica para actualizar múltiples tareas a la vez
    console.log("Actualizando filas:", Array.from(selectedRows), "con:", fieldsToUpdate);
    // Aquí iría el dispatch a una acción de Redux para la actualización masiva
  };

  const deselectAll = () => setSelectedRows(new Set());

  return (
    <>
      <FormTask isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddTask} proyectos={proyectos} staff={staff} stages={stages} entregables={entregables} estados={ESTADOS}/>
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between mb-4">
              <div><h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1><p className="text-gray-600">Vista de Hoja de Cálculo Interactiva</p></div>
              <div className="flex items-center gap-2">
                <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Download size={16} /> Exportar</button>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16} /> Nueva Tarea</button>
              </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label><div className="relative"><Search size={16} className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Buscar en toda la tabla..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="pl-10 w-full p-2 border border-gray-300 rounded-lg"/></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Etapa (Categoría)</label><select value={filters.stage_id} onChange={(e) => setFilters(prev => ({ ...prev, stage_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg"><option value="">Todas</option>{stages.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label><select value={filters.staff_id} onChange={(e) => setFilters(prev => ({ ...prev, staff_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg"><option value="">Todos</option>{staff.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
             
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label><select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg"><option value="">Todos</option>{Object.values(ESTADOS).map(estado => (<option key={estado} value={estado}>{estado}</option>))}</select></div>
              <div className="flex items-end"><button onClick={() => setFilters(initialFiltersState)} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full"><XCircle size={16} /> Limpiar</button></div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="w-full bg-white text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-12"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-48"><button onClick={() => requestSort('stage_id')} className="flex items-center gap-1 hover:text-gray-800">Etapa <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-64"><button onClick={() => requestSort('entregable_id')} className="flex items-center gap-1 hover:text-gray-800">Entregable <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-96"><button onClick={() => requestSort('task_description')} className="flex items-center gap-1 hover:text-gray-800">Priority <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-96"><button onClick={() => requestSort('task_description')} className="flex items-center gap-1 hover:text-gray-800">Tarea <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40"><button onClick={() => requestSort('Progress')} className="flex items-center gap-1 hover:text-gray-800">Progreso <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-96"><button onClick={() => requestSort('notes')} className="flex items-center gap-1 hover:text-gray-800">notes <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40"><button onClick={() => requestSort('status')} className="flex items-center gap-1 hover:text-gray-800">Estado <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40"><button onClick={() => requestSort('project_id')} className="flex items-center gap-1 hover:text-gray-800">Proyecto <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40"><button onClick={() => requestSort('staff_id')} className="flex items-center gap-1 hover:text-gray-800">Responsable <ArrowUpDown size={12} /></button></th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${selectedRows.has(item.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-2 border-r"><input type="checkbox" checked={selectedRows.has(item.id)} onChange={() => handleSelectRow(item.id)} /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="stage_id" value={item.stage_id} type="select" options={stages} /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="entregable_id" value={item.entregable_id} type="entregable-select" options={entregables} /></td>
                    
<td className={`px-4 py-2 border-r ${item.Priority === "Alta" ? 'bg-red-200' : item.Priority === "Media" ? 'bg-orange-200' : item.Priority === "Baja" ? 'bg-yellow-200' : ''}`}>  <EditableCell
  className="px-4 py-2 border-r"
    rowId={item.id}
    field="Priority"
    value={item.Priority} // Corregido el error de tipeo y apunta al campo correcto
    type="select"         // El tipo 'select' ahora es suficientemente inteligente
    options={Priorities}  // Pasas tu array de prioridades
  />
</td>
                    
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="task_description" value={item.task_description} type="textarea" /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="Progress" value={item.Progress} type="progress" /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="notes" value={item.notes} type="textarea" /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="status" value={item.status} type="status-select" options={Object.keys(ESTADOS).map(k => ({id: ESTADOS[k], name: ESTADOS[k]}))} /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="project_id" value={item.project_id} type="select" options={proyectos} /></td>
                    <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="staff_id" value={item.staff_id} type="select" options={staff} /></td>
                    <td className="px-4 py-2 border-r">
                      <div className="flex items-center justify-center">
                        <button onClick={() => handleDeleteTask(item.id, item.task_description)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors" title="Eliminar Tarea">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <TaskActions selectedRows={selectedRows} data={filteredData} updateMultipleTasks={updateMultipleTasks} deselectAll={deselectAll}/>
      </div>
    </>
  );
};

export default ProjectExcelView;
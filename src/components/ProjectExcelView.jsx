import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag
} from 'lucide-react';
import * as XLSX from 'xlsx';
import TaskActions from './TaskActions';
// NOTA: Se asume que 'updateTask' y 'getAllFromTable' existen en tu archivo de acciones
import { getAllFromTable, updateTask } from '../store/actions/actions'; 
import { CATEGORIES } from '../store/actionTypes';

// Constante de estados (se mantiene ya que son valores fijos)
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

// Función para asignar colores a los estados (sin cambios)
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

const ProjectExcelView = () => {
  const dispatch = useDispatch();
  
  // Estado principal para las tareas
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // CORRECCIÓN: Nuevos estados para popular los selectores dinámicamente
  const [proyectos, setProyectos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stages, setStages] = useState([]); // Para 'entregableType'

  const [filters, setFilters] = useState({
    project_id: '',
    entregableType: '',
    staff_id: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // CORRECCIÓN: Carga de datos para los selectores al montar el componente
  useEffect(() => {
    const fetchSelectorData = async () => {
      // Cargar Tareas (datos principales)
      const tareasAction = await dispatch(getAllFromTable("Tareas"));
      if (tareasAction && tareasAction.payload) {
        setData(tareasAction.payload);
      }
      // Cargar Proyectos
      const proyectosAction = await dispatch(getAllFromTable("Proyectos"));
      if (proyectosAction && proyectosAction.payload) {
        setProyectos(proyectosAction.payload);
      }
      // Cargar Staff
      const staffAction = await dispatch(getAllFromTable("Staff"));
      if (staffAction && staffAction.payload) {
        setStaff(staffAction.payload);
      }
      // Cargar Stages (para Tipo de Entregable)
      const stagesAction = await dispatch(getAllFromTable("Stage"));
      if (stagesAction && stagesAction.payload) {
        setStages(stagesAction.payload);
      }
    };
    fetchSelectorData();
  }, [dispatch]);
  
  // Lógica de filtros (sin cambios, pero ahora los filtros se poblarán dinámicamente)
  useEffect(() => {
    let filtered = data;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        (item.task_description || '').toLowerCase().includes(searchLower) ||
        (item.entregableType || '').toLowerCase().includes(searchLower) ||
        (item.status || '').toLowerCase().includes(searchLower)
      );
    }
    // NOTA: La lógica de filtrado asume que `project_id` y `staff_id` guardan el ID. 
    // Si guardan el nombre, la comparación `===` sigue funcionando.
    if (filters.project_id) {
      filtered = filtered.filter(item => item.project_id === filters.project_id);
    }
    if (filters.entregableType) {
        filtered = filtered.filter(item => item.entregableType === filters.entregableType);
    }
    if (filters.staff_id) {
      filtered = filtered.filter(item => item.staff_id === filters.staff_id);
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    setFilteredData(filtered);
  }, [data, filters]);

  // Todas las demás funciones (`updateCell`, `EditableCell`, `exportToExcel`, etc.) se mantienen igual
  const updateCell = (rowId, field, value) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === rowId ? { ...item, [field]: value } : item
      )
    );
    dispatch(updateTask(rowId, { [field]: value }));
  };

  const updateMultipleTasks = (taskIds, updates) => { /* ... */ };
  const deselectAll = () => { /* ... */ };

  const EditableCell = ({ rowId, field, value, type = 'text', options = [] }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
  
    const handleSave = () => {
      if (editValue !== value) {
        updateCell(rowId, field, editValue);
      }
      setIsEditing(false);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && type !== 'textarea') {
        handleSave();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditing(false);
      }
    };

    if (isEditing) {
      if (type === 'select') {
        return (
          <select
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            <option value="">-- Seleccionar --</option>
            {/* Las opciones ahora vienen del estado */}
            {options.map(option => (
              <option key={option.id} value={option.name}>{option.name}</option>
            ))}
          </select>
        );
      }
      // otros tipos de input...
      return (
         <textarea
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            rows="3"
         />
      )
    }

    if (field === 'status') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getEstadoColor(value)}`} onClick={() => setIsEditing(true)}>
            {value}
          </span>
        );
    }
    
    return (<div className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[24px]" onClick={() => setIsEditing(true)}>{value || '-'}</div>);
  };

  const exportToExcel = () => { /* ... */ };
  const importFromExcel = (event) => { /* ... */ };
  const addNewRow = () => { /* ... */ };

  const stats = { total: filteredData.length, /* ... */ };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        {/* Header y Estadísticas (sin cambios) */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
                <p className="text-gray-600">Vista de Hoja de Cálculo Interactiva</p>
            </div>
            {/* Botones de acción (sin cambios) */}
        </div>

        {/* CORRECCIÓN: Filtros ahora se populan desde el estado */}
        {showFilters && (
            <div className="grid grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-2">{/* Input de búsqueda */}</div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                    <select value={filters.project_id} onChange={(e) => setFilters(prev => ({ ...prev, project_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="">Todos</option>
                        {proyectos.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                    <select value={filters.staff_id} onChange={(e) => setFilters(prev => ({ ...prev, staff_id: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="">Todos</option>
                        {staff.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="">Todos</option>
                        {Object.values(ESTADOS).map(estado => (<option key={estado} value={estado}>{estado}</option>))}
                    </select>
                </div>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full bg-white text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {/* Cabeceras de la tabla (sin cambios) */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-12"><input type="checkbox" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-48">Tipo de Entregable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-96">Descripción de Tarea</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-64">Notas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40">Proyecto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-40">Responsable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* CORRECCIÓN: Celdas 'select' ahora usan los datos del estado */}
              {filteredData.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${selectedRows.has(item.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-2 border-r"><input type="checkbox" /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="entregableType" value={item.entregableType} type="select" options={stages} /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="task_description" value={item.task_description} type="textarea" /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="status" value={item.status} type="select" options={Object.keys(ESTADOS).map(k => ({id: k, name: ESTADOS[k]}))} /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="notes" value={item.notes} type="textarea" /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="project_id" value={item.project_id} type="select" options={proyectos} /></td>
                  <td className="px-4 py-2 border-r"><EditableCell rowId={item.id} field="staff_id" value={item.staff_id} type="select" options={staff} /></td>
                  <td className="px-4 py-2 border-r text-gray-400 text-xs truncate" title={item.id}>{item.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <TaskActions selectedRows={selectedRows} data={filteredData} updateMultipleTasks={updateMultipleTasks} deselectAll={deselectAll}/>
    </div>
  );
};

export default ProjectExcelView;
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Target, CheckCircle, Clock, Briefcase, Home, Layers, FileText } from 'lucide-react';
import { getAllFromTable } from '../store/actions/actions';

// CAMBIO CLAVE: Importamos la acción de Redux para traer los datos.

// CAMBIO CLAVE: El componente ya no recibe props para los datos.
const ProjectDashboard = () => {
  const dispatch = useDispatch();

  // LÓGICA DE CARGA: Estados locales para manejar los datos y el estado de carga.
  const [loading, setLoading] = useState(true);
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stages, setStages] = useState([]);
  const [entregables, setEntregables] = useState([]);

  // LÓGICA DE CARGA: Hook para buscar todos los datos cuando el componente se monta.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          tareasAction,
          proyectosAction,
          staffAction,
          stagesAction,
          entregablesAction
        ] = await Promise.all([
          dispatch(getAllFromTable("Tareas")),
          dispatch(getAllFromTable("Proyectos")),
          dispatch(getAllFromTable("Staff")),
          dispatch(getAllFromTable("Stage")),
          dispatch(getAllFromTable("Entregables_template"))
        ]);

        // Guardamos los datos en el estado local del componente.
        if (tareasAction?.payload) setTareas(tareasAction.payload);
        if (proyectosAction?.payload) setProyectos(proyectosAction.payload);
        if (staffAction?.payload) setStaff(staffAction.payload);
        if (stagesAction?.payload) setStages(stagesAction.payload);
        if (entregablesAction?.payload) setEntregables(entregablesAction.payload);

      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // El hook `useMemo` ahora depende del estado local del componente.
  const stats = useMemo(() => {
    if (loading || tareas.length === 0) {
      return {
        total: 0, estadoStats: {}, proyectoStats: {}, responsableStats: {}, stageStats: {},
        completadas: 0, enProceso: 0, pendientes: 0, proyectosActivos: 0, totalStages: 0, totalEntregables: 0
      };
    }
    
    // ... (TODA la lógica de cálculo que ya tenías se mantiene EXACTAMENTE IGUAL aquí)
    const estadoStats = tareas.reduce((acc, item) => {
        const status = item.status || 'Sin Estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const tareasPorProyecto = tareas.reduce((acc, tarea) => {
        const pid = tarea.project_id || 'Sin Proyecto';
        if (!acc[pid]) acc[pid] = [];
        acc[pid].push(tarea);
        return acc;
    }, {});
    const proyectoProgress = Object.keys(tareasPorProyecto).reduce((acc, projectId) => {
        const projectTasks = tareasPorProyecto[projectId];
        const totalProgress = projectTasks.reduce((sum, task) => sum + (Number(task.progress_real) || 0), 0);
        const avgProgress = projectTasks.length > 0 ? totalProgress / projectTasks.length : 0;
        const projectName = proyectos.find(p => p.id === projectId)?.name || 'Sin Proyecto';
        acc[projectName] = { progress: avgProgress, taskCount: projectTasks.length };
        return acc;
    }, {});
    const responsableStats = tareas.reduce((acc, item) => {
        const responsable = staff.find(s => s.id === item.staff_id);
        const responsableName = responsable ? `${responsable.name} ${responsable.lastname || ''}`.trim() : 'Sin Asignar';
        acc[responsableName] = (acc[responsableName] || 0) + 1;
        return acc;
    }, {});
    const stageStats = tareas.reduce((acc, tarea) => {
        const stage = stages.find(s => s.id === tarea.stage_id);
        const stageName = stage ? stage.name : 'Sin Etapa';
        acc[stageName] = (acc[stageName] || 0) + 1;
        return acc;
    }, {});
    const proyectosConTareas = new Set(tareas.map(t => t.project_id));

    return {
      total: tareas.length,
      estadoStats,
      proyectoStats: proyectoProgress,
      responsableStats,
      stageStats,
      completadas: estadoStats['Completado'] || 0,
      enProceso: estadoStats['En Progreso'] || 0,
      pendientes: estadoStats['Pendiente'] || 0,
      proyectosActivos: proyectosConTareas.size,
      totalStages: stages.length,
      totalEntregables: entregables.length,
    };

  }, [loading, tareas, proyectos, staff, stages, entregables]);

  // LÓGICA DE CARGA: Muestra un mensaje mientras se cargan los datos.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Cargando Dashboard... 🏗️</div>
      </div>
    );
  }

  // Preparación de datos para los gráficos (sin cambios).
  const estadoChartData = Object.entries(stats.estadoStats).map(([name, value]) => ({ name, value }));
  const responsableChartData = Object.entries(stats.responsableStats).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, tareas]) => ({ name, tareas }));
  const stageChartData = Object.entries(stats.stageStats).sort(([, a], [, b]) => b - a).map(([name, tareas]) => ({ name, tareas }));
  const COLORS = { 'Pendiente': '#FEB70F', 'En Progreso': '#3B82F6', 'Completado': '#10B981', 'Cancelado': '#EF4444' };
  const getColorByName = (name) => COLORS[name] || '#A1A1AA';

  return (
    // ... (Todo el JSX de tu dashboard se mantiene EXACTAMENTE IGUAL aquí)
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Proyectos 🚀</h1>
            <p className="text-gray-600">Resumen ejecutivo del estado actual de las tareas y proyectos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-blue-100 rounded-lg"><Target className="w-6 h-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Tareas</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Completadas</p><p className="text-2xl font-bold text-gray-900">{stats.completadas}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-yellow-100 rounded-lg"><Clock className="w-6 h-6 text-yellow-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">En Progreso</p><p className="text-2xl font-bold text-gray-900">{stats.enProceso}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-purple-100 rounded-lg"><Briefcase className="w-6 h-6 text-purple-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Proyectos Activos</p><p className="text-2xl font-bold text-gray-900">{stats.proyectosActivos}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-indigo-100 rounded-lg"><Layers className="w-6 h-6 text-indigo-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Etapas Definidas</p><p className="text-2xl font-bold text-gray-900">{stats.totalStages}</p></div></div></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center"><div className="p-3 bg-pink-100 rounded-lg"><FileText className="w-6 h-6 text-pink-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Tipos Entregables</p><p className="text-2xl font-bold text-gray-900">{stats.totalEntregables}</p></div></div></div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Gráfico de Tareas por Estado */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Tareas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={estadoChartData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {estadoChartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={getColorByName(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Carga de Trabajo por Responsable */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo (Top 10 Responsables)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responsableChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tareas" name="Tareas Asignadas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Gráfico de Tareas por Etapa */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tareas por Etapa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tareas" name="Nº de Tareas" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
      </div>

      {/* Resumen de Progreso por Proyecto */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Progreso Real por Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.proyectoStats).map(([projectName, projectData]) => {
              const progress = projectData.progress.toFixed(1);
              return (
                <div key={projectName} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Home className="w-4 h-4 mr-2" />{projectName}
                    </h4>
                    <span className="text-sm text-gray-500">{projectData.taskCount} tareas</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso Real Promedio</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
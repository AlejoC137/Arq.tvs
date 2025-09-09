import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Home
} from 'lucide-react';

const ProjectDashboard = ({ data }) => {
  // Calcular estadísticas
  const stats = useMemo(() => {
    const today = new Date();
    
    const estadoStats = data.reduce((acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    }, {});

    const proyectoStats = data.reduce((acc, item) => {
      acc[item.proyecto] = (acc[item.proyecto] || 0) + 1;
      return acc;
    }, {});

    const responsableStats = data.reduce((acc, item) => {
      item.responsables.forEach(resp => {
        acc[resp] = (acc[resp] || 0) + 1;
      });
      return acc;
    }, {});

    const prioridadStats = data.reduce((acc, item) => {
      acc[item.prioridad] = (acc[item.prioridad] || 0) + 1;
      return acc;
    }, {});

    // Tareas vencidas
    const vencidas = data.filter(item => {
      const deadline = item.deadlineDiseno || item.deadlineEjecucion;
      return deadline && new Date(deadline) < today && item.estado !== 'Completado';
    });

    // Tareas próximas a vencer (próximos 7 días)
    const proximasAVencer = data.filter(item => {
      const deadline = item.deadlineDiseno || item.deadlineEjecucion;
      if (!deadline || item.estado === 'Completado') return false;
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    return {
      total: data.length,
      estadoStats,
      proyectoStats,
      responsableStats,
      prioridadStats,
      vencidas: vencidas.length,
      proximasAVencer: proximasAVencer.length,
      completadas: data.filter(item => item.estado === 'Completado').length,
      enProceso: data.filter(item => item.estado === 'En Proceso').length,
      pendientes: data.filter(item => item.estado === 'Pendiente').length
    };
  }, [data]);

  // Preparar datos para gráficos
  const estadoChartData = Object.entries(stats.estadoStats).map(([estado, count]) => ({
    name: estado,
    value: count,
    percentage: ((count / stats.total) * 100).toFixed(1)
  }));

  const proyectoChartData = Object.entries(stats.proyectoStats).map(([proyecto, count]) => ({
    name: proyecto,
    tareas: count,
    percentage: ((count / stats.total) * 100).toFixed(1)
  }));

  const responsableChartData = Object.entries(stats.responsableStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([responsable, count]) => ({
      name: responsable,
      tareas: count
    }));

  const prioridadChartData = Object.entries(stats.prioridadStats).map(([prioridad, count]) => ({
    name: prioridad,
    value: count,
    percentage: ((count / stats.total) * 100).toFixed(1)
  }));

  // Colores para gráficos
  const COLORS = {
    'Pendiente': '#FEB70F',
    'En Proceso': '#3B82F6',
    'Completado': '#10B981',
    'Cancelado': '#EF4444',
    'En Revisión': '#8B5CF6',
    'Alta': '#EF4444',
    'Media': '#FEB70F',
    'Baja': '#10B981'
  };

  const getColorByName = (name) => {
    return COLORS[name] || '#6B7280';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Proyectos</h1>
        <p className="text-gray-600">Resumen ejecutivo de todos los proyectos arquitectónicos</p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tareas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completadas}</p>
              <p className="text-xs text-gray-500">
                {((stats.completadas / stats.total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enProceso}</p>
              <p className="text-xs text-gray-500">
                {((stats.enProceso / stats.total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.vencidas}</p>
              <p className="text-xs text-red-500">Requieren atención</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas importantes */}
      {(stats.vencidas > 0 || stats.proximasAVencer > 0) && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Alertas Importantes</h3>
            <div className="space-y-3">
              {stats.vencidas > 0 && (
                <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">
                      {stats.vencidas} tarea{stats.vencidas > 1 ? 's' : ''} vencida{stats.vencidas > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-600">Requiere acción inmediata</p>
                  </div>
                </div>
              )}
              {stats.proximasAVencer > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <Calendar className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      {stats.proximasAVencer} tarea{stats.proximasAVencer > 1 ? 's' : ''} próxima{stats.proximasAVencer > 1 ? 's' : ''} a vencer
                    </p>
                    <p className="text-sm text-yellow-600">En los próximos 7 días</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de Estados */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Tareas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadoChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estadoChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorByName(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Prioridades */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prioridadChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prioridadChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorByName(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Proyectos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas por Proyecto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={proyectoChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tareas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Responsables */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo por Responsable</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responsableChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tareas" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen por proyecto */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen por Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.proyectoStats).map(([proyecto, count]) => {
              const proyectoData = data.filter(item => item.proyecto === proyecto);
              const completadas = proyectoData.filter(item => item.estado === 'Completado').length;
              const progreso = ((completadas / count) * 100).toFixed(1);

              return (
                <div key={proyecto} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      {proyecto}
                    </h4>
                    <span className="text-sm text-gray-500">{count} tareas</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progreso}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {completadas} de {count} completadas
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

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Users, Briefcase, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { fetchStaff, fetchTasks } from '../store/actions/actions';
import ViewToggle from './common/ViewToggle';

const TeamView = () => {
  const dispatch = useDispatch();
  const [staffMembers, setStaffMembers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffStats, setStaffStats] = useState({});
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar staff y tareas
      const [staffResult, tasksResult] = await Promise.all([
        dispatch(fetchStaff()),
        dispatch(fetchTasks())
      ]);

      console.log('📊 Staff Result:', staffResult);
      console.log('📊 Tasks Result:', tasksResult);

      if (staffResult.success) {
        const staff = staffResult.data || [];
        console.log('👥 Staff loaded:', staff.length, 'members');
        console.log('👥 Staff data:', staff);
        setStaffMembers(staff);
      } else {
        console.error('❌ Error loading staff:', staffResult.error);
      }

      if (tasksResult.success) {
        const tasks = tasksResult.data || [];
        console.log('📋 Tasks loaded:', tasks.length, 'tasks');
        console.log('📋 Sample task:', tasks[0]);
        setAllTasks(tasks);
        calculateStats(staffResult.data || [], tasks);
      } else {
        console.error('❌ Error loading tasks:', tasksResult.error);
      }
    } catch (error) {
      console.error('❌ Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (staff, tasks) => {
    console.log('📈 Calculating stats...');
    console.log('👥 Staff count:', staff.length);
    console.log('📋 Tasks count:', tasks.length);

    const stats = {};

    staff.forEach(member => {
      // Probar ambos nombres de campo por compatibilidad
      const memberTasks = tasks.filter(t =>
        t.staff_id === member.id ||
        t.Staff_id === member.id ||
        t.staffId === member.id
      );

      console.log(`👤 ${member.name} (${member.id}): ${memberTasks.length} tasks`);

      stats[member.id] = {
        total: memberTasks.length,
        pending: memberTasks.filter(t => t.status === 'Pendiente').length,
        inProgress: memberTasks.filter(t => t.status === 'En Progreso' || t.status === 'En Diseño').length,
        completed: memberTasks.filter(t => t.status === 'Completo').length,
        blocked: memberTasks.filter(t => t.status === 'Bloqueado').length,
        completionRate: memberTasks.length > 0
          ? Math.round((memberTasks.filter(t => t.status === 'Completo').length / memberTasks.length) * 100)
          : 0
      };
    });

    console.log('📉 Stats calculated:', stats);
    setStaffStats(stats);
  };


  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-gray-100 text-gray-700',
      'En Progreso': 'bg-blue-100 text-blue-700',
      'En Diseño': 'bg-purple-100 text-purple-700',
      'Completo': 'bg-green-100 text-green-700',
      'Bloqueado': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Equipo de Trabajo</h1>
            </div>
            <p className="text-gray-600">Gestión de tareas por miembro del equipo</p>
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Equipo</p>
                <p className="text-2xl font-bold text-gray-800">{staffMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tareas Totales</p>
                <p className="text-2xl font-bold text-gray-800">{allTasks.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {allTasks.filter(t => t.status === 'Completo').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bloqueadas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {allTasks.filter(t => t.status === 'Bloqueado').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Staff Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {staffMembers.map((staff) => {
              const stats = staffStats[staff.id] || { total: 0, completed: 0, completionRate: 0 };
              const isExpanded = expandedCards.has(staff.id);

              // Filtrar tareas del miembro
              const memberTasks = allTasks.filter(t =>
                t.staff_id === staff.id ||
                t.Staff_id === staff.id ||
                t.staffId === staff.id
              );

              const toggleExpand = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedCards(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(staff.id)) {
                    newSet.delete(staff.id);
                  } else {
                    newSet.add(staff.id);
                  }
                  return newSet;
                });
              };

              return (
                <div
                  key={staff.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                >
                  {/* Header compacto */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                        {staff.name ? staff.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-white truncate">{staff.name}</h3>
                        <p className="text-xs text-blue-100 truncate">{staff.role_description || 'Sin rol'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body - Contador + Botón desplegable */}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-bold text-gray-900">{stats.total}</span> tareas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {stats.total > 0 && (
                          <>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stats.completionRate === 100 ? 'bg-green-100 text-green-700' :
                              stats.completionRate >= 50 ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                              {stats.completionRate}%
                            </span>
                            <button
                              onClick={toggleExpand}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title={isExpanded ? 'Ocultar tareas' : 'Ver tareas'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lista de tareas desplegable */}
                  {isExpanded && memberTasks.length > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50 max-h-64 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {memberTasks.map((task, index) => (
                          <div
                            key={task.id}
                            className="text-xs p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <p className="text-gray-700 line-clamp-2">
                              {task.tema || 'Sin descripción'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer compacto */}
                  <a
                    href={`/StaffTaskModal/${staff.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 px-3 py-2 text-center hover:bg-blue-50 transition-colors border-t border-gray-100"
                  >
                    <p className="text-xs text-gray-500 hover:text-blue-600 font-medium">
                      Ver tareas →
                    </p>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miembro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tareas
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffMembers.map((staff) => {
                    const stats = staffStats[staff.id] || { total: 0, pending: 0, inProgress: 0, completed: 0, blocked: 0, completionRate: 0 };
                    return (
                      <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                              {staff.name ? staff.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{staff.role_description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-semibold text-gray-900">{stats.total}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600" title="Pendientes">
                              {stats.pending || 0}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600" title="En Progreso">
                              {stats.inProgress || 0}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600" title="Completadas">
                              {stats.completed || 0}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600" title="Bloqueadas">
                              {stats.blocked || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{stats.completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`/StaffTaskModal/${staff.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver detalles
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {staffMembers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No hay miembros del equipo</h3>
            <p className="text-gray-500">Agrega miembros para comenzar a gestionar tareas</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TeamView;

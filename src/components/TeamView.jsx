import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Users, Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { fetchStaff, fetchTasks } from '../store/actions/actions';

const TeamView = () => {
  const dispatch = useDispatch();
  const [staffMembers, setStaffMembers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffStats, setStaffStats] = useState({});

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
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Equipo de Trabajo</h1>
          </div>
          <p className="text-gray-600">Gestión de tareas por miembro del equipo</p>
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

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((staff) => {
            const stats = staffStats[staff.id] || { total: 0, pending: 0, inProgress: 0, completed: 0, blocked: 0, completionRate: 0 };
            
            return (
              <a
                key={staff.id}
                href={`/StaffTaskModal/${staff.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 overflow-hidden group"
              >
                {/* Header con nombre */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {staff.name ? staff.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 text-white">
                      <h3 className="font-bold text-lg truncate">{staff.name}</h3>
                      <p className="text-sm text-blue-100 truncate">{staff.role_description || 'Sin rol asignado'}</p>
                    </div>
                  </div>
                </div>

                {/* Body con estadísticas */}
                <div className="p-4 space-y-3">
                  {/* Progreso */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Progreso</span>
                      <span className="text-xs font-bold text-gray-800">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Estadísticas de tareas */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                      <p className="text-xs text-gray-600">Completas</p>
                    </div>
                  </div>

                  {/* Badges de estado */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {stats.pending > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <Clock className="w-3 h-3 mr-1" />
                        {stats.pending} Pendiente{stats.pending > 1 ? 's' : ''}
                      </span>
                    )}
                    {stats.inProgress > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {stats.inProgress} En Curso
                      </span>
                    )}
                    {stats.blocked > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {stats.blocked} Bloqueada{stats.blocked > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-2 text-center group-hover:bg-blue-50 transition-colors">
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                    Click para ver tareas →
                  </p>
                </div>
              </a>
            );
          })}
        </div>

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

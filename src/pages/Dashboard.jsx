import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Calendar,
  CheckSquare,
  Filter,
  Search,
  User,
  Clock,
  AlertCircle,
  FileText,
  Home,
  Plus
} from 'lucide-react';

import { fetchProjects } from '../store/actions/projectActions.js';
import { fetchTasks } from '../store/actions/taskActions.js';
import { fetchStaff } from '../store/actions/staffActions.js';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

// Team Overview Component
const TeamOverview = () => {
  const { members } = useSelector(state => state.staff);
  const { tasks } = useSelector(state => state.tasks);

  // Calcular tareas por miembro
  const membersWithTasks = useMemo(() => {
    return members.map(member => {
      const memberTasks = tasks.filter(task => task.staff_id === member.id);
      const completedTasks = memberTasks.filter(t => t.status === 'Completado').length;
      const totalTasks = memberTasks.length;

      return {
        ...member,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      };
    });
  }, [members, tasks]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Equipo y Responsabilidades
        </CardTitle>
        <CardDescription>
          Vista compacta del equipo y contadores de tareas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {membersWithTasks.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 truncate">{member.role_description}</p>
                </div>
              </div>

              {/* Contador de tareas */}
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{member.totalTasks}</span> tareas
                  </span>
                </div>
                {member.totalTasks > 0 && (
                  <span className={`font-semibold ${member.completionRate === 100 ? 'text-green-600' :
                      member.completionRate >= 50 ? 'text-blue-600' :
                        'text-orange-600'
                    }`}>
                    {member.completionRate}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {members.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay miembros del equipo registrados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Project Stats Component
const ProjectStats = () => {
  const { projects } = useSelector(state => state.projects);
  const { tasks } = useSelector(state => state.tasks);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completo').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pendiente').length;
    const inProgressTasks = tasks.filter(task => task.status === 'En Progreso').length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [projects, tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Proyectos</p>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tareas</p>
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
              <p className="text-3xl font-bold">{stats.inProgressTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasa Completada</p>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Recent Tasks Component
const RecentTasks = () => {
  const { tasks, loading } = useSelector(state => state.tasks);

  const recentTasks = useMemo(() => {
    return tasks
      .filter(task => task.status !== 'Completo')
      .slice(0, 6);
  }, [tasks]);

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Pendiente': 'secondary',
      'En Diseño': 'default',
      'En Progreso': 'default',
      'Aprobación Requerida': 'warning',
      'Bloqueado': 'destructive',
      'En Discusión': 'warning',
      'Completo': 'success',
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          Tareas Recientes
        </CardTitle>
        <CardDescription>
          Últimas tareas pendientes y en progreso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{task.tema}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{task.category}</span>
                  {task.projects?.name && (
                    <>
                      <span>•</span>
                      <span>{task.projects.name}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(task.status)} className="ml-2">
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
        {recentTasks.length === 0 && (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay tareas pendientes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchStaff());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Home className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard de Gestión Arquitectónica</h1>
        </div>
        <p className="text-muted-foreground">
          Seguimiento de proyectos, tareas y equipo de trabajo
        </p>
      </div>

      <div className="space-y-8">
        <ProjectStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TeamOverview />
          <RecentTasks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Bell,
  Save,
  Upload,
  Home as HomeIcon
} from 'lucide-react';
import './index.css';
import ProjectTaskModal from './components/ProjectTaskModal';
import StaffTaskModal from './components/StaffTaskModal';
import { getEnabledTabs, getDefaultRoute } from './config/navigationConfig';
import Materiales from './components/Materiales.jsx'; // <- incluida la vista de Materiales
import MigracionDatosProyectos from './components/MigracionDatosProyectos.jsx'; // Herramienta de migración temporal

function App() {
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Cargar datos de Supabase al inicializar
  useEffect(() => {
    // TODO: Cargar datos desde Supabase
    console.log('Cargando datos desde Supabase...');
  }, []);

  // Calcular notificaciones
  useEffect(() => {
    const today = new Date();
    const newNotifications = [];

    // Tareas vencidas
    const vencidas = data.filter(item => {
      const deadline = item.deadlineDiseno || item.deadlineEjecucion;
      return deadline && new Date(deadline) < today && item.estado !== 'Completado';
    });

    if (vencidas.length > 0) {
      newNotifications.push({
        id: 'vencidas',
        type: 'error',
        title: 'Tareas Vencidas',
        message: `${vencidas.length} tarea${vencidas.length > 1 ? 's' : ''} vencida${vencidas.length > 1 ? 's' : ''}`,
        count: vencidas.length
      });
    }

    // Tareas próximas a vencer
    const proximasAVencer = data.filter(item => {
      const deadline = item.deadlineDiseno || item.deadlineEjecucion;
      if (!deadline || item.estado === 'Completado') return false;
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    if (proximasAVencer.length > 0) {
      newNotifications.push({
        id: 'proximas',
        type: 'warning',
        title: 'Próximas a Vencer',
        message: `${proximasAVencer.length} tarea${proximasAVencer.length > 1 ? 's' : ''} en los próximos 7 días`,
        count: proximasAVencer.length
      });
    }

    setNotifications(newNotifications);
  }, [data]);

  const navigationItems = getEnabledTabs();

  const saveToFile = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `proyectos_arquitectonicos_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setData(importedData);
          alert('Datos cargados exitosamente');
        } catch (error) {
          alert('Error al cargar el archivo: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    // <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ARQ.TVS</h1>
                <p className="text-xs text-gray-600">Gestión de Proyectos</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink key={item.id} item={item} />
              ))}
            </div>
          </nav>

          {/* Notificaciones */}
          {notifications.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2 mb-3">
                <Bell size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Alertas</span>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg text-sm ${
                      notification.type === 'error' 
                        ? 'bg-red-50 border border-red-200 text-red-700' 
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                    }`}
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-xs mt-1">{notification.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer con acciones */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <button
                onClick={saveToFile}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Guardar copia de seguridad"
              >
                <Save size={16} />
                <span className="text-xs">Backup</span>
              </button>
              <label className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                     title="Cargar desde archivo">
                <Upload size={16} />
                <span className="text-xs">Cargar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={loadFromFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Cargando...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
              <Route path="/ProjectTaskModal/:id" element={<ProjectTaskModal />} />
              <Route path="/StaffTaskModal/:staffId" element={<StaffTaskModal />} />
              <Route path="/Materiales" element={<Materiales />} />
              <Route path="/migracion-datos" element={<MigracionDatosProyectos />} />
              
              {/* Rutas dinámicas desde configuración */}
              {navigationItems.map((item) => (
                <Route 
                  key={item.id}
                  path={item.path} 
                  element={<item.component data={data} setData={setData} />} 
                />
              ))}
            </Routes>
          </Suspense>
        </div>
      </div>
    // </Router>
  );
}

// Componente NavLink para manejar la navegación activa
const NavLink = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon size={20} />
      <div className="flex-1">
        <div className="font-medium">{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-500">{item.description}</div>
        )}
      </div>
    </Link>
  );
};

export default App;

// ARCHIVO: src/components/ProjectPlans/ProjectHeader.jsx

import React from 'react';
import { User, Calendar, Tag } from 'lucide-react';

/**
 * Componente para mostrar la información del proyecto en el header
 */
const ProjectHeader = ({ project, projectProgress }) => {
  if (!project) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-shrink-0">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-600">Cliente</p>
            <p className="text-gray-800">{project.client_name || 'No especificado'}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-600">Fechas</p>
            <p className="text-gray-800">
              {`Inicio: ${project.start_date || 'N/A'} | Fin: ${project.end_date || 'N/A'}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-600">Estado Actual</p>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {project.status || 'No definido'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600">Progreso General</span>
          <span className="text-sm font-bold text-blue-600">{projectProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${projectProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;

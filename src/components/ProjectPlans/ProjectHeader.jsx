// ARCHIVO: src/components/ProjectPlans/ProjectHeader.jsx

import React, { useState } from 'react';
import { User, Calendar, Tag, ChevronDown, ChevronRight, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import supabase from '../../config/supabaseClient';
import { 
  parseDatosProyecto, 
  stringifyDatosProyecto,
  CATEGORIAS_MATERIALES,
  ETAPAS_PROYECTO
} from '../../constants/datosProyecto';
import { getEspaciosPorProyecto } from '../../constants/espacios';

/**
 * Componente para mostrar la información del proyecto en el header
 */
const ProjectHeader = ({ project, projectProgress, onProjectUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  if (!project) return null;
  
  const datos = isEditing ? editData : parseDatosProyecto(project.Datos);
  const hasDatos = datos.materialesConstantes.length > 0 || datos.presentacionesEspacio.length > 0;
  const espaciosProyecto = getEspaciosPorProyecto(project.name);
  
  const startEditing = () => {
    const currentDatos = parseDatosProyecto(project.Datos);
    setEditData({ ...currentDatos });
    setIsEditing(true);
    setIsExpanded(true);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };
  
  const saveChanges = async () => {
    try {
      const datosString = stringifyDatosProyecto(editData);
      
      const { error: updateError } = await supabase
        .from('Proyectos')
        .update({ Datos: datosString })
        .eq('id', project.id);
      
      if (updateError) throw updateError;
      
      // Notificar al padre si hay callback
      if (onProjectUpdate) {
        onProjectUpdate({ ...project, Datos: datosString });
      }
      
      setIsEditing(false);
      setEditData({});
      
      // Recargar la página para actualizar el proyecto
      window.location.reload();
    } catch (err) {
      console.error('Error guardando:', err);
      alert('Error al guardar los cambios');
    }
  };

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
      
      {/* Sección de Datos del Proyecto */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Datos del Proyecto</h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={saveChanges}
                  className="p-2 text-green-600 rounded-full transition-colors duration-200 hover:bg-green-100"
                  title="Guardar cambios"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 text-red-600 rounded-full transition-colors duration-200 hover:bg-red-100"
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {hasDatos && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-gray-400 rounded-full transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
                    title={isExpanded ? 'Colapsar' : 'Expandir'}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={startEditing}
                  className="p-2 text-gray-400 rounded-full transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600"
                  title="Editar datos"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Etapa */}
        <div className="mb-3">
          {isEditing ? (
            <select
              value={datos.etapa}
              onChange={(e) => setEditData({ ...editData, etapa: e.target.value })}
              className="text-xs font-medium px-3 py-1 rounded-full border-2 border-blue-500 bg-white"
            >
              {ETAPAS_PROYECTO.map(etapa => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          ) : (
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {datos.etapa}
            </span>
          )}
        </div>
        
        {/* Contenido expandible */}
        {isExpanded && (isEditing || hasDatos) && (
          <div className="space-y-3">
            {/* Materiales Constantes */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Materiales Constantes</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {datos.materialesConstantes.map((material, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs bg-blue-50 p-2 rounded border border-blue-100">
                    {isEditing ? (
                      <div className="flex-1 space-y-2">
                        <select
                          value={material.categoria}
                          onChange={(e) => {
                            const updated = [...editData.materialesConstantes];
                            updated[idx].categoria = e.target.value;
                            setEditData({ ...editData, materialesConstantes: updated });
                          }}
                          className="w-full text-xs px-2 py-1 border border-blue-300 rounded"
                        >
                          {CATEGORIAS_MATERIALES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={material.nombre}
                          onChange={(e) => {
                            const updated = [...editData.materialesConstantes];
                            updated[idx].nombre = e.target.value;
                            setEditData({ ...editData, materialesConstantes: updated });
                          }}
                          placeholder="Nombre del material"
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={material.observaciones}
                          onChange={(e) => {
                            const updated = [...editData.materialesConstantes];
                            updated[idx].observaciones = e.target.value;
                            setEditData({ ...editData, materialesConstantes: updated });
                          }}
                          placeholder="Observaciones (opcional)"
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">{material.categoria}</div>
                        <div className="text-gray-700">{material.nombre}</div>
                        {material.observaciones && (
                          <div className="text-xs text-gray-500">{material.observaciones}</div>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => {
                          setEditData({
                            ...editData,
                            materialesConstantes: editData.materialesConstantes.filter((_, i) => i !== idx)
                          });
                        }}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <button
                  onClick={() => {
                    const newMaterial = { categoria: 'Griferias', materialId: '', nombre: 'Nuevo Material', observaciones: '' };
                    setEditData({
                      ...editData,
                      materialesConstantes: [...editData.materialesConstantes, newMaterial]
                    });
                  }}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-3 h-3" /> Agregar Material
                </button>
              )}
            </div>
            
            {/* Presentaciones */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Presentaciones</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {datos.presentacionesEspacio.map((pres, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs bg-green-50 p-2 rounded border border-green-100">
                    {isEditing ? (
                      <div className="flex-1 space-y-2">
                        <select
                          value={pres.espacio}
                          onChange={(e) => {
                            const updated = [...editData.presentacionesEspacio];
                            updated[idx].espacio = e.target.value;
                            setEditData({ ...editData, presentacionesEspacio: updated });
                          }}
                          className="w-full text-xs px-2 py-1 border border-green-300 rounded"
                        >
                          {espaciosProyecto.map(esp => (
                            <option key={esp} value={esp}>{esp}</option>
                          ))}
                        </select>
                        <input
                          type="url"
                          value={pres.link}
                          onChange={(e) => {
                            const updated = [...editData.presentacionesEspacio];
                            updated[idx].link = e.target.value;
                            setEditData({ ...editData, presentacionesEspacio: updated });
                          }}
                          placeholder="https://..."
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium text-green-900">{pres.espacio}</div>
                        <a 
                          href={pres.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {pres.link}
                        </a>
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => {
                          setEditData({
                            ...editData,
                            presentacionesEspacio: editData.presentacionesEspacio.filter((_, i) => i !== idx)
                          });
                        }}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <button
                  onClick={() => {
                    const newPres = { espacio: espaciosProyecto[0] || '', link: '', fechaActualizacion: new Date().toISOString().split('T')[0] };
                    setEditData({
                      ...editData,
                      presentacionesEspacio: [...editData.presentacionesEspacio, newPres]
                    });
                  }}
                  className="mt-2 flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                >
                  <Plus className="w-3 h-3" /> Agregar Presentación
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;

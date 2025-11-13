import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ExternalLink } from 'lucide-react';
import supabase from '../config/supabaseClient';
import { 
  CATEGORIAS_MATERIALES, 
  ETAPAS_PROYECTO,
  parseDatosProyecto,
  stringifyDatosProyecto,
  DATOS_PROYECTO_INICIAL
} from '../constants/datosProyecto';
import { getEspaciosPorProyecto } from '../constants/espacios';

const DatosProyectoEditor = ({ proyecto, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('etapa');
  const [datos, setDatos] = useState(DATOS_PROYECTO_INICIAL);
  const [materiales, setMateriales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para nuevo material
  const [nuevoMaterial, setNuevoMaterial] = useState({
    categoria: '',
    materialId: '',
    nombre: '',
    observaciones: ''
  });

  // Estado para nueva presentación
  const [nuevaPresentacion, setNuevaPresentacion] = useState({
    espacio: '',
    link: '',
    fechaActualizacion: new Date().toISOString().split('T')[0]
  });

  // Cargar datos del proyecto
  useEffect(() => {
    if (proyecto) {
      const datosParseados = parseDatosProyecto(proyecto.Datos);
      setDatos(datosParseados);
    }
  }, [proyecto]);

  // Cargar materiales de Supabase
  useEffect(() => {
    const loadMateriales = async () => {
      try {
        const { data, error } = await supabase
          .from('Material')
          .select('id, nombre, categoria')
          .order('nombre');
        
        if (error) throw error;
        setMateriales(data || []);
      } catch (err) {
        console.error('Error cargando materiales:', err);
      }
    };
    
    loadMateriales();
  }, []);

  // Obtener espacios del proyecto actual
  const espaciosProyecto = getEspaciosPorProyecto(proyecto?.name || '');

  // Handlers para materiales constantes
  const agregarMaterial = () => {
    if (!nuevoMaterial.categoria || !nuevoMaterial.materialId) {
      setError('Selecciona categoría y material');
      return;
    }

    const materialSeleccionado = materiales.find(m => m.id === nuevoMaterial.materialId);
    
    const nuevoItem = {
      categoria: nuevoMaterial.categoria,
      materialId: nuevoMaterial.materialId,
      nombre: materialSeleccionado?.nombre || nuevoMaterial.nombre,
      observaciones: nuevoMaterial.observaciones
    };

    setDatos(prev => ({
      ...prev,
      materialesConstantes: [...prev.materialesConstantes, nuevoItem]
    }));

    setNuevoMaterial({
      categoria: '',
      materialId: '',
      nombre: '',
      observaciones: ''
    });
    setError(null);
  };

  const eliminarMaterial = (index) => {
    setDatos(prev => ({
      ...prev,
      materialesConstantes: prev.materialesConstantes.filter((_, i) => i !== index)
    }));
  };

  // Handlers para presentaciones
  const agregarPresentacion = () => {
    if (!nuevaPresentacion.espacio || !nuevaPresentacion.link) {
      setError('Completa espacio y link');
      return;
    }

    setDatos(prev => ({
      ...prev,
      presentacionesEspacio: [...prev.presentacionesEspacio, { ...nuevaPresentacion }]
    }));

    setNuevaPresentacion({
      espacio: '',
      link: '',
      fechaActualizacion: new Date().toISOString().split('T')[0]
    });
    setError(null);
  };

  const eliminarPresentacion = (index) => {
    setDatos(prev => ({
      ...prev,
      presentacionesEspacio: prev.presentacionesEspacio.filter((_, i) => i !== index)
    }));
  };

  // Handler para guardar
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const datosString = stringifyDatosProyecto(datos);
      
      const { data: updatedProject, error: updateError } = await supabase
        .from('Proyectos')
        .update({ Datos: datosString })
        .eq('id', proyecto.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (onSave) {
        onSave(updatedProject);
      }
      
      onClose();
    } catch (err) {
      console.error('Error guardando datos:', err);
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar materiales por categoría seleccionada
  const materialesFiltrados = nuevoMaterial.categoria
    ? materiales.filter(m => 
        m.categoria?.toLowerCase() === nuevoMaterial.categoria.toLowerCase()
      )
    : materiales;

  if (!proyecto) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Datos del Proyecto: <span className="font-bold text-blue-600">{proyecto.name}</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5">
          <button
            onClick={() => setActiveTab('etapa')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'etapa'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Etapa
          </button>
          <button
            onClick={() => setActiveTab('materiales')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'materiales'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Materiales Constantes
          </button>
          <button
            onClick={() => setActiveTab('presentaciones')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'presentaciones'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Presentaciones
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab: Etapa */}
          {activeTab === 'etapa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etapa Actual del Proyecto
              </label>
              <select
                value={datos.etapa}
                onChange={(e) => setDatos(prev => ({ ...prev, etapa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ETAPAS_PROYECTO.map(etapa => (
                  <option key={etapa} value={etapa}>{etapa}</option>
                ))}
              </select>
              <p className="mt-4 text-sm text-gray-500">
                La etapa representa el estado general del proyecto en el ciclo de vida.
              </p>
            </div>
          )}

          {/* Tab: Materiales */}
          {activeTab === 'materiales' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Materiales Constantes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define los materiales que se utilizarán consistentemente en todo el proyecto.
              </p>

              {/* Lista de materiales */}
              <div className="space-y-3 mb-6">
                {datos.materialesConstantes.map((material, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{material.categoria}</div>
                      <div className="text-sm text-gray-600">{material.nombre}</div>
                      {material.observaciones && (
                        <div className="text-xs text-gray-500 mt-1">{material.observaciones}</div>
                      )}
                    </div>
                    <button
                      onClick={() => eliminarMaterial(index)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulario para agregar material */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Agregar Material</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={nuevoMaterial.categoria}
                      onChange={(e) => setNuevoMaterial(prev => ({ 
                        ...prev, 
                        categoria: e.target.value,
                        materialId: '',
                        nombre: ''
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      {CATEGORIAS_MATERIALES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <select
                      value={nuevoMaterial.materialId}
                      onChange={(e) => {
                        const selectedMat = materiales.find(m => m.id === e.target.value);
                        setNuevoMaterial(prev => ({
                          ...prev,
                          materialId: e.target.value,
                          nombre: selectedMat?.nombre || ''
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      disabled={!nuevoMaterial.categoria}
                    >
                      <option value="">Seleccionar...</option>
                      {materialesFiltrados.map(mat => (
                        <option key={mat.id} value={mat.id}>{mat.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones (opcional)
                    </label>
                    <input
                      type="text"
                      value={nuevoMaterial.observaciones}
                      onChange={(e) => setNuevoMaterial(prev => ({ ...prev, observaciones: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Para todos los baños"
                    />
                  </div>
                </div>

                <button
                  onClick={agregarMaterial}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Material
                </button>
              </div>
            </div>
          )}

          {/* Tab: Presentaciones */}
          {activeTab === 'presentaciones' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Presentaciones por Espacio</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vincula presentaciones (PPT, PDF, etc.) a espacios específicos del proyecto.
              </p>

              {/* Lista de presentaciones */}
              <div className="space-y-3 mb-6">
                {datos.presentacionesEspacio.map((pres, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{pres.espacio}</div>
                      <a 
                        href={pres.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {pres.link}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {pres.fechaActualizacion && (
                        <div className="text-xs text-gray-500 mt-1">
                          Actualizado: {pres.fechaActualizacion}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => eliminarPresentacion(index)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulario para agregar presentación */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Agregar Presentación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Espacio
                    </label>
                    <select
                      value={nuevaPresentacion.espacio}
                      onChange={(e) => setNuevaPresentacion(prev => ({ ...prev, espacio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      {espaciosProyecto.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Actualización
                    </label>
                    <input
                      type="date"
                      value={nuevaPresentacion.fechaActualizacion}
                      onChange={(e) => setNuevaPresentacion(prev => ({ ...prev, fechaActualizacion: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link de la Presentación
                    </label>
                    <input
                      type="url"
                      value={nuevaPresentacion.link}
                      onChange={(e) => setNuevaPresentacion(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <button
                  onClick={agregarPresentacion}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Presentación
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 p-5 border-t border-gray-200 bg-gray-50">
          {error && <p className="text-sm text-red-600 mr-auto">{error}</p>}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatosProyectoEditor;

import React, { useState, useEffect, useMemo } from 'react'; // 1. Importar useMemo
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Filter, Plus, FileText, Edit, Trash2, X
} from 'lucide-react';
import { 
  getAllFromTable, 
  createEntregableTemplate, 
  updateEntregableTemplate, 
  deleteEntregableTemplate 
} from '../store/actions/actions';

const CATEGORIAS_ENTREGABLE = {
  ARQUITECTONICA: 'Arquitectónica',
  TECNICA: 'Técnica', 
  CONSTRUCCION: 'Construcción'
};

const PlanosView = () => {
  const dispatch = useDispatch();
  
  const { 
    list: templates = [], 
    loading, 
    error 
  } = useSelector(state => state.entregables?.Entregables_template || { list: [], loading: false, error: null });

  // --- Component State ---
  // Mantenemos solo el estado que es modificado directamente por el usuario
  const [filters, setFilters] = useState({
    Categoria: '',
    vistaTipo: '',
    escala_tipica: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    dispatch(getAllFromTable("Entregables_template"));
  }, [dispatch]);

  // 2. REMOVED: El useEffect que causaba el bucle infinito y el useState para filteredTemplates.

  // 3. ADDED: Calcular `filteredTemplates` con useMemo.
  // Esto es más eficiente. El cálculo solo se re-ejecuta si `templates` o `filters` cambian.
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    let filtered = templates;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.entregable_nombre?.toLowerCase().includes(searchTerm) ||
        template.vistaTipo?.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.Categoria) {
      filtered = filtered.filter(template => template.Categoria === filters.Categoria);
    }
    if (filters.vistaTipo) {
      filtered = filtered.filter(template => template.vistaTipo === filters.vistaTipo);
    }
    if (filters.escala_tipica) {
      filtered = filtered.filter(template => template.escala_tipica === filters.escala_tipica);
    }
    
    return filtered;
  }, [templates, filters]); // Dependencias: el cálculo se re-ejecuta solo si cambian

  // El resto del componente permanece igual, ya que usa la variable `filteredTemplates`
  // que ahora es calculada de forma segura por useMemo.

  // --- CRUD Handlers (sin cambios, ya estaban bien) ---
  const handleOpenModal = (template = null) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTemplate(null);
  };
  
  const handleSaveTemplate = async (formData) => {
    try {
      if (currentTemplate && currentTemplate.id) {
        await dispatch(updateEntregableTemplate(currentTemplate.id, formData));
        alert('Plantilla actualizada con éxito');
      } else {
        await dispatch(createEntregableTemplate(formData));
        alert('Plantilla creada con éxito');
      }
      dispatch(getAllFromTable("Entregables_template"));
      handleCloseModal();
    } catch (e) {
      console.error("Fallo al guardar la plantilla:", e);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      try {
        await dispatch(deleteEntregableTemplate(templateId));
        alert('Plantilla eliminada con éxito');
        dispatch(getAllFromTable("Entregables_template"));
      } catch (e) {
        console.error("Fallo al eliminar la plantilla:", e);
      }
    }
  };

  // --- Helper Functions ---
  const getAllUniqueValues = (key) => [...new Set(templates.map(t => t[key]).filter(Boolean))].sort();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catálogo de Plantillas de Entregables</h1>
              <p className="text-gray-600">Gestiona las plantillas estándar para los proyectos.</p>
            </div>
            <div className="flex items-center gap-2">
               <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} /> Filtros
                </button>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={16} /> Crear Plantilla
              </button>
            </div>
        </div>
        
        {/* Filtros UI */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <input type="text" placeholder="Buscar por nombre o tipo..." value={filters.search} onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-lg"/>
            <select value={filters.Categoria} onChange={(e) => setFilters(prev => ({...prev, Categoria: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Todas las Categorías</option>
              {Object.values(CATEGORIAS_ENTREGABLE).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={filters.vistaTipo} onChange={(e) => setFilters(prev => ({...prev, vistaTipo: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Todos los Tipos de Vista</option>
              {getAllUniqueValues('vistaTipo').map(vt => <option key={vt} value={vt}>{vt}</option>)}
            </select>
            <select value={filters.escala_tipica} onChange={(e) => setFilters(prev => ({...prev, escala_tipica: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Todas las Escalas</option>
              {getAllUniqueValues('escala_tipica').map(es => <option key={es} value={es}>{es}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Tabla de Plantillas */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full"><p>Cargando plantillas...</p></div>
        ) : (
          <div className="min-w-full">
            <table className="w-full bg-white">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Entregable</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Vista</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtipo de Vista</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escala</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{template.entregable_nombre}</td>
                    <td className="px-4 py-3">{template.Categoria}</td>
                    <td className="px-4 py-3">{template.vistaTipo}</td>
                    <td className="px-4 py-3">{template.vistaSubTipo}</td>
                    <td className="px-4 py-3">{template.escala_tipica}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleOpenModal(template)} className="text-blue-600 hover:text-blue-800" title="Editar"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteTemplate(template.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <TemplateFormModal
          template={currentTemplate}
          onClose={handleCloseModal}
          onSave={handleSaveTemplate}
          categorias={Object.values(CATEGORIAS_ENTREGABLE)}
        />
      )}
    </div>
  );
};


// Componente Modal sin cambios
const TemplateFormModal = ({ template, onClose, onSave, categorias }) => {
  const [formData, setFormData] = useState({
    entregable_nombre: template?.entregable_nombre || '',
    Categoria: template?.Categoria || '',
    vistaTipo: template?.vistaTipo || '',
    vistaSubTipo: template?.vistaSubTipo || '',
    escala_tipica: template?.escala_tipica || '',
    software_utilizado: template?.software_utilizado || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{template ? 'Editar' : 'Crear'} Plantilla</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="text" name="entregable_nombre" value={formData.entregable_nombre} onChange={handleChange} placeholder="Nombre del Entregable" required className="w-full border border-gray-300 rounded-md p-2"/>
            <select name="Categoria" value={formData.Categoria} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="text" name="vistaTipo" value={formData.vistaTipo} onChange={handleChange} placeholder="Tipo de Vista (e.g., Plantas, Cortes)" className="w-full border border-gray-300 rounded-md p-2"/>
            <input type="text" name="vistaSubTipo" value={formData.vistaSubTipo} onChange={handleChange} placeholder="Subtipo de Vista (e.g., De Locales, Longitudinal)" className="w-full border border-gray-300 rounded-md p-2"/>
            <input type="text" name="escala_tipica" value={formData.escala_tipica} onChange={handleChange} placeholder="Escala Típica (e.g., 1:100)" className="w-full border border-gray-300 rounded-md p-2"/>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PlanosView;
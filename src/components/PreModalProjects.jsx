import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Folder, Edit2, Save, X, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { getAllFromTable } from '../store/actions/actions';
import supabase from '../config/supabaseClient';
import { 
  parseDatosProyecto, 
  stringifyDatosProyecto,
  CATEGORIAS_MATERIALES,
  ETAPAS_PROYECTO
} from '../constants/datosProyecto';
import { getEspaciosPorProyecto } from '../constants/espacios';

const PreModalProjects = () => {
    const dispatch = useDispatch();
    const [proyectos, setProyectos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [materiales, setMateriales] = useState([]);
    
    // Estado para cards expandidas y en edición
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [editingCards, setEditingCards] = useState(new Set());
    const [editData, setEditData] = useState({});

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        // Cargar proyectos y materiales en paralelo
        Promise.all([
            dispatch(getAllFromTable("Proyectos")),
            supabase.from('Material').select('id, nombre, categoria').order('nombre')
        ])
            .then(([projectsAction, materialsResult]) => {
                if (projectsAction?.payload) {
                    setProyectos(projectsAction.payload);
                } else {
                    throw new Error("No se recibieron datos válidos.");
                }
                
                if (materialsResult.data) {
                    setMateriales(materialsResult.data);
                }
            })
            .catch(err => {
                console.error("Error al obtener datos:", err);
                setError("No se pudieron cargar los datos.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [dispatch]);

    // Toggle expand/collapse de card
    const toggleCard = (projectId) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };
    
    // Entrar en modo edición
    const startEditing = (proyecto) => {
        const datos = parseDatosProyecto(proyecto.Datos);
        setEditData({
            ...editData,
            [proyecto.id]: { ...datos }
        });
        setEditingCards(prev => new Set([...prev, proyecto.id]));
        setExpandedCards(prev => new Set([...prev, proyecto.id]));
    };
    
    // Cancelar edición
    const cancelEditing = (projectId) => {
        setEditingCards(prev => {
            const newSet = new Set(prev);
            newSet.delete(projectId);
            return newSet;
        });
        const newEditData = { ...editData };
        delete newEditData[projectId];
        setEditData(newEditData);
    };
    
    // Guardar cambios
    const saveChanges = async (proyecto) => {
        try {
            const datos = editData[proyecto.id];
            const datosString = stringifyDatosProyecto(datos);
            
            const { data: updatedProject, error: updateError } = await supabase
                .from('Proyectos')
                .update({ Datos: datosString })
                .eq('id', proyecto.id)
                .select()
                .single();
            
            if (updateError) throw updateError;
            
            // Actualizar el estado local
            setProyectos(prev => prev.map(p => 
                p.id === proyecto.id ? updatedProject : p
            ));
            
            // Salir del modo edición
            cancelEditing(proyecto.id);
        } catch (err) {
            console.error('Error guardando:', err);
            alert('Error al guardar los cambios');
        }
    };

    // --- RENDERIZADO ---

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                <header className="mb-8 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">Seleccionar Proyecto</h1>
                    <p className="text-md text-gray-600 mt-1">Elige un proyecto para ver el detalle de sus tareas.</p>
                </header>
                <div className="max-w-7xl mx-auto text-center text-gray-500 py-16">
                    Cargando proyectos...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                <header className="mb-8 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">Seleccionar Proyecto</h1>
                </header>
                <div className="max-w-7xl mx-auto text-center text-red-500 py-16 bg-white rounded-lg shadow-md">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Seleccionar Proyecto</h1>
                    <p className="text-md text-gray-600 mt-1">Elige un proyecto para ver el detalle de sus tareas.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proyectos.map((proyecto) => {
                        const isExpanded = expandedCards.has(proyecto.id);
                        const isEditing = editingCards.has(proyecto.id);
                        const datos = isEditing ? editData[proyecto.id] : parseDatosProyecto(proyecto.Datos);
                        const hasDatos = datos.materialesConstantes.length > 0 || datos.presentacionesEspacio.length > 0;
                        const espaciosProyecto = getEspaciosPorProyecto(proyecto.name);
                        
                        return (
                            <div
                                key={proyecto.id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-400"
                            >
                                {/* Header de la card */}
                                <div className="flex items-center justify-between gap-4 p-5">
                                    <a
                                        href={`/ProjectTaskModal/${proyecto.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 flex-grow truncate cursor-pointer"
                                        title={`Abrir ${proyecto.name}`}
                                    >
                                        <Folder className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                        <span className="font-semibold text-lg text-gray-800 truncate">
                                            {proyecto.name}
                                        </span>
                                    </a>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {isEditing ? (
                                            <>
                                                {/* Botones de guardar/cancelar en modo edición */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveChanges(proyecto);
                                                    }}
                                                    className="p-2 text-green-600 rounded-full transition-colors duration-200 hover:bg-green-100"
                                                    title="Guardar cambios"
                                                >
                                                    <Save className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        cancelEditing(proyecto.id);
                                                    }}
                                                    className="p-2 text-red-600 rounded-full transition-colors duration-200 hover:bg-red-100"
                                                    title="Cancelar"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Botón de expandir (solo si hay datos) */}
                                                {hasDatos && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCard(proyecto.id);
                                                        }}
                                                        className="p-2 text-gray-400 rounded-full transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
                                                        title={isExpanded ? 'Colapsar' : 'Expandir'}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronRight className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                )}
                                                
                                                {/* Botón de editar */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditing(proyecto);
                                                    }}
                                                    className="p-2 text-gray-400 rounded-full transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600"
                                                    title="Editar datos"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Etapa (badge o selector según modo) */}
                                <div className="px-5 pb-3">
                                    {isEditing ? (
                                        <select
                                            value={datos.etapa}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    [proyecto.id]: {
                                                        ...editData[proyecto.id],
                                                        etapa: e.target.value
                                                    }
                                                });
                                            }}
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
                                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                                        {/* Materiales Constantes */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Materiales Constantes</h4>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {datos.materialesConstantes.map((material, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm bg-blue-50 p-2 rounded border border-blue-100">
                                                        {isEditing ? (
                                                            <div className="flex-1 space-y-2">
                                                                <select
                                                                    value={material.categoria}
                                                                    onChange={(e) => {
                                                                        const updated = [...editData[proyecto.id].materialesConstantes];
                                                                        updated[idx].categoria = e.target.value;
                                                                        setEditData({
                                                                            ...editData,
                                                                            [proyecto.id]: {
                                                                                ...editData[proyecto.id],
                                                                                materialesConstantes: updated
                                                                            }
                                                                        });
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
                                                                        const updated = [...editData[proyecto.id].materialesConstantes];
                                                                        updated[idx].nombre = e.target.value;
                                                                        setEditData({
                                                                            ...editData,
                                                                            [proyecto.id]: {
                                                                                ...editData[proyecto.id],
                                                                                materialesConstantes: updated
                                                                            }
                                                                        });
                                                                    }}
                                                                    placeholder="Nombre del material"
                                                                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={material.observaciones}
                                                                    onChange={(e) => {
                                                                        const updated = [...editData[proyecto.id].materialesConstantes];
                                                                        updated[idx].observaciones = e.target.value;
                                                                        setEditData({
                                                                            ...editData,
                                                                            [proyecto.id]: {
                                                                                ...editData[proyecto.id],
                                                                                materialesConstantes: updated
                                                                            }
                                                                        });
                                                                    }}
                                                                    placeholder="Observaciones (opcional)"
                                                                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1">
                                                                <div className="font-medium text-blue-900">{material.categoria}</div>
                                                                <div className="text-gray-700 line-clamp-1">{material.nombre}</div>
                                                                {material.observaciones && (
                                                                    <div className="text-xs text-gray-500 line-clamp-1">{material.observaciones}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditData({
                                                                        ...editData,
                                                                        [proyecto.id]: {
                                                                            ...editData[proyecto.id],
                                                                            materialesConstantes: editData[proyecto.id].materialesConstantes.filter((_, i) => i !== idx)
                                                                        }
                                                                    });
                                                                }}
                                                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        // Agregar material vacío para que el usuario complete
                                                        const newMaterial = { categoria: 'Griferias', materialId: '', nombre: 'Nuevo Material', observaciones: '' };
                                                        setEditData({
                                                            ...editData,
                                                            [proyecto.id]: {
                                                                ...editData[proyecto.id],
                                                                materialesConstantes: [...editData[proyecto.id].materialesConstantes, newMaterial]
                                                            }
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
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Presentaciones</h4>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {datos.presentacionesEspacio.map((pres, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded border border-green-100">
                                                        {isEditing ? (
                                                            <div className="flex-1 space-y-2">
                                                                <input
                                                                    type="text"
                                                                    list={`espacios-list-${proyecto.id}-${idx}`}
                                                                    value={pres.espacio}
                                                                    onChange={(e) => {
                                                                        const updated = [...editData[proyecto.id].presentacionesEspacio];
                                                                        updated[idx].espacio = e.target.value;
                                                                        setEditData({
                                                                            ...editData,
                                                                            [proyecto.id]: {
                                                                                ...editData[proyecto.id],
                                                                                presentacionesEspacio: updated
                                                                            }
                                                                        });
                                                                    }}
                                                                    placeholder="Escribe o selecciona un espacio"
                                                                    className="w-full text-xs px-2 py-1 border border-green-300 rounded"
                                                                />
                                                                <datalist id={`espacios-list-${proyecto.id}-${idx}`}>
                                                                    {espaciosProyecto.map(esp => (
                                                                        <option key={esp} value={esp} />
                                                                    ))}
                                                                </datalist>
                                                                <input
                                                                    type="url"
                                                                    value={pres.link}
                                                                    onChange={(e) => {
                                                                        const updated = [...editData[proyecto.id].presentacionesEspacio];
                                                                        updated[idx].link = e.target.value;
                                                                        setEditData({
                                                                            ...editData,
                                                                            [proyecto.id]: {
                                                                                ...editData[proyecto.id],
                                                                                presentacionesEspacio: updated
                                                                            }
                                                                        });
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
                                                                    className="text-blue-600 hover:underline line-clamp-1 text-xs"
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
                                                                        [proyecto.id]: {
                                                                            ...editData[proyecto.id],
                                                                            presentacionesEspacio: editData[proyecto.id].presentacionesEspacio.filter((_, i) => i !== idx)
                                                                        }
                                                                    });
                                                                }}
                                                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        // Agregar presentación vacía
                                                        const newPres = { espacio: espaciosProyecto[0] || '', link: '', fechaActualizacion: new Date().toISOString().split('T')[0] };
                                                        setEditData({
                                                            ...editData,
                                                            [proyecto.id]: {
                                                                ...editData[proyecto.id],
                                                                presentacionesEspacio: [...editData[proyecto.id].presentacionesEspacio, newPres]
                                                            }
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
                        );
                    })}
                </div>

                {proyectos.length === 0 && !isLoading && (
                    <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center text-gray-500">
                        <p>No se encontraron proyectos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreModalProjects;
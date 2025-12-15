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

import ViewToggle from './common/ViewToggle';

const PreModalProjects = () => {
    const dispatch = useDispatch();
    const [proyectos, setProyectos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [materiales, setMateriales] = useState([]);
    const [allSpaces, setAllSpaces] = useState([]); // All available spaces
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Estado para cards expandidas y en edición
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [editingCards, setEditingCards] = useState(new Set());
    const [editData, setEditData] = useState({});

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Cargar proyectos, materiales y espacios en paralelo
        Promise.all([
            dispatch(getAllFromTable("Proyectos")),
            dispatch(getAllFromTable("Espacio_Elemento")),
            supabase.from('Material').select('id, nombre, categoria').order('nombre')
        ])
            .then(([projectsAction, spacesAction, materialsResult]) => {
                if (projectsAction?.payload) {
                    setProyectos(projectsAction.payload);
                } else {
                    throw new Error("No se recibieron datos de proyectos.");
                }

                if (spacesAction?.payload) {
                    setAllSpaces(spacesAction.payload);
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

        let parsedEspacios = [];
        try {
            parsedEspacios = proyecto.espacios ? JSON.parse(proyecto.espacios) : [];
            if (!Array.isArray(parsedEspacios)) parsedEspacios = [];
        } catch (e) {
            console.error("Error parsing espacios:", e);
            parsedEspacios = [];
        }

        setEditData({
            ...editData,
            [proyecto.id]: {
                ...datos,
                espacios: parsedEspacios
            }
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
            const currentEditData = editData[proyecto.id];
            // Extract spaces from other data
            const { espacios, ...datos } = currentEditData;

            const datosString = stringifyDatosProyecto(datos);
            const espaciosString = JSON.stringify(espacios || []);

            const { data: updatedProject, error: updateError } = await supabase
                .from('Proyectos')
                .update({
                    Datos: datosString,
                    espacios: espaciosString
                })
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
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Seleccionar Proyecto</h1>
                        <p className="text-md text-gray-600 mt-1">Elige un proyecto para ver el detalle de sus tareas.</p>
                    </div>
                    <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                </header>

                {viewMode === 'grid' ? (
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

                                            {/* Espacios del Proyecto */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Espacios Asignados</h4>
                                                {isEditing ? (
                                                    <div className="border border-green-200 rounded-md p-2 max-h-40 overflow-y-auto bg-green-50">
                                                        {allSpaces.length > 0 ? (
                                                            allSpaces.map(space => (
                                                                <label key={space._id || space.id} className="flex items-center space-x-2 p-1 hover:bg-green-100 rounded cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={(datos.espacios || []).includes(space._id || space.id)}
                                                                        onChange={(e) => {
                                                                            const isChecked = e.target.checked;
                                                                            const spaceId = space._id || space.id;
                                                                            let newEspacios = datos.espacios || [];
                                                                            if (isChecked) {
                                                                                newEspacios = [...newEspacios, spaceId];
                                                                            } else {
                                                                                newEspacios = newEspacios.filter(id => id !== spaceId);
                                                                            }
                                                                            setEditData({
                                                                                ...editData,
                                                                                [proyecto.id]: {
                                                                                    ...editData[proyecto.id],
                                                                                    espacios: newEspacios
                                                                                }
                                                                            });
                                                                        }}
                                                                        className="rounded text-green-600 focus:ring-green-500"
                                                                    />
                                                                    <span className="text-xs text-gray-700">
                                                                        {space.nombre} {space.apellido || ''} ({space.tipo})
                                                                    </span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs text-gray-400 text-center">No hay espacios disponibles</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {(isEditing ? datos.espacios : (proyecto.espacios ? JSON.parse(proyecto.espacios) : []))?.map(id => {
                                                            const sp = allSpaces.find(s => (s._id || s.id) === id);
                                                            return sp ? (
                                                                <span key={id} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">
                                                                    {sp.nombre} {sp.apellido || ''}
                                                                </span>
                                                            ) : null;
                                                        })}
                                                        {(!proyecto.espacios || JSON.parse(proyecto.espacios).length === 0) && (
                                                            <span className="text-xs text-gray-400 italic">No hay espacios asignados</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Sincronización de Tareas */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-sm font-semibold text-gray-700">Tareas ({datos.tareas?.length || 0})</h4>
                                                    {isEditing && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    // Sincronizar tareas desde la tabla Tareas
                                                                    const { data: tasks, error } = await supabase
                                                                        .from('Tareas')
                                                                        .select('*')
                                                                        .eq('project_id', proyecto.id);

                                                                    if (error) throw error;

                                                                    setEditData({
                                                                        ...editData,
                                                                        [proyecto.id]: {
                                                                            ...editData[proyecto.id],
                                                                            tareas: tasks || []
                                                                        }
                                                                    });
                                                                    alert(`Se han sincronizado ${tasks?.length || 0} tareas.`);
                                                                } catch (e) {
                                                                    console.error("Error syncing tasks:", e);
                                                                    alert("Error al sincronizar tareas.");
                                                                }
                                                            }}
                                                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                                                        >
                                                            Sincronizar Tareas
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 max-h-20 overflow-y-auto border border-gray-100 rounded p-1">
                                                    {datos.tareas && datos.tareas.length > 0 ? (
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {datos.tareas.map((t, i) => (
                                                                <li key={i}>{t.tema || t.task || 'Tarea sin nombre'}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="italic">Sin tareas sincronizadas</span>
                                                    )}
                                                </div>
                                            </div>

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
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materiales</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presentaciones</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {proyectos.map((proyecto) => {
                                        const datos = parseDatosProyecto(proyecto.Datos);
                                        return (
                                            <tr key={proyecto.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                                            <Folder size={16} />
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">{proyecto.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {datos.etapa}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-gray-500 max-w-xs truncate">
                                                        {datos.materialesConstantes.length > 0
                                                            ? `${datos.materialesConstantes.length} definidos`
                                                            : <span className="text-gray-400 italic">Sin materiales</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-gray-500 max-w-xs truncate">
                                                        {datos.presentacionesEspacio.length > 0
                                                            ? `${datos.presentacionesEspacio.length} archivos`
                                                            : <span className="text-gray-400 italic">Sin presentaciones</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a
                                                        href={`/ProjectTaskModal/${proyecto.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center gap-1 transition-colors"
                                                    >
                                                        Abrir <Folder size={14} />
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
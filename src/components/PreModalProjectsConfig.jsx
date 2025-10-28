import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
// Usamos la acción específica de projectActions
import { updateProject } from '../store/actions/projectActions.js';
// Asumimos que tienes una acción genérica para cargar otras tablas (como Personal)
// Esta podría venir de tu 'actions.js' o de un 'crudActions'
// Ajusta esta ruta si es necesario
import { getAllFromTable } from '../store/actions/actions.js'; 

// Lista predefinida de espacios
const ESPACIOS_LISTA = [
    "Sala", "Comedor", "Cocina", "Baño Principal", "Baño Social",
    "Dormitorio 1", "Dormitorio 2", "Dormitorio 3", "Terraza", "Balcón",
    "Garaje", "Patio", "Estudio", "Zona de Ropas"
];

// Lista predefinida de estados (basada en tu imagen y acciones)
const ESTADOS_LISTA = [
    "En Progreso", "En Diseño", "Pendiente", "Activo",
    "Completado", "Pausado", "Cancelado", "Archivado"
];

const PreModalProjectsConfig = ({ proyecto, onClose, onProjectUpdated }) => {
    const dispatch = useDispatch();
    
    // Estado para el formulario
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('');
    const [responsable, setResponsable] = useState(''); // Guarda el UUID del responsable
    const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([]);
    
    // Estado para cargar datos
    const [usuarios, setUsuarios] = useState([]); // Lista de usuarios para el dropdown
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Efecto para cargar la lista de usuarios (para el dropdown de 'resp')
    useEffect(() => {
        // Asumo que la tabla de usuarios/personal se llama 'Personal'
        dispatch(getAllFromTable("Personal"))
            .then(action => {
                if (action?.payload) {
                    // Ordenar usuarios alfabéticamente por nombre
                    const sortedUsers = action.payload.sort((a, b) => 
                        (a.name || '').localeCompare(b.name || '')
                    );
                    setUsuarios(sortedUsers);
                } else {
                    console.warn("No se pudo cargar la lista de personal para el dropdown.");
                }
            })
            .catch(err => {
                console.error("Error al cargar personal:", err);
            });
    }, [dispatch]);

    // Efecto para poblar el formulario cuando el 'proyecto' (prop) cambia
    useEffect(() => {
        if (proyecto) {
            setNombre(proyecto.name || '');
            setEstado(proyecto.status || '');
            setResponsable(proyecto.resp || ''); // El UUID del responsable
            setEspaciosSeleccionados(Array.isArray(proyecto.espacios) ? proyecto.espacios : []);
            setError(null);
        }
    }, [proyecto]);

    /**
     * Maneja el clic en un checkbox de espacio.
     */
    const handleSpaceChange = (spaceName) => {
        setEspaciosSeleccionados(prevEspacios => {
            if (prevEspacios.includes(spaceName)) {
                return prevEspacios.filter(s => s !== spaceName);
            } else {
                return [...prevEspacios, spaceName];
            }
        });
    };

    /**
     * Maneja el guardado de los cambios.
     */
    const handleSave = () => {
        setIsLoading(true);
        setError(null);

        // Objeto con *todos* los datos a actualizar
        const updateData = {
            name: nombre,
            status: estado,
            resp: responsable || null, // Envía null si el string está vacío
            espacios: espaciosSeleccionados
        };

        dispatch(updateProject(proyecto.id, updateData))
            .then(action => {
                // La acción 'updateProject' de tu factory debería devolver el item actualizado
                if (action && action.payload) { 
                    // Notifica al padre (PreModalProjects) que los datos cambiaron
                    onProjectUpdated(action.payload);
                } else {
                     // Fallback por si la acción no devuelve payload pero no falló
                    onProjectUpdated({ ...proyecto, ...updateData });
                }
            })
            .catch(err => {
                console.error("Error al guardar la configuración:", err);
                setError("No se pudo guardar. Inténtalo de nuevo.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Cierra el modal, solo si no está cargando.
     */
    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    if (!proyecto) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
                onClick={e => e.stopPropagation()} 
            >
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Configurar: <span className="font-bold text-blue-600">{proyecto.name}</span>
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cuerpo del Modal */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Campos de Texto y Select */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Campo Nombre */}
                        <div className="md:col-span-2">
                            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                                Nombre del Proyecto
                            </label>
                            <input
                                type="text"
                                id="projectName"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        
                        {/* Campo Estado */}
                        <div>
                            <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>
                            <select
                                id="projectStatus"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Seleccionar estado...</option>
                                {ESTADOS_LISTA.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Campo Responsable (Resp) */}
                        <div>
                            <label htmlFor="projectResp" className="block text-sm font-medium text-gray-700">
                                Responsable
                            </label>
                            <select
                                id="projectResp"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={responsable} // El valor es el UUID
                                onChange={(e) => setResponsable(e.target.value)}
                            >
                                <option value="">Sin asignar</option>
                                {usuarios.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {/* Muestra nombre, o email, o ID como fallback */}
                                        {user.name || user.email || user.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className="mb-6" />

                    {/* Checkboxes de Espacios */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Seleccionar Espacios</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Marca los espacios que aplican a este proyecto. Se guardará como una lista de textos.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {ESPACIOS_LISTA.map(space => (
                                <label key={space} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={espaciosSeleccionados.includes(space)}
                                        onChange={() => handleSpaceChange(space)}
                                    />
                                    <span className="text-gray-700">{space}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pie del Modal */}
                <div className="flex justify-end items-center gap-4 p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {error && <p className="text-sm text-red-600 mr-auto">{error}</p>}
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreModalProjectsConfig;
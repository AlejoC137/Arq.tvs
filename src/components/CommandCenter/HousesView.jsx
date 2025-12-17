import React, { useState, useEffect } from 'react';
import { Home, MapPin, User, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getHouses, getParcels } from '../../services/projectsService';

const HousesView = () => {
    const { navigation } = useSelector(state => state.app);
    const propertyView = navigation?.propertyView || 'houses';
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, [propertyView]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            if (propertyView === 'parcels') {
                const parcelData = await getParcels();
                setProjects(parcelData ? [parcelData] : []);
            } else {
                const housesData = await getHouses();
                setProjects(housesData || []);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProjectStatus = (project) => {
        try {
            const datos = typeof project.Datos === 'string' ? JSON.parse(project.Datos) : project.Datos;
            return datos?.etapa || 'Sin estado';
        } catch {
            return 'Sin estado';
        }
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Projects List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        {propertyView === 'parcels' ? (
                            <>
                                <MapPin size={20} className="text-blue-600" />
                                Parcelación
                            </>
                        ) : (
                            <>
                                <Home size={20} className="text-blue-600" />
                                Casas del Proyecto
                            </>
                        )}
                    </h2>
                    <p className="text-xs text-gray-600">
                        {projects.length} {propertyView === 'parcels' ? 'proyecto' : 'casas'}
                    </p>
                </div>

                {/* Projects List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No hay proyectos
                        </div>
                    ) : (
                        projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedProject?.id === project.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        {propertyView === 'parcels' ? (
                                            <MapPin size={20} className="text-blue-600" />
                                        ) : (
                                            <Home size={20} className="text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {project.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {getProjectStatus(project)}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Project Details */}
            <div className="flex-1 flex flex-col">
                {selectedProject ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                                    {propertyView === 'parcels' ? (
                                        <MapPin size={32} className="text-blue-600" />
                                    ) : (
                                        <Home size={32} className="text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {selectedProject.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Estado: {getProjectStatus(selectedProject)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Responsible */}
                                {selectedProject.responsable && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Responsable</h4>
                                        <div className="flex items-center gap-3 text-sm">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{selectedProject.responsable}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Project Data */}
                                {selectedProject.Datos && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Información del Proyecto</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                                {typeof selectedProject.Datos === 'string'
                                                    ? JSON.stringify(JSON.parse(selectedProject.Datos), null, 2)
                                                    : JSON.stringify(selectedProject.Datos, null, 2)
                                                }
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Status */}
                                {selectedProject.status && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Estado General</h4>
                                        <div className="flex items-center gap-3 text-sm">
                                            <FileText size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{selectedProject.status}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            {propertyView === 'parcels' ? (
                                <>
                                    <MapPin size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Selecciona la parcelación para ver detalles</p>
                                </>
                            ) : (
                                <>
                                    <Home size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Selecciona una casa para ver detalles</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HousesView;

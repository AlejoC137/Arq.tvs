import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Folder } from 'lucide-react';
import { getAllFromTable } from '../store/actions/actions';

const PreModalProjects = () => {
    const dispatch = useDispatch();
    const [proyectos, setProyectos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        dispatch(getAllFromTable("Proyectos"))
            .then(action => {
                if (action?.payload) {
                    setProyectos(action.payload);
                } else {
                    throw new Error("No se recibieron datos válidos.");
                }
            })
            .catch(err => {
                console.error("Error al obtener proyectos:", err);
                setError("No se pudieron cargar los proyectos.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [dispatch]);

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
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Seleccionar Proyecto</h1>
                    <p className="text-md text-gray-600 mt-1">Elige un proyecto para ver el detalle de sus tareas.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proyectos.map((proyecto) => (
                        <a
                            key={proyecto.id}
                            href={`/ProjectTaskModal/${proyecto.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 cursor-pointer"
                        >
                            <Folder className="w-8 h-8 text-blue-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-semibold text-lg text-gray-800 truncate">
                                {proyecto.name}
                            </span>
                        </a>
                    ))}
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
import React, { useState, useEffect } from 'react';
import { Users, User, Mail, Phone, Briefcase, Plus } from 'lucide-react';
import { getStaffers } from '../../services/spacesService';

const TeamView = () => {
    const [staffers, setStaffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStaffer, setSelectedStaffer] = useState(null);

    useEffect(() => {
        loadStaffers();
    }, []);

    const loadStaffers = async () => {
        setLoading(true);
        try {
            const data = await getStaffers();
            setStaffers(data || []);
        } catch (error) {
            console.error('Error loading staffers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex bg-white">
            {/* LEFT: Team List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        Equipo de Trabajo
                    </h2>
                    <p className="text-xs text-gray-600">
                        {staffers.length} miembros del equipo
                    </p>
                </div>

                {/* Team Members List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
                    ) : staffers.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No hay miembros del equipo
                        </div>
                    ) : (
                        staffers.map((staffer, idx) => (
                            <button
                                key={staffer.id || idx}
                                onClick={() => setSelectedStaffer(staffer)}
                                className={`
                                    w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors
                                    ${selectedStaffer?.id === staffer.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {staffer.name}
                                        </div>
                                        {staffer.role_description && (
                                            <div className="text-xs text-gray-500 truncate">
                                                {staffer.role_description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Member Details */}
            <div className="flex-1 flex flex-col">
                {selectedStaffer ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User size={32} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {selectedStaffer.name}
                                    </h3>
                                    {selectedStaffer.role_description && (
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <Briefcase size={14} />
                                            {selectedStaffer.role_description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Contact Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Información de Contacto</h4>
                                    <div className="space-y-2">
                                        {selectedStaffer.email && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="text-gray-700">{selectedStaffer.email}</span>
                                            </div>
                                        )}
                                        {selectedStaffer.telefono && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone size={16} className="text-gray-400" />
                                                <span className="text-gray-700">{selectedStaffer.telefono}</span>
                                            </div>
                                        )}
                                        {!selectedStaffer.email && !selectedStaffer.telefono && (
                                            <p className="text-sm text-gray-500 italic">
                                                No hay información de contacto disponible
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Stats/Tasks */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Estadísticas</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">-</div>
                                            <div className="text-xs text-gray-600">Tareas Activas</div>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">-</div>
                                            <div className="text-xs text-gray-600">Completadas</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-600">-</div>
                                            <div className="text-xs text-gray-600">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Users size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Selecciona un miembro del equipo para ver detalles</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamView;

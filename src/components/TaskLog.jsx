import React, { useState, useEffect } from 'react';
import { Plus, X, Save, CalendarDays, Lock, Trash2, Pencil, Check } from 'lucide-react';

const TaskLog = ({ task, onSave }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- CAMBIO: Estados para el modo de administrador y edición ---
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingLog, setEditingLog] = useState({ index: null, text: '' });

    const parseDates = (datesJson) => {
        try {
            if (!datesJson || typeof datesJson !== 'string') return { assignDate: '', dueDate: '', logs: [] };
            const parsed = JSON.parse(datesJson);
            if (!Array.isArray(parsed.logs)) parsed.logs = [];
            return parsed;
        } catch (error) {
            console.error("Error parsing dates JSON:", error, datesJson);
            return { assignDate: '', dueDate: '', logs: [] };
        }
    };

    const [dates, setDates] = useState(() => parseDates(task.dates));
    const [newEvent, setNewEvent] = useState('');

    useEffect(() => {
        if (isModalOpen) {
            setDates(parseDates(task.dates));
        } else {
            // --- CAMBIO: Restablecer el modo admin al cerrar el modal ---
            setIsAdmin(false);
        }
    }, [task.dates, isModalOpen]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDates(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLog = (e) => {
        e.preventDefault();
        if (!newEvent.trim()) return;
        const newLog = {
            date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            event: newEvent
        };
        setDates(prev => ({ ...prev, logs: [...(prev.logs || []), newLog] }));
        setNewEvent('');
    };

    const handleSave = () => {
        onSave(task.id, { dates: JSON.stringify(dates) });
        setIsModalOpen(false);
    };

    // --- CAMBIO: Lógica para el modo administrador ---
    const handleAdminAccess = () => {
        if (isAdmin) {
            setIsAdmin(false);
            return;
        }
        const password = prompt("Por favor, ingresa la clave de administrador:");
        if (password === "1324acb") {
            setIsAdmin(true);
            alert("Modo administrador activado.");
        } else if (password) {
            alert("Clave incorrecta.");
        }
    };

    // --- CAMBIO: Lógica para eliminar un log ---
    const handleDeleteLog = (logIndexToDelete) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este evento de la bitácora?")) return;

        const originalLogs = dates.logs || [];
        const updatedLogs = originalLogs.filter((_, index) => index !== logIndexToDelete);
        setDates(prev => ({ ...prev, logs: updatedLogs }));
    };

    // --- CAMBIO: Lógica para actualizar un log ---
    const handleUpdateLog = () => {
        if (editingLog.index === null) return;

        const originalLogs = dates.logs || [];
        const updatedLogs = originalLogs.map((log, index) => {
            if (index === editingLog.index) {
                return { ...log, event: editingLog.text };
            }
            return log;
        });
        setDates(prev => ({ ...prev, logs: updatedLogs }));
        setEditingLog({ index: null, text: '' }); // Salir del modo edición
    };


    const logsCount = parseDates(task.dates).logs.length;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1.5 p-2 rounded-md hover:bg-blue-50 transition-colors"
                title="Gestionar Fechas y Bitácora"
            >
                <CalendarDays size={16} />
                <span>Bitácora ({logsCount})</span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16 p-4 animate-fade-in-down">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Gestionar Fechas y Bitácora: <span className="text-blue-600">{task.tema}</span></h2>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Fechas Clave</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="modal-assign-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Asignación</label>
                                        <input type="date" id="modal-assign-date" name="assignDate" value={dates.assignDate || ''} onChange={handleDateChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="modal-due-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                                        <input type="date" id="modal-due-date" name="dueDate" value={dates.dueDate || ''} onChange={handleDateChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bitácora de Eventos</h3>
                                <div className="max-h-48 overflow-y-auto border rounded-lg p-2 mb-4 bg-gray-50">
                                    {dates.logs && dates.logs.length > 0 ? (
                                        dates.logs.map((log, index) => (
                                            <div key={index} className="text-sm p-1.5 border-b last:border-b-0 flex justify-between items-center group">
                                                {/* --- CAMBIO: Vista condicional para edición --- */}
                                                {editingLog.index === index ? (
                                                    <div className="flex-grow flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingLog.text}
                                                            onChange={(e) => setEditingLog({ ...editingLog, text: e.target.value })}
                                                            className="flex-grow p-1 border border-blue-400 rounded-md"
                                                            autoFocus
                                                        />
                                                        <button onClick={handleUpdateLog} className="p-1 text-green-600 hover:bg-green-100 rounded-full"><Check size={16} /></button>
                                                        <button onClick={() => setEditingLog({ index: null, text: '' })} className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"><X size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span className="font-semibold text-gray-600">{log.date}: </span>
                                                            <span className="text-gray-700">{log.event}</span>
                                                        </div>
                                                        {/* --- CAMBIO: Botones de admin visibles en modo admin --- */}
                                                        {isAdmin && (
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => setEditingLog({ index: index, text: log.event })} className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"><Pencil size={14} /></button>
                                                                <button onClick={() => handleDeleteLog(index)} className="p-1 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={14} /></button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center p-4">No hay eventos en la bitácora.</p>
                                    )}
                                </div>
                                <form onSubmit={handleAddLog} className="flex gap-2">
                                    <input type="text" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Añadir nuevo evento..." />
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"><Plus size={16} /> Añadir</button>
                                </form>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg">
                            {/* --- CAMBIO: Botón para activar/desactivar modo admin --- */}
                            <button
                                onClick={handleAdminAccess}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${isAdmin ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <Lock size={14} />
                                {isAdmin ? 'Modo Admin Activado' : 'Modo Administrador'}
                            </button>
                            <div>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2">Cancelar</button>
                                <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save size={16} /> Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskLog;
import React, { useState, useEffect, useMemo } from 'react';
import { Save, X } from 'lucide-react';
import { ESPACIOS_HABITACIONES } from '../constants/espacios';

// Estado inicial del formulario
const initialState = {
    task_description: '',
    project_id: '',
    staff_id: '',
    status: 'Pendiente',
    notes: '',
    stage_id: '',
    entregable_id: '',
    Progress: 0,
    espacio: '',
    // Se inicializa con una estructura de fecha válida
    dates: JSON.stringify({
        assignDate: '',
        dueDate: '',
        logs: []
    })
};

const FormTask = ({ isOpen, onClose, onSubmit, proyectos, staff, stages, entregables, estados, proyecto: proyectoId }) => {
    const [formData, setFormData] = useState(initialState);

    // Efecto para inicializar y resetear el formulario cuando se abre
    useEffect(() => {
        if (isOpen) {
            // Obtiene la fecha actual en formato YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];

            // Crea un estado limpio
            const resetState = {
                ...initialState,
                // Asigna la fecha de hoy a la fecha de asignación
                dates: JSON.stringify({
                    assignDate: today,
                    dueDate: '',
                    logs: []
                })
            };

            // Usa el ID del proyecto pasado por props
            if (proyectoId) {
                resetState.project_id = proyectoId;
            } else if (proyectos?.length > 0) {
                // Si por alguna razón no se pasa el ID, usa el primero como fallback
                resetState.project_id = proyectos[0].id;
            }

            // Asigna una etapa por defecto si existen
            if (stages?.length > 0) {
                resetState.stage_id = stages[0].id;
            }

            setFormData(resetState);
        }
    }, [isOpen, proyectos, stages, proyectoId]); // Se añade proyectoId a las dependencias

    // Filtra los entregables según la etapa seleccionada
    const filteredEntregables = useMemo(() => {
        if (!formData.stage_id || !entregables) return [];
        // Asumiendo que la columna en la tabla de entregables es 'Stage_id'
        return entregables.filter(e => e.Stage_id === formData.stage_id);
    }, [formData.stage_id, entregables]);
    
    if (!isOpen) return null;

    // Maneja los cambios en la mayoría de los campos del formulario
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseInt(value, 10) || 0 : value;
        
        setFormData(prev => {
            const updatedData = { ...prev, [name]: finalValue };
            // Si se cambia la etapa, se resetea el entregable
            if (name === 'stage_id') {
                updatedData.entregable_id = '';
            }
            return updatedData;
        });
    };

    // Maneja específicamente los cambios en los campos de fecha
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const currentDates = JSON.parse(prev.dates);
            const updatedDates = { ...currentDates, [name]: value };
            return { ...prev, dates: JSON.stringify(updatedDates) };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.task_description || !formData.project_id) {
            alert("Por favor, completa la descripción de la tarea y selecciona un proyecto.");
            return;
        }
        onSubmit(formData);
        onClose(); // Cierra el modal después de enviar
    };

    const currentDates = JSON.parse(formData.dates);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-down">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Crear Nueva Tarea</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                        <div className="md:col-span-2">
                            <label htmlFor="task_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción <span className="text-red-500">*</span></label>
                            <textarea id="task_description" name="task_description" value={formData.task_description} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" required></textarea>
                        </div>
        
                        <div>
                            <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                            <select id="staff_id" name="staff_id" value={formData.staff_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none">
                                <option value="">-- Sin Asignar --</option>
                                {/* CAMBIO: Se añade optional chaining para evitar el error */}
                                {staff?.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="stage_id" className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
                            <select id="stage_id" name="stage_id" value={formData.stage_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none">
                                {/* CAMBIO: Se añade optional chaining para evitar el error */}
                                {stages?.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="espacio" className="block text-sm font-medium text-gray-700 mb-1">Espacio</label>
                            <select id="espacio" name="espacio" value={formData.espacio} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none">
                                <option value="">-- Sin Asignar --</option>
                                {ESPACIOS_HABITACIONES.map(espacio => (<option key={espacio} value={espacio}>{espacio}</option>))}
                            </select>
                        </div>
                  
                        <div>
                            <label htmlFor="assignDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Asignación</label>
                            <input id="assignDate" name="assignDate" type="date" value={currentDates.assignDate} onChange={handleDateChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                            <input id="dueDate" name="dueDate" type="date" value={currentDates.dueDate} onChange={handleDateChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" />
                        </div>
  
                    </div>
                    <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save size={16} />Guardar Tarea</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTask;
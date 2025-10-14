import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Calendar, Tag } from 'lucide-react';

// Importa el componente EditableCell. Sería ideal moverlo a su propio archivo
// para poder importarlo aquí y en otros lugares si es necesario.
// import EditableCell from './EditableCell'; 

// Si no quieres mover EditableCell, puedes copiar su código aquí dentro.
// Por simplicidad para esta respuesta, lo asumiré como un componente disponible.

const TaskItem = ({ task, staff, stages, entregables, onUpdateCell, isSelected, onSelectRow }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getPriorityClasses = (priority) => {
        const base = 'w-1.5 h-full absolute top-0 left-0';
        switch (priority) {
            case 'Alta': return `${base} bg-red-500`;
            case 'Media-Alta': return `${base} bg-orange-500`;
            case 'Media': return `${base} bg-yellow-400`;
            case 'Media-Baja': return `${base} bg-green-400`;
            case 'Baja': return `${base} bg-blue-400`;
            default: return `${base} bg-gray-300`;
        }
    };

    const responsible = staff.find(s => s.id === task.staff_id);
    
    // Aquí deberías tener el componente EditableCell que ya creamos.
    // Por ahora, solo simularé su presencia. Asegúrate de tenerlo importado y funcionando.
    const EditableCell = ({value, type}) => <div className="p-1 min-h-[28px]">{value || '-'}</div>;

    return (
        <div className={`relative ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
            {/* --- INDICADOR DE PRIORIDAD --- */}
            <div className={getPriorityClasses(task.Priority)} title={`Prioridad: ${task.Priority}`}></div>

            {/* --- FILA PRINCIPAL (SIEMPRE VISIBLE) --- */}
            <div className="flex items-center w-full pl-6 pr-4 py-2">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelectRow}
                    className="mr-4 w-5 h-5"
                />

                <div className="flex-grow">
                    <EditableCell 
                        rowId={task.id} 
                        field="task_description" 
                        value={task.task_description} 
                        type="textarea"
                    />
                </div>
                
                <div className="flex items-center gap-6 mx-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2" title="Responsable">
                        <User size={16} />
                        <span>{responsible?.name || 'Sin asignar'}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Fecha Límite">
                        <Calendar size={16} />
                        <span>{task.dueDate || 'Sin fecha'}</span>
                    </div>
                    <div title="Estado">
                        <EditableCell rowId={task.id} field="status" value={task.status} type="status-select" />
                    </div>
                </div>

                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full hover:bg-gray-200">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* --- DETALLES EXPANDIBLES --- */}
            {isExpanded && (
                <div className="pl-16 pr-8 pb-4 pt-2 bg-gray-50/50 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Detalles Adicionales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                        
                        <div>
                            <label className="font-medium text-gray-500">Progreso</label>
                            <EditableCell rowId={task.id} field="Progress" value={task.Progress} type="progress" />
                        </div>
                        <div>
                            <label className="font-medium text-gray-500">Etapa</label>
                            <EditableCell rowId={task.id} field="stage_id" value={task.stage_id} type="select" options={stages} />
                        </div>
                        <div>
                            <label className="font-medium text-gray-500">Entregable</label>
                            <EditableCell rowId={task.id} field="entregable_id" value={task.entregable_id} type="entregable-select" options={entregables} />
                        </div>
                         <div className="md:col-span-2 lg:col-span-3">
                            <label className="font-medium text-gray-500">Fechas</label>
                            {/* <DatesManager task={task} onSave={(rowId, data) => onUpdateCell(rowId, { dates: JSON.stringify(data) })} /> */}
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="font-medium text-gray-500">Notas</label>
                            <EditableCell rowId={task.id} field="notes" value={task.notes} type="textarea" />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="font-medium text-gray-500">Actividad</label>
                            {/* <TaskLog task={task} ... /> */}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(TaskItem);
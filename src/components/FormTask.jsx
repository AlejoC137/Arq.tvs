import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const initialState = {
  task_description: '', project_id: '', staff_id: '',
  entregableType: '', status: 'Pendiente', notes: '',
  stage_id: '', entregable_id: ''
};

const FormTask = ({ isOpen, onClose, onSubmit, proyectos, staff, stages, entregables, estados }) => {
  const [formData, setFormData] = useState(initialState);
  const [filteredEntregables, setFilteredEntregables] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const firstStageId = stages.length > 0 ? stages[0].id : '';
      const defaultData = {
        ...initialState,
        project_id: proyectos.length > 0 ? proyectos[0].id : '',
        stage_id: firstStageId,
      };
      setFormData(defaultData);
      // Filtrar entregables para la primera etapa por defecto
      setFilteredEntregables(entregables.filter(e => e.Stage_id === firstStageId));
    }
  }, [isOpen, proyectos, stages, entregables]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Si el usuario cambia la etapa (stage_id), filtramos los entregables correspondientes.
    if (name === "stage_id") {
      setFilteredEntregables(entregables.filter(ent => ent.Stage_id === value));
      // También reseteamos la selección del entregable específico.
      updatedFormData.entregable_id = ''; 
    }
    
    // Al seleccionar un entregable, actualizamos el nombre en 'entregableType' para consistencia.
    if (name === "entregable_id") {
        const selectedEntregable = entregables.find(e => e.id === value);
        if (selectedEntregable) {
            updatedFormData.entregableType = selectedEntregable.entregable_nombre;
        }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.task_description || !formData.project_id) {
        alert("Por favor, completa la descripción y el proyecto.");
        return;
    }
    const finalData = { ...formData };
    // Asignar el nombre del stage a 'entregableType' si no se seleccionó un entregable específico
    if (!finalData.entregable_id) {
        const selectedStage = stages.find(s => s.id === finalData.stage_id);
        if (selectedStage) {
            finalData.entregableType = selectedStage.name;
        }
    }
    onSubmit(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-down">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Crear Nueva Tarea</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label htmlFor="task_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Tarea <span className="text-red-500">*</span></label><textarea id="task_description" name="task_description" value={formData.task_description} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" placeholder="Ej: Desarrollar planos de la fachada principal" required></textarea></div>
            <div><label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">Proyecto <span className="text-red-500">*</span></label><select id="project_id" name="project_id" value={formData.project_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" required><option value="" disabled>-- Seleccionar --</option>{proyectos.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></div>
            <div><label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label><select id="staff_id" name="staff_id" value={formData.staff_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"><option value="">-- Sin Asignar --</option>{staff.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
            <div><label htmlFor="stage_id" className="block text-sm font-medium text-gray-700 mb-1">Etapa (Categoría)</label><select id="stage_id" name="stage_id" value={formData.stage_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"><option value="" disabled>-- Seleccionar --</option>{stages.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
            <div><label htmlFor="entregable_id" className="block text-sm font-medium text-gray-700 mb-1">Entregable Específico</label><select id="entregable_id" name="entregable_id" value={formData.entregable_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" disabled={!formData.stage_id}><option value="">(Opcional)</option>{filteredEntregables.map(e => (<option key={e.id} value={e.id}>{e.entregable_nombre}</option>))}</select></div>
            <div className="md:col-span-2"><label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label><select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none">{Object.values(estados).map(estado => (<option key={estado} value={estado}>{estado}</option>))}</select></div>
            <div className="md:col-span-2"><label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label><textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" placeholder="Añadir detalles..."></textarea></div>
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